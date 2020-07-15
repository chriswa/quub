import * as m4 from '~/math/m4'
import { quub } from '~/.'
import Transform from '~/math/Transform'
import ICamera from './ICamera'

const projectionMatrix = m4.identity()
const viewMatrix = m4.identity()
const fov = 60 * Math.PI / 180
const zNear = 0.05
const zFar = 5000

export default class PerspectiveCamera implements ICamera {

  viewProjectionMatrix = m4.identity()

  transform: Transform = new Transform()

  calcViewProjectionMatrix() {

    const aspect = quub.canvas.clientWidth / quub.canvas.clientHeight // this can change as the browser window is resized
    m4.perspective(fov, aspect, zNear, zFar, projectionMatrix)
  
    const cameraMatrix = this.transform.calcMatrix()
    m4.inverse(cameraMatrix, viewMatrix)
  
    m4.multiply(projectionMatrix, viewMatrix, this.viewProjectionMatrix)
    
  }
  
}


