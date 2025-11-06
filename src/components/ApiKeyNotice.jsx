export default function ApiKeyNotice() {
  const hasKey = Boolean(import.meta.env.VITE_ELEVENLABS_API_KEY);
  return (
    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-200 p-4">
      <p className="text-sm">
        {hasKey ? (
          <>
            Your ElevenLabs API key is detected. You can generate audio.
          </>
        ) : (
          <>
            Add your ElevenLabs API key to proceed: set VITE_ELEVENLABS_API_KEY in your environment. For production, route calls through the backend to keep the key private.
          </>
        )}
      </p>
    </div>
  );
}
