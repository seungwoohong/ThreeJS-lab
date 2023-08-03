import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI();
THREE.ColorManagement.enabled = false;

/**
 * Textures
 */
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matacapTexture = textureLoader.load("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradient/3.png");

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/1/px.jpg',
  '/textures/environmentMaps/1/nx.jpg',
  '/textures/environmentMaps/1/py.jpg',
  '/textures/environmentMaps/1/nx.jpg',
  '/textures/environmentMaps/1/pz.jpg',
  '/textures/environmentMaps/1/nz.jpg',
])

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Material
 */
// const material = new THREE.MeshBasicMaterial({
//   map: doorColorTexture,
//   color: new THREE.Color("red"),
// });

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matacapTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// const material = new THREE.MeshToonMaterial();
const material = new THREE.MeshStandardMaterial();
// const material = new THREE.MeshPhysicalMaterial(); // is the same as MeshStandardMaterial but with support of clear coat effect;
/**
 * @description MeshStandardMaterial uses phsically based render
 */
material.metalness = 0.5
material.roughness = 0.5
// material.gradientMap = gradientTexture;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture; // ambient occlusion
// material.aoMapIntensity = 1.5;
// material.displacementMap = doorHeightTexture; // subdivision
// material.displacementScale = 0.05;
// material.roughnessMap = doorRoughnessTexture;
// material.metalnessMap = doorMetalnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5)
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
material.envMap = environmentMapTexture

gui.add(material, 'metalness').min(0).max(1);
gui.add(material, 'roughness').min(0).max(1);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.01);
gui.add(material, 'displacementScale').min(0).max(1).step(0.001);

gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

// material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
sphere.position.x = 1.5;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
plane.position.x = -1.5;
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);

scene.add(sphere, plane, torus);

/**
 * Lights
 */
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.2 * elapsedTime;
  plane.rotation.x = 0.2 * elapsedTime;
  torus.rotation.x = 0.2 * elapsedTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
