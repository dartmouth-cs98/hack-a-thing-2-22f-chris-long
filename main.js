import * as THREE from 'three';

import * as POSTPROCESSING from 'postprocessing';

/*
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 } );

const torus = new THREE.Mesh( geometry, material ); 

scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0x555555)
scene.add(ambientLight)

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial( { color: 0xffffff })
    const star = new THREE.Mesh( geometry, material );

    const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));

    star.position.set(x,y,z);
    scene.add(star)
}

Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('./img/spaceGeneric.jpeg')
scene.background = spaceTexture;

const chrisTexture = new THREE.TextureLoader().load('./img/ProfilePhoto.png')

const chris = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({map: chrisTexture})
)

scene.add(chris)

const ballTexture = new THREE.TextureLoader().load('./img/basketball.jpeg');

const ball = new THREE.Mesh(
    new THREE.SphereGeometry(3,32,32),
    new THREE.MeshStandardMaterial({map: ballTexture})
)

scene.add(ball)

ball.position.z = 15;
ball.position.setX(-10);
chris.position.z = -5;
chris.position.x = 2;

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    
    ball.rotation.x += 0.05;
    ball.rotation.y += 0.075;
    ball.rotation.z += 0.05;

    chris.rotation.y += 0.01;
    chris.rotation.z += 0.01;

    camera.position.x = t * -0.002;
    camera.position.y = t * -0.002;
    camera.position.z = t * -0.01;

}

document.body.onscroll = moveCamera
moveCamera();

function animate() {
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate()
*/

let scene, camera, renderer, cloudParticles = [], flash, chris, controls, initChrisX, initChrisY;
function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
  camera.rotation.x = 1.16;
  camera.rotation.y = -0.12;
  camera.rotation.z = 0.27;

  const ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);

  const directionalLight = new THREE.DirectionalLight(0xff007f);
  directionalLight.position.set(0,0,1);
  scene.add(directionalLight);

  let orangeLight = new THREE.PointLight(0xcc6600,50,450,1.7);
  orangeLight.position.set(200,300,100);
  scene.add(orangeLight);
  
  let redLight = new THREE.PointLight(0xd8547e,50,450,1.7);
  redLight.position.set(-100,400,-100);
  scene.add(redLight);
  
  let blueLight = new THREE.PointLight(0x3677ac,50,450,1.7);
  blueLight.position.set(-100,400,-100);
  scene.add(blueLight);

  flash = new THREE.PointLight(0x062d89, 30, 500 ,1.7);
  flash.position.set(200,300,100);
  scene.add(flash);

  const chrisTexture = new THREE.TextureLoader().load('./img/ProfilePhoto.png')

  chris = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({map: chrisTexture})
  )
  
  scene.add(chris)
  chris.position.x = (window.innerWidth / window.innerHeight) * 5;
  chris.position.y = (window.innerWidth / window.innerHeight) * 10;
  initChrisX = chris.position.x;
  initChrisY = chris.position.y;
  chris.position.z = -5;

  const spaceTexture = new THREE.TextureLoader().load('./img/spaceGeneric.jpeg', function(texture){

    const textureEffect = new POSTPROCESSING.TextureEffect({
      blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
      texture: texture
    });
    textureEffect.blendMode.opacity.value = 0.2;
  })
  scene.background = spaceTexture;

  renderer = new THREE.WebGLRenderer();
  scene.fog = new THREE.FogExp2(0x03544e, 0.00002);
  renderer.setClearColor(scene.fog.color);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let loader = new THREE.TextureLoader();

  loader.load("/img/smoke.png", function(texture){

    const cloudGeo = new THREE.PlaneBufferGeometry(500,500);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true
    });

    for(let p=0; p<50; p++) {
      let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
      cloud.position.set(
        Math.random()*800 - 400,
        400,
        Math.random()*450 - 500
      );
      cloud.rotation.x = 1.16;
      cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random()*360;
      cloud.material.opacity = 0.6;
      cloudParticles.push(cloud);
      scene.add(cloud);
    }
    animate();
  });
}
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;

    chris.rotation.y += 0.02;
    chris.rotation.z += 0.02;

    chris.position.y = (0.2*-t) + initChrisY;
    chris.position.x = (0.05*-t) + initChrisX;

}

document.body.onscroll = moveCamera

const bloomEffect = new POSTPROCESSING.BloomEffect({
    blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
    kernelSize: POSTPROCESSING.KernelSize.SMALL,
    useLuminanceFilter: true,
    luminanceThreshold: 0.3,
    luminanceSmoothing: 0.75
  });
bloomEffect.blendMode.opacity.value = 1.5;

function animate() {
  cloudParticles.forEach(p => {
    p.rotation.z -=0.002;
  });

  if(Math.random() > 0.93 || flash.power > 100) {
    if(flash.power < 100) 
      flash.position.set(
        Math.random()*400,
        300 + Math.random() *200,
        100
      );
    flash.power = 50 + Math.random() * 500;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
init();
