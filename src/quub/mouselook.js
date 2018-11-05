import * as camera from './camera.js'

let domElement = document.body
let isPointerLocked = false

export function init(mouseSpeed = 0.004) {

	domElement.addEventListener('click', event => {
		if (!isPointerLocked) {
			//domElement.requestPointerLock = domElement.requestPointerLock || domElement.mozRequestPointerLock || domElement.webkitRequestPointerLock
			domElement.requestPointerLock()
			event.preventDefault()
		}
		else {
			//this.onClick(event)
		}
	}, false)

	// listen for pointer lock event
	function onPointerLockChange() {
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

	// update player camera.transform.rot when mouse moves while pointer is locked
	document.addEventListener('mousemove', event => {
		if (isPointerLocked) {
			camera.transform.rot[0] -= mouseSpeed * (event.movementX) // || event.mozMovementX || event.webkitMovementX || 0)
			camera.transform.rot[1] -= mouseSpeed * (event.movementY) // || event.mozMovementY || event.webkitMovementY || 0)
			while (camera.transform.rot[0] > Math.PI) { camera.transform.rot[0] -= 2 * Math.PI }
			while (camera.transform.rot[0] < Math.PI) { camera.transform.rot[0] += 2 * Math.PI }
			camera.transform.rot[1] = Math.min(Math.max(-Math.PI / 2, camera.transform.rot[1]), Math.PI / 2) // clamp to up and down
		}
	}, false)
}
