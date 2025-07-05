import React from 'react';

interface EdgeLabelProps {
    x: number;
    y: number;
    text: string;
    fontSize?: number;
    strokeWidth?: number;
    fontWeight?: string;
    showMultipleStrokes?: boolean;
}

// Utility function to get non-interactive styles
const getNonInteractiveStyles = () => ({
    pointerEvents: 'none' as const,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    MozUserSelect: 'none' as const,
    msUserSelect: 'none' as const
});

export const EdgeLabel: React.FC<EdgeLabelProps> = ({
    x,
    y,
    text,
    fontSize = 12,
    strokeWidth = 3,
    fontWeight = 'bold',
    showMultipleStrokes = true
}) => {
    if (!text) return null;

    const nonInteractiveStyles = getNonInteractiveStyles();

    if (showMultipleStrokes) {
        return (
            <g style={nonInteractiveStyles}>
                {/* Outer stroke layer for maximum visibility */}
                <text
                    x={x}
                    y={y}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth + 1}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={nonInteractiveStyles}
                    className="text-primary-foreground"
                >
                    {text}
                </text>
                {/* Inner stroke layer */}
                <text
                    x={x}
                    y={y}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={nonInteractiveStyles}
                    className="text-primary-foreground"
                >
                    {text}
                </text>
                {/* Main text layer */}
                <text
                    x={x}
                    y={y}
                    fill="currentColor"
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={nonInteractiveStyles}
                    className="text-primary"
                >
                    {text}
                </text>
            </g>
        );
    }

    // Simple two-layer approach
    return (
        <g style={nonInteractiveStyles}>
            <text
                x={x}
                y={y}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fontSize={fontSize}
                fontWeight={fontWeight}
                textAnchor="middle"
                dominantBaseline="middle"
                style={nonInteractiveStyles}
                className="text-primary"
            >
                {text}
            </text>
            <text
                x={x}
                y={y}
                fill="currentColor"
                fontSize={fontSize}
                fontWeight={fontWeight}
                textAnchor="middle"
                dominantBaseline="middle"
                style={nonInteractiveStyles}
                className="text-primary-foreground"
            >
                {text}
            </text>
        </g>
    );
}; 