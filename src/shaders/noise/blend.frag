uniform sampler2D baseTexture;
uniform sampler2D blendTexture;
uniform int blendMode;
varying vec2 vUv;

vec3 screen(vec3 base, vec3 blend) {
  return 1.0 - ((1.0 - base) * (1.0 - blend));
}

vec3 multiply(vec3 base, vec3 blend) {
  return base * blend;
}

vec3 overlay(vec3 base, vec3 blend) {
  return mix(2.0 * base * blend, 1.0 - 2.0 * (1.0 - base) * (1.0 - blend), step(0.5, base));
}

vec3 softLight(vec3 base, vec3 blend) {
  return mix(sqrt(base) * blend, 1.0 - (1.0 - base) * (1.0 - blend), step(0.5, base));
}

vec3 hardLight(vec3 base, vec3 blend) {
  return overlay(blend, base);
}

vec3 colorDodge(vec3 base, vec3 blend) {
  return base / (1.0 - blend);
}

vec3 colorBurn(vec3 base, vec3 blend) {
  return 1.0 - (1.0 - base) / blend;
}

vec3 difference(vec3 base, vec3 blend) {
  return abs(base - blend);
}

vec3 exclusion(vec3 base, vec3 blend) {
  return base + blend - 2.0 * base * blend;
}

vec3 additive(vec3 base, vec3 blend) {
  return min(base + blend, 1.0);
}

vec3 subtract(vec3 base, vec3 blend) {
  return max(base - blend, 0.0);
}

vec3 divide(vec3 base, vec3 blend) {
  return base / max(blend, 0.0001);
}

vec3 blend(vec3 base, vec3 blend, int mode) {
  if (mode == 1) return screen(base, blend);
  if (mode == 2) return multiply(base, blend);
  if (mode == 3) return overlay(base, blend);
  if (mode == 4) return softLight(base, blend);
  if (mode == 5) return hardLight(base, blend);
  if (mode == 6) return colorDodge(base, blend);
  if (mode == 7) return colorBurn(base, blend);
  if (mode == 8) return difference(base, blend);
  if (mode == 9) return exclusion(base, blend);
  if (mode == 10) return additive(base, blend);
  if (mode == 11) return subtract(base, blend);
  if (mode == 12) return divide(base, blend);
  return base;
}

void main() {
  vec4 baseColor = texture2D(baseTexture, vUv);
  vec4 blendColor = texture2D(blendTexture, vUv);
  gl_FragColor = vec4(blend(baseColor.rgb, blendColor.rgb, blendMode), 1.0);
}