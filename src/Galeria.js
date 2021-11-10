import * as THREE from '../libs/three.js/r131/three.module.js'
import { OBJLoader } from '../libs/three.js/r131/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/r131/loaders/MTLLoader.js';
import { PointerLockControls } from '../libs/three.js/r131/controls/PointerLockControls.js';

let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let blocker, instructions;
let velocity, direction;
let objects = [];

let renderer = null, scene = null, camera = null, p1Group = null, p2Group = null, p3Group = null, p4Group = null, statues = [], paints = [], raycaster, controls;
let video1 = null;
let video2 = null;
let video3 = null;
let video4 = null;
let duration = 20000;
let currentTime = Date.now();
let prevTime = Date.now();

let ambientLight = null;

let dogObj = { obj: '../assets/Dog/uploads_files_2600740_ORIGAM_CHIEN_Free.obj', mtl: '../assets/Dog/uploads_files_2600740_ORIGAM_CHIEN_Free.mtl' };
let venusObj = { obj: '../assets/Venus/uploads_files_798016_venus_polygonal_statue.obj', mtl: '../assets/Venus/uploads_files_798016_venus_polygonal_statue.mtl' };
let portObj = { obj: '../assets/Portrait/uploads_files_1898405_frame.obj', mtl: '../assets/Portrait/uploads_files_1898405_frame.mtl' };
let racObj = { obj: '../assets/Racoon/uploads_files_2632923_Raccoon.obj', mtl: '../assets/Racoon/uploads_files_2632923_Raccoon.mtl' };
let cubeObj = { obj: '../assets/Cube/uploads_files_2080498_sci+fi+cube.obj', mtl: '../assets/Cube/uploads_files_2080498_sci+fi+cube.mtl' };
let manObj = { obj: '../assets/Man/uploads_files_1856997_man+pose+1.obj', mtl: '../assets/Man/uploads_files_1856997_man+pose+1.mtl' };
let twiObj = { obj: '../assets/Twisted/uploads_files_2079352_twisted+torus.obj', mtl: '../assets/Twisted/uploads_files_2079352_twisted+torus.mtl' };

const floorUrl = "../assets/piso.jpg";

function initPointerLock()
{
    blocker = document.getElementById( 'blocker' );
    instructions = document.getElementById( 'instructions' );

    controls = new PointerLockControls( camera, document.body );

    controls.addEventListener( 'lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    } );
    
    controls.addEventListener( 'unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    } );

    instructions.addEventListener( 'click', function () {
        controls.lock();
    }, false );

    scene.add( controls.getObject() );
}

function onKeyDown ( event )
{
    switch ( event.keyCode ) {

        case 38: // up
        case 87: // w
            moveForward = true;
            break;

        case 37: // left
        case 65: // a
            moveLeft = true; 
            break;

        case 40: // down
        case 83: // s
            moveBackward = true;
            break;

        case 39: // right
        case 68: // d
            moveRight = true;
            break;
    }

}

function onKeyUp( event ) {

    switch( event.keyCode ) {

        case 38: // up
        case 87: // w
            moveForward = false;
            break;

        case 37: // left
        case 65: // a
            moveLeft = false;
            break;

        case 40: // down
        case 83: // s
            moveBackward = false;
            break;

        case 39: // right
        case 68: // d
            moveRight = false;
            break;

    }
}

function main() {
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}

function playVideos(){
    video1.play();
    video2.play();
    video3.play();
    video4.play();
}

function initVideos() {
    video1 = document.getElementById('video1');
    video2 = document.getElementById('video2');
    video3 = document.getElementById('video3');
    video4 = document.getElementById('video4');
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
    requestAnimationFrame( update );
    // animate();

    if ( controls.isLocked === true ) 
    {
        let time = Date.now();
        let delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );

        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ){
            velocity.z -= direction.z * 300.0 * delta;
        } 

        if ( moveLeft || moveRight ){
            velocity.x -= direction.x * 300.0 * delta;
        }

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );
        
        prevTime = time;
    }
    // Render the scene
    renderer.render(scene, camera);

}

function createScene(canvas) {
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;

    velocity = new THREE.Vector3();
    direction = new THREE.Vector3();

    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.BasicShadowMap;
    // Create a new Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 1, 1);

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera.position.z = 30;
    camera.position.y = 30;

    let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 10, 3 );
    scene.add( light );

    ambientLight = new THREE.AmbientLight(0xfdfbd3, 0.5);
    scene.add(ambientLight);

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 15 );

    let mapFloor = new THREE.TextureLoader().load(floorUrl);
    mapFloor.wrapS = mapFloor.wrapT = THREE.RepeatWrapping;
    mapFloor.repeat.set(8, 8);

    let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, );
    let floor = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial({color:0xffffff, map:mapFloor, side:THREE.DoubleSide}));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5;
    scene.add( floor );

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
    p1Group.position.x = -2;

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
    loadObjMtl(dogObj, statues, -20, 0, 0, 0.8, 0, 0, 0, scene);
    loadObjMtl(venusObj, statues, -30, 0, 0, 0.8, 0, Math.PI, 0, scene);
    loadObjMtl(racObj, statues, 40, 0.8, 0, 0.8, 0, 0, 0, scene);
    loadObjMtl(cubeObj, statues, 120, 0, 0, 0.8, 0, 0, 0, scene);
    loadObjMtl(manObj, statues, 90, 0, 0, 0.5, 0, 0, 0, scene);
    loadObjMtl(twiObj, statues, -58, 0.8, 0, 100, 0, 0, 0, scene);

    

    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.009, 0, 0, 0, p1Group);
    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.009, 0, 0, 0, p2Group);
    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.009, 0, 0, 0, p3Group);
    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.009, 0, 0, 0, p4Group);

    initPointerLock();
}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    initVideos();
    main();
    resize(); 
    playVideos();
};

window.addEventListener('resize', resize, false);
