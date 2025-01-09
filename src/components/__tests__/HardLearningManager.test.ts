import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import HardLearningManager from '../HardLearningManager';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock Math.random pour contrôler le mode inversé
const originalMath = window.Math;
const mockMath = Object.create(originalMath);
mockMath.random = () => 0.1; // Toujours retourner 0.1 pour avoir le mode normal
window.Math = mockMath;

describe('HardLearningManager', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  describe('Initialisation et réinitialisation', () => {
    it('devrait initialiser avec aucune carte maîtrisée', () => {
      const { result } = renderHook(() => HardLearningManager());
      expect(result.current.stats.masteredCards).toBe(0);
      expect(result.current.stats.progressPercentage).toBe(0);
      expect(result.current.stats.easy).toBe(0);
      expect(result.current.stats.medium).toBe(0);
      expect(result.current.stats.hard).toBe(0);
      expect(result.current.stats.unseen).toBeGreaterThan(0);
    });

    it('devrait réinitialiser tous les compteurs avec resetProgress', () => {
      const { result } = renderHook(() => HardLearningManager());
      
      // Ajouter quelques réponses
      act(() => {
        result.current.handleDifficulty('easy');
        result.current.handleDifficulty('medium');
        result.current.handleDifficulty('hard');
      });
      
      // Réinitialiser
      act(() => {
        result.current.resetProgress();
      });
      
      expect(result.current.stats.masteredCards).toBe(0);
      expect(result.current.stats.progressPercentage).toBe(0);
      expect(result.current.stats.easy).toBe(0);
      expect(result.current.stats.medium).toBe(0);
      expect(result.current.stats.hard).toBe(0);
      expect(result.current.stats.currentStreak).toBe(0);
      expect(result.current.showAnswer).toBe(false);
    });
  });

  describe('Logique de maîtrise des cartes', () => {
    it('devrait compter une carte comme maîtrisée après 2 "easy"', () => {
      const { result } = renderHook(() => HardLearningManager());
      const initialCard = result.current.currentCard.question;
      
      // Premier "easy"
      act(() => {
        result.current.handleDifficulty('easy');
      });

      // On revient à la même carte
      while (result.current.currentCard.question !== initialCard) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      // Deuxième "easy" sur la même carte
      act(() => {
        result.current.handleDifficulty('easy');
      });
      
      expect(result.current.stats.masteredCards).toBe(1);
      expect(result.current.stats.easy).toBeGreaterThan(0);
    });

    it('ne devrait pas compter une carte comme maîtrisée avec medium/hard', () => {
      const { result } = renderHook(() => HardLearningManager());
      const initialCard = result.current.currentCard.question;
      
      // Marquer comme "medium"
      act(() => {
        result.current.handleDifficulty('medium');
      });

      // Revenir à la carte initiale
      while (result.current.currentCard.question !== initialCard) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      // Marquer comme "hard"
      act(() => {
        result.current.handleDifficulty('hard');
      });
      
      expect(result.current.stats.masteredCards).toBe(0);
      expect(result.current.stats.medium).toBeGreaterThan(0);
      expect(result.current.stats.hard).toBeGreaterThan(0);
    });

    it('devrait perdre le statut maîtrisé si marqué comme medium/hard après 2 easy', () => {
      const { result } = renderHook(() => HardLearningManager());
      const initialCard = result.current.currentCard.question;
      
      // Deux "easy" pour maîtriser
      act(() => {
        result.current.handleDifficulty('easy');
      });

      while (result.current.currentCard.question !== initialCard) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      act(() => {
        result.current.handleDifficulty('easy');
      });
      
      expect(result.current.stats.masteredCards).toBe(1);

      // Revenir à la carte et la marquer comme hard
      while (result.current.currentCard.question !== initialCard) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      act(() => {
        result.current.handleDifficulty('hard');
      });
      
      expect(result.current.stats.masteredCards).toBe(0);
    });
  });

  describe('Gestion des streaks et compteurs', () => {
    it('devrait maintenir le streak uniquement pour les easy consécutifs', () => {
      const { result } = renderHook(() => HardLearningManager());
      
      act(() => {
        result.current.handleDifficulty('easy');
      });
      expect(result.current.stats.currentStreak).toBe(1);
      
      act(() => {
        result.current.handleDifficulty('easy');
      });
      expect(result.current.stats.currentStreak).toBe(2);
      
      act(() => {
        result.current.handleDifficulty('medium');
      });
      expect(result.current.stats.currentStreak).toBe(0);
    });

    it('devrait maintenir le compteur timesReviewed uniquement pour les "easy"', () => {
      const { result } = renderHook(() => HardLearningManager());
      const initialCard = result.current.currentCard.question;
      
      // Premier "easy"
      act(() => {
        result.current.handleDifficulty('easy');
      });

      // Revenir à la carte initiale
      while (result.current.currentCard.question !== initialCard) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      // Marquer comme "medium"
      act(() => {
        result.current.handleDifficulty('medium');
      });

      while (result.current.currentCard.question !== initialCard) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      // Marquer comme "hard"
      act(() => {
        result.current.handleDifficulty('hard');
      });

      while (result.current.currentCard.question !== initialCard) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      // Deuxième "easy"
      act(() => {
        result.current.handleDifficulty('easy');
      });
      
      expect(result.current.stats.masteredCards).toBe(1);
    });
  });

  describe('Calcul de la progression', () => {
    it('devrait calculer correctement le pourcentage de progression', () => {
      const { result } = renderHook(() => HardLearningManager());
      const totalCards = result.current.stats.total;
      const initialCard = result.current.currentCard.question;
      
      // Maîtriser une carte
      act(() => {
        result.current.handleDifficulty('easy');
      });

      while (result.current.currentCard.question !== initialCard) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      act(() => {
        result.current.handleDifficulty('easy');
      });
      
      const expectedPercentage = Math.round((1 / totalCards) * 100);
      expect(result.current.stats.progressPercentage).toBe(expectedPercentage);
    });

    it('devrait identifier correctement quand toutes les cartes sont maîtrisées', () => {
      const { result } = renderHook(() => HardLearningManager());
      const initialCard = result.current.currentCard.question;
      let currentCard = initialCard;
      
      // Marquer toutes les cartes comme "easy" deux fois
      do {
        act(() => {
          result.current.handleDifficulty('easy');
        });
        currentCard = result.current.currentCard.question;
      } while (currentCard !== initialCard);

      do {
        act(() => {
          result.current.handleDifficulty('easy');
        });
        currentCard = result.current.currentCard.question;
      } while (currentCard !== initialCard);
      
      expect(result.current.stats.progressPercentage).toBe(100);
      expect(result.current.stats.isFullyMastered).toBe(true);
    });
  });

  describe('Persistance des données', () => {
    it('devrait sauvegarder et restaurer l\'état depuis localStorage', () => {
      // Premier hook pour sauvegarder l'état
      const { result: result1 } = renderHook(() => HardLearningManager());
      const initialCard = result1.current.currentCard.question;
      
      // Maîtriser une carte
      act(() => {
        result1.current.handleDifficulty('easy');
      });

      while (result1.current.currentCard.question !== initialCard) {
        act(() => {
          result1.current.handleDifficulty('medium');
        });
      }
      
      act(() => {
        result1.current.handleDifficulty('easy');
      });
      
      const savedStats = result1.current.stats;
      
      // Deuxième hook pour vérifier la restauration
      const { result: result2 } = renderHook(() => HardLearningManager());
      
      expect(result2.current.stats.masteredCards).toBe(savedStats.masteredCards);
      expect(result2.current.stats.progressPercentage).toBe(savedStats.progressPercentage);
      expect(result2.current.stats.easy).toBe(savedStats.easy);
    });
  });

  describe('Sélection des cartes', () => {
    it('ne devrait pas montrer la même carte immédiatement après l\'avoir jouée', () => {
      const { result } = renderHook(() => HardLearningManager());
      const firstCard = result.current.currentCard.question;
      
      // Jouer la première carte
      act(() => {
        result.current.handleDifficulty('easy');
      });
      
      const nextCard = result.current.currentCard.question;
      expect(nextCard).not.toBe(firstCard);
    });

    it('ne devrait pas montrer la même carte après plusieurs réponses consécutives', () => {
      const { result } = renderHook(() => HardLearningManager());
      const seenCards = new Set<string>();
      const firstCard = result.current.currentCard.question;
      seenCards.add(firstCard);
      
      // Jouer 5 cartes consécutives
      for (let i = 0; i < 5; i++) {
        const currentCard = result.current.currentCard.question;
        
        act(() => {
          result.current.handleDifficulty('medium');
        });
        
        const nextCard = result.current.currentCard.question;
        expect(nextCard).not.toBe(currentCard);
        seenCards.add(nextCard);
      }
      
      // Vérifier que nous avons vu des cartes différentes
      expect(seenCards.size).toBeGreaterThan(1);
    });

    it('devrait éventuellement remontrer une carte après avoir vu d\'autres cartes', () => {
      const { result } = renderHook(() => HardLearningManager());
      const firstCard = result.current.currentCard.question;
      const seenCards = new Set<string>();
      let firstCardSeen = false;
      
      // Jouer jusqu'à revoir la première carte, mais pas plus de 50 fois pour éviter une boucle infinie
      for (let i = 0; i < 50 && !firstCardSeen; i++) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
        
        const currentCard = result.current.currentCard.question;
        seenCards.add(currentCard);
        
        if (currentCard === firstCard && seenCards.size > 2) {
          firstCardSeen = true;
        }
      }
      
      expect(firstCardSeen).toBe(true);
      expect(seenCards.size).toBeGreaterThan(2);
    });
  });

  describe('Algorithme de priorité des cartes', () => {
    it('devrait donner une priorité plus élevée aux cartes difficiles', () => {
      const { result } = renderHook(() => HardLearningManager());
      const initialCard = result.current.currentCard.question;
      
      // Marquer la première carte comme difficile
      act(() => {
        result.current.handleDifficulty('hard');
      });
      
      // Marquer quelques autres cartes comme medium/easy
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      // La carte difficile devrait revenir plus rapidement
      let seenCards = 0;
      while (result.current.currentCard.question !== initialCard && seenCards < 10) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
        seenCards++;
      }
      
      expect(seenCards).toBeLessThan(5); // La carte difficile devrait revenir dans les 5 prochaines cartes
    });

    it('devrait augmenter la fréquence des cartes constamment marquées comme difficiles', () => {
      const { result } = renderHook(() => HardLearningManager());
      const initialCard = result.current.currentCard.question;
      
      // Marquer la même carte comme difficile plusieurs fois
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.handleDifficulty('hard');
        });
        
        // Revenir à la carte initiale
        while (result.current.currentCard.question !== initialCard) {
          act(() => {
            result.current.handleDifficulty('medium');
          });
        }
      }
      
      // Vérifier que la carte revient encore plus rapidement
      let seenCards = 0;
      act(() => {
        result.current.handleDifficulty('hard');
      });
      
      while (result.current.currentCard.question !== initialCard && seenCards < 10) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
        seenCards++;
      }
      
      expect(seenCards).toBeLessThan(3); // La carte très difficile devrait revenir très rapidement
    });
  });

  describe('Intervalles dynamiques', () => {
    it('devrait ajuster les intervalles en fonction du nombre de cartes', () => {
      const { result } = renderHook(() => HardLearningManager());
      const totalCards = result.current.stats.total;
      
      // Marquer une carte comme facile plusieurs fois
      const initialCard = result.current.currentCard.question;
      let lastSeenTime = Date.now();
      
      act(() => {
        result.current.handleDifficulty('easy');
      });
      
      // Revenir à la carte initiale
      while (result.current.currentCard.question !== initialCard) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      const newSeenTime = Date.now();
      const interval = newSeenTime - lastSeenTime;
      
      // L'intervalle devrait être proportionnel au nombre de cartes
      expect(interval).toBeGreaterThanOrEqual(Math.min(300, totalCards * 2));
    });

    it('devrait réduire les intervalles pour les cartes difficiles', () => {
      const { result } = renderHook(() => HardLearningManager());
      const initialCard = result.current.currentCard.question;
      
      // Marquer une carte comme difficile
      act(() => {
        result.current.handleDifficulty('hard');
      });
      
      let seenTime = Date.now();
      
      // Attendre que la carte revienne
      while (result.current.currentCard.question !== initialCard) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      const interval = Date.now() - seenTime;
      expect(interval).toBeLessThan(30 * 1000); // Moins que l'intervalle de base
    });
  });

  describe('Mode inversé adaptatif', () => {
    it('devrait favoriser le mode avec les performances les plus faibles', () => {
      const { result } = renderHook(() => HardLearningManager());
      
      // Créer un déséquilibre dans les performances
      for (let i = 0; i < 5; i++) {
        while (!result.current.isReversedMode) {
          act(() => {
            result.current.handleDifficulty('easy');
          });
        }
        act(() => {
          result.current.handleDifficulty('hard');
        });
      }
      
      // Compter combien de fois le mode inversé apparaît
      let reversedCount = 0;
      for (let i = 0; i < 20; i++) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
        if (result.current.isReversedMode) {
          reversedCount++;
        }
      }
      
      // Le mode inversé devrait apparaître plus souvent car les performances y sont plus faibles
      expect(reversedCount).toBeGreaterThan(10);
    });

    it('devrait maintenir un équilibre quand les performances sont similaires', () => {
      const { result } = renderHook(() => HardLearningManager());
      
      // Créer des performances similaires dans les deux modes
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
      }
      
      // Compter les occurrences de chaque mode
      let reversedCount = 0;
      for (let i = 0; i < 20; i++) {
        act(() => {
          result.current.handleDifficulty('medium');
        });
        if (result.current.isReversedMode) {
          reversedCount++;
        }
      }
      
      // Le ratio devrait être proche de 50/50
      expect(reversedCount).toBeGreaterThanOrEqual(7);
      expect(reversedCount).toBeLessThanOrEqual(13);
    });
  });
}); 