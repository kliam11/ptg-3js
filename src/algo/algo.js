import * as THREE from 'three';

export function create1DColorRamp(colorStops) {
    // Create a new array where each color stop includes its position
    const colorStopsWithPosition = colorStops.map((stop, index) => ({
        ...stop, // Spread the properties of the original stop
        position: index / (colorStops.length - 1) // Automatically assign position
    }));

    colorStopsWithPosition.sort((a, b) => a.position - b.position);

    const width = 256;
    const height = 1;
    const data = new Uint8Array(width * height * 4);

    // Convert hex string to integer (e.g., '#FFFFFF' -> 0xFFFFFF)
    function hexToInt(hex) {
        if (typeof hex === 'string') {
            return parseInt(hex.replace('#', ''), 16);
        }
        return hex; // Already an integer
    }

    function interpolateColor(c1, c2, t) {
        const r = ((c1 >> 16) & 0xFF) + (((c2 >> 16) & 0xFF) - ((c1 >> 16) & 0xFF)) * t;
        const g = ((c1 >> 8) & 0xFF) + (((c2 >> 8) & 0xFF) - ((c1 >> 8) & 0xFF)) * t;
        const b = (c1 & 0xFF) + ((c2 & 0xFF) - (c1 & 0xFF)) * t;
        return (Math.floor(r) << 16) | (Math.floor(g) << 8) | Math.floor(b);
    }

    // Ensure colorStops are in integer format
    colorStopsWithPosition.forEach(stop => {
        stop.color = hexToInt(stop.color); // Convert string hex or keep integer hex
    });

    if (colorStopsWithPosition.length === 1) {
        const color = colorStopsWithPosition[0].color;
        for (let i = 0; i < width; i++) {
            const index = i * 4;
            data[index] = (color >> 16) & 0xFF;
            data[index + 1] = (color >> 8) & 0xFF;
            data[index + 2] = color & 0xFF;
        }
    } else {
        for (let i = 0; i < width; i++) {
            const t = i / (width - 1);
            let leftStop = colorStopsWithPosition[0];
            let rightStop = colorStopsWithPosition[0];

            for (let j = 0; j < colorStopsWithPosition.length - 1; j++) {
                if (t >= colorStopsWithPosition[j].position && t <= colorStopsWithPosition[j + 1].position) {
                    leftStop = colorStopsWithPosition[j];
                    rightStop = colorStopsWithPosition[j + 1];
                    break;
                }
            }

            const color = interpolateColor(leftStop.color, rightStop.color, (t - leftStop.position) / (rightStop.position - leftStop.position));
            const index = i * 4;
            data[index] = (color >> 16) & 0xFF;
            data[index + 1] = (color >> 8) & 0xFF;
            data[index + 2] = color & 0xFF;
        }
    }

    const texture = new THREE.DataTexture(data, width, height);
    texture.needsUpdate = true;
    return texture;
}

export function getRectangularProjectionDimensions(radius, resolution) {
    const width = resolution * 360;
    const height = resolution * 180;
    return { width, height };
}