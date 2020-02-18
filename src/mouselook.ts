import { Vec3 } from '~/math/v3'

interface IMouselookOptions {
  rotationVector: Vec3
  mouseSpeed?: number
  domElement?: HTMLElement
}

export function init(options: IMouselookOptions) {
  const rotationVector = options.rotationVector
  const mouseSpeed = options.mouseSpeed ?? 0.004
  const domElement = options.domElement ?? document.body

  let isPointerLocked = false

  domElement.addEventListener('mousedown', (event) => {
    if (!isPointerLocked) {
      domElement.requestPointerLock()
      event.stopImmediatePropagation() // this eventhandler should be registered FIRST, so that other event handlers can rely on stopImmediatePropagation to catch pointerlock events!
    }
  }, false)

  // listen for pointer lock event
  function onPointerLockChange() {
    // @ts-ignore - Document.pointerLockElement exists
    if (document.pointerLockElement === domElement) { // || document.mozPointerLockElement === domElement || document.webkitPointerLockElement === domElement) {
      isPointerLocked = true
    }
    else {
      isPointerLocked = false
    }
  }
  document.addEventListener('pointerlockchange', onPointerLockChange, false)
  document.addEventListener('mozpointerlockchange', onPointerLockChange, false)
  document.addEventListener('webkitpointerlockchange', onPointerLockChange, false)

  // update player rotationVector when mouse moves while pointer is locked
  document.addEventListener('mousemove', (event) => {
    if (isPointerLocked) {
      rotationVector[ 0 ] -= mouseSpeed * (event.movementX) // || event.mozMovementX || event.webkitMovementX || 0)
      rotationVector[ 1 ] -= mouseSpeed * (event.movementY) // || event.mozMovementY || event.webkitMovementY || 0)
      while (rotationVector[ 0 ] > Math.PI) { rotationVector[ 0 ] -= 2 * Math.PI }
      while (rotationVector[ 0 ] < Math.PI) { rotationVector[ 0 ] += 2 * Math.PI }
      rotationVector[ 1 ] = Math.min(Math.max(-Math.PI / 2, rotationVector[ 1 ]), Math.PI / 2) // clamp to up and down
    }
  }, false)
}
