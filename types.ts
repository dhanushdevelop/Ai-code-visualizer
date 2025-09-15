export interface Position {
  x: number;
  y: number;
}

export interface GraphNode {
  id: string;
  label: string;
  explanation: string;
  codeSnippet: string;
  type: 'start' | 'end' | 'process' | 'decision' | string;
  position: Position;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ExecutionStep {
  nodeId: string;
  explanation: string;
  line: number;
  variables?: string; // This will be a JSON string
  callStack?: string[]; // e.g., ['main', 'factorial(4)', 'factorial(3)']
}

export interface VisualizationResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  executionTrace: ExecutionStep[];
}