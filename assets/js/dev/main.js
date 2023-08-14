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
import * as noise from 'simplenoise'

/*----------------------------------------------------
  Initialize
-----------------------------------------------------*/
const scene = new Scene()
scene.background = new Color(0xffffff)

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  1,
  500,
)
camera.position.set(0, 10, 100)
camera.lookAt(0, 0, 0)

const helpers = {
  axesHelper: new AxesHelper(20),
  gridHelper: new GridHelper(80, 50, 0xaaaaaa, 0xaaaaaa),
}
// Object.values(helpers).forEach((helper) => scene.add(helper))

new OrbitControls(camera, document.body)

const horizontalLines = []
const verticalLines = []
const lineNum = 100 // ライン数
const lineLength = 40 //ラインの長さ
const segmentNum = 300 //ラインの分割数
const lineMaterial = new LineBasicMaterial({ color: 0xe3a8ff }) // マテリアル

const amplitude = 30 // 振り幅

const calcZ = (i, lineNum, mag = 1.0) => {
  return i * mag - (lineNum * mag) / 2
}
const calcTime = () => {
  return Date.now() / 8000
}

for (let line_i = 0; line_i < lineNum; line_i++) {
  const points = []
  const time = calcTime()

  const z = calcZ(line_i, lineNum)

  for (let segment_j = 0; segment_j <= segmentNum; segment_j++) {
    const x = (lineLength / segmentNum) * segment_j - lineLength / 2
    const px = segment_j / lineNum
    const py = time
    const y = amplitude * noise.perlin2(px, py)

    const p = new Vector3(x, y, z)
    points.push(p)
  }

  const geometry = new BufferGeometry().setFromPoints(points)
  const line = new Line(geometry, lineMaterial)
  horizontalLines[line_i] = line
  scene.add(horizontalLines[line_i])
}

for (let line_i = 0; line_i <= 30; line_i++) {
  const x_index = (segmentNum / 30) * line_i
  const points = []

  for (let segment_j = 0; segment_j < lineNum; segment_j++) {
    const horizontalLine = horizontalLines[segment_j]
    const positions = horizontalLine.geometry.attributes.position.array
    const x = positions[x_index * 3]
    const y = positions[x_index * 3 + 1]
    const z = positions[x_index * 3 + 2]
    const p = new Vector3(x, y, z)
    points.push(p)
  }

  const geometry = new BufferGeometry().setFromPoints(points)
  const line = new Line(geometry, lineMaterial)
  scene.add(line)
  verticalLines.push(line)
}

function tick() {
  // camera.rotation.z += 0.001

  for (let line_i = 0; line_i < lineNum; line_i++) {
    const line = horizontalLines[line_i]
    const positions = line.geometry.attributes.position.array
    const time = calcTime()

    for (let segment_j = 0; segment_j <= segmentNum; segment_j++) {
      const x = (lineLength / segmentNum) * segment_j - lineLength / 2
      const px = segment_j / (lineNum + line_i)
      const py = line_i / lineNum + time
      const y = amplitude * noise.perlin2(px, py)
      const z = calcZ(line_i, lineNum)
      positions[segment_j * 3] = x
      positions[segment_j * 3 + 1] = y
      positions[segment_j * 3 + 2] = z
    }

    line.geometry.attributes.position.needsUpdate = true
  }

  for (let line_i = 0; line_i <= 30; line_i++) {
    const x_index = (segmentNum / 30) * line_i
    const line = verticalLines[line_i]
    const positions = line.geometry.attributes.position.array

    for (let segment_j = 0; segment_j < lineNum; segment_j++) {
      const horizontalLine = horizontalLines[segment_j]
      const horizontalPositions =
        horizontalLine.geometry.attributes.position.array
      const x = horizontalPositions[x_index * 3]
      const y = horizontalPositions[x_index * 3 + 1]
      const z = horizontalPositions[x_index * 3 + 2]
      positions[segment_j * 3] = x
      positions[segment_j * 3 + 1] = y
      positions[segment_j * 3 + 2] = z
    }

    line.geometry.attributes.position.needsUpdate = true
  }

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()
