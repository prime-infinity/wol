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
//console.log(user);
const mainSphereGeo = new THREE.SphereGeometry(1.2, 20, 20);
const mainSphereMesh = new THREE.Mesh(mainSphereGeo, mSm);
scene.add(mainSphereMesh);

// Create a function to create a sprite with a label
function createLabelSprite(position, label, bg) {
  const labelCanvas = document.createElement("canvas");
  const labelContext = labelCanvas.getContext("2d");
  const spriteSize = 128;
  labelCanvas.width = labelCanvas.height = spriteSize;
  const centerX = spriteSize / 2;
  const centerY = spriteSize / 2;
  const radius = spriteSize / 2 - 1;
  labelContext.fillStyle = bg;
  labelContext.beginPath();
  labelContext.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  labelContext.fill();
  labelContext.fillStyle = "white";
  labelContext.font = "Bold 52px Arial";
  labelContext.textAlign = "center";
  labelContext.textBaseline = "middle";
  labelContext.fillText(label, centerX, centerY);
  const labelTexture = new THREE.CanvasTexture(labelCanvas);

  const spriteMaterial = new THREE.SpriteMaterial({ map: labelTexture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.5, 0.5, 0.5);
  sprite.position.set(position.x, position.y, position.z);
  return sprite;
}

// Create four label sprites around the sphere
const sprite1 = createLabelSprite(
  new THREE.Vector3(1.5, 0, 0),
  user[0].followersCount,
  "blue"
);
const sprite2 = createLabelSprite(
  new THREE.Vector3(-1.5, 0, 0),
  user[0].followingCount,
  "red"
);
const sprite3 = createLabelSprite(new THREE.Vector3(0, 0, 1.5), "34", "orange");
const sprite4 = createLabelSprite(new THREE.Vector3(0, 0, -1.5), "44", "green");
mainSphereMesh.add(sprite1, sprite2, sprite3, sprite4);

const followersSpheres = [];
const space = 10; // minimum distance between spheres
for (let i = 0; i < user[0].followers.length; i++) {
  const followersID = user[0].followers[i];
  const followers = users.filter((user) => user.id === followersID);
  followersSpheres.push(followers[0]);
}

const positions = new Set(); // keep track of occupied positions
const spherseMeshes = [];
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
  let lineColor = "red";
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
  spherseMesh.userData = line;
  spherseMeshes.push(spherseMesh);
  scene.add(line);
  scene.add(spherseMesh);
}
//console.log(spherseMeshes);

const dragControls = new DragControls(
  spherseMeshes,
  camera,
  renderer.domElement
);

const updateLinePositions = (mesh) => {
  const spherseMesh = mesh.object;

  // get positions of smaller mesh and bigger mesh
  const smallerMeshPosition = spherseMesh.position.clone();
  const biggerMeshPosition = mainSphereMesh.position.clone();

  // update position of line
  const lineVertices = [
    smallerMeshPosition.x,
    smallerMeshPosition.y,
    smallerMeshPosition.z,
    biggerMeshPosition.x,
    biggerMeshPosition.y,
    biggerMeshPosition.z,
  ];
  spherseMesh.userData.geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineVertices, 3)
  );
  spherseMesh.userData.geometry.needsUpdate = true;
};

dragControls.addEventListener("drag", (event) => {
  //updateLinePositions();
});

dragControls.addEventListener("dragstart", function (event) {
  //console.log(event);
  controls.enabled = false;
});

dragControls.addEventListener("dragend", function (event) {
  controls.enabled = true;
  updateLinePositions(event);
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
  //updateLinePositions();
  controls.update();
  renderer.render(scene, camera);
};

animate();
