import { Asteroid } from "../pipeline/Asteroid";
import { Gas } from "../pipeline/Gas"

export class Demo {
    static build(type, params) {
    
        switch (type) {
            
            case 'asteroid':
                const asteroid = new Asteroid(
                    params.radius,
                    params.xstretch,
                    params.ystretch,
                    params.zstretch,
                    params.pertube,
                    params.simpleCount,
                    params.complexCount,
                    params.complexMinRad,
                    params.complexMaxRad,
                    params.basinsCount,
                    params.basinsMinRad,
                    params.basinsMaxRad,
                    params.crackScale,
                    params.baseColor
                );
                return asteroid.build();
            
            case 'gas':
                console.log(params.sections)
                const gas = new Gas(
                    params.radius,
                    params.sectionCount,
                    params.sections,
                    params.spotCount
                );
                return gas.build();
    
            default:
                break;
        }
    }
}

function colorToHex(colorStr) {
    if (colorStr.startsWith('#')) {
        return '0x' + parseInt(colorStr.replace('#', ''), 16).toString(16).toUpperCase();
    }
    return '0x' + parseInt(colorStr, 16).toString(16).toUpperCase();
}