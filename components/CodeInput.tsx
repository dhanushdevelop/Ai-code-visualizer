import React, { useMemo } from 'react';
import { SparklesIcon, LoadingSpinnerIcon, BreakpointIcon } from './icons';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onVisualize: () => void;
  isLoading: boolean;
  highlightedLine: number | null;
  breakpoints: Set<number>;
  onToggleBreakpoint: (lineNumber: number) => void;
}

const LINE_HEIGHT = 24; // Corresponds to Tailwind's `leading-6` class

export const CodeInput: React.FC<CodeInputProps> = ({ 
  value, 
  onChange, 
  onVisualize, 
  isLoading, 
  highlightedLine,
  breakpoints,
  onToggleBreakpoint
}) => {
  const lineCount = useMemo(() => value.split('\n').length, [value]);

  return (
    <div className="flex flex-col h-full bg-[var(--panel-bg)] rounded-md border border-[var(--panel-border)] shadow-md">
      <div className="p-3 border-b border-[var(--panel-border)] flex items-center">
        <h2 className="text-md font-semibold text-[var(--text-primary)]">Code Editor</h2>
      </div>
      <div className="flex-grow flex w-full fira-code relative overflow-y-auto">
        {/* Gutter */}
        <div className="flex-shrink-0 text-right p-4 text-[var(--text-secondary)] bg-[var(--background)] select-none">
          {Array.from({ length: lineCount }, (_, i) => i + 1).map(lineNumber => (
            <div 
              key={lineNumber} 
              className="h-6 leading-6 relative flex items-center justify-end"
            >
              <div 
                className="absolute right-full mr-2 w-5 h-5 flex items-center justify-center cursor-pointer"
                onClick={() => onToggleBreakpoint(lineNumber)}
              >
                {breakpoints.has(lineNumber) && <BreakpointIcon className="w-3 h-3 text-red-500" />}
              </div>
              {lineNumber}
            </div>
          ))}
        </div>
        
        {/* Textarea with Highlight */}
        <div className="relative flex-grow">
           <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste your code here..."
            className="absolute inset-0 p-4 bg-transparent font-mono text-base text-[var(--text-primary)] resize-none focus:outline-none w-full fira-code leading-6 caret-[var(--accent)]"
            spellCheck="false"
          />
          {/* Highlight overlay */}
          {highlightedLine && (
            <div className="absolute top-4 left-4 right-4 pointer-events-none">
               <div 
                  className="bg-sky-400/20 border-l-2 border-sky-400 transition-transform duration-200 ease-in-out"
                  style={{
                    height: `${LINE_HEIGHT}px`,
                    transform: `translateY(${(highlightedLine - 1) * LINE_HEIGHT}px)`
                  }}
               />
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-[var(--panel-border)] mt-auto">
        <button
          onClick={onVisualize}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 font-semibold text-white bg-sky-600 rounded-md 
                     hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/50 
                     disabled:bg-slate-600 disabled:opacity-70 disabled:cursor-not-allowed
                     transition-all duration-200"
        >
          {isLoading ? (
            <>
              <LoadingSpinnerIcon className="w-5 h-5" />
              Analyzing...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Visualize Execution
            </>
          )}
        </button>
      </div>
    </div>
  );
};