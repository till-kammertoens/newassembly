// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import * as THREE from 'https://unpkg.com/three@0.156.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.156.1/examples/jsm/controls/OrbitControls.js';

let mouseX = 0;
let mouseY = 0;
onmousemove = (event) => {
	mouseX = event.clientX / window.innerWidth;
	mouseY = event.clientY / window.innerHeight;
};

let camera, scene, renderer, controls, sitesTexture, sphere, spaceTexture, particleLight;

init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20 );
	camera.position.z = 2.5;
	// scene
	scene = new THREE.Scene();

	const ambientLight = new THREE.AmbientLight( 0xffffff, .05 );
	scene.add( ambientLight );
	
	const camlight = new THREE.PointLight( 0xffffff, 10 );
	camlight.position.x = 1;
	camlight.position.y = 1;
	camera.add( camlight );
	
	// const spot = new THREE.PointLight( 0xffffff, 10 );
	// spot.position.z = 2.5;
	// spot.position.x = 1;
	// spot.position.y = 1;
	// scene.add(spot);
	
	particleLight = new THREE.Mesh(
		new THREE.SphereGeometry( 0, 8, 8 ),
		new THREE.MeshBasicMaterial( { color: 0xffffff } )
	);
	scene.add( particleLight );
	particleLight.add( new THREE.PointLight( 0xffffff, 10 ) );
	
	scene.add( camera );
	

	// model
	var ratio;
	sitesTexture = new THREE.TextureLoader().load('./sites.png');
	sitesTexture.repeat.set(2, 1.2);
	sitesTexture.wrapS = THREE.RepeatWrapping;
	sitesTexture.wrapT = THREE.RepeatWrapping;
	const geometry = new THREE.SphereGeometry(0.9, 128, 64);
	const material = new THREE.MeshStandardMaterial({
		map: sitesTexture,
		transparent: true,
		side: THREE.DoubleSide,
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
	spaceTexture.repeat.set(3, 3);

	scene.background = spaceTexture;
	scene.backgroundIntensity = 0.05;
	// scene.backgroundBlurriness = 1;


	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	controls = new OrbitControls( camera, renderer.domElement );
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

	const timer = Date.now() * 0.00025;
	particleLight.position.x = Math.sin( timer * 9 ) * 3;
	particleLight.position.y = Math.cos( timer * 7 ) * 4;
	particleLight.position.z = Math.cos( timer * 5 ) * 3;
	
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