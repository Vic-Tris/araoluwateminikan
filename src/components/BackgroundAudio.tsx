import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { Pause, Play } from 'lucide-react';

const ambientAudioUrl = new URL('../../audios/ambient music.mp3', import.meta.url).href;

interface BackgroundAudioProps {
  enabled: boolean;
  onToggle: () => void;
  onReadyChange?: (ready: boolean) => void;
  className?: string;
}

export function BackgroundAudio({ enabled, onToggle, onReadyChange, className = '' }: BackgroundAudioProps) {
  const soundRef = useRef<Howl | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!soundRef.current) {
      try {
        soundRef.current = new Howl({
          src: [ambientAudioUrl],
          volume: 0.18,
          loop: true,
          html5: true,
          preload: true,
          onload: () => {
            setReady(true);
            onReadyChange?.(true);
          },
          onloaderror: () => {
            console.warn('Ambient music is unavailable. The constellation can still be explored without it.');
            setReady(false);
            onReadyChange?.(false);
          },
          onplayerror: () => {
            console.warn('Audio playback was blocked by the browser.');
          },
        });
      } catch (error) {
        console.warn('Unable to initialize ambient audio.', error);
      }
    }

    return () => {
      soundRef.current?.stop();
      soundRef.current?.unload();
      soundRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!soundRef.current) return;

    if (!enabled) {
      soundRef.current.pause();
      return;
    }

    soundRef.current.mute(false);
    try {
      if (!soundRef.current.playing()) soundRef.current.play();
    } catch (error) {
      console.warn('Autoplay was blocked. User interaction is required to begin audio.', error);
    }
  }, [enabled]);

  const handleToggle = () => {
    onToggle();
  };

  return (
    <button
      type="button"
      aria-label={!ready ? 'Ambient sound unavailable' : enabled ? 'Pause ambient sound' : 'Play ambient sound'}
      onClick={handleToggle}
      disabled={!ready}
      className={`pointer-events-auto flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-slate-950/50 px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-amber-100/80 transition hover:border-amber-300/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0 ${className}`}
    >
      <span className={`relative flex h-2.5 w-2.5 rounded-full ${enabled ? 'bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.7)]' : 'bg-slate-500'}`} />
      {enabled ? <Pause size={14} /> : <Play size={14} />}
      <span className="hidden sm:inline">{ready ? (enabled ? 'Sound on' : 'Sound off') : 'Audio unavailable'}</span>
    </button>
  );
}
