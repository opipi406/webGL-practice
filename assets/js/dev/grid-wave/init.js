import {
  AxesHelper,
  Color,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Scene
export const scene = new Scene()
scene.background = new Color(0xffffff)

// Renderer
export const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Camera
export const camera = new PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  1,
  1000,
)
camera.position.set(0, 120, 80)
camera.lookAt(0, 0, 0)

// Helpers
const helpers = {
  axesHelper: new AxesHelper(20),
  gridHelper: new GridHelper(80, 50, 0xaaaaaa, 0xaaaaaa),
}
// Object.values(helpers).forEach((helper) => scene.add(helper))

new OrbitControls(camera, document.body)
