
import React from 'react';
// FIX: Replaced non-existent `ExecutionStep` with `GraphNode` from `../types`.
import { type GraphNode } from '../types';

interface StepCardProps {
  // FIX: The `step` prop is now of type `GraphNode`.
  step: GraphNode;
  index: number;
}

export const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  return (
    <div className="bg-gray-900/70 border border-gray-700 rounded-lg overflow-hidden transition-shadow hover:shadow-lg hover:border-cyan-500/30">
      <div className="p-4 border-b border-gray-700 flex items-center gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-cyan-800/50 text-cyan-300 rounded-full flex items-center justify-center font-bold text-sm">
          {index + 1}
        </div>
        {/* FIX: Using `step.label` from `GraphNode` type instead of `step.title`. */}
        <h4 className="font-semibold text-lg text-gray-100">{step.label}</h4>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-gray-300">{step.explanation}</p>
        <pre className="bg-black/50 p-3 rounded-md overflow-x-auto">
          <code className="text-sm font-mono text-yellow-300">
            {step.codeSnippet}
          </code>
        </pre>
      </div>
    </div>
  );
};
