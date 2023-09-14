import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'


/**
 * Loaders
 */
const glftLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Environment map
 */
// LDR 
// const environmentMap =  cubeTextureLoader.load([
//     '/environmentMaps/1/px.png',
//     '/environmentMaps/1/nx.png',
//     '/environmentMaps/1/py.png',
//     '/environmentMaps/1/ny.png',
//     '/environmentMaps/1/pz.png',
//     '/environmentMaps/1/nz.png',
// ])
// HDR(RGBE)
rgbeLoader.load('/environmentMaps/0/2k.hdr', (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = envMap
    scene.environment = envMap
})
/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const global = {};

global.envMapIntensity = 1;

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// scene.background = environmentMap;
// scene.environment = environmentMap; // To apply lighting

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    // Return all object3D
    scene.traverse((descendant) => {
        if (descendant.isMesh && descendant.material.isMeshStandardMaterial) {
            descendant.material.envMapIntensity = global.envMapIntensity;
        }
    });
}

/**
 * Environment Map
 */
scene.backgroundBlurriness = 0.2;
scene.backgroundIntensity = 5;


gui.add(global, 'envMapIntensity').min(0).max(10).step(0.01).onChange(updateAllMaterials)
gui.add(scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
gui.add(scene, 'backgroundIntensity').min(0).max(10).step(0.001)


/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshBasicMaterial()
)
torusKnot.position.x = -4
torusKnot.position.y = 4
scene.add(torusKnot)

/**
 * Models
 */
glftLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    scene.add(gltf.scene);

    updateAllMaterials();
})

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xfffff, 0.3);
const directionalLight =  new THREE.DirectionalLight(0xffffff, 0.7);
scene.add(ambientLight, directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()