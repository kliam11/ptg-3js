varying vec2 vUv;

uniform sampler2D inputTexture;
uniform float smoothingStrength;

void main() {
    vec4 color = texture2D(inputTexture, vUv);

    // Sample neighboring pixels for smoothing
    vec4 left = texture2D(inputTexture, vUv + vec2(-smoothingStrength, 0.0));
    vec4 right = texture2D(inputTexture, vUv + vec2(smoothingStrength, 0.0));
    vec4 up = texture2D(inputTexture, vUv + vec2(0.0, smoothingStrength));
    vec4 down = texture2D(inputTexture, vUv + vec2(0.0, -smoothingStrength));

    // Average the current pixel with its neighbors
    vec4 smoothedColor = (color + left + right + up + down) / 5.0;

    gl_FragColor = smoothedColor;
}
