import gsap from "gsap";
import "./style.css";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from "dat.gui";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";

// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Mesh
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load("img/globe.jpg"),
      },
    },
  })
);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

// Atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);
atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);

// Stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  // color: 0xffffff,
  map: new THREE.TextureLoader().load("img/star.png"),
  transparent: true,
});
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 200;
  const y = (Math.random() - 0.5) * 200;
  const z = -Math.random() * 1000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(2, 3, 10);
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

addEventListener("resize", () => {
  // Update sizes
  sizes.width = innerWidth;
  sizes.height = innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
);
camera.position.set(0, 0, 15);
camera.setViewOffset(
  sizes.width,
  sizes.height,
  -350,
  0,
  sizes.width,
  sizes.height
);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

// Mouse
const mouse = new THREE.Vector2();

addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.2 * elapsedTime;
  gsap.to(group.rotation, {
    x: -mouse.y * 0.3,
    y: mouse.x * 0.3,
    duration: 2,
  });

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  requestAnimationFrame(tick);
};

tick();
