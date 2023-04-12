import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
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
const user = users.filter((user) => user.id === 5);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: "blue" });
const lineMaterial = new THREE.LineBasicMaterial({ color: "black" });

const sphereSize =
  user[0].followers.length > 0 ? user[0].followers.length : 0.5;
const mainSphereGeo = new THREE.SphereGeometry(sphereSize, 20, 20);
const mainSphereMesh = new THREE.Mesh(mainSphereGeo, sphereMaterial);
scene.add(mainSphereMesh);
//console.log(mainSphereMesh);

const followersSpheres = [];
for (let i = 0; i < user[0].followers.length; i++) {
  const followersID = user[0].followers[i];
  //console.log(followers);
  //for each follower, create a sphere
  //get details about the followers too, and use it for the spheres
  const followers = users.filter((user) => user.id === followersID);
  followersSpheres.push(followers[0]);
}

for (let i = 0; i < followersSpheres.length; i++) {
  const followers = followersSpheres[i];
  //console.log(followers);
  const spheresGeometry = new THREE.SphereGeometry(0.5, 20, 20);
  const spherseMesh = new THREE.Mesh(spheresGeometry, sphereMaterial);
  spherseMesh.position.set(followers.x, followers.y, followers.z);
  //console.log(spherseMesh);
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
}

/*const sphereMaterial = new THREE.MeshLambertMaterial({ color: "blue" });
const spheres = [];
for (let i = 0; i < users.length; i++) {
  const user = users[i];
  const sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20);
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.set(user.x, user.y, user.z);
  scene.add(sphereMesh);
  spheres.push(sphereMesh);
}

console.log(spheres);*/

// Connect users based on their following/followers relationships
//const lineMaterial = new THREE.LineBasicMaterial({ color: "black" });
//for (let i = 0; i < users.length; i++) {
//const user = users[i];
//const following = user.following;
//console.log(following);
//for (let j = 0; j < following.length; j++) {
//const followerIndex = following[j];
//console.log(followerIndex);
//const follower = users[followerIndex];
//console.log(follower);
/*const lineGeometry = new THREE.BufferGeometry();
    const lineVertices = [
      ...spheres[i].position.toArray(),
      ...spheres[followerIndex].position.toArray(),
    ];
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(lineVertices, 3)
    );
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);*/
//}
//}

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
