import React from 'react';

const LegendItem: React.FC<{ shape: 'pill' | 'rect' | 'diamond'; color: string; label: string }> = ({ shape, color, label }) => {
    
    let shapeStyle: React.CSSProperties = {
        borderColor: color,
        width: '32px',
        height: '18px'
    };
    if (shape === 'pill') {
        shapeStyle.borderRadius = '9999px';
    } else if (shape === 'diamond') {
        shapeStyle.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
        shapeStyle.backgroundColor = `var(--panel-bg)`;
    } else {
         shapeStyle.borderRadius = '2px';
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex-shrink-0 border-2" style={shapeStyle} />
            <span className="text-xs text-[var(--text-secondary)]">{label}</span>
        </div>
    );
}

export const GraphLegend: React.FC = () => {
    return (
        <div className="absolute top-4 left-4 bg-[var(--panel-bg)]/80 backdrop-blur-sm border border-[var(--panel-border)] p-2 rounded-md shadow-lg space-y-1">
            <LegendItem shape="pill" color="#10B981" label="Start / End" />
            <LegendItem shape="rect" color="#38BDF8" label="Process" />
            <LegendItem shape="diamond" color="#FBBF24" label="Decision" />
        </div>
    );
}
