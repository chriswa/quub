const projectionMatrix = m4.identity()
const viewMatrix = m4.identity()
const fov = 60 * Math.PI / 180
const zNear = 0.05
const zFar = 5000
export function calcViewProjectionMatrix(cameraTransform, viewProjectionMatrix_OUT) {
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight // this can change as the browser window is resized
	m4.perspective(fov, aspect, zNear, zFar, projectionMatrix)

	const cameraMatrix = cameraTransform.calcMatrix()
	m4.inverse(cameraMatrix, viewMatrix)

	m4.multiply(projectionMatrix, viewMatrix, viewProjectionMatrix_OUT)
}
