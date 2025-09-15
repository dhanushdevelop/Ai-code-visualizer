import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type VisualizationResult, type GraphNode as GraphNodeType, type ExecutionStep, Position } from '../types';
import { LoadingSpinnerIcon, SparklesIcon, HandIcon, TerminalIcon } from './icons';
import { GraphNode } from './GraphNode';
import { MiniMap } from './MiniMap';
import { GraphLegend } from './GraphLegend';
import { calculateHierarchicalLayout } from '../utils/layout';
import { type LayoutAlgorithm } from '../App';


interface VisualizationDisplayProps {
  result: VisualizationResult | null;
  isLoading: boolean;
  error: string | null;
  activeNodeId: string | null;
  currentStep: ExecutionStep | undefined;
  layoutAlgorithm: LayoutAlgorithm;
}

type ConsoleHistoryItem = {
  type: 'command' | 'output' | 'error' | 'info';
  content: string;
};

export const NODE_WIDTH = 240;
export const NODE_HEIGHT = 90;
const MIN_CONSOLE_HEIGHT = 40; // Just the header
const DEFAULT_CONSOLE_HEIGHT = 180;

const getCurvedPath = (source: GraphNodeType, target: GraphNodeType, sourcePos: Position, targetPos: Position) => {
    let startX = sourcePos.x;
    let startY = sourcePos.y;
    let endX = targetPos.x;
    let endY = targetPos.y;

    if (source.type === 'decision') { // Diamond
        const dx = targetPos.x - sourcePos.x;
        if (dx > 0) { // Right
            startX += NODE_WIDTH;
            startY += NODE_HEIGHT / 2;
        } else { // Left
            // startX is fine
            startY += NODE_HEIGHT / 2;
        }
    } else { // Rectangle/Pill
        startX += NODE_WIDTH / 2;
        startY += NODE_HEIGHT;
    }
    
    endX += NODE_WIDTH / 2;
    // endY is fine

    const dx = endX - startX;
  
    return `M ${startX},${startY} C ${startX + dx * 0.1},${startY + 60} ${endX - dx * 0.1},${endY - 60} ${endX},${endY}`;
};

export const VisualizationDisplay: React.FC<VisualizationDisplayProps> = ({ result, isLoading, error, activeNodeId, currentStep, layoutAlgorithm }) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const [computedNodes, setComputedNodes] = useState<GraphNodeType[]>([]);
  const [edges, setEdges] = useState<VisualizationResult['edges']>([]);
  const [draggedNode, setDraggedNode] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 800 });

  const [consoleHeight, setConsoleHeight] = useState(DEFAULT_CONSOLE_HEIGHT);
  const [isResizingConsole, setIsResizingConsole] = useState(false);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleHistory, setConsoleHistory] = useState<ConsoleHistoryItem[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const consoleOutputRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
        let newNodes = result.nodes;
        if (layoutAlgorithm === 'hierarchical') {
            newNodes = calculateHierarchicalLayout(result.nodes, result.edges);
        }
        setComputedNodes(newNodes);
        setEdges(result.edges);
        setConsoleHistory([{ type: 'info', content: 'Console ready. Type a variable name to inspect its value at the current step.' }]);
    } else {
        setComputedNodes([]);
        setEdges([]);
        setConsoleHistory([]);
    }
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [result, layoutAlgorithm]);
  
   useEffect(() => {
    if (computedNodes.length > 0) {
        const maxX = Math.max(...computedNodes.map(n => n.position.x + NODE_WIDTH));
        const maxY = Math.max(...computedNodes.map(n => n.position.y + NODE_HEIGHT));
        setCanvasSize({ width: Math.max(maxX + 400, 1000), height: Math.max(maxY + 400, 800) });
    }
  }, [computedNodes]);

  useEffect(() => {
      if (consoleOutputRef.current) {
          consoleOutputRef.current.scrollTop = consoleOutputRef.current.scrollHeight;
      }
  }, [consoleHistory]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const zoomFactor = 1.1;
    const newScale = e.deltaY > 0 ? scale / zoomFactor : scale * zoomFactor;
    const clampedScale = Math.max(0.1, Math.min(newScale, 3));
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newOffsetX = mouseX - (mouseX - offset.x) * (clampedScale / scale);
    const newOffsetY = mouseY - (mouseY - offset.y) * (clampedScale / scale);

    setScale(clampedScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return; // Prevent panning when clicking on nodes/other elements
    setIsPanning(true);
    setStartPanPoint({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('panning');
      e.currentTarget.classList.add('no-select');
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (layoutAlgorithm === 'hierarchical') return; // Disable dragging in hierarchical mode
    const node = computedNodes.find(n => n.id === nodeId);
    if (!node) return;
    const startX = (e.clientX - offset.x) / scale;
    const startY = (e.clientY - offset.y) / scale;
    setDraggedNode({ 
        id: nodeId, 
        offsetX: startX - node.position.x, 
        offsetY: startY - node.position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode && layoutAlgorithm !== 'hierarchical') {
      const newX = (e.clientX - offset.x) / scale - draggedNode.offsetX;
      const newY = (e.clientY - offset.y) / scale - draggedNode.offsetY;
      setComputedNodes(currentNodes =>
        currentNodes.map(n =>
          n.id === draggedNode.id
            ? { ...n, position: { x: newX, y: newY } }
            : n
        )
      );
      return;
    }
    if (!isPanning) return;
    setOffset({
      x: e.clientX - startPanPoint.x,
      y: e.clientY - startPanPoint.y,
    });
  };

  const handleMouseUpOrLeave = (e: React.MouseEvent) => {
    setIsPanning(false);
    setDraggedNode(null);
    if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.classList.remove('panning');
        e.currentTarget.classList.remove('no-select');
    }
  };

  const handleConsoleResizeStart = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizingConsole(true);
  }, []);

  const handleConsoleResize = useCallback((e: MouseEvent) => {
      if (!isResizingConsole || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = containerRect.bottom - e.clientY;
      const maxHeight = containerRect.height - 100; // Leave some space for the graph
      setConsoleHeight(Math.max(MIN_CONSOLE_HEIGHT, Math.min(newHeight, maxHeight)));
  }, [isResizingConsole]);

  const handleConsoleResizeEnd = useCallback(() => {
      setIsResizingConsole(false);
  }, []);

  useEffect(() => {
      if (isResizingConsole) {
          window.addEventListener('mousemove', handleConsoleResize);
          window.addEventListener('mouseup', handleConsoleResizeEnd);
      }
      return () => {
          window.removeEventListener('mousemove', handleConsoleResize);
          window.removeEventListener('mouseup', handleConsoleResizeEnd);
      };
  }, [isResizingConsole, handleConsoleResize, handleConsoleResizeEnd]);

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = consoleInput.trim();
    if (!command) return;

    const newHistory: ConsoleHistoryItem[] = [...consoleHistory, { type: 'command', content: command }];
    
    let vars: Record<string, any> = {};
    if (currentStep?.variables) {
      try {
        vars = JSON.parse(currentStep.variables);
      } catch (parseError) {
        console.error("Failed to parse variables JSON:", parseError);
        newHistory.push({ type: 'error', content: 'Internal error: Could not read variable state.' });
        setConsoleHistory(newHistory);
        setConsoleInput('');
        return;
      }
    }
    
    if (command in vars) {
      const value = vars[command];
      newHistory.push({ type: 'output', content: JSON.stringify(value, null, 2) });
    } else if (command === 'clear') {
       setConsoleHistory([{type: 'info', content: 'Console cleared.'}]);
       setConsoleInput('');
       return;
    } 
    else {
      newHistory.push({ type: 'error', content: `'${command}' is not defined in the current scope.` });
    }

    setConsoleHistory(newHistory);
    setConsoleInput('');
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
          <LoadingSpinnerIcon className="w-12 h-12 mb-6" />
          <p className="text-lg font-medium text-[var(--text-primary)]">Visualizing Code...</p>
          <p className="text-sm mt-2">The AI is analyzing the execution flow.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold">An Error Occurred</p>
          <p className="text-center mt-2 text-red-500">{error}</p>
        </div>
      );
    }

    if (computedNodes.length > 0) {
      const nodeMap = new Map(computedNodes.map(node => [node.id, node]));

      return (
        <div className="w-full h-full flex flex-col">
            <div 
                ref={graphRef}
                className="flex-grow relative w-full overflow-hidden cursor-grab bg-[var(--background)]"
                style={{
                    backgroundImage: 'radial-gradient(circle, var(--panel-border) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onWheel={handleWheel}
            >
              <MiniMap nodes={computedNodes} canvasSize={canvasSize} scale={scale} offset={offset} setOffset={setOffset} viewRef={graphRef}/>
              <GraphLegend />

              <div
                className="relative transition-transform duration-100 ease-out"
                style={{ 
                    width: canvasSize.width, 
                    height: canvasSize.height,
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    transformOrigin: '0 0'
                }}
              >
                <svg width={canvasSize.width} height={canvasSize.height} className="absolute top-0 left-0 pointer-events-none">
                  <defs>
                      <marker id="arrowhead" viewBox="-5 -5 10 10" refX="4" refY="0" markerWidth="6" markerHeight="6" orient="auto">
                          <path d="M 0,-4 L 5,0 L 0,4" fill="#64748B" />
                      </marker>
                      <marker id="arrowhead-highlight" viewBox="-5 -5 10 10" refX="4" refY="0" markerWidth="7" markerHeight="7" orient="auto">
                          <path d="M 0,-4 L 5,0 L 0,4" fill="#38BDF8" />
                      </marker>
                  </defs>
                  {edges.map(edge => {
                    const source = nodeMap.get(edge.source);
                    const target = nodeMap.get(edge.target);
                    if (!source || !target) return null;
                    const isHighlighted = hoveredNodeId === source.id || hoveredNodeId === target.id || activeNodeId === source.id;
                    const pathData = getCurvedPath(source, target, source.position, target.position);

                    const midX = (source.position.x + target.position.x + NODE_WIDTH) / 2;
                    const midY = (source.position.y + target.position.y + NODE_HEIGHT) / 2;

                    return (
                      <g key={edge.id} style={{ transition: 'all 0.3s ease' }}>
                        <path
                          d={pathData}
                          stroke={isHighlighted ? "#38BDF8" : "#475569"}
                          strokeWidth={isHighlighted ? 2.5 : 1.5}
                          fill="none"
                          markerEnd={isHighlighted ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)'}
                          className={isHighlighted ? 'edge-path' : ''}
                        />
                         {edge.label && (
                           <text x={midX} y={midY - 10} fill={isHighlighted ? 'var(--text-primary)' : 'var(--text-secondary)'} fontSize="14" textAnchor="middle" className="pointer-events-none font-semibold" stroke="var(--background)" strokeWidth="4" paintOrder="stroke" style={{ transition: 'fill 0.3s ease' }}>
                             {edge.label}
                           </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
                {computedNodes.map((node, index) => (
                  <GraphNode 
                    key={node.id} 
                    node={node}
                    isDraggable={layoutAlgorithm === 'ai'}
                    isDragging={draggedNode?.id === node.id}
                    isHovered={hoveredNodeId === node.id}
                    isActive={node.id === activeNodeId}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    onMouseEnter={() => !draggedNode && setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    style={{ animationDelay: `${index * 50}ms`, zIndex: draggedNode?.id === node.id ? 10 : 1 }}
                  />
                ))}
              </div>
            </div>
            {/* Console */}
            <div className="flex-shrink-0 flex flex-col border-t-2 border-transparent" style={{ height: consoleHeight }}>
                 <div
                    className="w-full h-1 bg-[var(--panel-border)] hover:bg-[var(--accent)] cursor-row-resize transition-colors duration-200"
                    onMouseDown={handleConsoleResizeStart}
                />
                <div className="flex-grow bg-[var(--background)] flex flex-col overflow-hidden">
                     <div className="flex items-center gap-2 p-2 border-b border-[var(--panel-border)] text-[var(--text-primary)]">
                        <TerminalIcon className="w-5 h-5"/>
                        <h3 className="font-semibold text-sm">Interactive Console</h3>
                    </div>
                    <div ref={consoleOutputRef} className="flex-grow p-2 overflow-y-auto fira-code text-sm space-y-1">
                        {consoleHistory.map((item, index) => (
                            <div key={index}>
                                {item.type === 'command' && <div className="text-[var(--text-secondary)]"><span className="text-[var(--accent)] mr-2">{'>'}</span>{item.content}</div>}
                                {item.type === 'output' && <pre className="text-[var(--text-primary)] whitespace-pre-wrap">{item.content}</pre>}
                                {item.type === 'error' && <div className="text-red-400">Error: {item.content}</div>}
                                {item.type === 'info' && <div className="text-slate-500 italic">{item.content}</div>}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleConsoleSubmit} className="p-2 border-t border-[var(--panel-border)] flex items-center gap-2">
                        <span className="text-[var(--accent)] font-bold">{'>'}</span>
                        <input 
                            type="text"
                            value={consoleInput}
                            onChange={(e) => setConsoleInput(e.target.value)}
                            className="bg-transparent w-full focus:outline-none text-[var(--text-primary)] fira-code"
                            placeholder="Type a variable name and press Enter..."
                            spellCheck="false"
                            disabled={!result}
                        />
                    </form>
                </div>
            </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
        <SparklesIcon className="w-16 h-16 text-slate-600 mb-4" />
        <h3 className="text-xl font-semibold mt-4 text-[var(--text-secondary)]">Visualization Panel</h3>
        <p className="mt-2 text-center text-[var(--text-secondary)]">Your code's execution flow will appear here.</p>
      </div>
    );
  };

  return (
    <div ref={containerRef} id="visualization-display" className="h-full bg-[var(--panel-bg)] rounded-md border border-[var(--panel-border)] shadow-md overflow-hidden relative">
      {renderContent()}
    </div>
  );
};