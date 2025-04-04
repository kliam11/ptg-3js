import './src/core/main.js';
import { set } from './src/core/main.js';

let selectedValue = null;

document.querySelectorAll('input[name="objectType"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        selectedValue = event.target.value;
        const configBox = document.getElementById('configBox');
        configBox.style.display = 'block';
        configBox.innerHTML = '';

        if (selectedValue === 'asteroid') {
            configBox.innerHTML = `
                <h5>Shape</h5>
                    <label for="radius">Radius (km):</label>
                    <input type="number" id="radius" name="radius" value="3475">
                    <br/>
                    <label for="ystretch">y-stretch:</label>
                    <input type="number" id="ystretch" name="ystretch" value="0.5">
                    <br/>
                    <label for="xstretch">x-stretch:</label>
                    <input type="number" id="xstretch" name="xstretch" value="0.5">
                    <br/>
                    <label for="zstretch">z-stretch:</label>
                    <input type="number" id="zstretch" name="zstretch" value="0.5">
                    <br/>
                    <label for="pertube">Pertube intensity:</label>
                    <input type="number" id="pertube" name="pertube" value="500">
                    <br/>
                <br/>

                <h5>Simple Craters</h5>
                    <label for="simpleCount">Count:</label>
                    <input type="number" id="simpleCount" name="simpleCount" value="200">
                    <br/>

                <br/>
                <h5>Complex Craters</h5>
                    <label for="complexCount">Count:</label>
                    <input type="number" id="complexCount" name="complexCount" value="50">
                    <br/>
                    <label for="complexMinRad">min. radius:</label>
                    <input type="number" id="complexMinRad" name="complexMinRad" value="50">
                    <br/>
                    <label for="complexMaxRad">max. radius:</label>
                    <input type="number" id="complexMaxRad" name="complexMaxRad" value="100">
                    <br/>

                <br/>
                <h5>Peak ring basins</h5>
                    <label for="basinsCount">Count:</label>
                    <input type="number" id="basinsCount" name="basinsCount" value="2">
                    <br/>
                    <label for="basinsMRad">min. radius:</label>
                    <input type="number" id="basinsMinRad" name="basinsMinRad" value="150">
                    <br/>
                    <label for="basinsMaxRad">max. radius:</label>
                    <input type="number" id="basinsMaxRad" name="basinsMaxRad" value="300">
                    <br/>
                    <label for="crackScale">Crack scale:</label>
                    <input type="number" id="crackScale" name="crackScale" value="300">
                    <br/>

                <br/>
                <h5>Coloring</h5>
                <label for="baseColor">Base Color:</label>
                <input type="color" id="baseColor" name="baseColor" value="#808080">
            `;
        } else if (selectedValue === 'gas') {
            configBox.innerHTML = `
                <h5>Shape</h5>
                    <label for="radius">Radius (km):</label>
                    <input type="number" id="radius" name="radius" value="49528">
                    <label for="spotCount">Spot count:</label>
                    <input type="number" id="spotCount" name="spotCount" value="2">
                    <br/>
                <br/>

                <h5>Sections</h5>
                    <label for="sectionCount">Section count:</label>
                    <input type="number" id="sectionCount" name="sectionCount" value="2">
                    <br/>
                    <button id="sectButton" class="optButton">Add</button>
                    <br/>
                <br/>
                <div id="sectBox"></div>
            `;
        }
        configBox.innerHTML += `
            <hr/>
            <button id="buildButton" class="optButton">Generate</button>
        `;

        const sectButton = document.getElementById('sectButton');
        if(sectButton) {
            document.getElementById('sectButton').addEventListener('click', () => {
                const sectionCount = parseInt(document.getElementById('sectionCount').value);
                const sectBox = document.getElementById('sectBox');
                sectBox.innerHTML = '';
            
                for (let i = 1; i <= sectionCount; i++) {
                    const sectDiv = document.createElement('div');
                    sectDiv.id = `sectDiv${i}`; 
                    sectDiv.innerHTML = `
                        <h6>Section ${i}</h6>
                        <label for="section${i}-height">Height (km): </label>
                        <input type="number" id="section${i}-height" class="colorNumIn" name="section${i}-height" value="100">
                        <br/>
                        <label for="section${i}-colorNum"># colors: </label>
                        <input type="number" id="section${i}-colorNum" class="colorNumIn" name="section${i}-colorNum" value="3">
                        <button type="button" id="btnSection${i}" class="sectColorBtn"> > </button>
                        <div id="sectColorBox${i}"></div>
                        <br/><hr/>
                    `;
                    sectBox.appendChild(sectDiv);

                    document.getElementById(`btnSection${i}`).addEventListener('click', () => {
                        const colorNum = parseInt(document.getElementById(`section${i}-colorNum`).value);
                        const colorBox = document.getElementById(`sectColorBox${i}`);
                        colorBox.innerHTML = '';
            
                        for (let j = 1; j <= colorNum; j++) {
                            const colorWrapper = document.createElement('div');
            
                            // Label for color input
                            const colorLabel = document.createElement('label');
                            colorLabel.innerHTML = `Color ${j}: `;
                            colorLabel.setAttribute('for', `section${i}-color${j}`);
            
                            // Color input
                            const colorInput = document.createElement('input');
                            colorInput.type = 'color';
                            colorInput.id = `section${i}-color${j}`;
                            colorInput.name = `section${i}-color${j}`;
                            colorInput.value = '#ffffff';
            
                            // Label for numerical input
                            const numLabel = document.createElement('label');
                            numLabel.innerHTML = ` pos: `;
                            numLabel.setAttribute('for', `section${i}-colorValue${j}`);
            
                            // Append elements to colorWrapper div
                            colorWrapper.appendChild(colorLabel);
                            colorWrapper.appendChild(colorInput);
            
                            colorBox.appendChild(colorWrapper);
                        }
                    });
                }
            });
        }

        document.getElementById('buildButton').addEventListener('click', () => {
            const params = {};
        
            // Common parameters
            params.radius = parseFloat(document.getElementById('radius').value);
            console.log("Radius: ", params.radius);
        
            // Asteroid-specific parameters
            if (selectedValue === 'asteroid') {
                params.ystretch = parseFloat(document.getElementById('ystretch').value);
                params.xstretch = parseFloat(document.getElementById('xstretch').value);
                params.zstretch = parseFloat(document.getElementById('zstretch').value);
                params.pertube = parseFloat(document.getElementById('pertube').value);
                params.simpleCount = parseInt(document.getElementById('simpleCount').value);
                params.complexCount = parseInt(document.getElementById('complexCount').value);
                params.complexMinRad = parseInt(document.getElementById('complexMinRad').value);
                params.complexMaxRad = parseInt(document.getElementById('complexMaxRad').value);
                params.basinsCount = parseInt(document.getElementById('basinsCount').value);
                params.basinsMinRad = parseInt(document.getElementById('basinsMinRad').value);
                params.basinsMaxRad = parseInt(document.getElementById('basinsMaxRad').value);
                params.crackScale = parseInt(document.getElementById('crackScale').value);
                params.baseColor = document.getElementById('baseColor').value;
                console.log("Asteroid Params: ", params);
            }
        
            // Gas-specific parameters
            if (selectedValue === 'gas') {
                params.spotCount = parseInt(document.getElementById('spotCount').value);
                params.sectionCount = parseInt(document.getElementById('sectionCount').value);
                console.log("Gas Params: Spot Count: ", params.spotCount, " Section Count: ", params.sectionCount);
                
                // Gather sections data
                params.sections = [];
                for (let i = 1; i <= params.sectionCount; i++) {
                    const section = {
                        height: parseFloat(document.getElementById(`section${i}-height`).value),
                        colorNum: parseInt(document.getElementById(`section${i}-colorNum`).value),
                        colors: []
                    };
        
                    // Get the colors for each section
                    for (let j = 1; j <= section.colorNum; j++) {
                        section.colors.push(document.getElementById(`section${i}-color${j}`).value);
                    }
        
                    params.sections.push(section);
                }
                console.log("Sections: ", params.sections);
            }
        
            console.log('Selected Parameters:', params);
            set(selectedValue, params);
        });
    });
});