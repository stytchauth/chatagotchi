import { createRoot } from 'react-dom/client';
import './index.css';
import { ACHIEVEMENTS, AchievementsResult } from '../../shared-types';
import { useToolOutput } from '../utils/use-tool-output.ts';

function App() {
  const output = useToolOutput<AchievementsResult>();

  // Show loading state when output is null
  if (output === null) {
    return (
      <div className="antialiased w-full text-black px-4 py-4 border border-black/10 rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
        <div className="flex flex-col items-center justify-center gap-4 min-h-[300px]">
          <div className="text-6xl flex items-center gap-1">
            <span className="animate-pulse">⏳</span>
            <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>
              •
            </span>
            <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>
              •
            </span>
            <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>
              •
            </span>
          </div>
        </div>
      </div>
    );
  }

  const unlockedAchievements =
    (output?.unlockedAchievements as string[] | undefined) || [];
  const unlockedSet = new Set(unlockedAchievements);

  return (
    <div className="antialiased w-full text-black px-4 py-4 border border-black/10 rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="text-center">
          <div className="text-2xl font-bold">Achievements</div>
          <div className="text-sm text-gray-600">
            {unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedSet.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`text-4xl ${!isUnlocked ? 'grayscale opacity-40' : ''}`}
                  >
                    {achievement.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-bold text-sm ${
                        isUnlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {achievement.title}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        isUnlocked ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {isUnlocked ? achievement.description : '???'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('achievements-root')!).render(<App />);
