import { type GraphNode, type GraphEdge } from '../types';
import { NODE_WIDTH, NODE_HEIGHT } from '../components/VisualizationDisplay';

const HORIZONTAL_SPACING = 100;
const VERTICAL_SPACING = 80;

export function calculateHierarchicalLayout(nodes: GraphNode[], edges: GraphEdge[]): GraphNode[] {
    if (nodes.length === 0) return [];

    const adj: Record<string, string[]> = {};
    const inDegree: Record<string, number> = {};
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    for (const node of nodes) {
        adj[node.id] = [];
        inDegree[node.id] = 0;
    }

    for (const edge of edges) {
        if (adj[edge.source]) {
            adj[edge.source].push(edge.target);
            inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
        }
    }

    const startNode = nodes.find(n => n.type === 'start') || nodes.find(n => inDegree[n.id] === 0);
    if (!startNode) return nodes; // Cannot determine layout

    const levels: string[][] = [];
    const visited = new Set<string>();
    const queue: { nodeId: string; level: number }[] = [{ nodeId: startNode.id, level: 0 }];
    visited.add(startNode.id);

    while (queue.length > 0) {
        const { nodeId, level } = queue.shift()!;
        
        if (!levels[level]) {
            levels[level] = [];
        }
        if (!levels[level].includes(nodeId)) {
           levels[level].push(nodeId);
        }

        (adj[nodeId] || []).forEach(neighborId => {
            if (!visited.has(neighborId)) {
                visited.add(neighborId);
                queue.push({ nodeId: neighborId, level: level + 1 });
            }
        });
    }

    const newNodes: GraphNode[] = [];
    const maxLevelWidth = Math.max(...levels.map(level => level.length));
    const totalWidth = maxLevelWidth * (NODE_WIDTH + HORIZONTAL_SPACING) - HORIZONTAL_SPACING;

    levels.forEach((level, levelIndex) => {
        const levelWidth = level.length * (NODE_WIDTH + HORIZONTAL_SPACING) - HORIZONTAL_SPACING;
        const startX = (totalWidth - levelWidth) / 2;

        level.forEach((nodeId, nodeIndex) => {
            const originalNode = nodeMap.get(nodeId);
            if (originalNode) {
                newNodes.push({
                    ...originalNode,
                    position: {
                        x: startX + nodeIndex * (NODE_WIDTH + HORIZONTAL_SPACING),
                        y: 50 + levelIndex * (NODE_HEIGHT + VERTICAL_SPACING),
                    }
                });
            }
        });
    });

    // Position any unvisited nodes (e.g., in disconnected graphs)
    const positionedNodeIds = new Set(newNodes.map(n => n.id));
    let unpositionedY = 50 + levels.length * (NODE_HEIGHT + VERTICAL_SPACING);
    nodes.forEach(node => {
        if (!positionedNodeIds.has(node.id)) {
            newNodes.push({
                ...node,
                position: { x: 50, y: unpositionedY }
            });
            unpositionedY += NODE_HEIGHT + VERTICAL_SPACING;
        }
    });


    return newNodes;
}
