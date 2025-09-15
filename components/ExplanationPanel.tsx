import React from 'react';
import { type ExecutionStep, type GraphNode } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface ExplanationPanelProps {
  step: ExecutionStep | undefined;
  node: GraphNode | undefined;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  isVisualizationActive: boolean;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ step, node, stepIndex, totalSteps, onNext, onPrev, isVisualizationActive }) => {
  return (
    <div className="flex flex-col h-full bg-[#282C34] rounded-lg border border-white/10 shadow-lg">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-gray-200">Explanation</h2>
      </div>
      
      {!isVisualizationActive ? (
        <div className="flex-grow flex items-center justify-center p-4">
          <p className="text-gray-400 text-center">
            Visualize the code to see a step-by-step explanation.
          </p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col p-4 space-y-4 overflow-y-auto">
          {node && (
            <div className="bg-black/20 p-3 rounded-md border border-white/10">
              <h4 className="font-semibold text-base text-gray-200">{node.label}</h4>
              <pre className="bg-black/30 p-2 mt-2 rounded text-sm fira-code text-yellow-300 overflow-x-auto">
                <code>{node.codeSnippet}</code>
              </pre>
            </div>
          )}
          {step && (
            <div className="text-gray-300 text-sm leading-relaxed">
              <p>{step.explanation}</p>
            </div>
          )}
        </div>
      )}
      
      {isVisualizationActive && totalSteps > 0 && (
        <div className="p-4 border-t border-white/10 mt-auto flex items-center justify-between">
          <button 
            onClick={onPrev} 
            disabled={stepIndex === 0}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-gray-600/50 rounded-md hover:bg-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous Step"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Prev
          </button>
          <div className="text-sm font-medium text-gray-400">
            Step {stepIndex + 1} / {totalSteps}
          </div>
          <button 
            onClick={onNext}
            disabled={stepIndex >= totalSteps - 1}
            className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-gray-600/50 rounded-md hover:bg-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next Step"
          >
            Next
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
