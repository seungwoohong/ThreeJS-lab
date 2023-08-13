import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png');

console.log(particleTexture)
/**
 * Particles
 */
const count = 2000;
const positions = new Float32Array(count * 3) // 3 is x, y, z, like this [0,0,0 , 1,1,1 , 2,2,2], coordinate for vertax each 3 
const colors = new Float32Array(count * 3) // [r,g,b , r,g,b]  like potions


for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}

const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial()


particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Points
particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true;
particlesMaterial.color = new THREE.Color('#ff88cc');
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture

// particle map을 쓰면 texture 이미지에 edge가 보이는 버그가 있다. 
// 이를 해결하기 위한 방법은 여러가지가 있다.

// Solution 1
// particlesMaterial.alphaTest = 0.001

// Solution 2 - 이 방법은 다른 오브젝트가 있을 때 색깔이 다르게 렌더링 되는 오류가 발생한다.
// particlesMaterial.depthTest = false

// Solution 3
particlesMaterial.depthWrite = false

particlesMaterial.blending = THREE.AdditiveBlending
particlesMaterial.vertexColors = true
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({
    color: '#ffffff'
}))

scene.add(particles)

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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles 
    // particles.rotation.y = elapsedTime * 0.18;

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = particlesGeometry.attributes.position.array[i3]; 
        // Avoid, attributes 를 계속해서 update하는 것은 성능에 좋지 않음
        // Solution is custom shader
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);

    }
    particlesGeometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()