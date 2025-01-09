interface StatsProps {
  stats: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
    unseen: number;
    currentStreak: number;
    averageStreak: number;
    masteredCards: number;
  };
}

const Stats = ({ stats }: StatsProps) => {
  const getPercentage = (value: number) => {
    return ((value / stats.total) * 100).toFixed(1);
  };

  return (
    <div className="relative">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#BB86FC10] to-[#03DAC610] blur-xl" />
      
      <div className="relative backdrop-blur-md bg-[rgba(30,30,30,0.95)] rounded-xl p-6 
                    border border-[rgba(187,134,252,0.2)] shadow-lg
                    hover:shadow-[0_0_25px_rgba(187,134,252,0.15)]
                    transition-all duration-300">
        {/* Streak et maîtrise */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#2D2D2D] to-[#1E1E1E] 
                        border border-[rgba(187,134,252,0.2)] hover:border-[rgba(187,134,252,0.4)]
                        transition-all duration-200">
            <div className="text-2xl font-bold text-[#BB86FC]">{stats.currentStreak}</div>
            <div className="text-sm text-[rgba(255,255,255,0.7)]">Streak actuel</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#2D2D2D] to-[#1E1E1E] 
                        border border-[rgba(3,218,198,0.2)] hover:border-[rgba(3,218,198,0.4)]
                        transition-all duration-200">
            <div className="text-2xl font-bold text-[#03DAC6]">{stats.averageStreak}</div>
            <div className="text-sm text-[rgba(255,255,255,0.7)]">Streak moyen</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#2D2D2D] to-[#1E1E1E] 
                        border border-[rgba(187,134,252,0.2)] hover:border-[rgba(187,134,252,0.4)]
                        transition-all duration-200 md:col-span-1 col-span-2">
            <div className="text-2xl font-bold text-[#BB86FC]">{stats.masteredCards}</div>
            <div className="text-sm text-[rgba(255,255,255,0.7)]">Cartes maîtrisées</div>
          </div>
        </div>

        {/* Statistiques détaillées */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.2)]
                          hover:border-[rgba(76,175,80,0.4)] transition-all duration-200 text-center">
              <div className="text-2xl font-bold text-[#4CAF50]">{getPercentage(stats.easy)}%</div>
              <div className="text-sm text-[rgba(255,255,255,0.7)]">Facile</div>
              <div className="text-xs text-[rgba(255,255,255,0.5)]">{stats.easy}/{stats.total}</div>
            </div>
            <div className="p-3 rounded-lg bg-[rgba(255,193,7,0.1)] border border-[rgba(255,193,7,0.2)]
                          hover:border-[rgba(255,193,7,0.4)] transition-all duration-200 text-center">
              <div className="text-2xl font-bold text-[#FFC107]">{getPercentage(stats.medium)}%</div>
              <div className="text-sm text-[rgba(255,255,255,0.7)]">Moyen</div>
              <div className="text-xs text-[rgba(255,255,255,0.5)]">{stats.medium}/{stats.total}</div>
            </div>
            <div className="p-3 rounded-lg bg-[rgba(207,102,121,0.1)] border border-[rgba(207,102,121,0.2)]
                          hover:border-[rgba(207,102,121,0.4)] transition-all duration-200 text-center">
              <div className="text-2xl font-bold text-[#CF6679]">{getPercentage(stats.hard)}%</div>
              <div className="text-sm text-[rgba(255,255,255,0.7)]">Difficile</div>
              <div className="text-xs text-[rgba(255,255,255,0.5)]">{stats.hard}/{stats.total}</div>
            </div>
            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]
                          hover:border-[rgba(255,255,255,0.2)] transition-all duration-200 text-center">
              <div className="text-2xl font-bold text-[rgba(255,255,255,0.7)]">{getPercentage(stats.unseen)}%</div>
              <div className="text-sm text-[rgba(255,255,255,0.7)]">Non vu</div>
              <div className="text-xs text-[rgba(255,255,255,0.5)]">{stats.unseen}/{stats.total}</div>
            </div>
          </div>
          
          {/* Progress bar with enhanced glass effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4CAF5020] via-[#FFC10720] to-[#CF667920] blur-md" />
            <div className="relative h-3 bg-[rgba(45,45,45,0.8)] rounded-full overflow-hidden backdrop-blur-sm">
              <div className="h-full flex">
                <div 
                  className="h-full bg-gradient-to-r from-[#4CAF50] to-[#4CAF50CC] transition-all duration-500" 
                  style={{ width: `${getPercentage(stats.easy)}%` }} 
                />
                <div 
                  className="h-full bg-gradient-to-r from-[#FFC107] to-[#FFC107CC] transition-all duration-500" 
                  style={{ width: `${getPercentage(stats.medium)}%` }} 
                />
                <div 
                  className="h-full bg-gradient-to-r from-[#CF6679] to-[#CF6679CC] transition-all duration-500" 
                  style={{ width: `${getPercentage(stats.hard)}%` }} 
                />
                <div 
                  className="h-full bg-[rgba(255,255,255,0.2)] transition-all duration-500" 
                  style={{ width: `${getPercentage(stats.unseen)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats; 