# Procedural 3D Planet Generative Algorithms

	•	Albedo (color) map
	•	Normal map for surface detail
	•	Roughness map for varying surface reflectivity
	•	AO map
	•	Displacement map for terrain elevation

  	•	For color maps: Use THREE.RGBFormat or THREE.RGBAFormat.
	•	For single-channel maps (like heightmaps): Use THREE.RedFormat or THREE.LuminanceFormat.
	•	For transparency: Use THREE.RGBAFormat or THREE.LuminanceAlphaFormat.
	•	For depth maps: Use THREE.DepthFormat.
	•	For more precision: Use THREE.FloatType or THREE.HalfFloatType.



	    generatePerlinTexture(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(size, size);

    // Create Perlin noise generator
    const perlin = new SimplexNoise();

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            // Use SimplexNoise to generate 2D noise
            const value = perlin.noise(x / size, y / size) * 255;
            const index = (x + y * size) * 4;
            imageData.data[index] = value;      // Red channel
            imageData.data[index + 1] = value;  // Green channel
            imageData.data[index + 2] = value;  // Blue channel
            imageData.data[index + 3] = 255;    // Alpha channel (fully opaque)
        }
    }

    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);  // Convert canvas to Three.js texture
    return texture;
}






const featurePoints = [];
for (let i = 0; i < 500; i++) {
    featurePoints.push({ x: Math.random() * 100, y: Math.random() * 100 });
}

const featurePoints2 = [];
for (let i = 0; i < 2; i++) {
    featurePoints2.push({ x: Math.random() * 100, y: Math.random() * 100 });
}

// Wrap Worley noise to pass feature points
const worleyWrapper = (x, y) => worley2D(x, y, featurePoints);
const worleyWrapper2 = (x, y) => worley2D(x, y, featurePoints2);

const width = 1000;
const height = 1000;
const scale = 10;

// Define noise layers
const noiseLayers = [
    { noiseFunction: perlin2D, frequency: 1.5, amplitude: 0.02 },
    { noiseFunction: worleyWrapper, frequency: 1.0, amplitude: 0.25 },
    { noiseFunction: worleyWrapper2, frequency: 1.0, amplitude: 0.25 },
    //{ noiseFunction: simplexNoise, frequency: 2.0, amplitude: 0.1 }
];

// Generate FBM noise
const fbmNoise = fbm(width, height, scale, noiseLayers);

console.log(fbmNoise);

const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
const pa = geometry.attributes.position;

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const index = y * width + x;
        const z = fbmNoise[y][x] * 50; // Scale the noise to adjust terrain height
        pa.setZ(index, z);
    }
}

pa.needsUpdate = true;
geometry.computeVertexNormals();

const material = new THREE.MeshStandardMaterial({
    color: 0x808080,
    wireframe: false,
    flatShading: true,
});

const terrain = new THREE.Mesh(geometry, material);
terrain.rotation.x = -Math.PI / 2; // Rotate the plane to make it horizontal
scene.add(terrain);












// Example
// Generate feature points for Worley noise
const featurePoints = [];
for (let i = 0; i < 500; i++) {
    featurePoints.push({ x: Math.random() * 100, y: Math.random() * 100 });
}

const featurePoints2 = [];
for (let i = 0; i < 2; i++) {
    featurePoints2.push({ x: Math.random() * 100, y: Math.random() * 100 });
}

// Wrap Worley noise to pass feature points
const worleyWrapper = (x, y) => worley2D(x, y, featurePoints);
const worleyWrapper2 = (x, y) => worley2D(x, y, featurePoints2);

const width = 256; // Texture resolution
const height = 256;
const scale = 10;

// Define noise layers
const noiseLayers = [
    { noiseFunction: perlin2D, frequency: 1.5, amplitude: 1.2 },
    { noiseFunction: worleyWrapper, frequency: 1.0, amplitude: 0.25 },
    { noiseFunction: worleyWrapper2, frequency: 1.0, amplitude: 0.25 },
];

// Generate FBM noise
const fbmNoise = fbm(width, height, scale, noiseLayers);

// Convert FBM noise to a texture
const data = new Uint8Array(width * height);
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const value = fbmNoise[y][x]; // Noise value in range [0, 1]
        data[y * width + x] = Math.floor(value * 255); // Convert to [0, 255]
    }
}

const fbmTexture = new THREE.DataTexture(data, width, height, THREE.RedFormat); // Use THREE.RedFormat for WebGL2
fbmTexture.needsUpdate = true;

// Create a sphere geometry
const geometry = new THREE.IcosahedronGeometry(1000, 150);

// Create the material and apply the FBM texture as a bump map
const material = new THREE.MeshStandardMaterial({
    color: 0x808080, // Base color
    bumpMap: fbmTexture, // Use the FBM texture as a bump map
    bumpScale: 100.9, // Adjust bump intensity
    roughness: 0.8, // Rough surface
    metalness: 0.0, // Non-metallic
});

// Create the sphere mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);










const textureLoader = new THREE.TextureLoader();
textureLoader.load(
    '/a.png',
    (texture) => {
        console.log('Texture loaded');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        
        const geometry = new THREE.SphereGeometry(1000, 32, 32);
        const material = new THREE.MeshStandardMaterial({ map: texture });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(0, 0, 0);
        scene.add(sphere);
    },
    undefined, 
    (err) => console.error('Error loading texture:', err)
);









export class RidgedMultiNoise {
  constructor({
    frequency = 1,
    persistence = 0.5,
    lacunarity = 2.0,
    octaveCount = 6,
    seed = 0,
    spectralWeightsExponent = 1.0,
    offset = 1.0,
    gain = 2.0
  }) {
    this.frequency = frequency;
    this.persistence = persistence;
    this.lacunarity = lacunarity;
    this.octaveCount = octaveCount;
    this.seed = seed;
    this.spectralWeightsExponent = spectralWeightsExponent;
    this.offset = offset;
    this.gain = gain;

    // Initialize the Perlin noise generator (assuming you have a perlinNoise function or module)
    this.perlin = new PerlinNoise(this.seed);
  }

  // Generate Ridged Multi Fractal Noise at position (x, y)
  generate(x, y) {
    let amplitude = 1;
    let frequency = this.frequency;
    let noiseValue = 0;
    let maxAmplitude = 0;
    let weight;

    for (let i = 0; i < this.octaveCount; i++) {
      let sampleX = x * frequency;
      let sampleY = y * frequency;

      // Generate Perlin noise at current frequency
      let perlinValue = this.perlin.noise(sampleX, sampleY);

      // Apply the ridge effect (absolute value)
      perlinValue = this.offset - Math.abs(perlinValue);

      // Apply the gain to the result
      perlinValue *= amplitude;

      // Add to the result, and calculate the max amplitude
      noiseValue += perlinValue;
      maxAmplitude += amplitude;

      // Apply spectral weight based on frequency
      weight = Math.pow(frequency, -this.spectralWeightsExponent);
      frequency *= this.lacunarity;
      amplitude *= this.persistence;
    }

    // Normalize the result to be between -1 and 1
    return noiseValue / maxAmplitude;
  }
}

// Perlin noise class (you can use your own Perlin noise implementation or a library)
class PerlinNoise {
  constructor(seed = 0) {
    this.seed = seed;
    this.p = [];

    // Generate permutation table
    for (let i = 0; i < 256; i++) {
      this.p[i] = i;
    }
    this.shuffle(this.p);
    this.p = this.p.concat(this.p);
  }

  // Permutation table shuffling
  shuffle(p) {
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
  }

  // Noise function for Perlin noise
  noise(x, y) {
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    let u = fade(x);
    let v = fade(y);

    let a = this.p[X] + Y;
    let aa = this.p[a];
    let ab = this.p[a + 1];
    let b = this.p[X + 1] + Y;
    let ba = this.p[b];
    let bb = this.p[b + 1];

    return lerp(v, lerp(u, grad(aa, x, y), grad(ba, x - 1, y)), lerp(u, grad(ab, x, y - 1), grad(bb, x - 1, y - 1)));
  }
}

// Fade function for Perlin noise
function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Linear interpolation function for Perlin noise
function lerp(t, a, b) {
  return a + t * (b - a);
}

// Gradient function for Perlin noise
function grad(hash, x, y) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
  return ((h & 1 ? -1 : 1) * u + (h & 2 ? -1 : 1) * v);
}





















import { createNoise2D } from 'simplex-noise';
import { makeRectangle } from 'fractal-noise';
const noise2D = createNoise2D();
const noise2 = (x, y) => noise2D.noise2D(x, y);

const width = 500;
const height = 500;
const noiseField = makeRectangle(width, height, noise2D, { frequency: 0.02, octaves: 7 });
// add to canvas and add to scene
// Create an HTML canvas to draw the noise texture
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

// Convert noise field to image data and draw to canvas
const imageData = ctx.createImageData(width, height);
const data = imageData.data;

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const value = (noiseField[y][x] + 1) * 0.5; // Normalize noise to [0, 1]
        const color = Math.floor(value * 255);
        const index = (y * width + x) * 4;
        data[index] = color;        // Red channel
        data[index + 1] = color;    // Green channel
        data[index + 2] = color;    // Blue channel
        data[index + 3] = 255;      // Alpha channel (fully opaque)
    }
}

ctx.putImageData(imageData, 0, 0);

// Create a texture from the canvas
const texture = new THREE.CanvasTexture(canvas);

// Create a plane geometry and apply the texture to it
const geometry = new THREE.IcosahedronGeometry(111, 200);
const material = new THREE.MeshStandardMaterial({ map: texture, roughnessMap: texture });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);




































const noise2D = createNoise2D();
const noise2 = (x, y) => noise2D.noise2D(x, y);

const width = 333;
const height = 333;
const noiseField = makeRectangle(width, height, noise2D, { frequency: 0.02, octaves: 7 });
// add to canvas and add to scene
// Create an HTML canvas to draw the noise texture
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

// Convert noise field to image data and draw to canvas
const imageData = ctx.createImageData(width, height);
const data = imageData.data;

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const value = (noiseField[y][x] + 1) * 0.5; // Normalize noise to [0, 1]
        const color = Math.floor(value * 255);
        const index = (y * width + x) * 4;
        data[index] = color;        // Red channel
        data[index + 1] = color;    // Green channel
        data[index + 2] = color;    // Blue channel
        data[index + 3] = 255;      // Alpha channel (fully opaque)
    }
}

ctx.putImageData(imageData, 0, 0);

// Create a texture from the canvas
const texture = new THREE.CanvasTexture(canvas);

// Create a plane geometry and apply the texture to it
const geometry = new THREE.PlaneGeometry(width, height, 128, 128);
const material = new THREE.MeshStandardMaterial({ map: texture, displacementMap: texture, displacementScale: 5 });
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI / 2;  // Rotate the plane to lie flat
scene.add(plane);









































const noise2D = createNoise2D();
const noise2 = (x, y) => noise2D.noise2D(x, y);

const width = 333;
const height = 333;
const noiseField = makeRectangle(width, height, noise2D, { frequency: 0.02, octaves: 7 });
// add to canvas and add to scene
// Create an HTML canvas to draw the noise texture
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

// Convert noise field to image data and draw to canvas
const imageData = ctx.createImageData(width, height);
const data = imageData.data;

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const value = (noiseField[y][x] + 1) * 0.5; // Normalize noise to [0, 1]
        const color = Math.floor(value * 255);
        const index = (y * width + x) * 4;
        data[index] = color;        // Red channel
        data[index + 1] = color;    // Green channel
        data[index + 2] = color;    // Blue channel
        data[index + 3] = 255;      // Alpha channel (fully opaque)
    }
}

ctx.putImageData(imageData, 0, 0);

// Create a texture from the canvas
const texture = toTexture(canvas, width, height, THREE.RGBAFormat);

// Create a plane geometry and apply the texture to it
const geometry = new THREE.PlaneGeometry(width, height, 128, 128);
const material = new THREE.MeshStandardMaterial({ map: texture, displacementMap: texture, displacementScale: 5 });
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI / 2;  // Rotate the plane to lie flat
scene.add(plane);