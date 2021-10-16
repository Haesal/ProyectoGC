import * as THREE from '../libs/three.js/r131/three.module.js'
import { OrbitControls } from '../libs/three.js/r131/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three.js/r131/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/r131/loaders/MTLLoader.js';
let renderer = null, orbitControls = null, scene = null, camera = null, p1Group = null, p2Group = null, p3Group = null, p4Group = null, statues = [], paints = [];
let video1 = null;
let video2 = null;
let video3 = null;
let video4 = null;
let duration = 20000;
let currentTime = Date.now();

let ambientLight = null;

let dogObj = { obj: '../assets/Dog/uploads_files_2600740_ORIGAM_CHIEN_Free.obj', mtl: '../assets/Dog/uploads_files_2600740_ORIGAM_CHIEN_Free.mtl' };
let venusObj = { obj: '../assets/Venus/uploads_files_798016_venus_polygonal_statue.obj', mtl: '../assets/Venus/uploads_files_798016_venus_polygonal_statue.mtl' };
let portObj = { obj: '../assets/Portrait/uploads_files_1898405_frame.obj', mtl: '../assets/Portrait/uploads_files_1898405_frame.mtl' };

function main() {
    const canvas = document.getElementById("webglcanvas");
    initVideos();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createScene(canvas);
    update();
}

function initVideos() {
    video1 = document.getElementById('video1');
    video1.play();
    video2 = document.getElementById('video2');
    video2.play();
    video3 = document.getElementById('video3');
    video3.play();
    video4 = document.getElementById('video4');
    video4.play();
}

function onError(err) { console.error(err); };

function onProgress(xhr) {
    if (xhr.lengthComputable) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log(xhr.target.responseURL, Math.round(percentComplete, 2) + '% downloaded');
    }
}

async function loadObjMtl(objModelUrl, objectList, xV, yV, zV, scaleV, rxV, ryV, rzV, group) {
    try {
        const mtlLoader = new MTLLoader();

        const materials = await mtlLoader.loadAsync(objModelUrl.mtl, onProgress, onError);

        materials.preload();

        const objLoader = new OBJLoader();

        objLoader.setMaterials(materials);

        const object = await objLoader.loadAsync(objModelUrl.obj, onProgress, onError);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        object.scale.set(scaleV, scaleV, scaleV);
        object.position.x = xV;
        object.position.y = yV;
        object.position.z = zV;
        object.rotation.x = rxV;
        object.rotation.y = ryV;
        object.rotation.z = rzV;
        objectList.push(object);
        group.add(object);
    }
    catch (err) {
        onError(err);
    }
}

function animate() {
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    for (const object of statues)
        if (object)
            object.rotation.y += angle / 2;
}

function update() {
    requestAnimationFrame(function () { update(); });

    // Render the scene
    renderer.render(scene, camera);

    // Spin the cube for next frame
    animate();

    // Update the camera controller
    orbitControls.update();
}

function createScene(canvas) {
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;

    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.BasicShadowMap;
    // Create a new Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 1, 1);
    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera.position.z = 15;

    orbitControls = new OrbitControls(camera, renderer.domElement);

    const light = new THREE.PointLight(0xfdfbd3, 0.7, 1000);
    light.position.set(0, 100, 100);
    // light.castShadow = true;
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0xfdfbd3, 0.5);
    scene.add(ambientLight);

    p1Group = new THREE.Object3D;
    p2Group = new THREE.Object3D;
    p3Group = new THREE.Object3D;
    p4Group = new THREE.Object3D;

    const geometry = new THREE.PlaneGeometry(1.2, 1.8);
    // P1 
    const texture1 = new THREE.VideoTexture(video1);
    const material1 = new THREE.MeshPhongMaterial({ map: texture1, side: THREE.DoubleSide });
    const paint1 = new THREE.Mesh(geometry, material1);
    paint1.position.y = 0.8;
    p1Group.add(paint1);
    p1Group.position.x = -1.5;

    //P2
    const texture2 = new THREE.VideoTexture(video2);
    const material2 = new THREE.MeshPhongMaterial({ map: texture2, side: THREE.DoubleSide });
    const paint2 = new THREE.Mesh(geometry, material2);
    paint2.position.y = 0.8;
    p2Group.add(paint2);
    p2Group.position.x = 0;

    //P3
    const texture3 = new THREE.VideoTexture(video3);
    const material3 = new THREE.MeshPhongMaterial({ map: texture3, side: THREE.DoubleSide });
    const paint3 = new THREE.Mesh(geometry, material3);
    paint3.position.y = 0.8;
    p3Group.add(paint3);
    p3Group.position.x = 1.5;

    //P4
    const texture4 = new THREE.VideoTexture(video4);
    const material4 = new THREE.MeshPhongMaterial({ map: texture4, side: THREE.DoubleSide });
    const paint4 = new THREE.Mesh(geometry, material4);
    paint4.position.y = 0.8;
    p4Group.add(paint4);
    p4Group.position.x = 3;

    scene.add(p1Group);
    scene.add(p2Group);
    scene.add(p3Group);
    scene.add(p4Group);

    // Create the objects
    loadObjMtl(dogObj, statues, -4, 0, 0, 0.015, 0, 0, 0, scene);
    loadObjMtl(venusObj, statues, -3, 0, 0, 0.015, 0, Math.PI, 0, scene);
    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.009, 0, 0, 0, p1Group);
    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.009, 0, 0, 0, p2Group);
    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.009, 0, 0, 0, p3Group);
    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.009, 0, 0, 0, p4Group);
}

main();