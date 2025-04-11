import './src/main.js';
import { set } from './src/main.js';

document.getElementById('generatePlanet').addEventListener('click', () => {
    const baseColor = document.getElementById('baseColor').value;
    const radius = parseFloat(document.getElementById('radius').value);
    const ridgeFrequency = parseFloat(document.getElementById('ridgeFrequency').value);
    const ridgeAmplitude = parseFloat(document.getElementById('ridgeAmplitude').value);
    const fineDustScale = parseFloat(document.getElementById('fineDustScale').value);
    const baseSpottingWeight = parseFloat(document.getElementById('baseSpottingWeight').value);
    const fineDustWeight = parseFloat(document.getElementById('fineDustWeight').value);

    set({
        baseColor,
        radius,
        ridgeFrequency,
        ridgeAmplitude,
        fineDustScale,
        baseSpottingWeight,
        fineDustWeight,
    });
});

