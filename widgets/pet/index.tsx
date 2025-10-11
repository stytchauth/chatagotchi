import { createRoot } from 'react-dom/client';
import './index.css';
import { useOpenAiGlobal } from '../utils/use-openai-global.ts';
import { SPECIES_EMOJIS, TurnResult } from './types';
import { useToolOutput } from '../utils/use-tool-output.ts';

function App() {
  const input = useOpenAiGlobal('toolInput');
  const output = useToolOutput<TurnResult>();

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

  const petState = output.petState;
  const lastAction = output.lastAction;

  const petEmoji = petState
    ? SPECIES_EMOJIS[petState.species][petState.state]
    : '❓';

  return (
    <div className="antialiased w-full text-black px-4 py-4 border border-black/10 rounded-2xl sm:rounded-3xl overflow-hidden bg-white relative">
      {/* Fullscreen Button */}
      {output.newAchievements.length && (
        <button
          onClick={() =>
            window.openai.sendFollowUpMessage({
              prompt: 'Show me my achievements so far',
            })
          }
          className="absolute top-2 right-2 p-2 text-xl hover:bg-gray-100 rounded-lg transition-colors"
        >
          New Achievement Unlocked ✨
        </button>
      )}

      <div className="flex flex-col items-center justify-center gap-4">
        {/* Pet Display */}
        <div className="flex items-center gap-2">
          <div className="text-8xl">{petEmoji}</div>
          {lastAction && (
            <div className="text-4xl animate-bounce">{lastAction.emoji}</div>
          )}
        </div>

        {/* Pet Info */}
        {petState && (
          <div className="w-full space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{petState.name}</div>
              <div className="text-sm text-gray-600">
                {petState.state} • Turn {petState.turn}
              </div>
            </div>

            {/* Stats */}
            {petState.state !== 'DEAD' && petState.state !== 'COMPLETE' && (
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>🍔 Stamina</span>
                    <span className="font-mono">
                      {Math.round(petState.stamina)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        petState.stamina > 50
                          ? 'bg-green-500'
                          : petState.stamina > 20
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${petState.stamina}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>😊 Happiness</span>
                    <span className="font-mono">
                      {Math.round(petState.happiness)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        petState.happiness > 50
                          ? 'bg-blue-500'
                          : petState.happiness > 20
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${petState.happiness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>❤️ Health</span>
                    <span className="font-mono">
                      {Math.round(petState.health)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        petState.health > 50
                          ? 'bg-pink-500'
                          : petState.health > 20
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${petState.health}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Messages */}
            {petState.state === 'DEAD' && (
              <div className="text-center p-4 bg-red-100 rounded-lg border-2 border-red-300">
                <div className="text-2xl mb-2">💀</div>
                <div className="text-lg font-bold">Game Over</div>
                <div className="text-sm mt-1">{petState.deathReason}</div>
              </div>
            )}

            {petState.state === 'COMPLETE' && (
              <div className="text-center p-4 bg-yellow-100 rounded-lg border-2 border-yellow-300">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-lg font-bold">Congratulations!</div>
                <div className="text-sm mt-1">
                  {petState.name} has grown up successfully!
                </div>
              </div>
            )}
          </div>
        )}

        {!petState && (
          <div className="text-center text-gray-500">
            <div className="text-sm">No pet found</div>
            <div className="text-xs">Start a new game to get started</div>
          </div>
        )}

        {/* Debug Info */}
        <details className="w-full text-[10px] opacity-50">
          <summary className="cursor-pointer font-semibold hover:opacity-75">
            Debug Info
          </summary>
          <div className="mt-2 space-y-1">
            <div>
              <div className="font-semibold">Input:</div>
              <pre className="bg-gray-100 p-1 rounded overflow-auto text-[9px]">
                {JSON.stringify(input, null, 2)}
              </pre>
            </div>
            <div>
              <div className="font-semibold">Output:</div>
              <pre className="bg-gray-100 p-1 rounded overflow-auto text-[9px]">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}

createRoot(document.getElementById('pet-root')!).render(<App />);
