import * as THREE from 'three';
import { ShaderMaterial } from 'three';

import gasfrag from '../shaders/pipeline/gas/gas.frag';
import geovert from '../shaders/pipeline/geo.vert';

import { create1DColorRamp, getRectangularProjectionDimensions } from '../algo/algo.js';

export class Gas {
    constructor(radius, sectionCount, sections, spotCount) {
        this.radius = radius * 1000;
        this.resolution = 2000;
        this.spotCount = spotCount;

        this.updateProjectionDimensions();

        // Generate colorramps for each layer
        this.sectionramp = [];
        colorsections.forEach(sect => {
            this.sectionramp.append(
                {
                    height: sect.height*1000,
                    ramp: create1DColorRamp(sect.colors),
                }
            );
        });

        // Add poles if space remaining
        const sumHeight = colorsections.reduce((sum, section) => sum + section.height, 0);
        if(sumHeight < this.height) {
            sectionramp.unshift(
                {
                    height: this.height - sumHeight,
                    ramp: create1DColorRamp([{position: 1.0, color: this.baseColor}]),
                }
            );
            sectionramp.append(
                {
                    height: this.height - sumHeight,
                    ramp: create1DColorRamp([{position: 1.0, color: this.baseColor}]),
                }
            );
        }
    }

    updateProjectionDimensions() {
        const { width, height } = getRectangularProjectionDimensions(this.radius, this.resolution);
        this.projWidth = width;
        this.projHeight = height;
    }

    build() {
        // run shader code for geo and material
        const rampTextures = this.sectionramp.map(section => section.ramp);

        /*
        uniforms = {
            sectionRamps: { type: 'tv', value: rampTextures.map(item => item.ramp) },  // Passing all ramp textures
            sectionHeights: { type: 'fv1', value: rampTextures.map(item => item.height) } // Passing all heights
        };
        */

        // convert to UV mapping
        // get all maps (color, normal, roughness, etc.)
        // return it
    }
}