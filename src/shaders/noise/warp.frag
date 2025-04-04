uniform float scale;
uniform float warpAmount;
varying vec2 vUv;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

float noise(vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float domainWarp(vec2 uv, float amount) {
    vec2 warpOffset = vec2(noise(uv * 1.5), noise(uv * 1.5 + vec2(5.2, 1.3))) * amount;
    return noise(uv + warpOffset);
}

void main() {
    vec2 uv = vUv * scale;
    float warpedNoise = domainWarp(uv, warpAmount);
    vec3 color = vec3(warpedNoise);

    gl_FragColor = vec4(color, 1.0);
}