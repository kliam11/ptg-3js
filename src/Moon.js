import * as THREE from 'three';
import colorfrag from './shaders/color.frag';
import moonvert from './shaders/moon.vert';

export default class Moon {
    constructor(renderer, baseColor, radius, ridgeFrequency,
        ridgeAmplitude, fineDustScale, baseSpottingWeight, fineDustWeight
    ) {
        this.renderer = renderer;

        // Render target for procedural texture generation
        const rttSize = 2048;
        this.renderTargets = Array(6).fill(null).map(() => new THREE.WebGLRenderTarget(rttSize, rttSize, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
        }));

        const randomOffset = () => new THREE.Vector2(Math.random() * 1, Math.random() * 100);

        // Dynamically generate materials for all six faces
        this.genMaterials = Array(6).fill(null).map(() => new THREE.ShaderMaterial({
            vertexShader: moonvert,
            fragmentShader: colorfrag,
            uniforms: {
                baseColor: { value: new THREE.Color(baseColor) },
                fbmOctaves: { value: 8.0 },
                fbmFrequency: { value: 1.0 },
                fbmAmplitude: { value: 1.1 },
                fbmLacunarity: { value: 2.0 },
                fbmGain: { value: 0.5 },
                ridgeOctaves: { value: 8.0 },
                ridgeFrequency: { value: ridgeFrequency },
                ridgeAmplitude: { value: ridgeAmplitude },
                ridgeLacunarity: { value: 1.0 },
                ridgeGain: { value: 0.5 },
                fineDustScale: { value: fineDustScale },
                baseSpottingWeight: { value: baseSpottingWeight },
                fineDustWeight: { value: fineDustWeight },
                faceOffset: { value: randomOffset() },
            },
        }));

        this.genScene = new THREE.Scene();
        this.genCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.genCam.position.z = 1;

        this.textures = this.generateTextures();
        const geometry = this.createCubeToSphereGeometry(radius, 128);
        this.moonMaterials = this.createMaterialsForFaces(this.textures);

        this.moonMesh = new THREE.Mesh(geometry, this.moonMaterials);
    }

    generateTextures() {
        const textures = [];
        for (let i = 0; i < 6; i++) {
            // Use a unique genMaterial for each face
            const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.genMaterials[i]);
            this.genScene.add(quad);

            // Render the texture for this face
            this.renderer.setRenderTarget(this.renderTargets[i]);
            this.renderer.render(this.genScene, this.genCam);
            this.renderer.setRenderTarget(null);

            textures.push(this.renderTargets[i].texture);

            // Remove the quad after rendering to avoid overlapping
            this.genScene.remove(quad);
        }
        return textures;
    }

    createMaterialsForFaces(textures) {
        return textures.map(texture => new THREE.MeshStandardMaterial({
            map: texture,
            bumpMap: texture,
            bumpScale: 25,
            flatShading: false,
        }));
    }

    createCubeToSphereGeometry(radius, resolution) {
        const geometry = new THREE.BoxGeometry(radius, radius, radius, resolution, resolution, resolution);
        const positions = geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];

            // Normalize the cube vertices to form a sphere
            const length = Math.sqrt(x * x + y * y + z * z);
            positions[i] = (x / length) * radius;
            positions[i + 1] = (y / length) * radius;
            positions[i + 2] = (z / length) * radius;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        return geometry;
    }

    getMesh() {
        return this.moonMesh;
    }
}