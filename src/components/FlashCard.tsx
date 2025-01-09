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
      <div className="space-y-4">
        {details.Localisation && (
          <div>
            <h4 className="text-[#03DAC6] text-sm font-medium mb-1">Localisation</h4>
            <p className="text-[rgba(255,255,255,0.87)]">{details.Localisation}</p>
          </div>
        )}
        {details["Symptomes maladies"] && (
          <div>
            <h4 className="text-[#03DAC6] text-sm font-medium mb-1">Symptômes/Maladies</h4>
            <p className="text-[rgba(255,255,255,0.87)]">{details["Symptomes maladies"]}</p>
          </div>
        )}
        {details["Spécificités Diagnostic"] && (
          <div>
            <h4 className="text-[#03DAC6] text-sm font-medium mb-1">Spécificités Diagnostic</h4>
            <p className="text-[rgba(255,255,255,0.87)]">{details["Spécificités Diagnostic"]}</p>
          </div>
        )}
        {details["Traitement Prévention"] && (
          <div>
            <h4 className="text-[#03DAC6] text-sm font-medium mb-1">Traitement/Prévention</h4>
            <p className="text-[rgba(255,255,255,0.87)]">{details["Traitement Prévention"]}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      {/* Question section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[#BB86FC] mb-4">
          {card.isReversed ? "Devinez le nom de la bactérie" : "Devinez les caractéristiques"}
        </h3>
        {card.isReversed ? (
          renderDetails(card.details)
        ) : (
          <p className="text-2xl font-medium text-[rgba(255,255,255,0.87)]">
            {card.question}
          </p>
        )}
      </div>

      {/* Answer section */}
      {!showAnswer ? (
        <motion.button
          className="w-full py-3 rounded-lg bg-[#2D2D2D] text-[#BB86FC]
                     hover:bg-[#3D3D3D] transition-colors"
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
          <div className="p-4 rounded-lg bg-[#2D2D2D]">
            {card.isReversed ? (
              <p className="text-2xl font-medium text-[rgba(255,255,255,0.87)]">
                {card.answer}
              </p>
            ) : (
              renderDetails(card.details)
            )}
          </div>

          {mode === 'hardlearning' && (
            <div className="grid grid-cols-3 gap-3">
              <button
                className="py-2 rounded-lg bg-[#2D2D2D] text-[#4CAF50]
                           hover:bg-[#3D3D3D] transition-colors"
                onClick={() => onDifficulty('easy')}
              >
                Facile
              </button>
              <button
                className="py-2 rounded-lg bg-[#2D2D2D] text-[#FFC107]
                           hover:bg-[#3D3D3D] transition-colors"
                onClick={() => onDifficulty('medium')}
              >
                Moyen
              </button>
              <button
                className="py-2 rounded-lg bg-[#2D2D2D] text-[#CF6679]
                           hover:bg-[#3D3D3D] transition-colors"
                onClick={() => onDifficulty('hard')}
              >
                Difficile
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FlashCard; 