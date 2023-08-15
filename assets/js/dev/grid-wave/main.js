import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from 'three'
import * as noise from 'simplenoise'
import { scene, renderer, camera } from './init'

const HORIZONTAL_LINE_NUM = 100 // 水平ライン数
const VERTICAL_LINE_NUM = 50 // 垂直ライン数
const LINE_LENGTH = 500 //ラインの長さ
const SEGMENT_NUM = 400 //ラインの分割数

const amplitude = 200 // 振幅
const speedRadio = 1 // 速度倍率
const yOffset = 20 // Y軸のオフセット

const setCoordsZ = (index, offset, rate = 5.0) => {
  return index * rate - (offset * rate) / 2
}
const getTime = () => {
  return (Date.now() / 8000) * speedRadio
}

const horizontalLines = []
const verticalLines = []
const lineMaterial = new LineBasicMaterial({ color: 0xe3a8ff }) // マテリアル

// Horizontal Line
for (let line_i = 0; line_i < HORIZONTAL_LINE_NUM; line_i++) {
  const points = []
  const time = getTime()

  const z = setCoordsZ(line_i, HORIZONTAL_LINE_NUM)

  for (let segment_j = 0; segment_j <= SEGMENT_NUM; segment_j++) {
    const px = segment_j / (HORIZONTAL_LINE_NUM + line_i)
    const py = line_i / HORIZONTAL_LINE_NUM + time
    const x = (LINE_LENGTH / SEGMENT_NUM) * segment_j - LINE_LENGTH / 2
    const y = amplitude * noise.perlin2(px, py) * 0 + yOffset

    points.push(new Vector3(x, y, z))
  }

  const geometry = new BufferGeometry().setFromPoints(points)
  const line = new Line(geometry, lineMaterial)
  horizontalLines[line_i] = line
  scene.add(line)
}

// Vertical Line
for (let line_i = 0; line_i <= VERTICAL_LINE_NUM; line_i++) {
  const x_index = (SEGMENT_NUM / VERTICAL_LINE_NUM) * line_i
  const points = []

  for (let segment_j = 0; segment_j < HORIZONTAL_LINE_NUM; segment_j++) {
    const horizontalPoints =
      horizontalLines[segment_j].geometry.attributes.position.array
    const x = horizontalPoints[x_index * 3]
    const y = horizontalPoints[x_index * 3 + 1]
    const z = horizontalPoints[x_index * 3 + 2]

    points.push(new Vector3(x, y, z))
  }

  const geometry = new BufferGeometry().setFromPoints(points)
  const line = new Line(geometry, lineMaterial)
  verticalLines.push(line)
  scene.add(line)
}

function updateHorizontalLines() {
  for (let line_i = 0; line_i < HORIZONTAL_LINE_NUM; line_i++) {
    const line = horizontalLines[line_i]
    const points = line.geometry.attributes.position.array
    const time = getTime()

    const z = setCoordsZ(line_i, HORIZONTAL_LINE_NUM)

    for (let segment_j = 0; segment_j <= SEGMENT_NUM; segment_j++) {
      const px = segment_j / (HORIZONTAL_LINE_NUM + line_i)
      const py = line_i / HORIZONTAL_LINE_NUM + time
      const x = (LINE_LENGTH / SEGMENT_NUM) * segment_j - LINE_LENGTH / 2
      const y = amplitude * noise.perlin2(px, py) + yOffset

      points[segment_j * 3] = x
      points[segment_j * 3 + 1] = y
      points[segment_j * 3 + 2] = z
    }

    line.geometry.attributes.position.needsUpdate = true
  }
}

function updateVerticalLines() {
  for (let line_i = 0; line_i <= VERTICAL_LINE_NUM; line_i++) {
    const x_index = (SEGMENT_NUM / VERTICAL_LINE_NUM) * line_i
    const line = verticalLines[line_i]
    const points = line.geometry.attributes.position.array

    for (let segment_j = 0; segment_j < HORIZONTAL_LINE_NUM; segment_j++) {
      const horizontalPoints =
        horizontalLines[segment_j].geometry.attributes.position.array
      const x = horizontalPoints[x_index * 3]
      const y = horizontalPoints[x_index * 3 + 1]
      const z = horizontalPoints[x_index * 3 + 2]

      points[segment_j * 3] = x
      points[segment_j * 3 + 1] = y
      points[segment_j * 3 + 2] = z
    }

    line.geometry.attributes.position.needsUpdate = true
  }
}

let rot = 0
function tick() {
  rot += 0.05 * speedRadio
  const rad = (rot * Math.PI) / 180
  camera.position.x = Math.sin(rad) * 80
  camera.position.z = Math.cos(rad) * 80
  camera.lookAt(0, 0, 0)

  updateHorizontalLines()
  updateVerticalLines()

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}
tick()
