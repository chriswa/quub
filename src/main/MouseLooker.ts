import { Vec3 } from '~/math/v3'

interface IMouselookOptions {
  rotationVector: Vec3
  mouseSpeed?: number
  domElement?: HTMLElement
}

export default class MouseLooker {

  private isEnabled = true
  private rotationVector: Vec3
  mouseSpeed: number
  private domElement: HTMLElement
  private isPointerLocked = false

  constructor(options: IMouselookOptions) {
    this.rotationVector = options.rotationVector
    this.mouseSpeed = options.mouseSpeed ?? 0.004
    this.domElement = options.domElement ?? document.body
  
    this.domElement.addEventListener('mousedown', (event) => {
      if (!this.isPointerLocked) {
        this.domElement.requestPointerLock()
        event.stopImmediatePropagation() // this eventhandler should be registered FIRST, so that other event handlers can rely on stopImmediatePropagation to catch pointerlock events!
      }
    }, false)
  
    // listen for pointer lock event
    const onPointerLockChange = () => {
      if (this.isEnabled === false) { return }
      // xxx @ts-ignore - Document.pointerLockElement exists
      if (document.pointerLockElement === this.domElement) { // || document.mozPointerLockElement === domElement || document.webkitPointerLockElement === domElement) {
        this.isPointerLocked = true
      }
      else {
        this.isPointerLocked = false
      }
    }
    document.addEventListener('pointerlockchange', onPointerLockChange, false)
    document.addEventListener('mozpointerlockchange', onPointerLockChange, false)
    document.addEventListener('webkitpointerlockchange', onPointerLockChange, false)
  
    // update player rotationVector when mouse moves while pointer is locked
    document.addEventListener('mousemove', (event) => {
      if (this.isEnabled === false) { return }
      if (this.isPointerLocked) {
        this.rotationVector[ 0 ] -= this.mouseSpeed * (event.movementX) // || event.mozMovementX || event.webkitMovementX || 0)
        this.rotationVector[ 1 ] -= this.mouseSpeed * (event.movementY) // || event.mozMovementY || event.webkitMovementY || 0)
        while (this.rotationVector[ 0 ] > Math.PI) { this.rotationVector[ 0 ] -= 2 * Math.PI }
        while (this.rotationVector[ 0 ] < Math.PI) { this.rotationVector[ 0 ] += 2 * Math.PI }
        this.rotationVector[ 1 ] = Math.min(Math.max(-Math.PI / 2, this.rotationVector[ 1 ]), Math.PI / 2) // clamp to up and down
      }
    }, false)
  }
  enable() {
    this.isEnabled = true
  }
  disable() {
    this.isEnabled = false
    this.isPointerLocked = false
  }
}

