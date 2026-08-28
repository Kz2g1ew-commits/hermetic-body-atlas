import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const parts = [
  {
    id: 'whole', number: '00', name: '전체 인체', subtitle: '사극 자석과 오드의 양극성', latin: 'CORPUS TETRAPOLARE', symbol: '☿',
    target: [0, -0.08, 0], camera: [0, 0.02, 12.4], electric: 50, magnetic: 50, neutral: 0,
    summary: '바르돈은 불 원리가 전기 유체를, 물 원리가 자기 유체를 낳으며 두 유체의 상호작용이 인체에서 사극 자석과 같은 구조를 이룬다고 설명합니다.',
    flow: '전기 유체는 능동적 팽창, 자기 유체는 수동적 수축의 성질로 설명됩니다. 오른손잡이는 몸 오른쪽이 능동·전기적이고 왼쪽이 수동·자기적이며, 왼손잡이는 반대입니다.',
    element: '사극 자석의 유비', action: '전기 1 / 자기 1'
  },
  {
    id: 'head', number: '01', name: '머리', subtitle: '앞·왼쪽·내부 전기 / 뒤·오른쪽 자기', latin: 'CAPUT', symbol: '◐',
    target: [0, 3.02, 0.08], camera: [0.1, 3.04, 3.7], electric: 60, magnetic: 40, neutral: 0,
    summary: '머리의 앞면과 왼쪽, 내부는 전기적이며 뒤통수와 오른쪽은 자기적으로 분류됩니다.',
    flow: '전기: 앞·왼쪽·내부 · 자기: 뒤·오른쪽.',
    element: '앞·뒤·좌·우·내부', action: '전기 3 / 자기 2'
  },
  {
    id: 'eyes', number: '02', name: '눈', subtitle: '앞·뒤 중성 / 양옆 전기 / 내부 자기', latin: 'OCULI', symbol: '◉',
    target: [0, 2.95, 0.32], camera: [0, 2.96, 2.7], electric: 40, magnetic: 20, neutral: 40,
    summary: '눈의 앞면과 뒷면은 중성, 오른쪽과 왼쪽 측면은 전기적, 내부는 자기적으로 분류됩니다.',
    flow: '중성: 앞·뒤 · 전기: 좌·우 측면 · 자기: 내부.',
    element: '앞·뒤·좌·우·내부', action: '전기 2 / 자기 1 / 중성 2'
  },
  {
    id: 'ears', number: '03', name: '귀', subtitle: '앞·뒤·내부 중성 / 왼쪽 전기 / 오른쪽 자기', latin: 'AURES', symbol: '◌',
    target: [.27, 2.905, -0.035], camera: [1.65, 2.92, .82], electric: 20, magnetic: 20, neutral: 60,
    summary: '귀의 앞면과 뒷면, 내부는 중성이며 왼쪽은 전기적, 오른쪽은 자기적으로 분류됩니다.',
    flow: '중성: 앞·뒤·내부 · 전기: 왼쪽 · 자기: 오른쪽.',
    element: '앞·뒤·좌·우·내부', action: '전기 1 / 자기 1 / 중성 3'
  },
  {
    id: 'mouth', number: '04', name: '입 · 혀', subtitle: '내부 자기 / 나머지 중성', latin: 'OS ET LINGUA', symbol: '◇',
    target: [0, 2.64, 0.45], camera: [0, 2.65, 2.65], electric: 0, magnetic: 20, neutral: 80,
    summary: '입과 혀의 앞면·뒷면·오른쪽·왼쪽은 중성이며 내부는 자기적으로 분류됩니다.',
    flow: '중성: 앞·뒤·오른쪽·왼쪽 · 자기: 내부.',
    element: '앞·뒤·좌·우·내부', action: '자기 1 / 중성 4'
  },
  {
    id: 'throat', number: '05', name: '목', subtitle: '왼쪽·내부 전기 / 앞·뒤·오른쪽 자기', latin: 'COLLUM', symbol: '♒',
    target: [0, 2.25, 0], camera: [0.45, 2.28, 3.2], electric: 40, magnetic: 60, neutral: 0,
    summary: '목의 앞면과 뒷면, 오른쪽은 자기적이며 왼쪽과 내부는 전기적으로 분류됩니다.',
    flow: '전기: 왼쪽·내부 · 자기: 앞·뒤·오른쪽.',
    element: '앞·뒤·좌·우·내부', action: '전기 2 / 자기 3'
  },
  {
    id: 'chest', number: '06', name: '가슴', subtitle: '앞면 전자기 / 뒤·왼쪽 전기', latin: 'PECTUS', symbol: '✦',
    target: [0, 1.65, 0.12], camera: [0.25, 1.68, 3.8], electric: 50, magnetic: 10, neutral: 40,
    summary: '가슴 앞면은 전자기적이며 뒷면과 왼쪽은 전기적, 오른쪽과 내부는 중성으로 분류됩니다.',
    flow: '전자기 혼합: 앞 · 전기: 뒤·왼쪽 · 중성: 오른쪽·내부.',
    element: '앞·뒤·좌·우·내부', action: '혼합 1 / 전기 2 / 중성 2'
  },
  {
    id: 'abdomen', number: '07', name: '배', subtitle: '앞·왼쪽 전기 / 뒤·오른쪽·내부 자기', latin: 'ABDOMEN', symbol: '☽',
    target: [0, 0.42, 0.08], camera: [0.25, 0.44, 3.65], electric: 40, magnetic: 60, neutral: 0,
    summary: '배의 앞면과 왼쪽은 전기적이며 뒷면과 오른쪽, 내부는 자기적으로 분류됩니다.',
    flow: '전기: 앞·왼쪽 · 자기: 뒤·오른쪽·내부.',
    element: '앞·뒤·좌·우·내부', action: '전기 2 / 자기 3'
  },
  {
    id: 'hands', number: '08', name: '손', subtitle: '앞·뒤·내부 중성 / 왼쪽 전기 / 오른쪽 자기', latin: 'MANUS', symbol: '✥',
    target: [0, -1.0, 0], camera: [0.2, -.96, 4.8], electric: 20, magnetic: 20, neutral: 60,
    summary: '손의 앞면과 뒷면, 내부는 중성이며 왼쪽은 전기적, 오른쪽은 자기적으로 분류됩니다.',
    flow: '중성: 앞·뒤·내부 · 전기: 왼쪽 · 자기: 오른쪽.',
    element: '앞·뒤·좌·우·내부', action: '전기 1 / 자기 1 / 중성 3'
  },
  {
    id: 'right-fingers', number: '09', name: '오른손 손가락', subtitle: '양옆 전기 / 앞·뒤·내부 중성', latin: 'DIGITI DEXTRI', symbol: '⋮',
    target: [-1.1, -1.18, 0], camera: [-1.1, -1.12, 3.8], electric: 40, magnetic: 0, neutral: 60,
    summary: '오른손 손가락의 앞면과 뒷면, 내부는 중성이며 오른쪽과 왼쪽 측면은 전기적으로 분류됩니다.',
    flow: '전기: 좌·우 측면 · 중성: 앞·뒤·내부.',
    element: '앞·뒤·좌·우·내부', action: '전기 2 / 중성 3'
  },
  {
    id: 'left-fingers', number: '10', name: '왼손 손가락', subtitle: '양옆 전기 / 앞·뒤·내부 중성', latin: 'DIGITI SINISTRI', symbol: '⋮',
    target: [1.1, -1.18, 0], camera: [1.1, -1.12, 3.8], electric: 40, magnetic: 0, neutral: 60,
    summary: '왼손 손가락의 앞면과 뒷면, 내부는 중성이며 오른쪽과 왼쪽 측면은 전기적으로 분류됩니다.',
    flow: '전기: 좌·우 측면 · 중성: 앞·뒤·내부.',
    element: '앞·뒤·좌·우·내부', action: '전기 2 / 중성 3'
  },
  {
    id: 'feet', number: '11', name: '발', subtitle: '앞·뒤·내부 중성 / 왼쪽 전기 / 오른쪽 자기', latin: 'PEDES', symbol: '▽',
    target: [0, -3.25, 0.08], camera: [0.2, -3.22, 3.65], electric: 20, magnetic: 20, neutral: 60,
    summary: '발의 앞면과 뒷면, 내부는 중성이며 왼쪽은 전기적, 오른쪽은 자기적으로 분류됩니다.',
    flow: '중성: 앞·뒤·내부 · 전기: 왼쪽 · 자기: 오른쪽.',
    element: '앞·뒤·좌·우·내부', action: '전기 1 / 자기 1 / 중성 3'
  },
  {
    id: 'male-genitals', number: '12', name: '남성 생식기', subtitle: '앞면 전기 / 내부 자기 / 나머지 중성', latin: 'GENITALIA MASCULINA', symbol: '♂',
    target: [0, -.34, .25], camera: [1.35, -.26, 2.8], electric: 20, magnetic: 20, neutral: 60,
    summary: '남성 생식기의 앞면은 전기적, 내부는 자기적이며 뒷면과 오른쪽·왼쪽은 중성으로 분류됩니다.',
    flow: '앞면의 빨간 전기 극에서 발산하여 내부의 파란 자기 극으로 수렴합니다. 중성: 뒤·오른쪽·왼쪽.',
    element: '앞·뒤·좌·우·내부', action: '전기 1 / 자기 1 / 중성 3'
  },
  {
    id: 'female-genitals', number: '13', name: '여성 생식기', subtitle: '앞면 자기 / 내부 전기 / 나머지 중성', latin: 'GENITALIA FEMININA', symbol: '♀',
    target: [0, -.34, .25], camera: [1.35, -.26, 2.8], electric: 20, magnetic: 20, neutral: 60,
    summary: '여성 생식기의 앞면은 자기적, 내부는 전기적이며 뒷면과 오른쪽·왼쪽은 중성으로 분류됩니다.',
    flow: '내부의 빨간 전기 극에서 발산하여 앞면의 파란 자기 극으로 수렴합니다. 중성: 뒤·오른쪽·왼쪽.',
    element: '앞·뒤·좌·우·내부', action: '전기 1 / 자기 1 / 중성 3'
  },
  {
    id: 'coccyx', number: '14', name: '마지막 척추 · 항문', subtitle: '내부 자기 / 나머지 중성', latin: 'VERTEBRA ULTIMA ET ANUS', symbol: '⊙',
    target: [0, -.42, -.34], camera: [0, -.36, -3.1], electric: 0, magnetic: 20, neutral: 80,
    summary: '마지막 척추와 항문의 앞면·뒷면·오른쪽·왼쪽은 중성이며 내부는 자기적으로 분류됩니다.',
    flow: '자기: 내부 · 중성: 앞·뒤·오른쪽·왼쪽.',
    element: '앞·뒤·좌·우·내부', action: '자기 1 / 중성 4'
  }
];

const canvas = document.querySelector('#scene');
const stage = document.querySelector('.stage');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x071116, 0.052);

const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
camera.position.set(0, 0.02, 12.4);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
renderer.setClearColor(0x071116, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.enablePan = false;
controls.minDistance = 2.1;
controls.maxDistance = 15;
controls.target.set(0, 0, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.42;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.72, 0.72, 0.12);
composer.addPass(bloom);

scene.add(new THREE.HemisphereLight(0xb8e9ed, 0x071116, 1.25));
const keyLight = new THREE.DirectionalLight(0xe8ddbd, 2.2);
keyLight.position.set(3, 5, 6);
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x3bbcff, 2.7);
rimLight.position.set(-4, 2, -5);
scene.add(rimLight);

const world = new THREE.Group();
scene.add(world);
const bodyGroup = new THREE.Group();
const electricGroup = new THREE.Group();
const magneticGroup = new THREE.Group();
const occultGroup = new THREE.Group();
world.add(occultGroup, magneticGroup, electricGroup, bodyGroup);
const anatomicalGroup = new THREE.Group();
world.add(anatomicalGroup);
const focusElectricLayer = new THREE.Group();
const focusMagneticLayer = new THREE.Group();
const focusNeutralLayer = new THREE.Group();
const focusElectricFilings = new THREE.Group();
const focusMagneticFilings = new THREE.Group();
const wholeElectricLayer = new THREE.Group();
const wholeMagneticLayer = new THREE.Group();
const wholeNeutralLayer = new THREE.Group();
focusElectricLayer.userData.dynamicFocus = true;
focusMagneticLayer.userData.dynamicFocus = true;
focusElectricFilings.userData.dynamicFocus = true;
focusMagneticFilings.userData.dynamicFocus = true;
wholeElectricLayer.userData.aggregateField = true;
wholeMagneticLayer.userData.aggregateField = true;
electricGroup.add(focusElectricLayer, focusElectricFilings, wholeElectricLayer);
magneticGroup.add(focusMagneticLayer, focusMagneticFilings, wholeMagneticLayer);
world.add(focusNeutralLayer, wholeNeutralLayer);

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x8cc5c1, roughness: 0.32, metalness: 0.05, transparent: true, opacity: 0.23,
  transmission: 0.35, thickness: 0.7, clearcoat: 0.2, side: THREE.DoubleSide, depthWrite: false
});
const bodyInnerMaterial = new THREE.MeshBasicMaterial({ color: 0x9cd8d0, transparent: true, opacity: 0.055, wireframe: true, depthWrite: false });
const pickables = [];

function addBodyMesh(geometry, position, scale, partId, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, bodyMaterial);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  mesh.userData.partId = partId;
  bodyGroup.add(mesh);
  pickables.push(mesh);
  const inner = new THREE.Mesh(geometry, bodyInnerMaterial);
  inner.position.copy(mesh.position);
  inner.scale.copy(mesh.scale).multiplyScalar(0.96);
  inner.rotation.copy(mesh.rotation);
  bodyGroup.add(inner);
  return mesh;
}

function capsuleBetween(a, b, radius, partId) {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const direction = end.clone().sub(start);
  const length = direction.length();
  const mesh = addBodyMesh(new THREE.CapsuleGeometry(radius, Math.max(0.05, length - radius * 2), 8, 18), [0, 0, 0], [1, 1, 1], partId);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  const inner = bodyGroup.children[bodyGroup.children.length - 1];
  inner.position.copy(mesh.position); inner.quaternion.copy(mesh.quaternion);
  return mesh;
}

// Stylised translucent anatomical figure.
addBodyMesh(new THREE.SphereGeometry(0.48, 32, 32), [0, 3.1, 0], [0.88, 1.12, 0.86], 'head');
addBodyMesh(new THREE.SphereGeometry(0.38, 24, 20), [0, 2.8, 0.02], [0.86, 0.7, 0.83], 'head');
addBodyMesh(new THREE.CylinderGeometry(0.21, 0.24, 0.52, 20), [0, 2.35, 0], [1, 1, 0.88], 'throat');
addBodyMesh(new THREE.CylinderGeometry(0.61, 0.42, 1.72, 32), [0, 1.35, 0], [1, 1, 0.62], 'chest');
addBodyMesh(new THREE.SphereGeometry(0.73, 28, 22), [0, 1.62, 0], [1.05, 0.72, 0.55], 'chest');
addBodyMesh(new THREE.SphereGeometry(0.52, 28, 20), [0, 0.35, 0], [1.08, 0.78, 0.7], 'abdomen');
addBodyMesh(new THREE.SphereGeometry(0.64, 28, 20), [0, -0.22, 0], [1.05, 0.58, 0.72], 'abdomen');

capsuleBetween([-0.66, 1.76, 0], [-0.87, 0.54, 0], 0.19, 'hands');
capsuleBetween([0.66, 1.76, 0], [0.87, 0.54, 0], 0.19, 'hands');
capsuleBetween([-0.87, 0.48, 0], [-0.98, -0.77, 0.03], 0.15, 'hands');
capsuleBetween([0.87, 0.48, 0], [0.98, -0.77, 0.03], 0.15, 'hands');
addBodyMesh(new THREE.SphereGeometry(0.21, 20, 18), [-0.99, -0.94, 0.04], [0.72, 1.25, 0.45], 'hands');
addBodyMesh(new THREE.SphereGeometry(0.21, 20, 18), [0.99, -0.94, 0.04], [0.72, 1.25, 0.45], 'hands');

capsuleBetween([-0.33, -0.51, 0], [-0.38, -1.85, 0], 0.25, 'feet');
capsuleBetween([0.33, -0.51, 0], [0.38, -1.85, 0], 0.25, 'feet');
capsuleBetween([-0.38, -1.91, 0], [-0.39, -3.16, 0.03], 0.19, 'feet');
capsuleBetween([0.38, -1.91, 0], [0.39, -3.16, 0.03], 0.19, 'feet');
addBodyMesh(new THREE.SphereGeometry(0.25, 20, 18), [-0.39, -3.45, 0.15], [0.75, 0.44, 1.42], 'feet');
addBodyMesh(new THREE.SphereGeometry(0.25, 20, 18), [0.39, -3.45, 0.15], [0.75, 0.44, 1.42], 'feet');

// A tiny procedural fallback remains available if the local MakeHuman OBJ cannot load.
const eyeMeshes = [];
function addAnatomicalEyes() {
  const scleraMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd9ffff, emissive: 0x3d9ca8, emissiveIntensity: .18, transparent: true,
    opacity: .54, roughness: .18, transmission: .32, depthWrite: false
  });
  const irisMaterial = new THREE.MeshBasicMaterial({ color: 0x39b7ff, transparent: true, opacity: .95, blending: THREE.AdditiveBlending, depthWrite: false });
  const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x071116, transparent: true, opacity: .96, depthWrite: false });
  [-.143, .143].forEach((x, index) => {
    const eye = new THREE.Group();
    eye.position.set(x, 2.95, .325);
    const globe = new THREE.Mesh(new THREE.SphereGeometry(.052, 24, 18), scleraMaterial);
    globe.scale.set(1, .76, .52); globe.userData.partId = 'eyes';
    const iris = new THREE.Mesh(new THREE.CircleGeometry(.019, 24), irisMaterial);
    iris.position.z = .029; iris.userData.partId = 'eyes';
    const pupil = new THREE.Mesh(new THREE.CircleGeometry(.007, 20), pupilMaterial);
    pupil.position.z = .031; pupil.userData.partId = 'eyes';
    const halo = new THREE.Mesh(new THREE.TorusGeometry(.068, .0035, 8, 48), new THREE.MeshBasicMaterial({ color: 0xcabe97, transparent: true, opacity: .45, depthWrite: false }));
    halo.position.z = -.005; halo.userData.partId = 'eyes';
    eye.add(globe, iris, pupil, halo);
    anatomicalGroup.add(eye);
    eyeMeshes.push(globe, iris, pupil, halo);
  });
}
let atlasSkin = null;
let atlasRegions = null;
const anatomicalPartMeshes = { eyes: [], ears: [], mouth: [] };

loadMakeHumanAnatomy().catch(error => {
  console.warn('Detailed MakeHuman model could not be loaded; procedural fallback retained.', error);
  addAnatomicalEyes();
  pickables.push(...eyeMeshes.filter(object => object.isMesh));
  document.querySelector('#loading').classList.add('done');
});

const MODEL_SCALE = .4075;
const MODEL_OFFSET = new THREE.Vector3(0, -.12, -.18);

function extractTriangles(source, predicate) {
  const position = source.getAttribute('position');
  const index = source.index;
  const output = [];
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const center = new THREE.Vector3();
  const count = index ? index.count : position.count;
  for (let i = 0; i < count; i += 3) {
    a.fromBufferAttribute(position, index ? index.getX(i) : i);
    b.fromBufferAttribute(position, index ? index.getX(i + 1) : i + 1);
    c.fromBufferAttribute(position, index ? index.getX(i + 2) : i + 2);
    center.copy(a).add(b).add(c).multiplyScalar(1 / 3);
    if (!predicate(center)) continue;
    output.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(output, 3));
  const welded = mergeVertices(geometry, 1e-4);
  welded.computeVertexNormals();
  return welded;
}

function setModelView(id, target, cameraPosition) {
  const part = parts.find(item => item.id === id);
  part.target = target;
  part.camera = cameraPosition;
}

function meshCenter(object) {
  return new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3());
}

async function loadMakeHumanAnatomy() {
  const source = await new OBJLoader().loadAsync(`${import.meta.env.BASE_URL}models/makehuman-base-cc0.obj`);
  const atlasRoot = new THREE.Group();
  atlasRoot.name = 'MakeHuman_CC0_Anatomy';
  atlasRoot.scale.setScalar(MODEL_SCALE);
  atlasRoot.position.copy(MODEL_OFFSET);
  anatomicalGroup.add(atlasRoot);
  pickables.length = 0;

  const skinSource = source.getObjectByName('body');
  const sourceSkinGeometry = skinSource.geometry.clone();
  sourceSkinGeometry.deleteAttribute('uv');
  const skinGeometry = mergeVertices(sourceSkinGeometry, 1e-4);
  skinGeometry.computeVertexNormals();
  atlasSkin = new THREE.Mesh(skinGeometry, new THREE.MeshPhysicalMaterial({
    color: 0x80c9c5, emissive: 0x102f31, emissiveIntensity: .18,
    transparent: true, opacity: .2, roughness: .38, metalness: .02,
    transmission: .12, thickness: .45, side: THREE.FrontSide, depthWrite: false
  }));
  atlasSkin.name = 'MakeHuman_Detailed_Skin';
  atlasSkin.userData.partId = 'anatomical';
  const topology = new THREE.Mesh(skinGeometry, new THREE.MeshBasicMaterial({
    color: 0x79dfdc, transparent: true, opacity: .026, wireframe: true,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  topology.name = 'MakeHuman_Skin_Topology';
  topology.raycast = () => {};
  atlasSkin.add(topology);
  atlasRoot.add(atlasSkin);
  pickables.push(atlasSkin);

  const tongueSource = source.getObjectByName('helper-tongue');
  const tongue = new THREE.Mesh(tongueSource.geometry.clone(), new THREE.MeshPhysicalMaterial({
    color: 0xbda783, emissive: 0x46391f, emissiveIntensity: .28, roughness: .48,
    transparent: true, opacity: .78, depthWrite: false, side: THREE.DoubleSide
  }));
  tongue.name = 'MakeHuman_Tongue';
  tongue.userData.partId = 'mouth';
  atlasRoot.add(tongue);
  anatomicalPartMeshes.mouth.push(tongue);
  pickables.push(tongue);

  const earMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd8c99b, emissive: 0x6c542b, emissiveIntensity: .35,
    transparent: true, opacity: .76, roughness: .36, side: THREE.DoubleSide, depthWrite: false
  });
  [-1, 1].forEach(side => {
    const earGeometry = extractTriangles(skinGeometry, center => (
      side * center.x > .71 &&
      ((side * center.x - .81) / .13) ** 2 +
      ((center.y - 7.18) / .43) ** 2 +
      ((center.z - .48) / .5) ** 2 < 1
    ));
    const ear = new THREE.Mesh(earGeometry, earMaterial.clone());
    ear.name = side > 0 ? 'MakeHuman_Left_Ear_Surface' : 'MakeHuman_Right_Ear_Surface';
    ear.userData.partId = 'ears';
    ear.userData.primaryFocus = side > 0;
    atlasRoot.add(ear);
    anatomicalPartMeshes.ears.push(ear);
    pickables.push(ear);
  });

  const scleraMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe5ffff, emissive: 0x367f8b, emissiveIntensity: .2,
    transparent: true, opacity: .84, roughness: .18, transmission: .12, depthWrite: false
  });
  const irisMaterial = new THREE.MeshBasicMaterial({ color: 0x3fbaff, transparent: true, opacity: .94, depthWrite: false });
  const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x031014, transparent: true, opacity: .98, depthWrite: false });
  ['helper-l-eye', 'helper-r-eye'].forEach(name => {
    const sourceEye = source.getObjectByName(name);
    const eye = new THREE.Mesh(sourceEye.geometry.clone(), scleraMaterial.clone());
    eye.name = name.replace('helper-', 'MakeHuman_');
    eye.userData.partId = 'eyes';
    eye.userData.permanent = true;
    atlasRoot.add(eye);
    eyeMeshes.push(eye);
    anatomicalPartMeshes.eyes.push(eye);
    pickables.push(eye);
  });
  [-.308, .308].forEach(x => {
    const iris = new THREE.Mesh(new THREE.CircleGeometry(.087, 32), irisMaterial.clone());
    iris.position.set(x, 7.284, 1.414);
    iris.userData.partId = 'eyes';
    iris.userData.permanent = true;
    const pupil = new THREE.Mesh(new THREE.CircleGeometry(.036, 24), pupilMaterial.clone());
    pupil.position.set(x, 7.284, 1.421);
    pupil.userData.partId = 'eyes';
    pupil.userData.permanent = true;
    atlasRoot.add(iris, pupil);
    eyeMeshes.push(iris, pupil);
    anatomicalPartMeshes.eyes.push(iris, pupil);
    pickables.push(iris, pupil);
  });

  bodyGroup.visible = false;
  atlasRoot.updateMatrixWorld(true);
  const earCenters = anatomicalPartMeshes.ears.map(meshCenter);
  const eyeCenters = anatomicalPartMeshes.eyes.filter(mesh => mesh.name.startsWith('MakeHuman_')).map(meshCenter);
  const tongueCenter = meshCenter(tongue);
  const primaryEarCenter = earCenters.find(center => center.x > 0);
  const eyesCenter = eyeCenters.reduce((sum, center) => sum.add(center), new THREE.Vector3()).multiplyScalar(1 / eyeCenters.length);

  setModelView('whole', [0, -.05, .25], [0, .05, 12.8]);
  setModelView('head', [0, 2.9, .22], [0, 2.92, 3.85]);
  setModelView('eyes', eyesCenter.toArray(), [eyesCenter.x, eyesCenter.y, eyesCenter.z + 2.2]);
  setModelView('ears', primaryEarCenter.toArray(), [primaryEarCenter.x + 1.27, primaryEarCenter.y + .02, primaryEarCenter.z + 1.09]);
  setModelView('mouth', tongueCenter.toArray(), [tongueCenter.x, tongueCenter.y, tongueCenter.z + 2.2]);
  setModelView('throat', [0, 2.27, .02], [.4, 2.28, 3.15]);
  setModelView('chest', [0, 1.52, .2], [.25, 1.55, 4.1]);
  setModelView('abdomen', [0, .38, .18], [.25, .4, 3.9]);
  setModelView('hands', [0, .74, .62], [0, .76, 6.25]);
  setModelView('right-fingers', [-1.94, .54, .86], [-1.94, .56, 3.35]);
  setModelView('left-fingers', [1.94, .54, .86], [1.94, .56, 3.35]);
  setModelView('feet', [0, -3.28, .48], [0, -3.23, 5.1]);
  setModelView('male-genitals', [0, -.34, .25], [1.35, -.26, 2.8]);
  setModelView('female-genitals', [0, -.34, .25], [1.35, -.26, 2.8]);
  setModelView('coccyx', [0, -.4, -.34], [0, -.36, -3.1]);

  polarityZones.eyes.centers = eyeCenters.map(center => center.toArray());
  polarityZones.ears.centers = earCenters.map(center => center.toArray());
  polarityZones.mouth.centers = [tongueCenter.toArray()];
  polarityZones.hands.centers = [[-1.76,.78,.57],[1.76,.78,.57]];
  polarityZones['right-fingers'].centers = [[-1.94,.54,.86]];
  polarityZones['left-fingers'].centers = [[1.94,.54,.86]];
  polarityZones.feet.centers = [[-.9,-3.32,.48],[.9,-3.32,.48]];
  const [rightEye, leftEye] = [...eyeCenters].sort((a, b) => a.x - b.x).map(center => center.toArray());
  polarityZones.eyes.instances = [
    { center: rightEye, e: ['right','left'], m: ['inside'], n: ['front','back'] },
    { center: leftEye, e: ['right','left'], m: ['inside'], n: ['front','back'] }
  ];
  configureEarInstances();
  polarityZones.hands.instances = [
    { center: [-1.76,.78,.57], e: ['left'], m: ['right'], n: ['front','back','inside'] },
    { center: [1.76,.78,.57], e: ['left'], m: ['right'], n: ['front','back','inside'] }
  ];
  polarityZones.feet.instances = [
    { center: [-.9,-3.32,.48], e: ['left'], m: ['right'], n: ['front','back','inside'] },
    { center: [.9,-3.32,.48], e: ['left'], m: ['right'], n: ['front','back','inside'] }
  ];
  auraNodes[3].position.set(-1.76, .78, .57);
  auraNodes[4].position.set(1.76, .78, .57);
  auraNodes[5].position.set(-.9, -3.32, .48);
  auraNodes[6].position.set(.9, -3.32, .48);

  rebuildWholeField();
  updateFocusPolarity(parts.find(part => part.id === activePart) || parts[0]);
  applyFieldScope();
  updateAnatomyFocus(activePart);
  document.querySelector('#loading').classList.add('done');
}

// Central axis and seven symbolic centres.
const axisMaterial = new THREE.MeshBasicMaterial({ color: 0xd5c89c, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false });
const axis = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 6.65, 8), axisMaterial);
axis.position.y = -0.05;
axis.userData.partId = 'whole';
bodyGroup.add(axis); pickables.push(axis);

const centres = [
  ['head', 3.12, 0xff5142, 0.095], ['throat', 2.27, 0x66baff, 0.07], ['chest', 1.28, 0xff4035, 0.115],
  ['abdomen', 0.62, 0xff6a37, 0.1], ['abdomen', -0.06, 0x43a9ff, 0.115], ['abdomen', -0.48, 0x3d7cff, 0.075], ['feet', -0.82, 0x6e74ff, 0.06]
];
centres.forEach(([partId, y, color, size]) => {
  const core = new THREE.Mesh(new THREE.SphereGeometry(size, 18, 18), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending }));
  core.position.set(0, y, 0.18); core.userData.partId = partId; bodyGroup.add(core); pickables.push(core);
});

// Delicate sacred geometry behind the figure.
const occultMat = new THREE.LineBasicMaterial({ color: 0xcabe97, transparent: true, opacity: 0.075, depthWrite: false });
function circleLine(radius, segments = 128) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, -0.6));
  }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), occultMat);
}
occultGroup.add(circleLine(3.42), circleLine(2.72));
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2;
  const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -0.6), new THREE.Vector3(Math.cos(a) * 3.42, Math.sin(a) * 3.42, -0.6)]);
  occultGroup.add(new THREE.Line(g, occultMat));
}

const redMat = new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0.66, blending: THREE.AdditiveBlending, depthWrite: false });
const redSoftMat = new THREE.MeshBasicMaterial({ color: 0xff483d, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
const blueMat = new THREE.MeshBasicMaterial({ color: 0x269dff, transparent: true, opacity: 0.66, blending: THREE.AdditiveBlending, depthWrite: false });
const blueLineMat = new THREE.LineBasicMaterial({ color: 0x249dff, transparent: true, opacity: 0.48, blending: THREE.AdditiveBlending, depthWrite: false });

const auraNodes = [];
function addElectricNode(position, radius, spikes = 12, partId = 'whole', shellOpacity = .1) {
  const group = new THREE.Group(); group.position.set(...position);
  const shell = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 18), redSoftMat.clone());
  shell.material.opacity = shellOpacity;
  group.add(shell);
  const core = new THREE.Mesh(new THREE.SphereGeometry(radius * .14, 14, 14), redMat.clone());
  group.add(core);
  for (let i = 0; i < spikes; i++) {
    const dir = new THREE.Vector3().setFromSphericalCoords(1, Math.acos(1 - 2 * ((i + .5) / spikes)), i * 2.399);
    const length = radius * (0.7 + (i % 3) * .14);
    const points = [dir.clone().multiplyScalar(radius * .2), dir.clone().multiplyScalar(length)];
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xff5145, transparent: true, opacity: .36, blending: THREE.AdditiveBlending }));
    group.add(line);
  }
  group.userData.fieldPart = partId;
  electricGroup.add(group); auraNodes.push(group);
  return group;
}
addElectricNode([0, 3.14, 0], .58, 12, 'head', 0);
addElectricNode([0, 1.28, .05], .8, 20, 'chest', .045);
addElectricNode([0, .35, .05], .52, 13, 'abdomen', .04);
addElectricNode([-.99, -.93, .05], .34, 9, 'hands', .055);
addElectricNode([.99, -.93, .05], .34, 9, 'hands', .055);
addElectricNode([-.39, -3.43, .12], .31, 8, 'feet', .04);
addElectricNode([.39, -3.43, .12], .31, 8, 'feet', .04);

const redRings = [];
function addRedRing(y, radius, tilt = 0, partId = 'whole') {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, .012, 8, 96), redMat.clone());
  mesh.position.y = y; mesh.rotation.x = Math.PI / 2; mesh.rotation.z = tilt;
  mesh.userData.fieldPart = partId;
  electricGroup.add(mesh); redRings.push(mesh);
}
addRedRing(3.38, .48, .08, 'head'); addRedRing(1.28, .82, -.1, 'chest'); addRedRing(.35, .54, .12, 'abdomen');

const fieldCurves = [];
const flowParticles = [];
function addFieldCurve(points, color = 'blue', closed = true, particleCount = 4, partId = 'whole') {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), closed, 'catmullrom', .52);
  const linePts = curve.getPoints(180);
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePts), color === 'blue' ? blueLineMat.clone() : new THREE.LineBasicMaterial({ color: 0xff4438, transparent: true, opacity: .35, blending: THREE.AdditiveBlending, depthWrite: false }));
  line.userData.fieldPart = partId;
  magneticGroup.add(line);
  fieldCurves.push({ curve, line, color });
  for (let i = 0; i < particleCount; i++) {
    const particle = new THREE.Mesh(new THREE.SphereGeometry(.026, 8, 8), color === 'blue' ? blueMat.clone() : redMat.clone());
    particle.userData.fieldPart = partId;
    magneticGroup.add(particle);
    flowParticles.push({ mesh: particle, curve, offset: i / particleCount, speed: color === 'blue' ? .035 : -.045 });
  }
}

// Long magnetic loops: outward at the head, inward through the torso, returning at the feet.
addFieldCurve([[0,3.55,-.05],[1.55,2.45,-.2],[1.82,.25,0],[1.1,-2.25,.1],[0,-3.68,.05],[-1.1,-2.25,.1],[-1.82,.25,0],[-1.55,2.45,-.2]], 'blue', true, 7, 'whole');
addFieldCurve([[0,3.42,.2],[1.08,2.3,.65],[1.22,.2,.85],[.78,-2.25,.6],[0,-3.52,.25],[-.78,-2.25,.6],[-1.22,.2,.85],[-1.08,2.3,.65]], 'blue', true, 6, 'whole');
addFieldCurve([[0,2.0,.15],[.9,1.72,.2],[1.08,1.22,0],[.88,.78,-.2],[0,.57,-.25],[-.88,.78,-.2],[-1.08,1.22,0],[-.9,1.72,.2]], 'blue', true, 5, 'chest');
addFieldCurve([[0,.45,.2],[.83,.26,.25],[.97,-.16,0],[.7,-.58,-.2],[0,-.7,-.2],[-.7,-.58,-.2],[-.97,-.16,0],[-.83,.26,.25]], 'blue', true, 4, 'abdomen');

// Double current winding along the spine.
for (let phase = 0; phase < 2; phase++) {
  const pts = [];
  for (let i = 0; i <= 42; i++) {
    const t = i / 42; const y = -2.95 + t * 5.9; const a = t * Math.PI * 8 + phase * Math.PI;
    pts.push([Math.cos(a) * .11, y, Math.sin(a) * .11]);
  }
  const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
  const material = phase ? blueLineMat.clone() : new THREE.LineBasicMaterial({ color: 0xff4538, transparent: true, opacity: .48, blending: THREE.AdditiveBlending, depthWrite: false });
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(180)), material);
  line.userData.fieldPart = 'whole';
  const group = phase ? magneticGroup : electricGroup; group.add(line);
  for (let i = 0; i < 4; i++) {
    const particle = new THREE.Mesh(new THREE.SphereGeometry(.024, 8, 8), phase ? blueMat.clone() : redMat.clone());
    particle.userData.fieldPart = 'whole';
    group.add(particle); flowParticles.push({ mesh: particle, curve, offset: i / 4, speed: phase ? -.055 : .055 });
  }
}

// Ground plane and root rings.
const ground = new THREE.Mesh(new THREE.CircleGeometry(2.3, 96), new THREE.MeshBasicMaterial({ color: 0x1f7da8, transparent: true, opacity: .035, side: THREE.DoubleSide, depthWrite: false }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -3.68; scene.add(ground);
for (let i = 0; i < 3; i++) {
  const ring = new THREE.Mesh(new THREE.RingGeometry(.65 + i * .42, .66 + i * .42, 96), new THREE.MeshBasicMaterial({ color: i % 2 ? 0x238bd0 : 0xc83c38, transparent: true, opacity: .13 - i * .025, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = -3.665; scene.add(ring);
}

// Bardon's five-way surface classification. Positions mark categories; they do not claim a physical field direction.
const polarityZones = {
  head:    { e: ['front','left','inside'], m: ['back','right'], n: [], radius: [.5,.52,.46] },
  eyes:    { e: ['left','right'], m: ['inside'], n: ['front','back'], radius: [.058,.04,.05], centers: [[-.143,2.95,.325],[.143,2.95,.325]] },
  ears:    { e: ['left'], m: ['right'], n: ['front','back','inside'], radius: [.04,.075,.05], centers: [[.27,2.905,-.034],[-.27,2.905,-.034]] },
  mouth:   { e: [], m: ['inside'], n: ['front','back','left','right'], radius: [.15,.09,.14], centers: [[0,2.64,.45]] },
  throat:  { e: ['left','inside'], m: ['front','back','right'], n: [], radius: [.25,.34,.25] },
  chest:   { e: ['front','back','left'], m: ['front'], n: ['right','inside'], radius: [.72,.64,.4], centers: [[0,1.65,.12]] },
  abdomen: { e: ['front','left'], m: ['back','right','inside'], n: [], radius: [.6,.62,.35], centers: [[0,.42,.08]] },
  hands:   { e: ['left'], m: ['right'], n: ['front','back','inside'], radius: [.18,.22,.18], centers: [[-1.08,-1,0],[1.08,-1,0]] },
  'right-fingers': { e: ['left','right'], m: [], n: ['front','back','inside'], radius: [.16,.2,.16], centers: [[-1.94,.54,.86]] },
  'left-fingers':  { e: ['left','right'], m: [], n: ['front','back','inside'], radius: [.16,.2,.16], centers: [[1.94,.54,.86]] },
  feet:    { e: ['left'], m: ['right'], n: ['front','back','inside'], radius: [.2,.18,.32], centers: [[-.3,-3.25,.08],[.3,-3.25,.08]] },
  'male-genitals':   { e: ['front'], m: ['inside'], n: ['back','left','right'], radius: [.25,.24,.22], centers: [[0,-.34,.25]] },
  'female-genitals': { e: ['inside'], m: ['front'], n: ['back','left','right'], radius: [.25,.24,.22], centers: [[0,-.34,.25]] },
  coccyx: { e: [], m: ['inside'], n: ['front','back','left','right'], radius: [.24,.24,.2], centers: [[0,-.4,-.34]] }
};
const neutralMat = new THREE.MeshBasicMaterial({ color: 0xcabe97, transparent: true, opacity: .42, depthWrite: false });
let handedness = 'right';
let flowLayout = 'aggregate';
let earInterpretation = 'surface';
const focusFilingMaterials = [];
const focusFlowParticles = [];
const wholeFilingMaterials = [];

function positionForDirection(center, radii, direction) {
  const [rx, ry, rz] = radii;
  const offset = {
    front: [0, 0, rz], back: [0, 0, -rz], left: [rx, 0, 0], right: [-rx, 0, 0], inside: [0, 0, 0]
  }[direction];
  return new THREE.Vector3(center[0] + offset[0], center[1] + offset[1], center[2] + offset[2]);
}

function makePolarityMarker(kind, direction, center, radii, scale = 1, opacityScale = 1) {
  const material = kind === 'e' ? redMat.clone() : kind === 'm' ? blueMat.clone() : neutralMat.clone();
  material.opacity = (kind === 'n' ? .35 : .92) * opacityScale;
  material.blending = THREE.NormalBlending;
  material.depthTest = kind === 'n';
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(.028, 14, 12), material);
  const haloMaterial = material.clone();
  haloMaterial.blending = THREE.AdditiveBlending;
  haloMaterial.opacity *= .78;
  const halo = new THREE.Mesh(new THREE.TorusGeometry(.052, .003, 6, 36), haloMaterial);
  group.position.copy(positionForDirection(center, radii, direction));
  if (direction === 'left' || direction === 'right') halo.rotation.y = Math.PI / 2;
  if (direction === 'inside') { core.scale.setScalar(1.15); halo.scale.setScalar(.72); }
  group.scale.setScalar(scale);
  group.add(core, halo);
  return group;
}

function zoneInstances(part, zones) {
  if (zones.instances) return zones.instances;
  return (zones.centers || [part.target]).map(center => ({
    center, e: zones.e, m: zones.m, n: zones.n
  }));
}

function configureEarInstances() {
  const earZones = polarityZones.ears;
  const [rightEar, leftEar] = [...earZones.centers].sort((a, b) => a[0] - b[0]);
  if (!rightEar || !leftEar) return;
  if (earInterpretation === 'organs') {
    earZones.instances = [
      { center: rightEar, e: [], m: ['right'], n: ['front','back','inside'] },
      { center: leftEar, e: ['left'], m: [], n: ['front','back','inside'] }
    ];
    return;
  }
  earZones.instances = [
    { center: rightEar, e: ['left'], m: ['right'], n: ['front','back','inside'] },
    { center: leftEar, e: ['left'], m: ['right'], n: ['front','back','inside'] }
  ];
}

function updateEarInterpretationCopy() {
  const ear = parts.find(part => part.id === 'ears');
  if (earInterpretation === 'organs') {
    ear.subtitle = '비교 가설 · 왼쪽 귀 전기 / 오른쪽 귀 자기';
    ear.summary = '비교 보기에서는 왼쪽 귀를 전기적, 오른쪽 귀를 자기적으로 읽고 각 귀의 외측에 대표 노드를 둡니다. 이는 원문의 방향면 분류와 구분한 해석 가설입니다.';
    ear.flow = '비교 가설: 왼쪽 귀의 빨간 대표 전기 극에서 오른쪽 귀의 파란 대표 자기 극으로 흐릅니다. 양쪽 귀의 앞·뒤·내부는 중성으로 둡니다.';
    ear.electric = 12.5; ear.magnetic = 12.5; ear.neutral = 75;
    ear.element = '좌우 귀 대표점 · 앞·뒤·내부';
    ear.action = '전기 1 / 자기 1 / 중성 6';
    return;
  }
  ear.subtitle = '앞·뒤·내부 중성 / 왼쪽 전기 / 오른쪽 자기';
  ear.summary = '귀의 앞면과 뒷면, 내부는 중성이며 왼쪽 면은 전기적, 오른쪽 면은 자기적으로 분류됩니다.';
  ear.flow = '중성: 앞·뒤·내부 · 전기: 왼쪽 면 · 자기: 오른쪽 면.';
  ear.electric = 20; ear.magnetic = 20; ear.neutral = 60;
  ear.element = '앞·뒤·좌·우·내부';
  ear.action = '전기 1 / 자기 1 / 중성 3';
}

function addInstanceMarkers(instance, radii, layers, scale = 1, opacityScale = 1) {
  instance.e.forEach(direction => layers.e.add(makePolarityMarker('e', direction, instance.center, radii, scale, opacityScale)));
  instance.m.forEach(direction => layers.m.add(makePolarityMarker('m', direction, instance.center, radii, scale, opacityScale)));
  instance.n.forEach(direction => layers.n.add(makePolarityMarker('n', direction, instance.center, radii, scale, opacityScale)));
}

function clearGeneratedGroup(group) {
  group.traverse(object => {
    if (object === group) return;
    object.geometry?.dispose();
    if (Array.isArray(object.material)) object.material.forEach(material => material.dispose());
    else object.material?.dispose();
  });
  group.clear();
}

function addFilingSegments(positions, kind) {
  if (!positions.length) return;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({
    color: kind === 'e' ? 0xff5347 : 0x35aaff,
    transparent: true, opacity: .46, blending: THREE.AdditiveBlending,
    depthWrite: false, depthTest: false
  });
  const filings = new THREE.LineSegments(geometry, material);
  (kind === 'e' ? focusElectricFilings : focusMagneticFilings).add(filings);
  focusFilingMaterials.push({ material, phase: kind === 'e' ? 0 : Math.PI });
}

function addFlowParticle(curve, kind, from, to, offset, radius) {
  const material = (kind === 'e' ? redMat : blueMat).clone();
  material.opacity = .92;
  material.depthTest = false;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(Math.max(.009, radius * .026), 9, 8), material);
  (kind === 'e' ? focusElectricFilings : focusMagneticFilings).add(mesh);
  focusFlowParticles.push({ mesh, curve, kind, from, to, offset, speed: .24 });
}

function addPoleConnection(electricPole, magneticPole, radius, seed = 0, lineCount = 12) {
  const delta = magneticPole.clone().sub(electricPole);
  const distance = delta.length();
  if (distance < .018) return;
  const axis = delta.clone().normalize();
  const reference = Math.abs(axis.y) < .82 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const basisU = new THREE.Vector3().crossVectors(axis, reference).normalize();
  const basisV = new THREE.Vector3().crossVectors(axis, basisU).normalize();
  const redSegments = [], blueSegments = [];
  for (let line = 0; line < lineCount; line++) {
    const angle = line / lineCount * Math.PI * 2 + seed * .71;
    const radial = basisU.clone().multiplyScalar(Math.cos(angle)).addScaledVector(basisV, Math.sin(angle));
    const bulge = Math.max(radius * (.52 + (line % 3) * .13), distance * .38);
    const control1 = electricPole.clone().addScaledVector(axis, distance * .2).addScaledVector(radial, bulge);
    const control2 = magneticPole.clone().addScaledVector(axis, -distance * .2).addScaledVector(radial, bulge);
    const curve = new THREE.CubicBezierCurve3(electricPole, control1, control2, magneticPole);
    const steps = 32;
    for (let step = 0; step < steps; step += 2) {
      const startT = step / steps;
      const endT = Math.min(1, (step + .78) / steps);
      const output = (startT + endT) * .5 < .5 ? redSegments : blueSegments;
      output.push(...curve.getPointAt(startT), ...curve.getPointAt(endT));
    }
    if (line % Math.max(3, Math.ceil(lineCount / 3)) === 0) {
      const offset = line / lineCount;
      addFlowParticle(curve, 'e', .015, .49, offset, radius);
      addFlowParticle(curve, 'm', .51, .985, offset, radius);
    }
  }
  addFilingSegments(redSegments, 'e');
  addFilingSegments(blueSegments, 'm');
}

function addRadialPoleFlow(pole, radius, kind) {
  const segments = [];
  const directions = 32;
  for (let i = 0; i < directions; i++) {
    const u = (i + .5) / directions;
    const phi = Math.acos(1 - 2 * u);
    const theta = i * 2.399963;
    const direction = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);
    for (let dash = 0; dash < 3; dash++) {
      const startDistance = radius * (.24 + dash * .42 + (i % 3) * .025);
      const endDistance = startDistance + radius * .16;
      segments.push(
        ...pole.clone().addScaledVector(direction, startDistance),
        ...pole.clone().addScaledVector(direction, endDistance)
      );
    }
    if (i % 8 === 0) {
      const curve = new THREE.LineCurve3(
        pole.clone().addScaledVector(direction, radius * .16),
        pole.clone().addScaledVector(direction, radius * 1.48)
      );
      addFlowParticle(curve, kind, kind === 'e' ? 0 : 1, kind === 'e' ? 1 : 0, i / directions, radius);
    }
  }
  addFilingSegments(segments, kind);
}

function centroidOf(poles) {
  return poles.reduce((centroid, pole) => centroid.add(pole), new THREE.Vector3()).multiplyScalar(1 / poles.length);
}

function addAggregatePolarFlow(electricPoles, magneticPoles, radius) {
  const electricCenter = centroidOf(electricPoles);
  const magneticCenter = centroidOf(magneticPoles);
  if (electricCenter.distanceTo(magneticCenter) >= radius * .14) {
    addPoleConnection(electricCenter, magneticCenter, radius * .9, 0, 6);
    return;
  }

  // Symmetric layouts such as each eye have coincident aggregate centers.
  // Keep one restrained fan per outer electric pole and converge on the shared magnetic center.
  electricPoles.forEach((electricPole, index) => {
    if (electricPole.distanceTo(magneticCenter) >= .018) {
      addPoleConnection(electricPole, magneticCenter, radius * .62, index, 3);
    }
  });
}

function addAlternatingNodeFlow(electricPoles, magneticPoles, radius) {
  const electricNodes = electricPoles.map((position, index) => ({ kind: 'e', position, index }));
  const magneticNodes = magneticPoles.map((position, index) => ({ kind: 'm', position, index }));
  const remaining = {
    e: [...electricNodes].sort((a, b) => a.position.x - b.position.x || a.position.z - b.position.z),
    m: [...magneticNodes].sort((a, b) => a.position.x - b.position.x || a.position.z - b.position.z)
  };
  const all = { e: electricNodes, m: magneticNodes };
  const recordedEdges = new Set();
  let edgeSeed = 0;

  function recordEdge(first, second) {
    const electric = first.kind === 'e' ? first : second;
    const magnetic = first.kind === 'm' ? first : second;
    const key = `${electric.index}:${magnetic.index}`;
    if (recordedEdges.has(key) || electric.position.distanceTo(magnetic.position) < .018) return;
    recordedEdges.add(key);
    addPoleConnection(electric.position, magnetic.position, radius * .38, edgeSeed++, 2);
  }

  function takeNearestOpposite(node, candidates) {
    let nearestIndex = -1;
    let nearestDistance = Infinity;
    candidates.forEach((candidate, index) => {
      const distance = node.position.distanceTo(candidate.position);
      if (distance >= .018 && distance < nearestDistance) {
        nearestIndex = index;
        nearestDistance = distance;
      }
    });
    return nearestIndex < 0 ? null : candidates.splice(nearestIndex, 1)[0];
  }

  let current = (remaining.e.length >= remaining.m.length ? remaining.e : remaining.m).shift();
  while (current) {
    const oppositeKind = current.kind === 'e' ? 'm' : 'e';
    const next = takeNearestOpposite(current, remaining[oppositeKind]);
    if (!next) break;
    recordEdge(current, next);
    current = next;
  }

  ['e', 'm'].forEach(kind => {
    remaining[kind].forEach(node => {
      const oppositeKind = kind === 'e' ? 'm' : 'e';
      const candidates = [...all[oppositeKind]];
      const nearest = takeNearestOpposite(node, candidates);
      if (nearest) recordEdge(node, nearest);
    });
  });
}

function rebuildFocusFilings(part) {
  clearGeneratedGroup(focusElectricFilings);
  clearGeneratedGroup(focusMagneticFilings);
  focusFilingMaterials.length = 0;
  focusFlowParticles.length = 0;
  const zones = polarityZones[part.id];
  if (!zones || part.id === 'whole') return;
  const instances = zoneInstances(part, zones);
  const radius = Math.max(...zones.radius) * (instances.length > 1 ? 1.35 : 1.15);
  if (flowLayout === 'alternating') {
    const electricPoles = instances.flatMap(instance => instance.e.map(direction => positionForDirection(instance.center, zones.radius, direction)));
    const magneticPoles = instances.flatMap(instance => instance.m.map(direction => positionForDirection(instance.center, zones.radius, direction)));
    if (electricPoles.length && magneticPoles.length) {
      addAlternatingNodeFlow(electricPoles, magneticPoles, radius);
    } else {
      if (electricPoles.length) addRadialPoleFlow(centroidOf(electricPoles), radius * .82, 'e');
      if (magneticPoles.length) addRadialPoleFlow(centroidOf(magneticPoles), radius * .82, 'm');
    }
    return;
  }
  if (part.id === 'ears' && earInterpretation === 'organs') {
    const electricPoles = instances.flatMap(instance => instance.e.map(direction => positionForDirection(instance.center, zones.radius, direction)));
    const magneticPoles = instances.flatMap(instance => instance.m.map(direction => positionForDirection(instance.center, zones.radius, direction)));
    addAggregatePolarFlow(electricPoles, magneticPoles, radius);
    return;
  }
  instances.forEach(instance => {
    const electricPoles = instance.e.map(direction => positionForDirection(instance.center, zones.radius, direction));
    const magneticPoles = instance.m.map(direction => positionForDirection(instance.center, zones.radius, direction));
    if (electricPoles.length && magneticPoles.length) {
      if (electricPoles.length === 1 && magneticPoles.length === 1) {
        addPoleConnection(electricPoles[0], magneticPoles[0], radius);
      } else {
        addAggregatePolarFlow(electricPoles, magneticPoles, radius);
      }
    } else {
      if (electricPoles.length) addRadialPoleFlow(centroidOf(electricPoles), radius * .82, 'e');
      if (magneticPoles.length) addRadialPoleFlow(centroidOf(magneticPoles), radius * .82, 'm');
    }
  });
}

function bodyWidthAt(y) {
  if (y > 2.25) return .38;
  if (y > 1.1) return .72;
  if (y > -.45) return .58;
  if (y > -2.5) return .42;
  return .34;
}

function addHandednessFilings(kind, side) {
  const positions = [];
  for (let i = 0; i < 84; i++) {
    const y = -3.25 + i / 83 * 6.4;
    const width = bodyWidthAt(y);
    const z = -.08 + Math.sin(i * 1.73) * .3;
    const x = side * (width + .08 + (i % 4) * .035);
    const slope = side * (kind === 'e' ? .07 : -.07);
    positions.push(x - slope, y - .035, z, x + slope, y + .035, z + Math.sin(i) * .018);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({
    color: kind === 'e' ? 0xff4f43 : 0x2fa7ff,
    transparent: true, opacity: .28, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const lines = new THREE.LineSegments(geometry, material);
  (kind === 'e' ? wholeElectricLayer : wholeMagneticLayer).add(lines);
  wholeFilingMaterials.push({ material, phase: kind === 'e' ? 0 : Math.PI });
}

function rebuildWholeField() {
  clearGeneratedGroup(wholeElectricLayer);
  clearGeneratedGroup(wholeMagneticLayer);
  clearGeneratedGroup(wholeNeutralLayer);
  wholeFilingMaterials.length = 0;
  parts.filter(part => part.id !== 'whole').forEach(part => {
    const zones = polarityZones[part.id];
    if (!zones) return;
    zoneInstances(part, zones).forEach(instance => {
      addInstanceMarkers(instance, zones.radius, {
        e: wholeElectricLayer, m: wholeMagneticLayer, n: wholeNeutralLayer
      }, 1, .76);
    });
  });
  const electricSide = handedness === 'right' ? -1 : 1;
  addHandednessFilings('e', electricSide);
  addHandednessFilings('m', -electricSide);
}

function updateFocusPolarity(part) {
  clearGeneratedGroup(focusElectricLayer);
  clearGeneratedGroup(focusMagneticLayer);
  clearGeneratedGroup(focusNeutralLayer);
  const zones = polarityZones[part.id];
  if (!zones) {
    rebuildFocusFilings(part);
    return;
  }
  zoneInstances(part, zones).forEach(instance => {
    const markerScale = instance.e.length + instance.m.length > 2 ? .58 : 1;
    addInstanceMarkers(instance, zones.radius, {
      e: focusElectricLayer, m: focusMagneticLayer, n: focusNeutralLayer
    }, markerScale);
  });
  rebuildFocusFilings(part);
}

let fieldScope = 'focus';
function applyFieldScope() {
  const showFocus = fieldScope === 'focus' && activePart !== 'whole';
  const showWhole = !showFocus;
  electricGroup.children.forEach(child => {
    child.visible = child === focusElectricLayer || child === focusElectricFilings
      ? showFocus
      : child === wholeElectricLayer && showWhole;
  });
  magneticGroup.children.forEach(child => {
    child.visible = child === focusMagneticLayer || child === focusMagneticFilings
      ? showFocus
      : child === wholeMagneticLayer && showWhole;
  });
  focusNeutralLayer.visible = showFocus;
  wholeNeutralLayer.visible = showWhole;
}
function updateAnatomyFocus(partId) {
  if (!atlasSkin) return;
  const focused = fieldScope === 'focus' && partId !== 'whole';
  const hasExactMesh = ['eyes', 'ears', 'mouth'].includes(partId);
  atlasSkin.material.opacity = focused ? (partId === 'mouth' ? .07 : hasExactMesh ? .15 : .12) : .2;
  const topology = atlasSkin.getObjectByName('MakeHuman_Skin_Topology') || atlasSkin.getObjectByName('Detailed_Skin_Topology');
  if (topology) topology.material.opacity = focused ? .018 : .026;
  if (atlasRegions) atlasRegions.material.opacity = focused && hasExactMesh ? .18 : .1;
  Object.entries(anatomicalPartMeshes).forEach(([region, meshes]) => meshes.forEach(mesh => {
    const isEyeSurface = mesh.userData.permanent || eyeMeshes.includes(mesh);
    const isFocusedSurface = region === partId && (region !== 'ears' || earInterpretation === 'organs' || mesh.userData.primaryFocus);
    mesh.visible = focused ? isFocusedSurface : isEyeSurface;
    if (!mesh.material) return;
    if (mesh.name === 'Tongue_FMA_54640' || mesh.name === 'MakeHuman_Tongue') mesh.material.opacity = focused && partId === 'mouth' ? .9 : .16;
    else if (!isEyeSurface) mesh.material.opacity = focused && region === partId ? .78 : .34;
  }));
}

const partList = document.querySelector('#part-list');
parts.forEach(part => {
  const button = document.createElement('button');
  button.className = `part-button${part.id === 'whole' ? ' active' : ''}`;
  button.dataset.part = part.id;
  button.innerHTML = `<span class="num">${part.number}</span><span class="name">${part.name}</span><span class="dot"></span>`;
  button.addEventListener('click', () => selectPart(part.id));
  partList.appendChild(button);
});

const ui = {
  number: document.querySelector('#detail-number'), symbol: document.querySelector('#detail-symbol'), latin: document.querySelector('#detail-latin'),
  title: document.querySelector('#detail-title'), summary: document.querySelector('#detail-summary'), flow: document.querySelector('#detail-flow'),
  electric: document.querySelector('#electric-value'), magnetic: document.querySelector('#magnetic-value'), neutral: document.querySelector('#neutral-value'),
  electricRatio: document.querySelector('#electric-ratio'), magneticRatio: document.querySelector('#magnetic-ratio'), neutralRatio: document.querySelector('#neutral-ratio'),
  element: document.querySelector('#element-value'), action: document.querySelector('#action-value'),
  glyph: document.querySelector('#flow-glyph'), focus: document.querySelector('#focus-label')
};

let activePart = 'whole';
let tween = null;
function easeInOutCubic(t) { return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }
function selectPart(id, animate = true) {
  const part = parts.find(p => p.id === id) || parts[0];
  activePart = part.id;
  const earSwitch = document.querySelector('.ear-interpretation-switch');
  const showEarInterpretation = part.id === 'ears';
  earSwitch.classList.toggle('visible', showEarInterpretation);
  earSwitch.setAttribute('aria-hidden', String(!showEarInterpretation));
  document.querySelectorAll('.part-button').forEach(b => b.classList.toggle('active', b.dataset.part === part.id));
  ui.number.textContent = part.number; ui.symbol.textContent = part.symbol; ui.latin.textContent = part.latin;
  ui.title.textContent = part.name; ui.summary.textContent = part.summary; ui.flow.textContent = part.flow;
  ui.electric.textContent = part.electric; ui.magnetic.textContent = part.magnetic; ui.neutral.textContent = part.neutral;
  ui.electricRatio.style.width = `${part.electric}%`; ui.magneticRatio.style.width = `${part.magnetic}%`; ui.neutralRatio.style.width = `${part.neutral}%`;
  ui.element.textContent = part.element; ui.action.textContent = part.action; ui.glyph.textContent = part.symbol;
  ui.focus.innerHTML = `<span class="focus-index">${part.number}</span><span><b>${part.name}</b><small>${part.subtitle}</small></span>`;
  ui.focus.classList.remove('visible'); requestAnimationFrame(() => ui.focus.classList.add('visible'));
  updateFocusPolarity(part);
  applyFieldScope();
  updateAnatomyFocus(part.id);

  const pairedEarView = part.id === 'ears' && earInterpretation === 'organs';
  const endTarget = new THREE.Vector3(...(pairedEarView ? [0, part.target[1], part.target[2]] : part.target));
  const endCamera = new THREE.Vector3(...(pairedEarView ? [0, part.target[1], part.target[2] + 3.45] : part.camera));
  if (animate) {
    controls.autoRotate = false;
    document.querySelector('#rotate-view').classList.remove('active');
    tween = { start: performance.now(), duration: 1150, fromCamera: camera.position.clone(), fromTarget: controls.target.clone(), endCamera, endTarget };
  } else {
    camera.position.copy(endCamera); controls.target.copy(endTarget);
  }
}

document.querySelectorAll('.field-button').forEach(button => button.addEventListener('click', () => {
  const isElectric = button.dataset.field === 'electric';
  const group = isElectric ? electricGroup : magneticGroup;
  group.visible = !group.visible;
  button.classList.toggle('active', group.visible);
  button.setAttribute('aria-pressed', String(group.visible));
}));
document.querySelectorAll('.scope-switch button').forEach(button => button.addEventListener('click', () => {
  fieldScope = button.dataset.scope;
  document.querySelectorAll('.scope-switch button').forEach(item => {
    const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
  });
  applyFieldScope();
  updateAnatomyFocus(activePart);
}));
function updateHandednessPresentation() {
  const rightDominant = handedness === 'right';
  const whole = parts[0];
  whole.subtitle = rightDominant
    ? '오른손잡이 · 인체 오른쪽 전기 / 왼쪽 자기'
    : '왼손잡이 · 인체 왼쪽 전기 / 오른쪽 자기';
  whole.flow = `전기 유체는 능동적 팽창, 자기 유체는 수동적 수축으로 설명됩니다. ${rightDominant ? '인체 오른쪽은 전기적이고 왼쪽은 자기적입니다.' : '인체 왼쪽은 전기적이고 오른쪽은 자기적입니다.'}`;
  document.querySelector('#polarity-left').innerHTML = `<span></span>인체 오른쪽 · ${rightDominant ? '전기' : '자기'}`;
  document.querySelector('#polarity-right').innerHTML = `인체 왼쪽 · ${rightDominant ? '자기' : '전기'}<span></span>`;
  if (activePart === 'whole') selectPart('whole', false);
}
document.querySelectorAll('.handedness-switch button').forEach(button => button.addEventListener('click', () => {
  handedness = button.dataset.handedness;
  document.querySelectorAll('.handedness-switch button').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  rebuildWholeField();
  applyFieldScope();
  updateHandednessPresentation();
}));
document.querySelectorAll('.flow-layout-switch button').forEach(button => button.addEventListener('click', () => {
  flowLayout = button.dataset.flowLayout;
  document.querySelectorAll('.flow-layout-switch button').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  updateFocusPolarity(parts.find(part => part.id === activePart) || parts[0]);
  applyFieldScope();
}));
document.querySelectorAll('.ear-interpretation-switch button').forEach(button => button.addEventListener('click', () => {
  earInterpretation = button.dataset.earInterpretation;
  document.querySelectorAll('.ear-interpretation-switch button').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  configureEarInstances();
  updateEarInterpretationCopy();
  rebuildWholeField();
  selectPart('ears', false);
  applyFieldScope();
}));

document.querySelector('#reset-view').addEventListener('click', () => selectPart('whole'));
document.querySelector('#rotate-view').addEventListener('click', (event) => {
  controls.autoRotate = !controls.autoRotate; event.currentTarget.classList.toggle('active', controls.autoRotate); tween = null;
});
document.querySelector('#help-button').addEventListener('click', () => document.querySelector('#help-dialog').showModal());
document.querySelector('#close-help').addEventListener('click', () => document.querySelector('#help-dialog').close());

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerDown = null;
canvas.addEventListener('pointerdown', e => { pointerDown = [e.clientX, e.clientY]; });
function regionFromBodyPoint(point) {
  if (Math.abs(point.x) > 1.78 && point.y > .28 && point.y < .92) return point.x < 0 ? 'right-fingers' : 'left-fingers';
  if (Math.abs(point.x) > 1.42 && point.y > .45 && point.y < 1.34) return 'hands';
  if (Math.abs(point.x) > .27 && point.y > 2.62 && point.y < 3.02 && point.z < .28) return 'ears';
  if (point.y > 2.76 && point.y < 2.96 && point.z > .27 && Math.abs(point.x) < .28) return 'eyes';
  if (point.y > 2.42 && point.y < 2.72 && point.z > .2 && Math.abs(point.x) < .32) return 'mouth';
  if (point.y > 2.45) return 'head';
  if (point.y > 2.04) return 'throat';
  if (point.y > .82) return 'chest';
  if (point.y > -.62 && point.y < .04 && point.z < -.12) return 'coccyx';
  if (point.y > -.62 && point.y < .04 && point.z > .08) return 'male-genitals';
  if (point.y > -.58) return 'abdomen';
  return 'feet';
}
canvas.addEventListener('pointerup', e => {
  if (!pointerDown || Math.hypot(e.clientX - pointerDown[0], e.clientY - pointerDown[1]) > 5) return;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(pickables, false)[0];
  if (!hit?.object.userData.partId) return;
  const partId = hit.object.userData.partId === 'anatomical' ? regionFromBodyPoint(hit.point) : hit.object.userData.partId;
  selectPart(partId);
});

function resize() {
  const width = stage.clientWidth, height = stage.clientHeight;
  camera.aspect = width / height; camera.updateProjectionMatrix();
  renderer.setSize(width, height, false); composer.setSize(width, height);
}
window.addEventListener('resize', resize); resize();

const clock = new THREE.Clock();
let elapsed = 0;
function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), .05); elapsed += dt;
  if (tween) {
    const t = Math.min(1, (now - tween.start) / tween.duration); const e = easeInOutCubic(t);
    camera.position.lerpVectors(tween.fromCamera, tween.endCamera, e); controls.target.lerpVectors(tween.fromTarget, tween.endTarget, e);
    if (t >= 1) tween = null;
  }
  controls.update();
  auraNodes.forEach((node, i) => {
    const s = 1 + Math.sin(elapsed * (1.55 + i * .08) + i) * .1;
    node.scale.setScalar(s); node.rotation.y += dt * (i % 2 ? -.18 : .18);
  });
  redRings.forEach((ring, i) => { ring.scale.setScalar(1 + Math.sin(elapsed * 1.7 + i) * .08); ring.rotation.z += dt * (.08 + i * .025); });
  flowParticles.forEach(p => {
    const t = ((elapsed * p.speed + p.offset) % 1 + 1) % 1;
    p.mesh.position.copy(p.curve.getPointAt(t));
    const pulse = .75 + Math.sin(elapsed * 5 + p.offset * 10) * .25; p.mesh.scale.setScalar(pulse);
  });
  focusFlowParticles.forEach(particle => {
    const progress = ((elapsed * particle.speed + particle.offset) % 1 + 1) % 1;
    const t = particle.from + (particle.to - particle.from) * progress;
    particle.mesh.position.copy(particle.curve.getPointAt(t));
    particle.mesh.scale.setScalar(.72 + Math.sin(elapsed * 6 + particle.offset * 12) * .22);
  });
  const polePulse = (Math.sin(elapsed * 3.1) + 1) * .5;
  focusElectricLayer.children.forEach(marker => marker.scale.setScalar(.94 + polePulse * .18));
  focusMagneticLayer.children.forEach(marker => marker.scale.setScalar(1.12 - polePulse * .16));
  focusFilingMaterials.forEach(({ material, phase }) => {
    material.opacity = .34 + Math.sin(elapsed * 2.8 + phase) * .12;
  });
  wholeFilingMaterials.forEach(({ material, phase }) => {
    material.opacity = .22 + Math.sin(elapsed * 2.1 + phase) * .08;
  });
  occultGroup.rotation.z = Math.sin(elapsed * .08) * .025;
  composer.render();
}

configureEarInstances();
updateEarInterpretationCopy();
updateHandednessPresentation();
requestAnimationFrame(animate);
