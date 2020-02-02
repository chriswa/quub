import * as m4 from '~/math/m4'
import Transform from '~/math/Transform'
import * as ortho from './ortho'
import * as perspective from './perspective'

export { ortho }
export { perspective }

export const transform = new Transform()

export const viewProjectionMatrix = m4.identity()

// export function calcWorldViewProjectionMatrix(worldTransform: Transform, worldViewProjectionMatrix_OUT: m4.Mat4) {
//   const worldProjectionMatrix = worldTransform.calcMatrix()
//   m4.multiply(viewProjectionMatrix, worldProjectionMatrix, worldViewProjectionMatrix_OUT)
// }


type CameraMode = 'ortho' | 'perspective'
let cameraMode: CameraMode = 'perspective'

export function setMode(newCameraMode: CameraMode) {
  cameraMode = newCameraMode
}

export function update() {
  if (cameraMode === 'perspective') {
    perspective.calcViewProjectionMatrix(transform)
  }
  else {
    ortho.calcViewProjectionMatrix(transform)
  }
}
