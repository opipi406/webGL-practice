import {
  AxesHelper,
  BoxGeometry,
  BufferGeometry,
  CameraHelper,
  Color,
  GridHelper,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/*----------------------------------------------------
  Initialize
-----------------------------------------------------*/
const scene = new Scene()
scene.background = new Color(0xffffff)

const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  500,
)
camera.position.set(0, 30, 100)
camera.lookAt(0, 0, 0)

const helpers = {
  axesHelper: new AxesHelper(20),
  gridHelper: new GridHelper(80, 50, 0xaaaaaa, 0xaaaaaa),
  // cameraHelper: new CameraHelper(camera),
}
Object.values(helpers).forEach((helper) => scene.add(helper))

new OrbitControls(camera, document.body)

const textElement = document.getElementById('rotate-text')

let rot = 0 // 角度
let mouseX = 0 // マウス座標

// マウス座標はマウスが動いた時のみ取得できる
document.addEventListener('mousemove', (event) => {
  mouseX = event.pageX
})

tick()

// マウス座標はマウスが動いた時のみ取得できる
document.addEventListener('mousemove', (event) => {
  mouseX = event.pageX
})

const lines = []
const MAX_LINES = 50

for (let i = 0; i < MAX_LINES; i++) {
  const points = []

  const x = (i - MAX_LINES / 2) * 4

  points.push(new Vector3(x, 50, 0))
  points.push(new Vector3(x, -100, 0))

  const geometry = new BufferGeometry().setFromPoints(points)
  const material = new LineBasicMaterial({ color: 0x7300ab })
  const line = new Line(geometry, material)
  scene.add(line)
  lines.push(line)
}

function tick() {
  // camera.rotation.y += 0.001
  // camera.rotation.z += 0.001
  // camera.rotation.x += 0.001

  camera.rotation.x
  textElement.textContent = `(
    ${camera.rotation.x.toFixed(2)},
    ${camera.rotation.y.toFixed(2)},
    ${camera.rotation.z.toFixed(2)})`

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()
