import { AnimatePresence, motion } from 'framer-motion';
import { Howl } from 'howler';
import { Lock, Pause, Play, Sparkles, Square, Stars } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackgroundAudio } from '@/components/BackgroundAudio';
import { ConstellationCanvas } from '@/components/ConstellationCanvas';
import { GrandFinaleModal } from '@/components/GrandFinaleModal';
import { MemoryPage } from '@/components/MemoryPage';
import { RomanticBubbles } from '@/components/RomanticBubbles';
import { birthdayPortrait, constellationNodes, secretNode, secretQuestions } from '@/data/constellation';
import type { ConstellationNode } from '@/types/constellation';

function App() {
  const secretAudioRef = useRef<Howl | null>(null);
  const [ambientAudioReady, setAmbientAudioReady] = useState(false);
  const [secretAudioReady, setSecretAudioReady] = useState(false);
  const [secretAudioPlaying, setSecretAudioPlaying] = useState(false);
  const [exploredIds, setExploredIds] = useState<string[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [grandFinaleOpen, setGrandFinaleOpen] = useState(false);
  const [grandFinaleSeen, setGrandFinaleSeen] = useState(false);
  const [showSecretNode, setShowSecretNode] = useState(false);
  const [explorationNotice, setExplorationNotice] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [secretQuestionIndex, setSecretQuestionIndex] = useState(0);
  const [secretAnswer, setSecretAnswer] = useState('');
  const [secretError, setSecretError] = useState('');
  const [secretUnlocking, setSecretUnlocking] = useState(false);
  const [secretShake, setSecretShake] = useState(false);

  const primaryMemoryIds = useMemo(() => constellationNodes.map((node) => node.id), []);
  const selectedMemory = useMemo(
    () => constellationNodes.find((node) => node.id === selectedNodeId) ?? null,
    [selectedNodeId],
  );

  const memoryIndex = selectedMemory ? primaryMemoryIds.indexOf(selectedMemory.id) : 0;
  const progressCount = exploredIds.length;
  const allMemoriesExplored = progressCount >= constellationNodes.length;

  useEffect(() => {
    const secretAudio = new Howl({
      src: ['/audio/secret-reveal.mp3'],
      volume: 0.7,
      loop: false,
      html5: true,
      preload: true,
      onload: () => setSecretAudioReady(true),
      onloaderror: () => {
        setSecretAudioReady(false);
        console.warn('Secret reveal audio is unavailable. Add secret-reveal.mp3 to public/audio to enable it.');
      },
      onplay: () => setSecretAudioPlaying(true),
      onpause: () => setSecretAudioPlaying(false),
      onstop: () => setSecretAudioPlaying(false),
      onend: () => setSecretAudioPlaying(false),
      onplayerror: () => {
        setSecretAudioPlaying(false);
        console.warn('Secret reveal audio playback was blocked by the browser.');
      },
    });
    secretAudioRef.current = secretAudio;

    return () => {
      secretAudio.stop();
      secretAudio.unload();
      secretAudioRef.current = null;
    };
  }, []);

  const toggleSecretAudio = useCallback(() => {
    const secretAudio = secretAudioRef.current;
    if (!secretAudioReady || !secretAudio) return;

    if (secretAudio.playing()) {
      secretAudio.pause();
    } else {
      secretAudio.play();
    }
  }, [secretAudioReady]);

  const stopSecretAudio = useCallback(() => {
    secretAudioRef.current?.stop();
  }, []);

  useEffect(() => {
    if (allMemoriesExplored && !grandFinaleSeen && !grandFinaleOpen) {
      setGrandFinaleOpen(true);
    }
  }, [allMemoriesExplored, grandFinaleSeen, grandFinaleOpen]);

  const openMemory = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId);
      setExplorationNotice(false);
      setExploredIds((previous) => (previous.includes(nodeId) ? previous : [...previous, nodeId]));
    },
    [],
  );

  const handleCloseMemory = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handlePrevMemory = useCallback(() => {
    if (!selectedMemory) return;
    const currentIndex = primaryMemoryIds.indexOf(selectedMemory.id);
    const nextIndex = Math.max(0, currentIndex - 1);
    setSelectedNodeId(primaryMemoryIds[nextIndex]);
  }, [primaryMemoryIds, selectedMemory]);

  const handleNextMemory = useCallback(() => {
    if (!selectedMemory) return;
    const currentIndex = primaryMemoryIds.indexOf(selectedMemory.id);
    const isLastMemory = currentIndex === primaryMemoryIds.length - 1;

    if (isLastMemory) {
      setSelectedNodeId(null);
      setGrandFinaleOpen(true);
      setGrandFinaleSeen(true);
      return;
    }

    const nextIndex = Math.min(primaryMemoryIds.length - 1, currentIndex + 1);
    setSelectedNodeId(primaryMemoryIds[nextIndex]);
  }, [primaryMemoryIds, selectedMemory]);

  const resetSecretState = useCallback(() => {
    setSecretQuestionIndex(0);
    setSecretAnswer('');
    setSecretError('');
    setSecretUnlocking(false);
    setSecretShake(false);
  }, []);

  const handleSecretNodeClick = useCallback(() => {
    if (secretUnlocked) return;
    if (!allMemoriesExplored) {
      setExplorationNotice(true);
      return;
    }
    setSelectedNodeId('secret-node');
    resetSecretState();
  }, [allMemoriesExplored, resetSecretState, secretUnlocked]);

  const handleSecretSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const currentQuestion = secretQuestions[secretQuestionIndex];
      const normalizedInput = secretAnswer.trim();
      const normalizedCorrect = currentQuestion.answer.trim();

      if (normalizedInput.toLowerCase() === normalizedCorrect.toLowerCase()) {
        if (secretQuestionIndex === secretQuestions.length - 1) {
          secretAudioRef.current?.play();
          setSecretUnlocking(true);
          setSecretError('');
          setTimeout(() => {
            setSecretUnlocked(true);
            setSelectedNodeId(null);
            setShowSecretNode(true);
          }, 1600);
          return;
        }

        setSecretQuestionIndex((previous) => previous + 1);
        setSecretAnswer('');
        setSecretError('');
        return;
      }

      setSecretShake(true);
      setSecretError("Not quite, my love. Take a breath and try once more.");
      window.setTimeout(() => setSecretShake(false), 400);
    },
    [secretAnswer, secretQuestionIndex],
  );

  const handleRevealSecret = useCallback(() => {
    setGrandFinaleOpen(false);
    setGrandFinaleSeen(true);
    setShowSecretNode(true);
    setSelectedNodeId(null);
  }, []);

  const handleCloseSecretExperience = useCallback(() => {
    setSelectedNodeId(null);
    setSecretUnlocked(true);
    setShowSecretNode(true);
  }, []);

  if (selectedNodeId === 'secret-node' && !secretUnlocked) {
    const activeQuestion = secretQuestions[secretQuestionIndex];

    return (
      <div className="canvas-shell flex min-h-screen items-center justify-center p-3 sm:p-4">
        <BackgroundAudio
          enabled={audioEnabled}
          onToggle={() => setAudioEnabled((value) => !value)}
          onReadyChange={setAmbientAudioReady}
          className="fixed right-3 top-3 z-30 sm:right-4 sm:top-4 md:right-6"
        />
        <RomanticBubbles />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.18),transparent_25%),radial-gradient(circle_at_top,rgba(147,197,253,0.2),transparent_30%)]" />

        <motion.div
          key={activeQuestion.id}
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`glass-panel relative z-10 w-full max-w-xl rounded-[24px] border border-white/10 p-5 sm:rounded-[30px] sm:p-6 md:p-8 ${secretShake ? 'animate-[shake_0.35s_ease-in-out]' : ''}`}
          style={{
            boxShadow: '0 0 60px rgba(245, 167, 99, 0.12)',
          }}
        >
          <div className="mb-6 flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-amber-100/75">
            <span>A note just for you</span>
            <span>
              {secretQuestionIndex + 1} / {secretQuestions.length}
            </span>
          </div>

          <div className="mb-8 flex items-center gap-2 text-amber-100/90">
            <Lock size={15} />
            <span className="text-[10px] uppercase tracking-[0.28em]">One last constellation</span>
          </div>

          {!secretUnlocking ? (
            <form onSubmit={handleSecretSubmit} className="space-y-7">
              <p className="text-sm leading-relaxed text-slate-300">
                A few details from our story stand between you and the quiet chapter I saved for you.
              </p>
              <div className="space-y-3">
                <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 transition-all duration-500"
                    style={{ width: `${((secretQuestionIndex + 1) / secretQuestions.length) * 100}%` }}
                  />
                </div>
                <motion.p
                  key={activeQuestion.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-balance font-display text-xl text-white sm:text-2xl md:text-3xl"
                >
                  {activeQuestion.prompt}
                </motion.p>
              </div>

              <div className="input-shell">
                <input
                  value={secretAnswer}
                  onChange={(event) => setSecretAnswer(event.target.value)}
                  placeholder="Your answer"
                  className="w-full border-0 bg-transparent px-4 py-4 text-base text-white placeholder:text-slate-500 focus:outline-none"
                  autoFocus
                />
              </div>

              {secretError ? (
                <p className="text-sm text-rose-200/90">{secretError}</p>
              ) : (
                <p className="text-sm text-slate-400">
                  {secretQuestionIndex === 0
                    ? 'Take your time. The last star is waiting.'
                    : secretQuestionIndex === 1
                      ? 'You remembered the first clue. One more detail is waiting.'
                      : 'You are close now. One final memory will open the way.'}
                </p>
              )}

              <button
                type="submit"
                className="pointer-events-auto w-full rounded-full border border-amber-200/30 bg-gradient-to-r from-amber-200/10 via-rose-100/10 to-amber-200/15 px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-amber-50 transition hover:border-amber-200/60 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
              >
                Continue
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-200/35 bg-amber-200/10 text-amber-100 shadow-[0_0_40px_rgba(251,191,36,0.15)]"
              >
                <Sparkles size={28} />
              </motion.div>
              <p className="font-display text-3xl text-white">You found the last light.</p>
              <p className="text-slate-300">Thank you for remembering the little things that led us here.</p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="canvas-shell relative min-h-screen overflow-hidden">
      <BackgroundAudio
        enabled={audioEnabled}
        onToggle={() => setAudioEnabled((value) => !value)}
        onReadyChange={setAmbientAudioReady}
        className="fixed right-3 top-3 z-30 sm:right-4 sm:top-4 md:right-6"
      />
      <RomanticBubbles />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(176,132,255,0.2),transparent_32%),radial-gradient(circle_at_bottom,rgba(113,164,255,0.18),transparent_32%)]" />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-4">
          <div className="pointer-events-none min-w-0 rounded-2xl border border-white/10 bg-slate-950/25 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.12)] backdrop-blur-sm sm:rounded-full sm:px-4 sm:tracking-[0.32em]">
            <span className="font-display text-xs tracking-[0.08em] text-amber-200 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)] sm:text-base sm:tracking-[0.18em]">
              Araoluwa | Our Constellation
            </span>
          </div>

        </div>
      </header>

      <div className="pointer-events-none fixed left-1/2 top-[4.5rem] z-30 -translate-x-1/2 sm:top-20 md:top-24">
        <div className="whitespace-nowrap rounded-full border border-amber-200/15 bg-slate-950/35 px-3 py-2 text-[9px] uppercase tracking-[0.1em] text-amber-50 backdrop-blur-md sm:px-4 sm:text-[10px] sm:tracking-[0.25em]">
          <span className="inline-flex items-center gap-2">
            <Stars size={12} className="text-amber-100" />
            {progressCount} / {constellationNodes.length} Stars Explored
          </span>
        </div>
        <p className="mt-2 max-w-[min(22rem,calc(100vw-2rem))] text-center text-[10px] leading-relaxed text-slate-200/90 sm:text-xs">
          Every star holds a piece of our story. Explore at your own pace.
        </p>
      </div>

      <section
        aria-labelledby="birthday-greeting-title"
        className="pointer-events-none fixed inset-x-3 bottom-20 z-20 flex items-center gap-3 rounded-[22px] border border-amber-100/15 bg-slate-950/65 p-2.5 shadow-[0_0_36px_rgba(251,191,36,0.12)] backdrop-blur-xl sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[min(25rem,calc(100vw-2.5rem))] sm:gap-4 sm:rounded-[26px] sm:p-3"
      >
        <img
          src={birthdayPortrait}
          alt="Araoluwa, celebrated beneath our constellation"
          className="h-24 w-20 shrink-0 rounded-[16px] object-cover sm:h-28 sm:w-24 sm:rounded-[18px]"
        />
        <div className="min-w-0 py-1">
          <p className="text-[9px] uppercase tracking-[0.2em] text-amber-200/75 sm:text-[10px] sm:tracking-[0.25em]">A story made with love</p>
          <h1 id="birthday-greeting-title" className="mt-1 font-display text-lg leading-tight text-white sm:text-xl">Happy Birthday, Araoluwa</h1>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-200/90 sm:text-xs">
            May every year bring you the warmth, laughter, and light you bring to my world. Beneath these stars, every memory leads back to you.
          </p>
        </div>
      </section>

      <ConstellationCanvas
        nodes={constellationNodes}
        selectedNodeId={selectedNodeId}
        onSelectNode={(nodeId) => {
          if (nodeId === 'secret-node') {
            handleSecretNodeClick();
            return;
          }

          if (nodeId) {
            openMemory(nodeId);
          }
        }}
        secretUnlocked={secretUnlocked}
      />

      {selectedMemory ? (
        <MemoryPage
          memory={selectedMemory}
          index={memoryIndex}
          total={constellationNodes.length}
          onClose={handleCloseMemory}
          onPrev={handlePrevMemory}
          onNext={handleNextMemory}
        />
      ) : null}

      <GrandFinaleModal
        open={grandFinaleOpen}
        onClose={() => {
          setGrandFinaleOpen(false);
          setGrandFinaleSeen(true);
          setShowSecretNode(true);
        }}
        onRevealSecret={handleRevealSecret}
      />

      <AnimatePresence>
        {explorationNotice ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed inset-x-3 bottom-52 z-40 flex justify-center sm:bottom-24"
          >
            <div className="pointer-events-auto max-w-md rounded-[22px] border border-amber-200/20 bg-slate-950/90 p-4 text-center shadow-[0_0_36px_rgba(251,191,36,0.16)] backdrop-blur-xl sm:p-5">
              <p className="font-display text-xl text-amber-100">The epilogue star is waiting.</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Explore all five memory stars first. Your progress is saved—return to this star when the constellation reads 5 / 5.
              </p>
              <button
                type="button"
                onClick={() => setExplorationNotice(false)}
                className="mt-4 min-h-10 rounded-full border border-amber-200/30 bg-amber-200/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-amber-50 transition hover:border-amber-200/60"
              >
                Continue exploring
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!secretUnlocked ? (
        <div className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-30 -translate-x-1/2">
          <button
            type="button"
            onClick={handleSecretNodeClick}
            className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-amber-200/20 bg-slate-950/55 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-amber-100 shadow-[0_0_32px_rgba(251,191,36,0.15)] backdrop-blur-md transition hover:border-amber-200/40 hover:text-white"
          >
            <Lock size={13} />
            Something More...
          </button>
        </div>
      ) : null}

      {secretUnlocked ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-40 overscroll-contain overflow-y-auto bg-slate-950/70 p-3 sm:p-4"
        >
          <div className="glass-panel relative mx-auto my-3 w-full max-w-5xl rounded-[24px] border border-amber-200/20 p-4 sm:my-4 sm:rounded-[30px] sm:p-6 md:p-8">
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
              <div className="flex items-center gap-3 text-amber-100">
                <Sparkles size={18} />
                <span className="text-[10px] uppercase tracking-[0.3em]">Secret epilogue</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopSecretAudio();
                  setSecretUnlocked(false);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/20 hover:text-white"
              >
                Return to sky
              </button>
            </div>

            <section aria-label="Audio controls" className="mb-6 grid gap-3 rounded-[20px] border border-white/10 bg-slate-950/40 p-3 sm:grid-cols-2 sm:p-4">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-amber-100/80">Ambient soundtrack</p>
                  <p className="mt-1 text-xs text-slate-400">{ambientAudioReady ? (audioEnabled ? 'Playing' : 'Paused') : 'Add a playable ambient-space.mp3 to public/audio'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAudioEnabled((enabled) => !enabled)}
                  disabled={!ambientAudioReady}
                  aria-label={audioEnabled ? 'Pause ambient soundtrack' : 'Play ambient soundtrack'}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-slate-100 transition hover:border-amber-200/40 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {audioEnabled ? <Pause size={14} /> : <Play size={14} />}
                  {audioEnabled ? 'Pause' : 'Play'}
                </button>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-amber-100/80">Secret reveal</p>
                  <p className="mt-1 text-xs text-slate-400">{secretAudioReady ? (secretAudioPlaying ? 'Playing' : 'Ready') : 'Add secret-reveal.mp3 to public/audio'}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={toggleSecretAudio}
                    disabled={!secretAudioReady}
                    aria-label={secretAudioPlaying ? 'Pause secret reveal audio' : 'Play secret reveal audio'}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-amber-50 transition hover:border-amber-200/50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {secretAudioPlaying ? <Pause size={14} /> : <Play size={14} />}
                    {secretAudioPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    type="button"
                    onClick={stopSecretAudio}
                    disabled={!secretAudioReady}
                    aria-label="Stop secret reveal audio"
                    className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-100 transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Square size={13} />
                  </button>
                </div>
              </div>
            </section>

            <div className="mb-6 space-y-3 text-center">
              <h3 className="text-balance font-display text-3xl text-white sm:text-4xl md:text-5xl">You found the hidden final chapter.</h3>
              <p className="mx-auto max-w-2xl text-slate-300">{secretNode.description}</p>
            </div>

            <article className="glass-panel mb-6 rounded-[24px] border border-white/10 p-5 sm:p-7">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-200/95 sm:text-base sm:leading-8">{secretNode.story}</p>
            </article>

            <div className="grid gap-5 md:grid-cols-2">
              {[secretNode.images[0], secretNode.images[1]].map((image, index) => (
                <figure key={image} className={`relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/40 p-2 ${index === 0 ? 'md:-mt-2' : 'md:mt-6'}`}>
                  <div className="flex h-[min(65svh,560px)] items-start justify-center overflow-hidden rounded-[18px] bg-slate-950/40">
                    <img src={image} alt={`Secret epilogue memory ${index + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top p-1" />
                  </div>
                  <figcaption className="px-3 pb-1 pt-3 text-center text-xs leading-relaxed text-slate-300 sm:text-sm">{secretNode.imageCaptions[index]}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

export default App;
