const scene = new THREE.Scene();


const geometry =  new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: '#ff0000'});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

/**
 * position x,y,z
 * Everything have inherit Object3D
 */
const camera = new THREE.PerspectiveCamera(75, 800 / 600);
camera.position.z = 6;
camera.position.x = 1.5;
camera.position.y = 1.5;
scene.add(camera);

const canvas =  document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas})

renderer.setSize(800, 600)
renderer.render(scene, camera)