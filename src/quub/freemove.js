import * as camera from './camera.js'
import { dt } from './timing.js'

let moveSpeed

const keysDown = {}

export function init(moveSpeed_ = 0.02) {
	moveSpeed = moveSpeed_

	document.addEventListener('keydown', event => {
		keysDown[event.which] = true
	}, false)
	document.addEventListener('keyup', event => {
		keysDown[event.which] = false
	}, false)
}

const playerRotationMatrix = m4.identity()
const keyCodes = {
	'forward':  87, // w
	'backward': 83, // s
	'left':     65, // a
	'right':    68, // d
	'up':       32, // space
	//'down':     16, // shift
	'down':     88, // x
}

export function update() {

	m4.identity(playerRotationMatrix)
	m4.rotateY(playerRotationMatrix, camera.transform.rot[0], playerRotationMatrix)
	m4.rotateX(playerRotationMatrix, camera.transform.rot[1], playerRotationMatrix)

	const forwardInput = (keysDown[keyCodes.backward] ? 1 : 0) + (keysDown[keyCodes.forward] ? -1 : 0)
	const rightInput   = (keysDown[keyCodes.right]    ? 1 : 0) + (keysDown[keyCodes.left]    ? -1 : 0)
	const upInput      = (keysDown[keyCodes.up]       ? 1 : 0) + (keysDown[keyCodes.down]    ? -1 : 0)

	const speed = moveSpeed * dt

	// right
	camera.transform.pos[0] += rightInput * playerRotationMatrix[0] * speed
	camera.transform.pos[1] += rightInput * playerRotationMatrix[1] * speed
	camera.transform.pos[2] += rightInput * playerRotationMatrix[2] * speed

	// up
	camera.transform.pos[0] += upInput * playerRotationMatrix[4] * speed
	camera.transform.pos[1] += upInput * playerRotationMatrix[5] * speed
	camera.transform.pos[2] += upInput * playerRotationMatrix[6] * speed

	// forward
	camera.transform.pos[0] += forwardInput * playerRotationMatrix[8] * speed
	camera.transform.pos[1] += forwardInput * playerRotationMatrix[9] * speed
	camera.transform.pos[2] += forwardInput * playerRotationMatrix[10] * speed

}
