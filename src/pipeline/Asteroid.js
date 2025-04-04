import * as THREE from 'three';

export class Asteroid {
    constructor(
        radius,
        xstretch,
        ystretch,
        zstretch,
        pertube,
        simpleCount,
        complexCount,
        complexMinRad,
        complexMaxRad,
        basinsCount,
        basinsMinRad,
        basinsMaxRad,
        crackScale,
        baseColor
    ) {
        this.radius = radius * 1000;
        this.resolution = 2000;
        this.xstretch = xstretch;
        this.ystretch = ystretch;
        this.zstretch = zstretch;
        this.pertube = pertube;
        this.simpleCount = simpleCount;
        this.complexCount = complexCount;
        this.complexMinRad = complexMinRad;
        this.complexMaxRad = complexMaxRad;
        this.basinsCount = basinsCount;
        this.basinsMinRad = basinsMinRad;
        this.basinsMaxRad = basinsMaxRad;
        this.crackScale = crackScale;
        this.baseColor = baseColor;
    }

    build() {

    }

}
