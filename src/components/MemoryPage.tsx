import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { ConstellationNode } from '@/types/constellation';

interface MemoryPageProps {
  memory: ConstellationNode | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function MemoryPage({ memory, index, total, onClose, onPrev, onNext }: MemoryPageProps) {
  if (!memory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        className="fixed inset-0 z-40 overscroll-contain overflow-y-auto bg-slate-950/65 px-3 py-4 sm:px-4 sm:py-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.98 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="mx-auto w-full max-w-5xl"
        >
          <div className="glass-panel relative overflow-hidden rounded-[22px] border border-white/10 p-4 sm:rounded-[28px] sm:p-6 md:p-8">
            <div className="mb-5 flex items-center justify-between gap-2 sm:mb-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="pointer-events-auto flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-slate-200 transition hover:border-amber-200/40 hover:text-white sm:text-[10px] sm:tracking-[0.2em]"
                >
                  <X size={14} />
                  Return to Sky
                </button>
              </div>

              <div className="rounded-full border border-amber-200/20 bg-amber-50/5 px-2.5 py-2 text-center text-[9px] uppercase tracking-[0.12em] text-amber-100/85 sm:px-3 sm:text-[10px] sm:tracking-[0.25em]">
                Memory {index + 1} of {total}
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3 text-center md:text-left">
                <p className="text-[10px] uppercase tracking-[0.22em] text-amber-100/75 sm:text-[11px] sm:tracking-[0.32em]">{memory.date}</p>
                <h2 className="text-balance font-display text-3xl text-white sm:text-4xl md:text-5xl">{memory.title}</h2>
                <p className="mx-auto max-w-2xl text-sm text-slate-300 md:mx-0">{memory.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {memory.images.map((image, imageIndex) => (
                  <motion.div
                    key={`${memory.id}-${imageIndex}`}
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: imageIndex * 0.1 }}
                    className={`group relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/40 p-2 ${imageIndex === 0 ? 'md:-mt-2' : 'md:mt-6'}`}
                  >
                    <figure>
                      <div className="flex h-[min(65svh,560px)] items-start justify-center overflow-hidden rounded-[18px] border border-white/10 bg-slate-950/40">
                        <img
                          src={image}
                          alt={`${memory.title} memory ${imageIndex + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover object-top p-1"
                        />
                      </div>
                      <figcaption className="px-3 pb-1 pt-3 text-center text-xs leading-relaxed text-slate-300 sm:text-sm">
                        {memory.imageCaptions[imageIndex]}
                      </figcaption>
                    </figure>
                  </motion.div>
                ))}
              </div>

              <article className="glass-panel rounded-[24px] border border-white/10 p-4 sm:p-5 md:p-7">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-200/95 sm:text-base sm:leading-8">{memory.story}</p>
              </article>

              <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onPrev}
                    className="pointer-events-auto inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-slate-200 transition hover:border-amber-200/40 hover:text-white sm:px-4 sm:text-[10px] sm:tracking-[0.2em]"
                  >
                    <ArrowLeft size={14} />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    className="pointer-events-auto inline-flex min-h-10 items-center gap-2 rounded-full border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-amber-50 transition hover:border-amber-200/50 hover:bg-amber-200/15 sm:px-4 sm:text-[10px] sm:tracking-[0.2em]"
                  >
                    Next
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="text-[10px] uppercase tracking-[0.25em] text-slate-300">
                  Chapter {index + 1} of {total}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
