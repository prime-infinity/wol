import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

let scene;
let camera;
let renderer;
let controls;
let stats;
let container = document.getElementById("container");
container.width = window.innerWidth;
container.height = window.innerHeight;
scene = new THREE.Scene();
const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1e7;

//camera
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 25);
scene.add(camera);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

//renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.update();

//lights
/*const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 5, 0);
scene.add(light);*/

// Create a new sphere geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// Create a new material for the sphere
const sphereMaterial = new THREE.MeshLambertMaterial({ color: "blue" });

// Create a new mesh and add the sphere geometry and material to it
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

// Add the mesh to the scene
scene.add(sphereMesh);

//resize listner
window.addEventListener("resize", () => {
  container.width = window.innerWidth;
  container.height = window.innerHeight;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // Rotate the sphere mesh around the Y axis
  sphereMesh.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);

  controls.update();
};

animate();
