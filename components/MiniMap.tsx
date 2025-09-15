import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type GraphNode } from '../types';
import { NODE_WIDTH, NODE_HEIGHT } from './VisualizationDisplay';

interface MiniMapProps {
    nodes: GraphNode[];
    canvasSize: { width: number; height: number };
    scale: number;
    offset: { x: number; y: number };
    setOffset: (offset: {x: number; y: number}) => void;
    viewRef: React.RefObject<HTMLDivElement>;
}

const MINIMAP_WIDTH = 200;

export const MiniMap: React.FC<MiniMapProps> = ({ nodes, canvasSize, scale, offset, setOffset, viewRef }) => {
    const [isDraggingViewport, setIsDraggingViewport] = useState(false);
    const miniMapRef = useRef<HTMLDivElement>(null);

    const mapScale = MINIMAP_WIDTH / canvasSize.width;
    const mapHeight = canvasSize.height * mapScale;

    const viewportWidth = (viewRef.current?.clientWidth || 0) / scale * mapScale;
    const viewportHeight = (viewRef.current?.clientHeight || 0) / scale * mapScale;
    const viewportX = -offset.x * mapScale;
    const viewportY = -offset.y * mapScale;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!miniMapRef.current) return;
        setIsDraggingViewport(true);
        const rect = miniMapRef.current.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        // If clicking outside the viewport, center the viewport on the click
        if (startX < viewportX || startX > viewportX + viewportWidth || startY < viewportY || startY > viewportY + viewportHeight) {
            const newViewportX = startX - viewportWidth / 2;
            const newViewportY = startY - viewportHeight / 2;
            setOffset({
                x: -newViewportX / mapScale,
                y: -newViewportY / mapScale
            });
        }
    };
    
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDraggingViewport || !miniMapRef.current) return;
        
        const rect = miniMapRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const newViewportX = mouseX - viewportWidth / 2;
        const newViewportY = mouseY - viewportHeight / 2;

        setOffset({
            x: -newViewportX / mapScale,
            y: -newViewportY / mapScale
        });

    }, [isDraggingViewport, mapScale, setOffset, viewportWidth, viewportHeight]);


    const handleMouseUp = useCallback(() => {
        setIsDraggingViewport(false);
    }, []);
    
    useEffect(() => {
        if (isDraggingViewport) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isDraggingViewport, handleMouseMove, handleMouseUp]);


    return (
        <div 
            ref={miniMapRef}
            onMouseDown={handleMouseDown}
            className="absolute bottom-4 right-4 bg-[var(--panel-bg)] border-2 border-[var(--panel-border)] rounded-md shadow-lg cursor-pointer"
            style={{ width: MINIMAP_WIDTH, height: mapHeight }}
        >
            {nodes.map(node => (
                <div 
                    key={node.id}
                    className="absolute bg-[var(--accent)] opacity-60 rounded-sm"
                    style={{
                        left: node.position.x * mapScale,
                        top: node.position.y * mapScale,
                        width: NODE_WIDTH * mapScale,
                        height: NODE_HEIGHT * mapScale
                    }}
                />
            ))}
            <div 
                className="absolute border-2 border-[var(--accent)] bg-white/10"
                style={{
                    width: viewportWidth,
                    height: viewportHeight,
                    transform: `translate(${viewportX}px, ${viewportY}px)`
                }}
            />
        </div>
    );
};
