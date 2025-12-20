import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import quizService from '../../services/quizService';

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        console.error('Error to fetch results:', error);
        toast.error('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!results || !results.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p>Quiz results not found</p>
        </div>
      </div>
    );
  }

  const {
    data: { quiz, results: detailedResults },
  } = results;
  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Legendary! You crushed it! 🏆';
    if (score >= 80) return 'Great job! 🎉';
    if (score >= 70) return 'Nice work — keep climbing! 🚀';
    if (score >= 60) return 'Almost there! One more round! 💪';
    return "Don't give up — keep practicing! 🔁";
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to={`/documents/${quiz.document._id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors duration-200"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Back to Document
        </Link>
      </div>

      <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

      {/* Score Card */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8 mb-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-lg shadow-emerald-500/25">
            <Trophy className="w-7 h-7 text-emerald-700" strokeWidth={2} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Your Score
            </p>
            <div
              className={`inline-block text-5xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent mb-2`}
            >
              {score}%
            </div>
            <p className="text-lg font-medium text-slate-700">
              {getScoreMessage(score)}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
              <Target className="w-4 h-4 text-slate-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-slate-700">
                {totalQuestions} Total
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl ">
              <CheckCircle2
                className="w-4 h-4 text-emerald-600"
                strokeWidth={2}
              />
              <span className="text-sm font-semibold text-emerald-700">
                {correctAnswers} Correct
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl">
              <XCircle className="w-4 h-4 text-rose-600" strokeWidth={2} />
              <span className="text-sm font-semibold text-rose-700">
                {incorrectAnswers} Incorrect
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-5 h-5 text-slate-700" strokeWidth={2} />
          <h3 className="text-sm font-semibold text-slate-800">
            Detailed Review
          </h3>
        </div>
        {detailedResults.map((result, index) => {
          const isCorrect = !!result.isCorrect;
          const userText = result.selectedAnswer ?? '—';
          const correctText =
            result.correctAnswerText ??
            (Array.isArray(result.options)
              ? result.options[
                  (Number.parseInt(result.correctAnswer, 10) || 1) - 1
                ]
              : result.correctAnswer);
          const options = Array.isArray(result.options) ? result.options : [];
          const selectedIndex = Number.isInteger(result.selectedIndex)
            ? result.selectedIndex
            : options.findIndex((o) => o === userText);
          const correctIndex = Number.isInteger(result.correctIndex)
            ? result.correctIndex
            : Array.isArray(options)
              ? (Number.parseInt(result.correctAnswer, 10) || 1) - 1
              : -1;

          return (
            <div
              key={`review-${index}`}
              className="mb-4 p-4 border-2 rounded-xl bg-white/80 border-slate-200"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Question {index + 1}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full border ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-rose-100 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                    ) : (
                      <XCircle className="w-4 h-4" strokeWidth={2} />
                    )}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-3">{result.question}</p>

                <div className="space-y-2 mt-2">
                  {options.length > 0 ? (
                    options.map((opt, optIdx) => {
                      const isSelected = optIdx === selectedIndex;
                      const isCorrectOption = optIdx === correctIndex;
                      const base =
                        'flex items-center justify-between px-4 py-3 rounded-xl border-2';
                      const state = isCorrectOption
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : isSelected
                          ? 'bg-rose-50 border-rose-200 text-rose-700'
                          : 'bg-white/80 border-slate-200 text-slate-700';
                      return (
                        <div
                          key={`opt-${index}-${optIdx}`}
                          className={`${base} ${state}`}
                        >
                          <span className="text-sm">{opt}</span>
                          <div className="flex items-center gap-2">
                            {isCorrectOption && (
                              <span className="text-xs font-semibold px-2 py-1 rounded-lg border bg-emerald-100 text-emerald-700 border-emerald-200">
                                Correct
                              </span>
                            )}
                            {!isCorrectOption && isSelected && (
                              <span className="text-xs font-semibold px-2 py-1 rounded-lg border bg-rose-100 text-rose-700 border-rose-200">
                                Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">
                        Your:
                      </span>
                      <span className="text-xs px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                        {userText}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 ml-2">
                        Correct:
                      </span>
                      <span className="text-xs px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                        {correctText}
                      </span>
                    </div>
                  )}
                </div>

                {result.explanation && (
                  <div className="mt-3 rounded-xl border-2 bg-slate-50 border-slate-200 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen
                        className="w-4 h-4 text-slate-600"
                        strokeWidth={2}
                      />
                      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        Explanation
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      {result.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResultPage;
