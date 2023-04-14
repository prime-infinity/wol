import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import { DragControls } from "DragControls"; // import DragControls
import { users } from "./users.js";

//console.log(users);

let scene;
let camera;
let renderer;
let controls;
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

//sphere geometry
//get user
const user = users.filter((user) => user.id === 8);
const mSm = new THREE.MeshBasicMaterial({ color: "#A9A9A9" });
const sSm = new THREE.MeshBasicMaterial({ color: "#71797E" });

const mainSphereGeo = new THREE.SphereGeometry(1.2, 20, 20);
const mainSphereMesh = new THREE.Mesh(mainSphereGeo, mSm);
scene.add(mainSphereMesh);
//console.log(user);

const followersSpheres = [];
const space = 10; // minimum distance between spheres
for (let i = 0; i < user[0].followers.length; i++) {
  const followersID = user[0].followers[i];
  const followers = users.filter((user) => user.id === followersID);
  followersSpheres.push(followers[0]);
}

const positions = new Set(); // keep track of occupied positions

for (let i = 0; i < followersSpheres.length; i++) {
  const followers = followersSpheres[i];
  const spheresGeometry = new THREE.SphereGeometry(0.5, 20, 20);
  const spherseMesh = new THREE.Mesh(spheresGeometry, sSm);

  // generate random position within the space parameter
  let newPosition = new THREE.Vector3(
    Math.random() * space - space / 2,
    Math.random() * space - space / 2,
    Math.random() * space - space / 2
  );

  // check if the position is already occupied
  while (positions.has(newPosition.toArray().toString())) {
    newPosition = new THREE.Vector3(
      Math.random() * space - space / 2,
      Math.random() * space - space / 2,
      Math.random() * space - space / 2
    );
  }

  positions.add(newPosition.toArray().toString()); // add new position to occupied positions
  spherseMesh.position.copy(newPosition);

  // check if the follower's following array contains a certain ID
  let lineColor = "black";
  if (user[0].following.includes(followers.id)) {
    lineColor = "blue";
  }

  // create the line material based on the color
  const lineMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
    linewidth: 4,
  });

  const lineGeometry = new THREE.BufferGeometry();
  const lineVertices = [
    ...mainSphereMesh.position.toArray(),
    ...spherseMesh.position.toArray(),
  ];
  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineVertices, 3)
  );
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
  scene.add(spherseMesh);
  //console.log(followers);
}
console.log(followersSpheres);
const dragControls = new DragControls(
  followersSpheres,
  camera,
  renderer.domElement
);

/*const updateLinePositions = () => {
  for (let i = 0; i < scene.children.length; i++) {
    const object = scene.children[i];
    if (object instanceof THREE.Line) {
      const vertices = object.geometry.attributes.position.array;
      vertices[0] = mainSphereMesh.position.x;
      vertices[1] = mainSphereMesh.position.y;
      vertices[2] = mainSphereMesh.position.z;
      vertices[3] = object.parent.position.x;
      vertices[4] = object.parent.position.y;
      vertices[5] = object.parent.position.z;
      object.geometry.attributes.position.needsUpdate = true;
    }
  }
};

dragControls.addEventListener("drag", (event) => {
  updateLinePositions();
});*/

dragControls.addEventListener("dragstart", function (event) {
  controls.enabled = false;
});

dragControls.addEventListener("dragend", function (event) {
  controls.enabled = true;
});

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
