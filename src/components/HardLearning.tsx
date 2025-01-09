import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import HardLearningManager from './HardLearningManager';
import FlashCard from './FlashCard';

const HardLearning = () => {
  const {
    currentCard,
    showAnswer,
    setShowAnswer,
    handleDifficulty,
    stats,
    isReversedMode,
    resetProgress
  } = HardLearningManager();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showMasteryModal, setShowMasteryModal] = useState(false);

  useEffect(() => {
    if (stats.isFullyMastered && !showMasteryModal) {
      setShowMasteryModal(true);
    }
  }, [stats.isFullyMastered]);

  return (
    <div className="min-h-screen bg-[#121212] text-[#E1E1E1]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-medium text-[#BB86FC]">
              {isReversedMode ? 'Mode Inversé' : 'Mode Normal'}
            </h1>
            <div className="text-[#03DAC6] font-medium">
              Streak: {stats.currentStreak}
            </div>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-[#BB86FC] hover:text-[#03DAC6] transition-colors"
          >
            Réinitialiser
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[rgba(255,255,255,0.7)]">Progression globale</span>
            <span className="text-[#03DAC6]">{stats.progressPercentage}%</span>
          </div>
          <div className="h-2 bg-[#2D2D2D] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#03DAC6]"
              initial={{ width: 0 }}
              animate={{ width: `${stats.progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs mt-2 text-[rgba(255,255,255,0.5)]">
            <span>Cartes maîtrisées: {stats.masteredCards}/{stats.total}</span>
            <span>Restantes: {stats.total - stats.masteredCards}</span>
          </div>
        </div>

        {/* Main Card Section */}
        <div className="relative max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FlashCard
                card={currentCard}
                showAnswer={showAnswer}
                onShowAnswer={() => setShowAnswer(true)}
                onDifficulty={handleDifficulty}
                mode="hardlearning"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm
                         flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-sm w-full
                          border border-[rgba(187,134,252,0.2)]">
              <h3 className="text-lg font-medium text-[#BB86FC] mb-4">
                Réinitialiser la progression ?
              </h3>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-[rgba(255,255,255,0.7)]
                             hover:text-white transition-colors"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 text-[#CF6679] hover:text-[#FF4081]
                             transition-colors"
                  onClick={() => {
                    resetProgress();
                    setShowResetConfirm(false);
                  }}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mastery Achievement Modal */}
        {showMasteryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm
                         flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1E1E1E] rounded-xl p-8 max-w-md w-full
                        border border-[rgba(187,134,252,0.2)]"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#BB86FC] mb-4">
                  🎉 Félicitations ! 🎉
                </h3>
                <p className="text-[rgba(255,255,255,0.87)] mb-6">
                  Vous avez maîtrisé toutes les cartes ! Vous pouvez soit continuer à réviser pour maintenir vos connaissances, soit réinitialiser pour recommencer depuis le début.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-6 py-3 rounded-lg bg-[#2D2D2D] text-[#BB86FC]
                               hover:bg-[#3D3D3D] transition-colors"
                    onClick={() => setShowMasteryModal(false)}
                  >
                    Continuer
                  </button>
                  <button
                    className="px-6 py-3 rounded-lg bg-[#2D2D2D] text-[#03DAC6]
                               hover:bg-[#3D3D3D] transition-colors"
                    onClick={() => {
                      resetProgress();
                      setShowMasteryModal(false);
                    }}
                  >
                    Recommencer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HardLearning; 