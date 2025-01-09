import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import HardLearningManager from './HardLearningManager';
import FlashCard from './FlashCard';
import { FaCheck, FaChartBar, FaRandom } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdSwapHoriz } from 'react-icons/md';

const HardLearning = () => {
  const {
    currentCard,
    showAnswer,
    setShowAnswer,
    handleDifficulty,
    stats,
    isReversedMode,
    learningMode,
    cycleMode,
    resetProgress,
    changeDeckProportion
  } = HardLearningManager();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showMasteryModal, setShowMasteryModal] = useState(false);
  const [showDeckSettings, setShowDeckSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const proportionOptions = [25, 50, 75, 100];

  useEffect(() => {
    if (stats.isFullyMastered && !showMasteryModal) {
      setShowMasteryModal(true);
    }
  }, [stats.isFullyMastered]);

  const getModeIcon = () => {
    switch (learningMode) {
      case 'normal':
        return <MdSwapHoriz className="text-[#03DAC6] transform rotate-0 transition-transform" />;
      case 'reversed':
        return <MdSwapHoriz className="text-[#03DAC6] transform rotate-180 transition-transform" />;
      case 'random':
        return <FaRandom className="text-[#03DAC6]" />;
    }
  };

  const getModeText = () => {
    switch (learningMode) {
      case 'normal':
        return 'Mode Normal';
      case 'reversed':
        return 'Mode Inversé';
      case 'random':
        return 'Mode Aléatoire';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-[#E1E1E1]">
      <div className="max-w-4xl mx-auto px-4 py-6 relative">
        {/* Top Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={cycleMode}
              className="flex items-center gap-2 bg-[#2D2D2D] rounded-lg px-4 py-2 hover:bg-[#3D3D3D] transition-colors group relative"
            >
              <span className="text-[#BB86FC] font-medium">
                {getModeText()}
              </span>
              {getModeIcon()}
              {learningMode === 'random' && isReversedMode && (
                <div className="absolute -top-2 -right-2 bg-[#03DAC6] text-[#121212] text-xs px-2 py-0.5 rounded-full">
                  Inversé
                </div>
              )}
            </button>
            <div className="flex items-center gap-2 bg-[#2D2D2D] rounded-lg px-4 py-2">
              <span className="text-[#03DAC6] font-medium">
                {stats.currentStreak}
              </span>
              <span className="text-[rgba(255,255,255,0.7)]">streak</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2D2D2D] rounded-lg hover:bg-[#3D3D3D] transition-colors"
            >
              <FaChartBar className="text-[#BB86FC]" />
              <span>Stats</span>
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-[#2D2D2D] rounded-lg text-[#BB86FC] hover:bg-[#3D3D3D] transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[rgba(255,255,255,0.7)]">Progression</span>
              <span className="text-[#03DAC6] font-medium">{stats.progressPercentage}%</span>
            </div>
            <div className="text-xs text-[rgba(255,255,255,0.5)]">
              {stats.masteredCards}/{stats.total} cartes
            </div>
          </div>
          <div className="h-2 bg-[#2D2D2D] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#BB86FC] to-[#03DAC6]"
              initial={{ width: 0 }}
              animate={{ width: `${stats.progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Main Card Section */}
        <div className="relative max-w-2xl mx-auto mb-8">
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

        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-0 bottom-0 bg-[#1E1E1E] border-t border-[#2D2D2D] p-6 rounded-t-xl shadow-lg"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#BB86FC]">Statistiques</h2>
                  <button
                    onClick={() => setShowStats(false)}
                    className="text-[rgba(255,255,255,0.5)] hover:text-white"
                  >
                    Fermer
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#2D2D2D] p-4 rounded-lg">
                    <div className="text-sm text-[rgba(255,255,255,0.5)]">Faciles</div>
                    <div className="text-xl font-bold text-[#4CAF50]">{stats.easy}</div>
                  </div>
                  <div className="bg-[#2D2D2D] p-4 rounded-lg">
                    <div className="text-sm text-[rgba(255,255,255,0.5)]">Moyennes</div>
                    <div className="text-xl font-bold text-[#FFC107]">{stats.medium}</div>
                  </div>
                  <div className="bg-[#2D2D2D] p-4 rounded-lg">
                    <div className="text-sm text-[rgba(255,255,255,0.5)]">Difficiles</div>
                    <div className="text-xl font-bold text-[#CF6679]">{stats.hard}</div>
                  </div>
                  <div className="bg-[#2D2D2D] p-4 rounded-lg">
                    <div className="text-sm text-[rgba(255,255,255,0.5)]">Non vues</div>
                    <div className="text-xl font-bold text-[rgba(255,255,255,0.7)]">{stats.unseen}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1E1E1E] rounded-xl p-8 max-w-sm w-full border border-[rgba(187,134,252,0.2)]"
            >
              <h3 className="text-xl font-bold text-[#BB86FC] mb-4">
                Réinitialiser la progression ?
              </h3>
              <p className="text-[rgba(255,255,255,0.87)] mb-6">
                Cette action effacera toute votre progression. Êtes-vous sûr de vouloir continuer ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-[rgba(255,255,255,0.7)] hover:text-white transition-colors"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-[#CF6679] text-white rounded-lg hover:bg-[#FF4081] transition-colors"
                  onClick={() => {
                    resetProgress();
                    setShowResetConfirm(false);
                  }}
                >
                  Réinitialiser
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Mastery Achievement Modal */}
        {showMasteryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1E1E1E] rounded-xl p-8 max-w-md w-full border border-[rgba(187,134,252,0.2)]"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-[#BB86FC] mb-4">
                  Félicitations !
                </h3>
                <p className="text-[rgba(255,255,255,0.87)] mb-6">
                  Vous avez maîtrisé toutes les cartes ! Continuez à réviser pour maintenir vos connaissances ou recommencez depuis le début.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-6 py-3 rounded-lg bg-[#2D2D2D] text-[#BB86FC] hover:bg-[#3D3D3D] transition-colors"
                    onClick={() => setShowMasteryModal(false)}
                  >
                    Continuer
                  </button>
                  <button
                    className="px-6 py-3 rounded-lg bg-[#03DAC6] text-[#121212] font-medium hover:bg-[#00BFA5] transition-colors"
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

        {/* Deck Settings */}
        <div className="fixed bottom-4 right-4">
          <div className="relative">
            <button
              onClick={() => setShowDeckSettings(!showDeckSettings)}
              className="flex items-center gap-2 px-4 py-2 bg-[#2D2D2D] rounded-lg hover:bg-[#3D3D3D] transition-colors shadow-lg"
            >
              <span>{stats.deckProportion}% du deck</span>
              <MdKeyboardArrowDown 
                className={`transform transition-transform ${showDeckSettings ? 'rotate-180' : ''}`}
              />
            </button>
            {showDeckSettings && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-full right-0 mb-2 py-2 w-48 bg-[#1E1E1E] rounded-lg shadow-lg z-10"
              >
                {proportionOptions.map((proportion) => (
                  <button
                    key={proportion}
                    onClick={() => {
                      changeDeckProportion(proportion);
                      setShowDeckSettings(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-[#2F2F2F] transition-colors flex items-center justify-between ${
                      stats.deckProportion === proportion ? 'text-[#BB86FC]' : ''
                    }`}
                  >
                    {proportion}% du deck
                    {stats.deckProportion === proportion && (
                      <FaCheck className="text-[#BB86FC]" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardLearning; 