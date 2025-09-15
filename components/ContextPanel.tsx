import React, { useState } from 'react';
import { type ExecutionStep } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon, VariableIcon, CallStackIcon, PlayIcon } from './icons';

type Tab = 'explanation' | 'variables' | 'callStack';

interface ContextPanelProps {
  step: ExecutionStep | undefined;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onContinue: () => void;
  isVisualizationActive: boolean;
  canContinue: boolean;
}

const VariableRenderer = ({ data, level = 0 }: { data: any, level?: number }) => {
    if (typeof data !== 'object' || data === null) {
        return <span className="text-amber-400">{JSON.stringify(data)}</span>;
    }

    const isArray = Array.isArray(data);
    const entries = Object.entries(data);

    if (entries.length === 0) {
        return isArray ? <span className="text-slate-500">[]</span> : <span className="text-slate-500">{"{}"}</span>;
    }

    return (
        <div className="space-y-1">
            {entries.map(([key, value]) => (
                <div key={key} style={{ paddingLeft: `${level * 16}px` }}>
                    <span className={isArray ? "text-slate-500" : "text-sky-400"}>{key}: </span>
                    <VariableRenderer data={value} level={level + 1} />
                </div>
            ))}
        </div>
    );
};

const TabButton: React.FC<{active: boolean, onClick: () => void, children: React.ReactNode}> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            active 
            ? 'bg-slate-700/80 dark:bg-slate-700 text-slate-900 dark:text-slate-100' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
    >
        {children}
    </button>
)

export const ContextPanel: React.FC<ContextPanelProps> = ({ 
    step, 
    stepIndex, 
    totalSteps, 
    onNext, 
    onPrev,
    onContinue,
    isVisualizationActive,
    canContinue
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('explanation');

  const renderContent = () => {
    if (!isVisualizationActive) {
      return (
        <div className="flex-grow flex items-center justify-center p-4">
          <p className="text-[var(--text-secondary)] text-center">
            Visualize the code to see the execution context.
          </p>
        </div>
      );
    }

    switch(activeTab) {
        case 'explanation':
            return (
                <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {step ? (
                        <div className="text-[var(--text-primary)] text-sm leading-relaxed">
                            <p>{step.explanation}</p>
                        </div>
                    ) : <p className="text-[var(--text-secondary)]">No explanation for this step.</p>}
                </div>
            );
        case 'variables':
            let variables = {};
            let parseError = null;
            if (step?.variables) {
                try {
                    variables = JSON.parse(step.variables);
                } catch(e) {
                    parseError = "Could not parse variable data.";
                }
            }
            return (
                <div className="flex-grow p-4 overflow-y-auto fira-code text-sm">
                    {parseError && <p className="text-red-400">{parseError}</p>}
                    {!parseError && Object.keys(variables).length > 0 ? (
                        <VariableRenderer data={variables} />
                    ) : (
                        <p className="text-[var(--text-secondary)]">No variables in scope.</p>
                    )}
                </div>
            );
        case 'callStack':
            return (
                 <div className="flex-grow p-4 overflow-y-auto">
                    {step?.callStack && step.callStack.length > 0 ? (
                        <div className="space-y-2">
                           {step.callStack.slice().reverse().map((frame, index) => (
                               <div key={index} className={`p-2 rounded-md fira-code text-sm ${index === 0 ? 'bg-sky-500/10 text-sky-400 dark:text-sky-300 border border-sky-500/20' : 'bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400'}`}>
                                   {frame}
                               </div>
                           ))}
                        </div>
                    ) : <p className="text-[var(--text-secondary)]">Call stack is empty.</p>}
                </div>
            );
    }
  };


  return (
    <div className="flex flex-col h-full bg-[var(--panel-bg)] rounded-md border border-[var(--panel-border)] shadow-md">
      <div className="p-2 border-b border-[var(--panel-border)] flex items-center justify-between">
        <div className="flex items-center gap-1">
            <TabButton active={activeTab === 'explanation'} onClick={() => setActiveTab('explanation')}>
                <InfoIcon className="w-4 h-4" /> Explanation
            </TabButton>
            <TabButton active={activeTab === 'variables'} onClick={() => setActiveTab('variables')}>
                <VariableIcon className="w-4 h-4" /> Variables
            </TabButton>
             <TabButton active={activeTab === 'callStack'} onClick={() => setActiveTab('callStack')}>
                <CallStackIcon className="w-4 h-4" /> Call Stack
            </TabButton>
        </div>
      </div>
      
      {renderContent()}
      
      {isVisualizationActive && totalSteps > 0 && (
        <div className="p-3 border-t border-[var(--panel-border)] mt-auto">
            <div className="flex items-center justify-between mb-3">
                <button 
                    onClick={onPrev} 
                    disabled={stepIndex === 0}
                    className="flex items-center gap-1 px-3 py-1.5 font-semibold text-sm text-[var(--text-primary)] bg-black/10 dark:bg-white/10 rounded-md hover:bg-black/20 dark:hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous Step"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                    Prev
                </button>
                <div className="text-sm font-medium text-[var(--text-secondary)]">
                    Step {stepIndex + 1} / {totalSteps}
                </div>
                <button 
                    onClick={onNext}
                    disabled={stepIndex >= totalSteps - 1}
                    className="flex items-center gap-1 px-3 py-1.5 font-semibold text-sm text-[var(--text-primary)] bg-black/10 dark:bg-white/10 rounded-md hover:bg-black/20 dark:hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next Step"
                >
                    Next
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
            </div>
             <button 
                onClick={onContinue}
                disabled={!canContinue}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 dark:disabled:bg-slate-600 transition-colors"
                aria-label="Continue to next breakpoint"
            >
                <PlayIcon className="w-5 h-5" />
                Continue to Breakpoint
            </button>
        </div>
      )}
    </div>
  );
};