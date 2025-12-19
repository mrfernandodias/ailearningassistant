import { RotateCcw, Star } from 'lucide-react';
import { useState } from 'react';

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  if (!flashcard) return null;
  return (
    <div
      className="relative w-full h-72 select-none"
      style={{ perspective: '1000px' }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 ease-in-out will-change-transform transform-gpu cursor-pointer`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
      >
        {/* Front of the card (Question) */}
        <div
          className="absolute inset-0 w-full h-full bg-white/80 backdrop-blur-xl border-2 border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 p-8 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Star Button */}
          <div className="flex items-center justify-between">
            <div className="bg-slate-100 text-[10px] text-slate-600 rounded-full px-3 py-1 uppercase tracking-wide">
              {flashcard?.difficulty || '—'}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                flashcard.isStarred
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-amber-500'
              }`}
              aria-pressed={flashcard.isStarred}
              aria-label={
                flashcard.isStarred ? 'Unstar flashcard' : 'Star flashcard'
              }
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1 flex items-center justify-center px-4 py-4">
            <p className="text-lg font-semibold text-slate-900 text-center leading-relaxed">
              {flashcard.question}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="">Click to reveal answer</span>
          </div>
        </div>

        {/* Back of the card (Answer) */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-emerald-400/60 rounded-2xl shadow-xl shadow-emerald-500/30 p-8 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="bg-slate-100 text-[10px] text-slate-600 rounded-full px-3 py-1 uppercase tracking-wide">
              Answer
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                flashcard.isStarred
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-amber-500'
              }`}
              aria-pressed={flashcard.isStarred}
              aria-label={
                flashcard.isStarred ? 'Unstar flashcard' : 'Star flashcard'
              }
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Answer Content */}
          <div className="flex-1 flex items-center justify-center px-4 py-4">
            <p className="text-base text-white text-center leading-relaxed font-medium max-h-40 md:max-h-48 overflow-y-auto">
              {flashcard.answer}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-white/70 font-medium">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="">Click to view question</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
