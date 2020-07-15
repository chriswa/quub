import * as m4 from '~/math/m4'
import * as v3 from '~/math/v3'
import Transform from '~/math/Transform'
// import { Immutable } from '~/util'

export default abstract class BaseCamera {
  abstract calcViewProjectionMatrix(): void
  transform: Transform

  readonly viewProjectionMatrix: v3.Vec3 // Immutable<v3.Vec3> // getter

  calcWorldViewProjectionMatrix(worldTransform: Transform, worldViewProjectionMatrix_OUT: m4.Mat4) {
    const worldProjectionMatrix = worldTransform.calcMatrix()
    m4.multiply(this.viewProjectionMatrix, worldProjectionMatrix, worldViewProjectionMatrix_OUT)
  }

}
