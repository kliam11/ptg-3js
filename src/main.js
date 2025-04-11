import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Moon from './Moon.js';

import moonvert from './shaders/moon.vert';
import cratersfrag from './shaders/craters.frag';

let  obj = null;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000000000);
camera.position.z = 1750000;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// Create and add the moon
export function set({
    baseColor,
    radius,
    ridgeFrequency,
    ridgeAmplitude,
    fineDustScale,
    baseSpottingWeight,
    fineDustWeight,
}) {
    if(obj != null) {
        scene.remove(obj.getMesh());
    }
    obj = new Moon(renderer, baseColor, radius*1000, ridgeFrequency, 
        ridgeAmplitude, fineDustScale, baseSpottingWeight, fineDustWeight);
    scene.add(obj.getMesh());
}

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

function build() {
    requestAnimationFrame(build);
    controls.update();
    renderer.render(scene, camera);
}

build();