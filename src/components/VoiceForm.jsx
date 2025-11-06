import { useEffect, useMemo, useState } from "react";
import { Mic, Music, Wand2 } from "lucide-react";

export default function VoiceForm({ onSubmit, loading }) {
  const [voiceName, setVoiceName] = useState("");
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.75);
  const [text, setText] = useState("Hi! I'm an AI clone of your voice. Let's create something amazing.");
  const [file, setFile] = useState(null);

  const canSubmit = useMemo(() => voiceName.trim() && text.trim() && file && !loading, [voiceName, text, file, loading]);

  useEffect(() => {
    // Reset when loading completes?
  }, [loading]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ voiceName: voiceName.trim(), text: text.trim(), stability, similarityBoost, file });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Voice name</label>
        <input
          type="text"
          value={voiceName}
          onChange={(e) => setVoiceName(e.target.value)}
          placeholder="e.g. My Studio Voice"
          className="w-full rounded-lg bg-zinc-900/60 border border-white/10 px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Stability: {stability.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={stability}
            onChange={(e) => setStability(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Similarity boost: {similarityBoost.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={similarityBoost}
            onChange={(e) => setSimilarityBoost(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Prompt text</label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-lg bg-zinc-900/60 border border-white/10 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Reference audio sample</label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFile}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600/10 file:text-indigo-300 hover:file:bg-indigo-600/20"
          />
        </div>
        <p className="mt-2 text-xs text-zinc-500">Provide a clean recording (10-30s) for best results.</p>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 disabled:bg-indigo-600/40 px-5 py-2.5 text-white font-medium shadow ring-1 ring-inset ring-white/10 hover:bg-indigo-500 transition-colors"
      >
        <Wand2 className="h-4 w-4" /> Clone & Generate
      </button>
    </form>
  );
}
