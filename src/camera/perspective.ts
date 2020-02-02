import * as m4 from '~/math/m4'
import gfx from '~/.'
import Transform from '~/math/Transform'
import * as camera from '.'

const projectionMatrix = m4.identity()
const viewMatrix = m4.identity()
const fov = 60 * Math.PI / 180
const zNear = 0.05
const zFar = 5000

export function calcViewProjectionMatrix(transform: Transform) {

  const viewProjectionMatrix_OUT = camera.viewProjectionMatrix

  const aspect = gfx.canvas.clientWidth / gfx.canvas.clientHeight // this can change as the browser window is resized
  m4.perspective(fov, aspect, zNear, zFar, projectionMatrix)

  const cameraMatrix = transform.calcMatrix()
  m4.inverse(cameraMatrix, viewMatrix)

  m4.multiply(projectionMatrix, viewMatrix, viewProjectionMatrix_OUT)
  
}
