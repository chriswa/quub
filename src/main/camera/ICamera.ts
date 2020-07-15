import * as v3 from '~/math/v3'
import Transform from '~/math/Transform'
// import { Immutable } from '~/util'

export default interface ICamera {
  calcViewProjectionMatrix(): void
  transform: Transform
  readonly viewProjectionMatrix: v3.Vec3 // Immutable<v3.Vec3> // getter
}
