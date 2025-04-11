varying vec2 vUv;

uniform vec3 baseColor;

uniform float fbmOctaves;
uniform float fbmFrequency;
uniform float fbmAmplitude;
uniform float fbmLacunarity;
uniform float fbmGain;

uniform float ridgeOctaves;
uniform float ridgeFrequency;
uniform float ridgeAmplitude;
uniform float ridgeLacunarity;
uniform float ridgeGain;

uniform float fineDustScale;
uniform float baseSpottingWeight;
uniform float fineDustWeight;

uniform vec2 faceOffset;

vec3 permute(vec3 x) { 
    return mod(((x*34.0)+1.0)*x, 289.0); 
}

float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float fbm(vec2 p, int octaves, float frequency, float amplitude, float lacunarity, float gain) {
    float value = 0.0;

    for (int i = 0; i < octaves; i++) {
        value += snoise(p * frequency) * amplitude;
        p *= lacunarity;
        amplitude *= gain;
    }

    return value;
}

float ridge_noise(vec2 p, int octaves, float frequency, float amplitude, float lacunarity, float gain) {
    float value = 0.0;

    for (int i = 0; i < octaves; i++) {
        float noise = snoise(p * frequency);
        value += abs(noise) * amplitude;
        p *= lacunarity;
        amplitude *= gain;
        frequency *= lacunarity;
    }

    return value;
}

vec4 permute(vec4 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

vec2 cellular(vec2 P) {
	#define K 0.142857142857
	#define K2 0.0714285714285
	#define jitter 0.8
	vec2 Pi = mod(floor(P), 289.0);
 	vec2 Pf = fract(P);
	vec4 Pfx = Pf.x + vec4(-0.5, -1.5, -0.5, -1.5);
	vec4 Pfy = Pf.y + vec4(-0.5, -0.5, -1.5, -1.5);
	vec4 p = permute(Pi.x + vec4(0.0, 1.0, 0.0, 1.0));
	p = permute(p + Pi.y + vec4(0.0, 0.0, 1.0, 1.0));
	vec4 ox = mod(p, 7.0)*K+K2;
	vec4 oy = mod(floor(p*K),7.0)*K+K2;
	vec4 dx = Pfx + jitter*ox;
	vec4 dy = Pfy + jitter*oy;
	vec4 d = dx * dx + dy * dy;
	d.xy = (d.x < d.y) ? d.xy : d.yx;
	d.xz = (d.x < d.z) ? d.xz : d.zx;
	d.xw = (d.x < d.w) ? d.xw : d.wx;
	d.y = min(d.y, d.z);
	d.y = min(d.y, d.w);
	return sqrt(d.xy);
}

// Blending functions
float blendAddition(float a, float b) {
    return a + b;
}

float blendMultiplication(float a, float b) {
    return a * b;
}

float blendSubtraction(float a, float b) {
    return a - b;
}

float blendDivision(float a, float b) {
    return a / max(b, 0.0001);
}

float blendMaximum(float a, float b) {
    return max(a, b);
}

float blendMinimum(float a, float b) {
    return min(a, b);
}

float blendScreen(float a, float b) {
    return 1.0 - (1.0 - a) * (1.0 - b);
}

float blendOverlay(float a, float b) {
    return a < 0.5 ? (2.0 * a * b) : (1.0 - 2.0 * (1.0 - a) * (1.0 - b));
}

float blendWeightedSum(float a, float b, float weightA, float weightB) {
    return weightA * a + weightB * b;
}

vec3 single_crater(vec2 st, float ridgeWidth, float ridgeCrackIntensity, float ridgeCrackDepth, float craterRad) {
    vec2 circleCenter = vec2(0.5, 0.5);         // Center of the circle in UV space
    float circleRadius = craterRad;             // Radius of the circle in UV space
    float borderThickness = ridgeWidth;         // Thickness of the border

    float dist = distance(st, circleCenter);

    // Add ridge noise only to the border
    float noise = ridge_noise(st * ridgeCrackIntensity, 8, 1.0, 0.5, 2.0, 0.5) * ridgeCrackDepth;
    float distWithNoise = dist + noise;
    float circle = smoothstep(circleRadius, circleRadius - 0.01, dist);
    float border = smoothstep(circleRadius + borderThickness, circleRadius, distWithNoise);

    float innerGradient = smoothstep(0.0, circleRadius, dist);
    vec3 innerColor = mix(vec3(0.0), vec3(0.2), innerGradient);
    vec3 borderColor = vec3(0.25);
    vec3 color = mix(vec3(1.0), borderColor, border);
    
    return mix(color, innerColor, circle);
}
/*
float worleyNoise(vec2 uv) {
    vec2 cell = floor(uv);
    vec2 fractUV = fract(uv);
    float minDist = 1.0;

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = fract(sin(dot(cell + neighbor, vec2(12.9898, 78.233))) * 43758.5453);
            vec2 diff = neighbor + point - fractUV;
            float dist = dot(diff, diff);
            minDist = min(minDist, dist);
        }
    }

    return sqrt(minDist);
}

float craterLayer(vec2 uv, float scale, float depth, float radius, float falloff) {
    vec2 scaledUV = uv * scale;
    float worley = worleyNoise(scaledUV);
    float circle = smoothstep(radius, radius - falloff, worley);
    float craterShape = pow(circle, depth);

    return craterShape;
}*/

void main() {
    vec2 uv = vUv + faceOffset;

    // Base color and spotting
    float baseSpotting = fbm(uv, int(fbmOctaves), fbmFrequency, fbmAmplitude, fbmLacunarity, fbmGain);

    // Fine dust
    float baseNoise = fbm(uv, int(fbmOctaves), fbmFrequency * 6.0, fbmAmplitude * 0.1, fbmLacunarity, fbmGain);
    float ridgeNoise = ridge_noise(uv, int(ridgeOctaves), ridgeFrequency, ridgeAmplitude, ridgeLacunarity, ridgeGain);
    float fineDust = blendWeightedSum(baseNoise, ridgeNoise, 0.5, 0.9);
    fineDust = fineDust * fineDustScale + 0.5;

    // Combine spotting and fine dust
    float combined = blendWeightedSum(baseSpotting, fineDust, baseSpottingWeight, fineDustWeight);
    combined = smoothstep(0.0, 1.0, combined);

    // Map the combined noise to the gradient of the base color
    vec3 color = baseColor + combined;

    gl_FragColor = vec4(color, 1.0);
}