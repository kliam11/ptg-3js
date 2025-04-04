// Fragment shader for color ramp
uniform sampler2D noiseTexture; // Renamed uniform from 'texture' to 'noiseTexture'
uniform sampler2D colorRamp;
uniform float power;
varying vec2 vUv;

void main() {
    // Sample the noise texture (grayscale value)
    float textureValue = texture2D(noiseTexture, vUv).r; // Use 'noiseTexture' instead of 'texture'

    // Ensure textureValue is clamped to the [0, 1] range (valid range for 1D texture)
    textureValue = clamp(textureValue, 0.0, 1.0);

    // Sample color from the color ramp texture using the adjusted texture value
    vec4 color1 = texture2D(colorRamp, vec2(textureValue, 0.0));  
    
    // Optional: Apply power adjustment to control the color mapping intensity
    float t = pow(textureValue, power);  
    
    // Final color is just from the color ramp (adjusted with power if needed)
    vec4 finalColor = color1;

    // Output the final color
    gl_FragColor = finalColor;
}