import * as THREE from '../libs/three.js/r131/three.module.js'
import { OBJLoader } from '../libs/three.js/r131/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/r131/loaders/MTLLoader.js';
import { PointerLockControls } from '../libs/three.js/r131/controls/PointerLockControls.js';

let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let blocker, instructions;
let velocity, direction;
let SHADOW_MAP_WIDTH = 4096, SHADOW_MAP_HEIGHT = 4096;

let renderer = null, scene = null, camera = null, p1Group = null, p2Group = null, p3Group = null, p4Group = null, statues = [], paintsGroup = null, paints = [], walls = [], decoration = [], ceilLig = [], controls;
let video1 = null;
let video2 = null;
let video3 = null;
let video4 = null;
let prevTime = Date.now();

let ambientLight = null;
let raycaster = null,/*mouse = new THREE.Vector2()*/ clicked;

let dogObj = { obj: '../assets/Dog/uploads_files_2600740_ORIGAM_CHIEN_Free.obj', mtl: '../assets/Dog/uploads_files_2600740_ORIGAM_CHIEN_Free.mtl' };
let venusObj = { obj: '../assets/Venus/uploads_files_798016_venus_polygonal_statue.obj', mtl: '../assets/Venus/uploads_files_798016_venus_polygonal_statue.mtl' };
let portObj = { obj: '../assets/Portrait/uploads_files_1898405_frame.obj', mtl: '../assets/Portrait/uploads_files_1898405_frame.mtl' };
let racObj = { obj: '../assets/Racoon/uploads_files_2632923_Raccoon.obj', mtl: '../assets/Racoon/uploads_files_2632923_Raccoon.mtl' };
let cubeObj = { obj: '../assets/Cube/uploads_files_2080498_sci+fi+cube.obj', mtl: '../assets/Cube/uploads_files_2080498_sci+fi+cube.mtl' };
let manObj = { obj: '../assets/Man/uploads_files_1856997_man+pose+1.obj', mtl: '../assets/Man/uploads_files_1856997_man+pose+1.mtl' };
let twiObj = { obj: '../assets/Twisted/uploads_files_2079352_twisted+torus.obj', mtl: '../assets/Twisted/uploads_files_2079352_twisted+torus.mtl' };
let ligObj = { obj: '../assets/lights/AM152_063_Lugstar_Premium_LED.obj', mtl: '../assets/lights/AM152_063_Lugstar_Premium_LED.mtl' };
let traObj = { obj: '../assets/TrashCan/trash_can.obj', mtl: '../assets/TrashCan/trash_can.mtl' };
let benObj = { obj: '../assets/Bench/Burri_Maro_oRL.obj', mtl: '../assets/Bench/Burri_Maro_oRL.mtl' };

let venus = null, man = null, dog = null, racoon = null, cubeS = null, snake = null;

const floorUrl = "../assets/floor.jpg";
const doorUrl = "../assets/door.jpg";
const signUrl = "../assets/no_food_or_drink_prohibition_sign-1-1.png";

let animatorVenus = null, animatorMan = null, animatorDog = null, animatorRacoon = null, animatorCube = null, animatorSnake = null;
let duration = 10000, loopAnimation = false;


function initPointerLock() {
    blocker = document.getElementById('blocker');
    instructions = document.getElementById('instructions');

    controls = new PointerLockControls(camera, document.body);

    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });

    instructions.addEventListener('click', function () {
        controls.lock();
    }, false);

    scene.add(controls.getObject());
}

function onKeyDown(event) {
    switch (event.keyCode) {

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

function onKeyUp(event) {

    switch (event.keyCode) {

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

function initVideos() {
    video1 = document.getElementById('video1');
    video2 = document.getElementById('video2');
    video3 = document.getElementById('video3');
    video4 = document.getElementById('video4');

    video1.currentTime = 0.1;
    video2.currentTime = 0.1;
    video3.currentTime = 0.1;
    video4.currentTime = 0.1;
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

async function loadObjMtlS(objModelUrl, objectList, xV, yV, zV, scaleV, rxV, ryV, rzV, group) {
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
        group.add(object);
        group.scale.set(scaleV, scaleV, scaleV);
        group.position.x = xV;
        group.position.y = yV;
        group.position.z = zV;
        group.rotation.x = rxV;
        group.rotation.y = ryV;
        group.rotation.z = rzV;
        objectList.push(object);
    }
    catch (err) {
        onError(err);
    }
}

function update() {
    requestAnimationFrame(update);
    // animate();

    if (controls.isLocked === true) {
        let time = Date.now();
        let delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);

        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) {
            velocity.z -= direction.z * 400.0 * delta;
        }

        if (moveLeft || moveRight) {
            velocity.x -= direction.x * 400.0 * delta;
        }

        controls.moveRight(- velocity.x * delta);
        controls.moveForward(- velocity.z * delta);

        prevTime = time;
    }
    // Render the scene
    renderer.render(scene, camera);

    KF.update();
}

function galeriaCreate() {
    // lights

    let light2 = new THREE.PointLight(0xeedd82, 1, 10);
    light2.castShadow = true;
    light2.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    light2.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    light2.position.set(17.5, 4.6, 37);
    scene.add(light2);

    let light3 = new THREE.PointLight(0xeedd82, 1, 10);
    light3.castShadow = true;
    light3.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    light3.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    light3.position.set(17.5, 4.6, 28);
    scene.add(light3);

    let lightRoom1 = new THREE.PointLight(0xeedd82, 1, 30);
    lightRoom1.castShadow = true;
    lightRoom1.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    lightRoom1.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    lightRoom1.position.set(-11, 7, 7.5);
    scene.add(lightRoom1);

    let lightRoom2 = new THREE.PointLight(0xeedd82, 1, 30);
    lightRoom2.castShadow = true;
    lightRoom2.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    lightRoom2.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    lightRoom2.position.set(15, 7, 7.5);
    scene.add(lightRoom2);

    ambientLight = new THREE.AmbientLight(0xfdfbd3, 0.5);
    scene.add(ambientLight);

    // floor
    let mapFloor = new THREE.TextureLoader().load(floorUrl);
    mapFloor.wrapS = mapFloor.wrapT = THREE.RepeatWrapping;
    mapFloor.repeat.set(8, 8);

    let floorGeometry = new THREE.PlaneGeometry(50, 65, 100, 100);
    let floor = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff, map: mapFloor, side: THREE.DoubleSide }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.position.z = 10;
    floor.castShadow = false;
    floor.receiveShadow = true;
    scene.add(floor);

    // ceil  
    let ceilMaterial = new THREE.MeshPhongMaterial({ color: 0x722F37 });
    let ceilGeometry = new THREE.BoxGeometry(5, 20.2, 0.3);
    let ceil = new THREE.Mesh(ceilGeometry, ceilMaterial);
    ceil.rotation.x = -Math.PI / 2;
    ceil.position.y = 5.14;
    ceil.position.z = 32.5;
    ceil.position.x = 17.5;
    ceil.castShadow = true;
    ceil.receiveShadow = true;
    scene.add(ceil);

    ceilGeometry = new THREE.BoxGeometry(38, 30.2, 0.3);
    let ceil2 = new THREE.Mesh(ceilGeometry, ceilMaterial);
    ceil2.rotation.x = -Math.PI / 2;
    ceil2.position.y = 8;
    ceil2.position.z = 7.5;
    ceil2.position.x = 2.35;
    ceil2.castShadow = true;
    ceil2.receiveShadow = true;
    scene.add(ceil2);

    // Walls
    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x722F37 });
    let wallGeometry = new THREE.BoxGeometry(0.3, 10, 20);
    let wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.z = 32.5;
    wall1.position.x = 20;
    wall1.castShadow = true;
    wall1.receiveShadow = true;
    walls.push(wall1);
    scene.add(wall1);

    wallGeometry = new THREE.BoxGeometry(0.3, 10, 20);
    let wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.position.z = 32.5;
    wall2.position.x = 15;
    wall2.castShadow = true;
    wall2.receiveShadow = true;
    walls.push(wall2);
    scene.add(wall2);

    wallGeometry = new THREE.BoxGeometry(5.3, 10, 0.3);
    let wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall3.position.z = 42.5;
    wall3.position.x = 17.5;
    wall3.castShadow = true;
    wall3.receiveShadow = true;
    walls.push(wall3);
    scene.add(wall3);

    wallGeometry = new THREE.BoxGeometry(3, 16, 0.3);
    let wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall4.position.z = 22.5;
    wall4.position.x = 20;
    wall4.castShadow = true;
    wall4.receiveShadow = true;
    walls.push(wall4);
    scene.add(wall4);

    wallGeometry = new THREE.BoxGeometry(5.3, 5, 0.3);
    let wall5 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall5.position.z = 22.5;
    wall5.position.x = 17.5;
    wall5.position.y = 6.3;
    wall5.castShadow = true;
    wall5.receiveShadow = true;
    walls.push(wall5);
    scene.add(wall5);

    wallGeometry = new THREE.BoxGeometry(33, 16, 0.3);
    let wall6 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall6.position.z = 22.5;
    wall6.position.x = 0;
    wall6.castShadow = true;
    wall6.receiveShadow = true;
    walls.push(wall6);
    scene.add(wall6);

    wallGeometry = new THREE.BoxGeometry(0.3, 16, 30);
    let wall7 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall7.position.z = 7.5;
    wall7.position.x = - 16.5;
    wall7.castShadow = true;
    wall7.receiveShadow = true;
    walls.push(wall7);
    scene.add(wall7);

    wallGeometry = new THREE.BoxGeometry(0.3, 16, 30);
    let wall8 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall8.position.z = 7.5;
    wall8.position.x = 21.5;
    wall8.castShadow = true;
    wall8.receiveShadow = true;
    walls.push(wall8);
    scene.add(wall8);

    wallGeometry = new THREE.BoxGeometry(38, 16, 0.3);
    let wall9 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall9.position.z = -7.5;
    wall9.position.x = 2.5;
    wall9.castShadow = true;
    wall9.receiveShadow = true;
    walls.push(wall9);
    scene.add(wall9);

    // Fake door
    let mapDoor = new THREE.TextureLoader().load(doorUrl);

    let doorGeometry = new THREE.PlaneGeometry(2, 4);
    let door = new THREE.Mesh(doorGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff, map: mapDoor, side: THREE.DoubleSide }));
    door.position.y = 2;
    door.position.z = 42.34;
    door.position.x = 17.5;
    door.castShadow = false;
    door.receiveShadow = true;
    scene.add(door);

    // sign
    let mapSign = new THREE.TextureLoader().load(signUrl);

    let signGeometry = new THREE.PlaneGeometry(0.5, 0.8);
    let sign = new THREE.Mesh(signGeometry, new THREE.MeshPhongMaterial({ color: 0xffffff, map: mapSign, side: THREE.DoubleSide }));
    sign.position.y = 2.5;
    sign.position.z = 22.7;
    sign.position.x = 19.2;
    sign.castShadow = false;
    sign.receiveShadow = true;
    scene.add(sign);

    // pinturas y estatuas
    p1Group = new THREE.Object3D;
    p2Group = new THREE.Object3D;
    p3Group = new THREE.Object3D;
    p4Group = new THREE.Object3D;
    paintsGroup = new THREE.Object3D;
    paintsGroup.add(p1Group);
    paintsGroup.add(p2Group);
    paintsGroup.add(p3Group);
    paintsGroup.add(p4Group);

    const geometry = new THREE.PlaneGeometry(1.8, 2.5);
    // P1 
    const texture1 = new THREE.VideoTexture(video1);
    const material1 = new THREE.MeshPhongMaterial({ map: texture1, side: THREE.DoubleSide });
    const paint1 = new THREE.Mesh(geometry, material1);
    paint1.position.y = 0.8;
    paint1.receiveShadow = true;
    p1Group.add(paint1);
    p1Group.position.x = 21.3;
    p1Group.position.y = 2.5;
    p1Group.position.z = -2;
    p1Group.rotation.y = -Math.PI / 2;


    //P2
    const texture2 = new THREE.VideoTexture(video2);
    const material2 = new THREE.MeshPhongMaterial({ map: texture2, side: THREE.DoubleSide });
    const paint2 = new THREE.Mesh(geometry, material2);
    paint2.position.y = 0.8;
    paint2.receiveShadow = true;
    p2Group.add(paint2);
    p2Group.position.x = 21.3;
    p2Group.position.y = 2.5;
    p2Group.position.z = 16;
    p2Group.rotation.y = -Math.PI / 2;

    //P3
    const texture3 = new THREE.VideoTexture(video3);
    const material3 = new THREE.MeshPhongMaterial({ map: texture3, side: THREE.DoubleSide });
    const paint3 = new THREE.Mesh(geometry, material3);
    paint3.position.y = 0.8;
    paint3.receiveShadow = true;
    p3Group.add(paint3);
    p3Group.position.x = -16.23;
    p3Group.position.y = 2.5;
    p3Group.position.z = -2;
    p3Group.rotation.y = Math.PI / 2;

    //P4
    const texture4 = new THREE.VideoTexture(video4);
    const material4 = new THREE.MeshPhongMaterial({ map: texture4, side: THREE.DoubleSide });
    const paint4 = new THREE.Mesh(geometry, material4);
    paint4.position.y = 0.8;
    paint4.receiveShadow = true;
    p4Group.add(paint4);
    p4Group.position.x = -16.23;
    p4Group.position.y = 2.5;
    p4Group.position.z = 16;
    p4Group.rotation.y = Math.PI / 2;

    scene.add(p1Group);
    scene.add(p2Group);
    scene.add(p3Group);
    scene.add(p4Group);

    // Plataforma
    createPlataforma(8, 2);
    createPlataforma(8, 20);
    createPlataforma(8, -15);
    createPlataforma(-6, 20);
    createPlataforma(-6, -15);
    createPlataforma(21, -15);


    venus = new THREE.Object3D;
    man = new THREE.Object3D;
    dog = new THREE.Object3D;
    racoon = new THREE.Object3D;
    cubeS = new THREE.Object3D;
    snake = new THREE.Object3D;


    scene.add(venus);
    scene.add(man);
    scene.add(dog);
    scene.add(racoon);
    scene.add(cubeS);
    scene.add(snake);


    // Create the objects
    loadObjMtlS(dogObj, statues, 20, 1.5, 8, 0.02, 0, -Math.PI / 2, 0, dog);
    loadObjMtlS(manObj, statues, -14.7, 1.5, 8.3, 0.015, 0, Math.PI / 2, 0, man);
    loadObjMtlS(venusObj, statues, 2, 1.5, 8, 0.05, 0, Math.PI, 0, venus);

    loadObjMtlS(racObj, statues, 20, 2.3, -6, 0.25, 0, -Math.PI / 4, 0, racoon);
    loadObjMtlS(cubeObj, statues, -15, 1.5, -6, 0.5, 0, 0, 0, cubeS);
    loadObjMtlS(twiObj, statues, -15, 2.3, 21, 10, 0, 0, 0, snake);

    loadObjMtl(traObj, decoration, 19.3, 0, 23, 1.3, 0, 0, 0, scene);
    loadObjMtl(benObj, decoration, 2, 0, 21.5, 0.03, -Math.PI / 2, 0, 0, scene);
    loadObjMtl(benObj, decoration, 2, 0, -6.5, 0.03, -Math.PI / 2, 0, 0, scene);


    loadObjMtl(ligObj, ceilLig, 17.5, 4.9, 37, 0.020, 0, 0, 0, scene);
    loadObjMtl(ligObj, ceilLig, 17.5, 4.9, 28, 0.020, 0, 0, 0, scene);
    loadObjMtl(ligObj, ceilLig, -11, 7.8, 7.5, 0.020, 0, 0, 0, scene);
    loadObjMtl(ligObj, ceilLig, 15, 7.8, 7.5, 0.020, 0, 0, 0, scene);

    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.015, 0, 0, 0, p1Group);
    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.015, 0, 0, 0, p2Group);
    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.015, 0, 0, 0, p3Group);
    loadObjMtl(portObj, paints, 0, 0.8, 0, 0.015, 0, 0, 0, p4Group);

}

function createPlataforma(z, x) {
    const plataformaMaterial = new THREE.MeshPhongMaterial({ color: 0x722F37 });
    let plataformaGeometry = new THREE.BoxGeometry(2.5, 3, 2.5);
    let plataforma = new THREE.Mesh(plataformaGeometry, plataformaMaterial);
    plataforma.position.z = z;
    plataforma.position.x = x;
    plataforma.castShadow = true;
    plataforma.receiveShadow = true;
    walls.push(plataforma);
    scene.add(plataforma);
}

function createScene(canvas) {
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    velocity = new THREE.Vector3();
    direction = new THREE.Vector3();

    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.BasicShadowMap;
    // Create a new Three.js scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 1, 1);

    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera.position.z = 40;
    camera.position.x = 17.5;
    camera.position.y = 2;
    camera.rotation.y = Math.PI / 8;

    raycaster = new THREE.Raycaster();

    galeriaCreate();

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    document.addEventListener('pointerdown', onDocumentPointerDown);

    initPointerLock();
}

function onDocumentPointerDown(event) {
    event.preventDefault();
    raycaster.setFromCamera(new THREE.Vector2(), camera);
    intersectionDownController(p1Group, () => {
        video1.play();
    });
    intersectionDownController(p2Group, () => {
        video2.play();
    });
    intersectionDownController(p3Group, () => {
        video3.play();
    });
    intersectionDownController(p4Group, () => {
        video4.play();
    });
    intersectionDownControllerObj(venus, () => {
        initAnimationsVenus();
        animatorVenus.start();
    });
    intersectionDownControllerObj(dog, () => {
        initAnimationsDog();
        animatorDog.start();
    });
    intersectionDownControllerObj(man, () => {
        initAnimationsMan();
        animatorMan.start();
    });
    intersectionDownControllerObj(racoon, () => {
        initAnimationsRacoon();
        animatorRacoon.start();
    });
    intersectionDownControllerObj(cubeS, () => {
        initAnimationsCube();
        animatorCube.start();
    });
    intersectionDownControllerObj(snake, () => {
        initAnimationsSnake();
        animatorSnake.start();
    });
}

function initAnimationsVenus() {
    animatorVenus = new KF.KeyFrameAnimator;
    animatorVenus.init({
        interps:
            [
                {
                    keys: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
                    values: [
                        { y: 1.5, x: 2 },
                        { y: -1.5, x: 2 },
                        { y: -3, x: 2 },
                        { y: -5, x: 2 },
                        { y: -3, x: 2 },
                        { y: -1.5, x: 2 },
                        { y: 1.5, x: 2 }
                    ],
                    target: venus.position
                },
                {
                    keys: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
                    values: [
                        { y: Math.PI },
                        { y: Math.PI * 1.2 },
                        { y: Math.PI * 1.4 },
                        { y: Math.PI * 2 },
                        { y: Math.PI * 1.4 },
                        { y: Math.PI * 1.2 },
                        { y: Math.PI },
                    ],
                    target: venus.rotation
                },
            ],
        loop: loopAnimation,
        duration: duration/2,
    });
    venus.traverse(function (child) {
        if (child.isMesh) {
            animatorVenus.init({
                interps:
                    [
                        {
                            keys: [0, 0.2, 0.4, 0.6, 0.8, 1],
                            values: [
                                {r: 1,g: 1,b:1},
                                {r: 1,g: 0,b:0},
                                {r: 0,g: 0,b:0},
                                {r: 0.4,g: 1,b:0.4},
                                {r: 0,g: 0,b:1},
                                {r: 1,g: 1,b:1},
                            ],
                            target: child.material.color
                        },
                    ],
                loop: loopAnimation,
                duration: duration/2,
            });
        }
    });
}

function initAnimationsDog() {
    animatorDog = new KF.KeyFrameAnimator;
    animatorDog.init({
        interps:
            [
                {
                    keys: [0, 0.3, 0.7 , 1],
                    values: [
                        { z: 8 },
                        { z: 8.3 },
                        { z: 7.7 },
                        { z: 8 },
                    ],
                    target: dog.position
                },
            ],
        loop: loopAnimation,
        duration: duration/2,
    });
    dog.traverse(function (child) {
        if (child.isMesh) {
            animatorDog.init({
                interps:
                    [
                        {
                            keys: [0, 0.2, 0.4, 0.6, 0.8, 1],
                            values: [
                                {r: 1,g: 1,b:1},
                                {r: 1,g: 0,b:0},
                                {r: 0,g: 0,b:0},
                                {r: 0.4,g: 1,b:0.4},
                                {r: 0,g: 0,b:1},
                                {r: 1,g: 1,b:1},
                            ],
                            target: child.material.color
                        },
                    ],
                loop: loopAnimation,
                duration: duration/2,
            });
        }
    });
}

function initAnimationsMan() {
    animatorMan = new KF.KeyFrameAnimator;
    animatorMan.init({
        interps:
            [
                {
                    keys: [0, 0.2,0.4,0.6, 0.8 , 1],
                    values: [
                        {x:-14.7 ,y: 1.5 ,z: 8.3},
                        {x:0 ,y: 4 ,z: 0 },
                        {x:10 ,y: 4.5 ,z: -4 },
                        {x:0 ,y: 4.5 ,z: 7},
                        {x:-11 ,y: 4 ,z: 15},
                        {x:-14.7 ,y: 1.5 ,z: 8.3},
                    ],
                    target: man.position
                },
            ],
        loop: loopAnimation,
        duration: duration,
    });
    man.traverse(function (child) {
        if (child.isMesh) {
            animatorMan.init({
                interps:
                    [
                        {
                            keys: [0, 0.2, 0.4, 0.6, 0.8, 1],
                            values: [
                                {r: 1,g: 1,b:1},
                                {r: 1,g: 0,b:0},
                                {r: 0,g: 0,b:0},
                                {r: 0.4,g: 1,b:0.4},
                                {r: 0,g: 0,b:1},
                                {r: 1,g: 1,b:1},
                            ],
                            target: child.material.color
                        },
                    ],
                loop: loopAnimation,
                duration: duration,
            });
        }
    });
}

function initAnimationsRacoon() {
    animatorRacoon = new KF.KeyFrameAnimator;
    animatorRacoon.init({
        interps:
            [
                {
                    keys: [0, 0.2,0.4,0.6, 0.8 , 1],
                    values: [
                        {x:0.25 ,y: 0.25 ,z: 0.25},
                        {x:0.40 ,y: 0.25  ,z: 0.40 },
                        {x:0.50 ,y: 0.25  ,z: 0.50 },
                        {x:0.40 ,y: 0.25  ,z: 0.40},
                        {x:0.30 ,y: 0.25  ,z: 0.30},
                        {x:0.25 ,y: 0.25 ,z: 0.25},
                    ],
                    target: racoon.scale
                },
            ],
        loop: loopAnimation,
        duration: duration,
    });
    racoon.traverse(function (child) {
        if (child.isMesh) {
            animatorRacoon.init({
                interps:
                    [
                        {
                            keys: [0, 0.2, 0.4, 0.6, 0.8, 1],
                            values: [
                                {r: 1,g: 1,b:1},
                                {r: 1,g: 0,b:0},
                                {r: 0,g: 0,b:0},
                                {r: 0.4,g: 1,b:0.4},
                                {r: 0,g: 0,b:1},
                                {r: 1,g: 1,b:1},
                            ],
                            target: child.material.color
                        },
                    ],
                loop: loopAnimation,
                duration: duration,
            });
        }
    });
}

function initAnimationsCube() {
    animatorCube = new KF.KeyFrameAnimator;
    animatorCube.init({
        interps:
            [
                {
                    keys: [0, 0.5, 1],
                    values: [
                        {x:0.5 ,y: 0.5 ,z: 0.5},
                        {x:0.2 ,y: 0.2  ,z: 0.2 },
                        {x:0.5 ,y: 0.5 ,z: 0.5 }
                    ],
                    target: cubeS.scale
                },
                {
                    keys: [0, 0.5, 1],
                    values: [
                        {y: 0},
                        {y: Math.PI},
                        {y: Math.PI*2},
                    ],
                    target: cubeS.rotation
                },
            ],
        loop: loopAnimation,
        duration: duration,
    });
    cubeS.traverse(function (child) {
        if (child.isMesh) {
            animatorCube.init({
                interps:
                    [
                        {
                            keys: [0, 0.2, 0.4, 0.6, 0.8, 1],
                            values: [
                                {r: 1,g: 1,b:1},
                                {r: 1,g: 0,b:0},
                                {r: 0,g: 0,b:0},
                                {r: 0.4,g: 1,b:0.4},
                                {r: 0,g: 0,b:1},
                                {r: 1,g: 1,b:1},
                            ],
                            target: child.material.color
                        },
                    ],
                loop: loopAnimation,
                duration: duration,
            });
        }
    });
}

function initAnimationsSnake() {
    animatorSnake = new KF.KeyFrameAnimator;
    animatorSnake.init({
        interps:
            [
                {
                    keys: [0, 0.5, 1],
                    values: [
                        {x:10 ,y: 10 ,z: 10},
                        {x:18 ,y: 18  ,z: 18 },
                        {x:10 ,y: 10 ,z: 10 }
                    ],
                    target: snake.scale
                },
                {
                    keys: [0, 0.5, 1],
                    values: [
                        {y: 0},
                        {y: Math.PI},
                        {y: Math.PI*2},
                    ],
                    target: snake.rotation
                },
            ],
        loop: loopAnimation,
        duration: duration,
    });
    snake.traverse(function (child) {
        if (child.isMesh) {
            animatorSnake.init({
                interps:
                    [
                        {
                            keys: [0, 0.2, 0.4, 0.6, 0.8, 1],
                            values: [
                                {r: 1,g: 1,b:1},
                                {r: 1,g: 0,b:0},
                                {r: 0,g: 0,b:0},
                                {r: 0.4,g: 1,b:0.4},
                                {r: 0,g: 0,b:1},
                                {r: 1,g: 1,b:1},
                            ],
                            target: child.material.color
                        },
                    ],
                loop: loopAnimation,
                duration: duration,
            });
        }
    });
}


function intersectionDownController(grupo, accion) {
    let intersects = raycaster.intersectObjects(grupo.children);

    if (intersects.length > 0) {
        clicked = intersects[0].object;
        if (camera.position.distanceTo(grupo.position) < 12) {
            accion();
        }
    }
    else {
        if (clicked)
            clicked = null;
    }
}

function intersectionDownControllerObj(grupo, accion) {
    let intersects = raycaster.intersectObjects(grupo.children, true);

    if (intersects.length > 0) {
        clicked = intersects[0].object;
        if (camera.position.distanceTo(grupo.position) < 15) {
            accion();
        }
    }
    else {
        if (clicked)
            clicked = null;
    }
}

function resize() {
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
};

window.addEventListener('resize', resize, false);
