import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene();

// camera
// new THREE.PerspectiveCamera(視野角,画面サイズ,カメラの見える範囲最小値,最大値).
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
// camera.position.set(左右, 上下, 画面の奥行き);
camera.position.set(0,0,30);
camera.lookAt(new THREE.Vector3(0, 0, 0));

//renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// light
// new THREE.DirectionalLight(色, 光の強さ)
// 平行光源.
const light = new THREE.DirectionalLight(0xcccccc, 5);
light.position.set(-10,0,10); light.castShadow = true;
scene.add(light);

const cube = new THREE.Mesh(new THREE.BoxGeometry( 10, 10, 10 ), new THREE.MeshPhongMaterial({color: 0x00ff00}));
cube.position.set(10,0,-10);scene.add( cube );
cube.receiveShadow = true;

const sphere = new THREE.Mesh(new THREE.SphereGeometry( 5, 32, 16 ), new THREE.MeshPhongMaterial({color: 0xffff00}));
scene.add( sphere );
sphere.castShadow = true;

const fontLoader = new FontLoader();
  fontLoader.load("font.json", (font) => {
    const textGeometry = new TextGeometry("すりーじぇいえす\nとてもぐれいと\nですね", {
        font: font,
        size: 2,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
    })
    textGeometry.center();// 中央を原点にとる.

    const text = new THREE.Mesh(textGeometry, new THREE.MeshStandardMaterial());
    text.castShadow = true;
    text.position.z = 1;
    text.position.set(0,20,0);
    scene.add(text);
});

let counter =0;// 4.7.8 routine
function animate() {
	requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    if(counter < 240){
        sphere.scale.x += 0.005;
        sphere.scale.y += 0.005;
        sphere.scale.z += 0.005;
    }
    else if(counter < 660){
        sphere.rotation.y += 0.01;
        sphere.rotation.z += 0.01;
    }
    else if(counter < 1140){
        sphere.scale.x -= 0.0025;
        sphere.scale.y -= 0.0025;
        sphere.scale.z -= 0.0025;
    }
    else{
        if(counter>=1200){counter=-1;}
    }
    counter++;
	renderer.render( scene, camera );
}
animate();