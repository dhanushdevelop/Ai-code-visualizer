import React from 'react';
import { type GraphNode as GraphNodeType } from '../types';
import { NODE_WIDTH, NODE_HEIGHT } from './VisualizationDisplay';

interface GraphNodeProps {
  node: GraphNodeType;
  isDraggable: boolean;
  isDragging: boolean;
  isHovered: boolean;
  isActive: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  style?: React.CSSProperties;
}

const nodeStyles = {
  process: { ring: 'ring-sky-400', text: 'text-sky-400' },
  decision: { ring: 'ring-amber-400', text: 'text-amber-400' },
  start: { ring: 'ring-emerald-400', text: 'text-emerald-400' },
  end: { ring: 'ring-rose-400', text: 'text-rose-400' },
};

export const GraphNode: React.FC<GraphNodeProps> = ({ node, isDraggable, isDragging, isHovered, isActive, onMouseDown, onMouseEnter, onMouseLeave, style }) => {
  const styles = nodeStyles[node.type] || nodeStyles.process;
  
  const interactionStyles = isDragging
    ? 'scale-105 shadow-2xl shadow-black/30 cursor-grabbing'
    : isDraggable ? 'cursor-grab group' : 'cursor-pointer group';
    
  let shapeStyle = 'rounded-lg';
  if (node.type === 'start' || node.type === 'end') {
      shapeStyle = 'rounded-2xl';
  } else if (node.type === 'decision') {
      shapeStyle = ''; // clip-path will handle the shape
  }

  const activeStyles = isActive ? `ring-2 ring-offset-2 ring-offset-[var(--background)] ${styles.ring}` : '';

  return (
    <div
      className={`absolute flex flex-col justify-center items-center p-3 border shadow-md transition-all duration-200 animate-node-in bg-[var(--node-bg)] border-[var(--node-border)] ${shapeStyle} ${interactionStyles} ${activeStyles}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        opacity: 0, // Initial state for animation
        clipPath: node.type === 'decision' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'none',
        ...style
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="text-center w-full">
        <div className="font-semibold text-sm text-[var(--text-primary)] truncate px-2">{node.label}</div>
        <div className="mt-2 bg-[var(--code-snippet-bg)] p-2 rounded-md w-full max-w-full overflow-hidden border border-[var(--panel-border)]">
          <pre className="truncate"><code className="text-xs text-[var(--node-text)] fira-code">{node.codeSnippet}</code></pre>
        </div>
      </div>
      
      {/* Tooltip */}
      <div className={`absolute bottom-full mb-3 w-80 p-3 bg-[var(--panel-bg)] text-[var(--text-secondary)] text-sm rounded-lg shadow-xl 
                     transition-all duration-300 pointer-events-none z-20 border border-[var(--panel-border)]
                     ${isHovered && !isDragging ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <h4 className={`font-bold text-base mb-1 border-b pb-1 border-[var(--panel-border)] ${styles.text}`}>{node.label}</h4>
        <p className="mt-2">{node.explanation}</p>
        <div className={`absolute top-full left-1/2 w-3 h-3 bg-[var(--panel-bg)] border-r border-b border-[var(--panel-border)] transform -translate-x-1/2 -translate-y-1/2 rotate-45 -z-10`}></div>
      </div>
    </div>
  );
};