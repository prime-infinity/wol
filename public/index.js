import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import { users } from "./users.js";

console.log(users);

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

//sphere geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: "blue" });
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.set(0, 0, 0);
scene.add(sphereMesh);

const sphereGeometry2 = new THREE.SphereGeometry(0.5, 20, 20);
const sphereMaterial2 = new THREE.MeshLambertMaterial({ color: "red" });
const sphereMesh2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
sphereMesh2.position.set(4, 0, 0);
scene.add(sphereMesh2);

const sphereGeometry3 = new THREE.SphereGeometry(0.5, 20, 20);
const sphereMaterial3 = new THREE.MeshLambertMaterial({ color: "red" });
const sphereMesh3 = new THREE.Mesh(sphereGeometry3, sphereMaterial3);
sphereMesh3.position.set(4, 4, 0);
scene.add(sphereMesh3);

// Create the lines
const lineGeometry = new THREE.BufferGeometry();
const lineVertices = [
  ...sphereMesh.position.toArray(),
  ...sphereMesh2.position.toArray(),
];
lineGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(lineVertices, 3)
);
const lineMaterial = new THREE.LineBasicMaterial({ color: "black" });

const line1 = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line1);

// Create the lines
const lineGeometry2 = new THREE.BufferGeometry();
const lineVertices2 = [
  ...sphereMesh.position.toArray(),
  ...sphereMesh3.position.toArray(),
];
lineGeometry2.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(lineVertices2, 3)
);
const lineMaterial2 = new THREE.LineBasicMaterial({ color: "black" });

const line2 = new THREE.Line(lineGeometry2, lineMaterial2);
scene.add(line2);

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
  renderer.render(scene, camera);

  controls.update();
};

animate();
