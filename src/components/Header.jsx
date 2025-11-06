import { Sparkles, Github } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">AI Voice Cloner</h1>
            <p className="text-sm text-zinc-400">Create realistic voices powered by ElevenLabs</p>
          </div>
        </div>
        <a
          href="https://github.com/elevenlabs/elevenlabs-python-sdk"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-200 transition-colors"
        >
          <Github className="h-4 w-4" /> Docs
        </a>
      </div>
    </header>
  );
}
