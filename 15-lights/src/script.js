import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
/**
 * @description three에서 export되는 모듈에 포함되어 있지 않아 three/examples/jsm/helpers/ 에서 import 해야함'
 */
import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper'

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
 * Lights
 * Low cost - ambinetLight, HemisphereLight
 * Moderate cost - DirectionalLight, PointLight
 * High cost - SpotLight, RectAreaLight
 */
/**
 * @description Lights는 cost가 상당히 많이 든다.
 * 그걸 해결할 수 있는 기법으로 Bake기법을 사용할 수 있다.
 * Bake는 shadow를 light를 통해 표현하지 않고 texture와 같은 material에 shadow를 표현하는 것이다.
 * 즉, 처음부터 이미지에 그림자와 명암을 표현하고 cost가 적게 드는 light를 사용하는 기법이다.
 * @see https://threejs-journey.com/lessons/lights#baking
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)
// const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.5); // like-sun
// scene.add(directionalLight) 
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 3);
// scene.add(directionalLightHelper);

// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 3) // top, bottom으로 양쪽에서 각 색을 비추는 조명;
// scene.add(hemisphereLightHelper);

// const pointLight = new THREE.PointLight(0xffff00, 0.5, 10, 1); // 이름 그대로 특정 좌표를 포인트로 하여 사방으로 빛을 비추는 조명
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// pointLight.position.set(0, 3, 0)
// scene.add(pointLight)
// scene.add(pointLightHelper)

/**
 * @description only works with MeshStandardMaterial and MeshPhysicalMaterial
 */
// const rectLight = new THREE.RectAreaLight(0xff9000, 2, 1, 1); // 사진관 조명처럼 사각형 형태로 퍼지면서 빛을 비추는 조명, 따라서 멤버 변수에 width, height가 존재한다.
// rectLight.position.set(-1.5, 1, 1.5)
// rectLight.lookAt(new THREE.Vector3())
// scene.add(rectLight)

// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1); // 후레쉬처럼 넓게 퍼지는 조명 
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
spotLight.target.position.x = 1
// scene.add(spotLight.target)


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
    // console.log(elapsedTime)

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()