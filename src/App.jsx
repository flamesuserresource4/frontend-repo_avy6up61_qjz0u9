import { useMemo, useState } from "react";
import Header from "./components/Header";
import VoiceForm from "./components/VoiceForm";
import ApiKeyNotice from "./components/ApiKeyNotice";
import AudioPlayer from "./components/AudioPlayer";

function App() {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");

  const backend = import.meta.env.VITE_BACKEND_URL;
  const elevenKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  const canUseFrontendDirect = useMemo(() => Boolean(elevenKey), [elevenKey]);

  const readErrorPayload = async (res) => {
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        // Common ElevenLabs error shapes: { detail: "..." } or { message: "..." } or array
        const detail = data?.detail || data?.message || (Array.isArray(data) ? data[0]?.message : "");
        return detail || JSON.stringify(data);
      }
      const text = await res.text();
      return text || `HTTP ${res.status}`;
    } catch {
      return `HTTP ${res.status}`;
    }
  };

  const safeObjectUrl = (blob) => {
    // Revoke previous URL to avoid leaks
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    return URL.createObjectURL(blob);
  };

  const generate = async ({ voiceName, text, stability, similarityBoost, file }) => {
    setError("");
    setLoading(true);
    setAudioUrl("");

    try {
      if (backend) {
        // Preferred: through backend (key stays private)
        const form = new FormData();
        form.append("voiceName", voiceName);
        form.append("text", text);
        form.append("stability", String(stability));
        form.append("similarityBoost", String(similarityBoost));
        form.append("file", file);

        const res = await fetch(`${backend}/clone-and-generate`, {
          method: "POST",
          body: form,
        });
        if (!res.ok) {
          const payload = await readErrorPayload(res);
          throw new Error(`Backend ${res.status}: ${payload}`);
        }
        // Expect binary audio
        const blob = await res.blob();
        const url = safeObjectUrl(blob);
        setAudioUrl(url);
        return;
      }

      if (!canUseFrontendDirect) {
        throw new Error(
          "No backend configured and no ElevenLabs API key found. Add VITE_BACKEND_URL or VITE_ELEVENLABS_API_KEY."
        );
      }

      // Fallback demo: call ElevenLabs directly from frontend (not for production)
      const uploadRes = await fetch("https://api.elevenlabs.io/v1/voices/add", {
        method: "POST",
        headers: {
          "xi-api-key": elevenKey,
        },
        body: (() => {
          const form = new FormData();
          form.append("name", voiceName);
          form.append("files", file);
          form.append("labels", JSON.stringify({ app: "vibe-clone" }));
          return form;
        })(),
      });
      if (!uploadRes.ok) {
        const payload = await readErrorPayload(uploadRes);
        throw new Error(`Upload failed ${uploadRes.status}: ${payload}`);
      }
      const uploaded = await uploadRes.json();
      const voiceId = uploaded?.voice_id || uploaded?.voice?.voice_id;
      if (!voiceId) throw new Error("No voice id returned from ElevenLabs.");

      const genRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": elevenKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability, similarity_boost: similarityBoost },
        }),
      });
      if (!genRes.ok) {
        const payload = await readErrorPayload(genRes);
        throw new Error(`Synthesis failed ${genRes.status}: ${payload}`);
      }
      const blob = await genRes.blob();
      setAudioUrl(safeObjectUrl(blob));
    } catch (e) {
      const msg = (e && e.message) ? e.message : "Something went wrong";
      // Provide lightweight guidance for common issues
      const hint = !backend && !canUseFrontendDirect
        ? "Tip: Set VITE_BACKEND_URL for a secure proxy, or VITE_ELEVENLABS_API_KEY for quick testing."
        : "";
      setError([msg, hint].filter(Boolean).join("\n"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-white">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Clone a voice and generate speech</h2>
          <p className="mt-1 text-zinc-400 text-sm">Upload a short sample, tweak the settings, and synthesize realistic audio.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
            <VoiceForm onSubmit={generate} loading={loading} />

            {error && (
              <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm whitespace-pre-wrap">
                {error}
              </div>
            )}

            {audioUrl && <AudioPlayer src={audioUrl} />}
          </div>

          <div className="space-y-4">
            <ApiKeyNotice />
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 text-sm text-zinc-300">
              <p className="font-medium mb-2">How it works</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                <li>Upload a clean voice sample (10–30 seconds).</li>
                <li>We create a temporary clone using ElevenLabs.</li>
                <li>We synthesize your prompt with that cloned voice.</li>
                <li>Download or play the generated audio.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-10 text-center text-xs text-zinc-500">
        Built for rapid prototyping. Use a backend for secure keys and advanced workflows.
      </footer>
    </div>
  );
}

export default App;
