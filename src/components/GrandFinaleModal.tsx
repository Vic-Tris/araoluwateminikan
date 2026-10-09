import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, Star } from 'lucide-react';
import { useEffect } from 'react';
import { birthdayGalleryImages } from '@/data/constellation';

interface GrandFinaleModalProps {
  open: boolean;
  onClose: () => void;
  onRevealSecret: () => void;
}

export function GrandFinaleModal({ open, onClose, onRevealSecret }: GrandFinaleModalProps) {
  useEffect(() => {
    if (!open) return;

    confetti({
      particleCount: 120,
      spread: 80,
      startVelocity: 35,
      origin: { y: 0.4 },
      colors: ['#fbbf24', '#f9d7a8', '#f5a6c8', '#d5d9ff', '#ffffff'],
    });
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overscroll-contain overflow-y-auto bg-slate-950/80 p-3 sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mx-auto my-3 w-full max-w-4xl rounded-[24px] border border-amber-200/20 bg-slate-950/70 p-4 shadow-[0_0_90px_rgba(251,191,36,0.12)] backdrop-blur-xl sm:my-6 sm:rounded-[30px] sm:p-6 md:my-10 md:p-8"
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-amber-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200/20 bg-amber-100/5">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-amber-100/70">Happy Birthday Araoluwa</p>
                  <h3 className="font-display text-2xl text-white md:text-3xl">For Araoluwa</h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-slate-200 transition hover:border-white/20 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-7">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-6 text-slate-200 md:p-8">
                <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-amber-200/75">7th October 2026 · A birthday reflection</p>
                <p className="text-balance font-display text-2xl text-amber-100 sm:text-3xl md:text-4xl">My dearest Araoluwa,</p>

                <div className="mt-5 space-y-4 text-sm leading-7 text-slate-200/95 sm:mt-6 sm:space-y-5 sm:text-base sm:leading-8">
                  <p>
                    Happy birthday, my love. Today is a reason to celebrate, but I hope you know that what I want to honour is bigger than the date. I want to celebrate the person you are: your strength, your kindness, your thoughtful heart, and the light you bring into the lives around you. Your life has meaning in its own right. I hope this new year of yours gives you room to feel that, not just hear it from me.
                  </p>
                  <p>
                    I often return in my mind to the simple truth that I met you at NYSC camp in Abia State. I cannot tell you that I understood then how much that meeting would come to mean. I can tell you what I know now: I am grateful our paths crossed, and grateful for the opportunity to know you beyond that beginning. What followed did not need a grand origin story to become precious. Its meaning is in the woman I came to know and in the care we have been able to share.
                  </p>
                  <p>
                    You are strong, and you are gentle; neither quality takes anything away from the other. I admire the way you support the people you love while remaining your own person. I admire how observant you are—how you can notice when something is not quite right even when it is easy for everyone else to miss. That kind of attention is a form of care. It tells people that they matter enough to be seen. I hope you know that I notice this in you, and that I value it deeply.
                  </p>
                  <p>
                    Your kindness is not important only because I have been fortunate enough to receive it. It matters because of who you are and because of the good you bring to people whose lives meet yours. I believe you are a blessing to this generation: not as a flattering phrase, but because a thoughtful, loving, steady person can make the world around her gentler and more hopeful. The care you give has a life beyond this relationship, and I hope it finds its way back to you in the people and opportunities that help you flourish.
                  </p>
                  <p>
                    I also want you to know that you do not have to be endlessly strong to deserve admiration, and you do not have to take care of everyone to deserve love. You are worthy of tenderness on the days when you feel certain of yourself and on the days when you need someone to remind you of your own light. I hope you make space for your dreams, your rest, and the things that bring you happiness simply because they are yours. Your life is not a supporting detail in anyone else's story. It is a story of its own, and I am proud to witness the person you are.
                  </p>
                  <p>
                    With you, I have found joy, love, support, and a sense of safety that I never want to take for granted. You have become someone I can hold close in my heart—not because your purpose is to make my life easier, but because your presence, exactly as it is, has become dear to me. I cherish your laughter and your warmth, but I also cherish your convictions, your strength, your attention to detail, and the many parts of you that belong to you alone.
                  </p>
                  <p>
                    For the year ahead, I wish you more than pleasant surprises. I wish you peace that is truly yours, happiness that does not need to be earned, good health, room to grow toward the things you want, and people who recognise your worth without being asked. May you feel proud of the woman you are becoming and supported in every hope you choose to follow. I look forward with gratitude to the memories still waiting for us, without needing to pretend that I know exactly what they will be.
                  </p>
                  <p>
                    Araoluwa, thank you for being yourself, and thank you for allowing our story to become part of my life. I love you with a depth that ordinary words cannot contain, but I will keep choosing honest words and finding new ways to show it. Happy birthday, my dearest. I am thankful for you today, and I will remain thankful long after today has passed.
                  </p>
                </div>
              </div>

              <section aria-label="Birthday photos">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {birthdayGalleryImages.map((image) => (
                    <figure key={image.src} className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-slate-900/50 p-2">
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-[90%] w-[90%] rounded-[14px] bg-slate-950/40 object-contain"
                      />
                    </figure>
                  ))}
                </div>
              </section>

              <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-[24px] border border-amber-200/20 bg-gradient-to-br from-amber-200/10 via-white/5 to-rose-200/10 p-5 shadow-[0_0_28px_rgba(251,191,36,0.08)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-100">
                      <Star size={15} />
                      <span className="text-[10px] uppercase tracking-[0.25em]">Date Night Voucher</span>
                    </div>
                    <Gift size={15} className="text-amber-100" />
                  </div>

                  <div className="rounded-[18px] border border-white/10 bg-slate-950/50 p-5">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-slate-400">A little time for us</p>
                    <h4 className="mt-3 text-balance font-display text-2xl text-white sm:text-3xl">One Beautiful Night</h4>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      An invitation to step away from the rush, share a meal, talk without watching the clock, and make another memory together. No grand plan required—just us, present with one another.
                    </p>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-[9px] uppercase tracking-[0.16em] text-amber-100/80 sm:text-[10px] sm:tracking-[0.22em]">
                      <span>Redeem by: date night</span>
                      <span>Signed with love</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center rounded-[24px] border border-white/10 bg-slate-900/60 p-5">
                  <button
                    type="button"
                    onClick={onRevealSecret}
                    className="w-full rounded-full border border-amber-200/30 bg-amber-200/10 px-5 py-3 text-[10px] uppercase tracking-[0.24em] text-amber-50 transition hover:border-amber-200/60 hover:bg-amber-200/15"
                  >
                    Discover the hidden epilogue
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
