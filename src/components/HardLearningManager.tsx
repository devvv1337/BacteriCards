import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import bacteriesData from '../bacteries.json';

interface CardStatus {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  lastSeen: number;
  timesReviewed: number;
  streak: number;
  failureCount: number;
  lastInterval: number;
  reverseStreak: number;
  reverseFailureCount: number;
  isIncluded: boolean;
}

interface CardView {
  question: string;
  answer: string;
  details: {
    Noms: string;
    Localisation: string;
    "Symptomes maladies": string;
    "Spécificités Diagnostic": string;
    "Traitement Prévention": string;
  };
  isReversed: boolean;
}

const HardLearningManager = () => {
  const [deckProportion, setDeckProportion] = useLocalStorage<number>('deck-proportion', 100);
  const [selectedCards] = useState(() => {
    const totalCards = bacteriesData.length;
    const cardsToInclude = Math.floor((totalCards * deckProportion) / 100);
    return new Set(
      [...Array(totalCards).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, cardsToInclude)
    );
  });

  const [cardStatuses, setCardStatuses] = useLocalStorage<CardStatus[]>('card-statuses', 
    bacteriesData.map((b, index) => ({
      id: b.Noms,
      difficulty: null,
      lastSeen: Date.now(),
      timesReviewed: 0,
      streak: 0,
      failureCount: 0,
      lastInterval: 0,
      reverseStreak: 0,
      reverseFailureCount: 0,
      isIncluded: selectedCards.has(index)
    }))
  );

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [isReversedMode, setIsReversedMode] = useState(false);
  const [lastSeenIndices] = useState<Set<number>>(new Set());

  // Fonction pour créer une vue de carte (normale ou inversée)
  const createCardView = (bacterie: typeof bacteriesData[0], reversed: boolean): CardView => {
    if (reversed) {
      // Mode inversé : deviner le nom à partir des caractéristiques
      return {
        question: '',  // La question sera affichée avec les détails dans le composant FlashCard
        answer: bacterie.Noms,
        details: bacterie,
        isReversed: true
      };
    } else {
      // Mode normal : deviner les caractéristiques à partir du nom
      return {
        question: bacterie.Noms,
        answer: '',  // L'affichage complet sera géré par le composant FlashCard
        details: bacterie,
        isReversed: false
      };
    }
  };

  const calculateNextInterval = (status: CardStatus, difficulty: 'easy' | 'medium' | 'hard', reversed: boolean) => {
    const baseInterval = 30;
    let multiplier = 1;
    const currentStreak = reversed ? status.reverseStreak : status.streak;
    const currentFailures = reversed ? status.reverseFailureCount : status.failureCount;

    switch(difficulty) {
      case 'easy':
        multiplier = Math.min(currentStreak + 1, 5) * 2;
        break;
      case 'medium':
        multiplier = Math.min(currentStreak + 1, 3) * 1.5;
        break;
      case 'hard':
        multiplier = 1;
        break;
    }

    if (currentFailures > 0) {
      multiplier = multiplier / (currentFailures + 1);
    }

    return Math.max(baseInterval * multiplier, baseInterval);
  };

  const getNextCardIndex = () => {
    const now = Date.now();
    const sortedCards = cardStatuses
      .map((status, index) => ({ status, index }))
      .filter(card => selectedCards.has(card.index)) // Filtrer selon la proportion choisie
      .filter(card => !lastSeenIndices.has(card.index))
      .sort((a, b) => {
        if (a.status.difficulty === null) return -1;
        if (b.status.difficulty === null) return 1;

        const aScore = getCardPriorityScore(a.status, now);
        const bScore = getCardPriorityScore(b.status, now);
        return bScore - aScore;
      });

    if (sortedCards.length === 0) {
      lastSeenIndices.clear();
      return getNextCardIndex();
    }

    const nextIndex = sortedCards[0].index;
    lastSeenIndices.add(nextIndex);
    
    if (lastSeenIndices.size > 3) {
      const oldestCard = Array.from(lastSeenIndices)[0];
      lastSeenIndices.delete(oldestCard);
    }

    setIsReversedMode(Math.random() < 0.5);
    return nextIndex;
  };

  const getCardPriorityScore = (status: CardStatus, now: number) => {
    const timeSinceLastReview = (now - status.lastSeen) / 1000;
    const difficultyScore = {
      'hard': 3,
      'medium': 2,
      'easy': 1,
      'null': 4
    }[status.difficulty || 'null'];

    const currentStreak = isReversedMode ? status.reverseStreak : status.streak;
    const currentFailures = isReversedMode ? status.reverseFailureCount : status.failureCount;

    const urgencyFactor = Math.max(0, timeSinceLastReview / status.lastInterval);
    const failureFactor = (currentFailures + 1) * 1.5;
    const streakPenalty = 1 / (currentStreak + 1);

    return (difficultyScore * urgencyFactor * failureFactor * streakPenalty);
  };

  const handleDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    const now = Date.now();
    setCardStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      const currentStatus = newStatuses[currentCardIndex];
      
      const isSuccess = difficulty === 'easy' || (difficulty === 'medium' && currentStatus.streak > 0);
      
      if (isReversedMode) {
        const newReverseStreak = isSuccess ? currentStatus.reverseStreak + 1 : 0;
        const newReverseFailureCount = difficulty === 'hard' ? currentStatus.reverseFailureCount + 1 : 0;
        
        newStatuses[currentCardIndex] = {
          ...currentStatus,
          difficulty,
          lastSeen: now,
          timesReviewed: difficulty === 'easy' ? currentStatus.timesReviewed + 1 : currentStatus.timesReviewed,
          reverseStreak: newReverseStreak,
          reverseFailureCount: newReverseFailureCount,
          lastInterval: calculateNextInterval(currentStatus, difficulty, true)
        };
      } else {
        const newStreak = isSuccess ? currentStatus.streak + 1 : 0;
        const newFailureCount = difficulty === 'hard' ? currentStatus.failureCount + 1 : 0;
        
        newStatuses[currentCardIndex] = {
          ...currentStatus,
          difficulty,
          lastSeen: now,
          timesReviewed: difficulty === 'easy' ? currentStatus.timesReviewed + 1 : currentStatus.timesReviewed,
          streak: newStreak,
          failureCount: newFailureCount,
          lastInterval: calculateNextInterval(currentStatus, difficulty, false)
        };
      }

      return newStatuses;
    });

    if (difficulty === 'easy') {
      setSessionStreak(prev => prev + 1);
    } else {
      setSessionStreak(0);
    }

    setShowAnswer(false);
    setCurrentCardIndex(getNextCardIndex());
  };

  const stats = {
    total: selectedCards.size,
    easy: cardStatuses.filter(s => selectedCards.has(cardStatuses.indexOf(s)) && s.difficulty === 'easy').length,
    medium: cardStatuses.filter(s => selectedCards.has(cardStatuses.indexOf(s)) && s.difficulty === 'medium').length,
    hard: cardStatuses.filter(s => selectedCards.has(cardStatuses.indexOf(s)) && s.difficulty === 'hard').length,
    unseen: cardStatuses.filter(s => selectedCards.has(cardStatuses.indexOf(s)) && s.difficulty === null).length,
    currentStreak: sessionStreak,
    averageStreak: Math.round(cardStatuses
      .filter(s => selectedCards.has(cardStatuses.indexOf(s)))
      .reduce((acc, curr) => acc + curr.streak + curr.reverseStreak, 0) / (selectedCards.size * 2)),
    masteredCards: cardStatuses.filter(s => 
      selectedCards.has(cardStatuses.indexOf(s)) &&
      s.difficulty === 'easy' && 
      s.timesReviewed >= 2
    ).length,
    progressPercentage: Math.round((cardStatuses.filter(s => 
      selectedCards.has(cardStatuses.indexOf(s)) &&
      s.difficulty === 'easy' && 
      s.timesReviewed >= 2
    ).length / selectedCards.size) * 100),
    isFullyMastered: cardStatuses
      .filter(s => selectedCards.has(cardStatuses.indexOf(s)))
      .every(s => s.difficulty === 'easy' && s.timesReviewed >= 2),
    deckProportion
  };

  const currentCard = createCardView(bacteriesData[currentCardIndex], isReversedMode);

  const resetProgress = () => {
    setCardStatuses(
      bacteriesData.map((b, index) => ({
        id: b.Noms,
        difficulty: null,
        lastSeen: Date.now(),
        timesReviewed: 0,
        streak: 0,
        failureCount: 0,
        lastInterval: 0,
        reverseStreak: 0,
        reverseFailureCount: 0,
        isIncluded: selectedCards.has(index)
      }))
    );
    setSessionStreak(0);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setIsReversedMode(false);
  };

  const changeDeckProportion = (newProportion: number) => {
    setDeckProportion(newProportion);
    window.location.reload(); // Recharger pour réinitialiser avec la nouvelle proportion
  };

  return {
    currentCard,
    showAnswer,
    setShowAnswer,
    handleDifficulty,
    stats,
    isReversedMode,
    resetProgress,
    changeDeckProportion
  };
};

export default HardLearningManager; 