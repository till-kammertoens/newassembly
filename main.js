import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let mouseX = 0;
let mouseY = 0;
onmousemove = (event) => {
	mouseX = event.clientX / window.innerWidth;
	mouseY = event.clientY / window.innerHeight;
};

let camera, scene, renderer, controls, sitesTexture, sphere, spaceTexture;

init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20 );
	camera.position.z = 2.5;
	// scene
	scene = new THREE.Scene();

	const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
	scene.add( ambientLight );

	const pointLight = new THREE.PointLight( 0xffffff, 35 );
	pointLight.position.set( 10, 0, -2 );
	// scene.add( pointLight );
	
	const light2 = new THREE.PointLight( 0xffffff, 20 );
	light2.position.set( -1, 0, 2 );
	// scene.add( light2 );
	
	const camlight = new THREE.PointLight( 0xffffff, 10 );
	camera.add( camlight );
	
	scene.background = new THREE.Color( "#946BEF" );
	scene.add( camera );
	

	// model
	sitesTexture = new THREE.TextureLoader().load('./sites.png');
	sitesTexture.repeat.set(4,3)
	sitesTexture.wrapS = THREE.RepeatWrapping;
	sitesTexture.wrapT = THREE.RepeatWrapping;
	const geometry = new THREE.SphereGeometry(0.9, 128, 64);
	const material = new THREE.MeshStandardMaterial({
		map: sitesTexture,
		transparent: true,
	});
	sphere = new THREE.Mesh(geometry, material);
	sphere.position.x = 0;
	sphere.position.y = 0;
	sphere.rotation.z = .2;
	scene.add(sphere);

	// bg
	spaceTexture = new THREE.TextureLoader().load('./bg.jpg');
	spaceTexture.wrapS = THREE.RepeatWrapping;
	spaceTexture.wrapT = THREE.RepeatWrapping;
	spaceTexture.repeat.set(2, 2);

	scene.background = spaceTexture;
	scene.backgroundIntensity = 0.3;


	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	controls = new  OrbitControls( camera, renderer.domElement );
	camera.position.set( -0.8, 0.5, -2.2 );
	controls.enabled = false;
	controls.update();
	
	window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

const speedConst = .5;
// const speedConst = 0.1;
var offset = 0;
var spaceOffset = 0

function animate() {  
	// group.children.forEach((elem) => {
	// 	elem.rotation.x += speedConst * 0.001 * (elem.position.x + 1);
	// 	elem.rotation.y += speedConst * 0.005 * (elem.position.y + 1);
	// 	elem.rotation.z += speedConst * 0.002;
	// })

	// sphere.rotation.x += 0.001;
	// sphere.rotation.y += 0.001;
	// sphere.rotation.z += 0.0005;
	
	sitesTexture.offset.set(offset -= 0.0003, 1.3 * offset);
	spaceTexture.offset.set(spaceOffset += 0.0002, (2 * spaceOffset));

	// rotate scene w/ LERP
	const targetRotationX = ((1 - mouseY) * 0.6) - 0.1
	sphere.rotation.x = sphere.rotation.x + (targetRotationX - sphere.rotation.x) * 0.1;
	const targetRotationY = (mouseX) * 0.7 - 0.3
	sphere.rotation.y = sphere.rotation.y + (targetRotationY - sphere.rotation.y) * 0.1;
	
	// zoom scene
	// let scrollHeight = Math.max(
	// 	document.body.scrollHeight, document.documentElement.scrollHeight,
	// 	document.body.offsetHeight, document.documentElement.offsetHeight,
	// 	document.body.clientHeight, document.documentElement.clientHeight
	// );
	// let relativeScroll = window.scrollY / scrollHeight;
	// group.position.z = - relativeScroll;
	
	controls.update;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}