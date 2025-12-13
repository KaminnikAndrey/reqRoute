// components/ColorBlock.tsx
import React from 'react';

interface ColorBlockProps {
    isActive?: boolean;
    width?: number | string;
    height?: number;
    radius?: number;
    className?: string;
}

export const ColorBlock: React.FC<ColorBlockProps> = ({
                                                          isActive = false,
                                                   width = 95.5,
                                                   height = 6,
                                                   radius = 8,
                                                   className = ''
                                               }) => {
    return (
        <div
            className={`color-block ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: `${height}px`,
                borderRadius: `${radius}px`,
                backgroundColor: `${isActive ? "#EF3124" : "#F7B1AA"}`,
            }}
        />
    );
};

