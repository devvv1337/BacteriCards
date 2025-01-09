import { motion } from 'framer-motion';

interface FlashCardProps {
  card: {
    question: string;
    answer: string;
    details?: {
      Localisation: string;
      "Symptomes maladies": string;
      "Spécificités Diagnostic": string;
      "Traitement Prévention": string;
    };
    isReversed: boolean;
  };
  showAnswer: boolean;
  onShowAnswer: () => void;
  onDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  mode: 'hardlearning' | 'training' | 'exam';
}

const FlashCard = ({ card, showAnswer, onShowAnswer, onDifficulty, mode }: FlashCardProps) => {
  const renderDetails = (details: FlashCardProps['card']['details']) => {
    if (!details) return null;
    
    return (
      <div className="space-y-6">
        {details.Localisation && (
          <div className="bg-[#2D2D2D] p-4 rounded-lg">
            <h4 className="text-[#03DAC6] text-sm font-medium mb-2">Localisation</h4>
            <p className="text-[rgba(255,255,255,0.87)] leading-relaxed">{details.Localisation}</p>
          </div>
        )}
        {details["Symptomes maladies"] && (
          <div className="bg-[#2D2D2D] p-4 rounded-lg">
            <h4 className="text-[#03DAC6] text-sm font-medium mb-2">Symptômes/Maladies</h4>
            <p className="text-[rgba(255,255,255,0.87)] leading-relaxed">{details["Symptomes maladies"]}</p>
          </div>
        )}
        {details["Spécificités Diagnostic"] && (
          <div className="bg-[#2D2D2D] p-4 rounded-lg">
            <h4 className="text-[#03DAC6] text-sm font-medium mb-2">Spécificités Diagnostic</h4>
            <p className="text-[rgba(255,255,255,0.87)] leading-relaxed">{details["Spécificités Diagnostic"]}</p>
          </div>
        )}
        {details["Traitement Prévention"] && (
          <div className="bg-[#2D2D2D] p-4 rounded-lg">
            <h4 className="text-[#03DAC6] text-sm font-medium mb-2">Traitement/Prévention</h4>
            <p className="text-[rgba(255,255,255,0.87)] leading-relaxed">{details["Traitement Prévention"]}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg border border-[rgba(187,134,252,0.1)]">
      {/* Question section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#BB86FC]" />
          <h3 className="text-sm font-medium text-[rgba(255,255,255,0.6)]">
            {card.isReversed ? "Devinez le nom de la bactérie" : "Devinez les caractéristiques"}
          </h3>
        </div>
        {card.isReversed ? (
          renderDetails(card.details)
        ) : (
          <div className="bg-[#2D2D2D] p-6 rounded-lg">
            <p className="text-2xl font-medium text-[rgba(255,255,255,0.87)] text-center">
              {card.question}
            </p>
          </div>
        )}
      </div>

      {/* Answer section */}
      {!showAnswer ? (
        <motion.button
          className="w-full py-4 rounded-lg bg-gradient-to-r from-[#BB86FC] to-[#03DAC6] text-[#121212] font-medium
                     hover:opacity-90 transition-opacity"
          whileTap={{ scale: 0.98 }}
          onClick={onShowAnswer}
        >
          Voir la réponse
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-lg bg-[#2D2D2D] border border-[rgba(187,134,252,0.1)]">
            {card.isReversed ? (
              <p className="text-2xl font-medium text-[rgba(255,255,255,0.87)] text-center">
                {card.answer}
              </p>
            ) : (
              renderDetails(card.details)
            )}
          </div>

          {mode === 'hardlearning' && (
            <div className="grid grid-cols-3 gap-3">
              <motion.button
                className="py-3 rounded-lg bg-[#2D2D2D] text-[#4CAF50] font-medium
                           hover:bg-[#3D3D3D] transition-colors relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDifficulty('easy')}
              >
                <span className="relative z-10">Facile</span>
                <motion.div
                  className="absolute inset-0 bg-[#4CAF50] opacity-10"
                  initial={false}
                  whileHover={{ opacity: 0.2 }}
                />
              </motion.button>
              <motion.button
                className="py-3 rounded-lg bg-[#2D2D2D] text-[#FFC107] font-medium
                           hover:bg-[#3D3D3D] transition-colors relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDifficulty('medium')}
              >
                <span className="relative z-10">Moyen</span>
                <motion.div
                  className="absolute inset-0 bg-[#FFC107] opacity-10"
                  initial={false}
                  whileHover={{ opacity: 0.2 }}
                />
              </motion.button>
              <motion.button
                className="py-3 rounded-lg bg-[#2D2D2D] text-[#CF6679] font-medium
                           hover:bg-[#3D3D3D] transition-colors relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDifficulty('hard')}
              >
                <span className="relative z-10">Difficile</span>
                <motion.div
                  className="absolute inset-0 bg-[#CF6679] opacity-10"
                  initial={false}
                  whileHover={{ opacity: 0.2 }}
                />
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FlashCard; 