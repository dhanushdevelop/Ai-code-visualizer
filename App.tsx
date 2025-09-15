import React, { useState, useCallback, useEffect } from 'react';
import { CodeInput } from './components/CodeInput';
import { VisualizationDisplay } from './components/VisualizationDisplay';
import { ContextPanel } from './components/ContextPanel';
import { SettingsModal } from './components/SettingsModal';
import { visualizeCode } from './services/geminiService';
import { type VisualizationResult } from './types';
import { SparklesIcon, SettingsIcon } from './components/icons';

export type Theme = 'light' | 'dark';
export type LayoutAlgorithm = 'ai' | 'hierarchical';


const App: React.FC = () => {
  const [code, setCode] = useState<string>(`function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

const result = factorial(4);
console.log(result);`);
  const [visualizationResult, setVisualizationResult] = useState<VisualizationResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set());
  
  const [theme, setTheme] = useState<Theme>('dark');
  const [layoutAlgorithm, setLayoutAlgorithm] = useState<LayoutAlgorithm>('ai');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (visualizationResult) {
      setVisualizationResult(null);
      setCurrentStepIndex(0);
    }
  };

  const handleToggleBreakpoint = (lineNumber: number) => {
    setBreakpoints(prev => {
      const newBreakpoints = new Set(prev);
      if (newBreakpoints.has(lineNumber)) {
        newBreakpoints.delete(lineNumber);
      } else {
        newBreakpoints.add(lineNumber);
      }
      return newBreakpoints;
    });
  };

  const handleVisualize = useCallback(async () => {
    if (!code.trim()) {
      setError("Please enter some code to visualize.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setVisualizationResult(null);
    setCurrentStepIndex(0);

    try {
      const result = await visualizeCode(code);
      setVisualizationResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  }, [code]);
  
  const handleNextStep = () => {
    if (visualizationResult && currentStepIndex < visualizationResult.executionTrace.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const handleContinueToBreakpoint = () => {
    if (!visualizationResult) return;
    let nextIndex = currentStepIndex + 1;
    while(nextIndex < visualizationResult.executionTrace.length) {
      const nextStep = visualizationResult.executionTrace[nextIndex];
      if (breakpoints.has(nextStep.line)) {
        setCurrentStepIndex(nextIndex);
        return;
      }
      nextIndex++;
    }
    // If no breakpoint is found, go to the last step
    setCurrentStepIndex(visualizationResult.executionTrace.length - 1);
  };

  const currentStep = visualizationResult?.executionTrace[currentStepIndex];
  const activeNodeId = currentStep?.nodeId || null;
  const highlightedLine = currentStep?.line || null;

  return (
    <div className="h-screen flex flex-col font-sans bg-[var(--background)] text-[var(--text-primary)]">
      <header className="flex-shrink-0 bg-[var(--panel-bg)] border-b border-[var(--panel-border)] shadow-sm z-10">
        <div className="container mx-auto flex items-center justify-between gap-3 p-3">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-7 h-7 text-[var(--accent)]" />
            <h1 className="text-xl font-semibold">
              AI Code Visualizer
            </h1>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Open settings"
          >
            <SettingsIcon className="w-6 h-6 text-[var(--text-secondary)]" />
          </button>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col md:flex-row gap-2 p-2 overflow-hidden">
        <div className="md:w-4/12 flex flex-col h-full">
          <CodeInput 
            value={code}
            onChange={handleCodeChange}
            onVisualize={handleVisualize}
            isLoading={isLoading}
            highlightedLine={highlightedLine}
            breakpoints={breakpoints}
            onToggleBreakpoint={handleToggleBreakpoint}
          />
        </div>
        <div className="md:w-5/12 flex flex-col h-full">
          <VisualizationDisplay 
            result={visualizationResult}
            isLoading={isLoading}
            error={error}
            activeNodeId={activeNodeId}
            currentStep={currentStep}
            layoutAlgorithm={layoutAlgorithm}
          />
        </div>
         <div className="md:w-3/12 flex flex-col h-full">
          <ContextPanel
            step={currentStep}
            stepIndex={currentStepIndex}
            totalSteps={visualizationResult?.executionTrace.length ?? 0}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            onContinue={handleContinueToBreakpoint}
            isVisualizationActive={!!visualizationResult}
            canContinue={breakpoints.size > 0 && currentStepIndex < (visualizationResult?.executionTrace.length ?? 0) - 1}
          />
        </div>
      </main>
      
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
          onThemeChange={setTheme}
          layoutAlgorithm={layoutAlgorithm}
          onLayoutAlgorithmChange={setLayoutAlgorithm}
        />
      )}
    </div>
  );
};

export default App;