import Transform from './Transform.js'
import * as math from './math.js'

export const transform = new Transform()
export const viewProjectionMatrix = m4.identity()


export function updateViewProjectionMatrix() {
	math.calcViewProjectionMatrix(transform, viewProjectionMatrix)
}

export function calcWorldViewProjectionMatrix(worldTransform, worldViewProjectionMatrix_OUT) {
	const worldProjectionMatrix = worldTransform.calcMatrix()
	m4.multiply(viewProjectionMatrix, worldProjectionMatrix, worldViewProjectionMatrix_OUT)
}
