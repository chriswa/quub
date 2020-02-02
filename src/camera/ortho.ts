import * as m4 from '~/math/m4'
import * as v3 from '~/math/v3'
import gfx from '~/.'
import Transform from '~/math/Transform'
import * as camera from '.'

let zoom = 1

export function setZoom(newZoom: number) {
  zoom = newZoom
}

const scaleVector = v3.create(1, 1, 1)

export function calcViewProjectionMatrix(transform: Transform) {

  const halfCanvasWidth = gfx.canvas.width / 2
  const halfCanvasHeight = gfx.canvas.height / 2

  scaleVector[ 0 ] = scaleVector[ 1 ] = zoom
  m4.ortho(
    -halfCanvasWidth - 0.5,
    halfCanvasWidth - 0.5,
    halfCanvasHeight - 0.5,
    -halfCanvasHeight - 0.5,
    -1000,
    1000,
    camera.viewProjectionMatrix,
  )

  m4.scale(camera.viewProjectionMatrix, scaleVector, camera.viewProjectionMatrix)

  m4.translate(camera.viewProjectionMatrix, transform.pos, camera.viewProjectionMatrix)
  
}

/*
So if the original world -> clip space is

tempPoint = projectionMatrix * viewMatrix * worldSpacePoint
clipSpacePoint = tempPoint / tempPoint.w
Then to go backward it's

tempPoint = clipSpacePoint * tempPoint.w
worldSpacePoint = inverse(projectMatrix * viewMatrix) * tempPoint

*/

export function screenPosToWorldPos(pos: v3.Vec3) {
  const inverseViewProjectionMatrix = m4.inverse(camera.viewProjectionMatrix)
  // const inverseViewProjectionMatrix = m4.inverse(viewProjectionMatrixWithoutTransform)
  const canvas = gfx.canvas

  const clipPos = v3.clone(pos)
  clipPos[ 0 ] = (clipPos[ 0 ] / canvas.clientWidth * 2) - 1
  clipPos[ 1 ] = (clipPos[ 1 ] / canvas.clientHeight * -2) + 1 // because GL is 0 at bottom

  const worldPos = m4.transformDirection(inverseViewProjectionMatrix, clipPos)
  v3.subtract(worldPos, camera.transform.pos, worldPos)
  return worldPos
}
