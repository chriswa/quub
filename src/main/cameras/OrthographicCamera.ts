import * as m4 from '~/math/m4'
import * as v3 from '~/math/v3'
import { quub } from '~/.'
import Transform from '~/math/Transform'
import BaseCamera from './BaseCamera'

export default class OrthographicCamera extends BaseCamera {
  
  zoom = 1
  setZoom(newZoom: number) {
    this.zoom = newZoom
  }
  
  private scaleVector = v3.create(1, 1, 1)

  viewProjectionMatrix = m4.identity()

  transform: Transform = new Transform()

  // n.b. that cameraTransform's rot is ignored
  calcViewProjectionMatrix() {

    const halfCanvasWidth = quub.canvas.width / 2
    const halfCanvasHeight = quub.canvas.height / 2
  
    this.scaleVector[ 0 ] = this.scaleVector[ 1 ] = this.zoom
    m4.ortho(
      -halfCanvasWidth - 0.5,
      halfCanvasWidth - 0.5,
      halfCanvasHeight - 0.5,
      -halfCanvasHeight - 0.5,
      -1000,
      1000,
      this.viewProjectionMatrix,
    )
  
    m4.scale(this.viewProjectionMatrix, this.scaleVector, this.viewProjectionMatrix)
  
    m4.translate(this.viewProjectionMatrix, this.transform.pos, this.viewProjectionMatrix)
    
  }
  
  /*
    So if the original world -> clip space is

    tempPoint = projectionMatrix * viewMatrix * worldSpacePoint
    clipSpacePoint = tempPoint / tempPoint.w
    Then to go backward it's

    tempPoint = clipSpacePoint * tempPoint.w
    worldSpacePoint = inverse(projectMatrix * viewMatrix) * tempPoint
  */

  screenPosToWorldPos(screenPos: v3.Vec3) {
    const inverseViewProjectionMatrix = m4.inverse(this.viewProjectionMatrix)
    // const inverseViewProjectionMatrix = m4.inverse(viewProjectionMatrixWithoutTransform)
    const canvas = quub.canvas

    const clipPos = v3.clone(screenPos)
    clipPos[ 0 ] = (clipPos[ 0 ] / canvas.clientWidth * 2) - 1
    clipPos[ 1 ] = (clipPos[ 1 ] / canvas.clientHeight * -2) + 1 // because GL is 0 at bottom

    const worldPos = m4.transformDirection(inverseViewProjectionMatrix, clipPos)
    v3.subtract(worldPos, this.transform.pos, worldPos)
    return worldPos
  }

}

