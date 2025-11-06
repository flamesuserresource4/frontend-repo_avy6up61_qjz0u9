import { useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { useState } from "react";

export default function AudioPlayer({ src, filename = "output.mp3" }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [src]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  if (!src) return null;

  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-zinc-900/60 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-300">Generated audio</div>
        <a
          href={src}
          download={filename}
          className="text-xs text-indigo-300 hover:text-indigo-200"
        >
          Download
        </a>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={toggle}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
      </div>
    </div>
  );
}
