varying vec2 vUv;
uniform float frequency;
uniform float amplitude;
uniform float lacunarity;
uniform float gain;
uniform int octaves;

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 uv) {
    float sum = 0.0;
    float amp = amplitude;
    float freq = frequency;
    
    for (int i = 0; i < octaves; i++) {
        sum += amp * smoothNoise(uv * freq);
        freq *= lacunarity;
        amp *= gain;
    }
    
    return sum;
}

void main() {
    float noiseValue = fbm(vUv);
    gl_FragColor = vec4(vec3(noiseValue), 1.0);
}