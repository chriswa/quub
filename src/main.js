import * as quub from './quub/index.js'
import * as cubeRenderer from './cubeRenderer.js'

// initialize mobile support library
PleaseFullscreen()

// add FPS stats to corner of page
quub.addMrDoobStats()

// add canvas, init gl
quub.createCanvasAndInitGL()

// init mouselook, which uses pointerlock to rotate the camera
quub.mouselook.init()

// init freemove, which uses WASD/space/shift keys to translate the camera
quub.freemove.init()

// start game loop, which uses requestAnimationFrame
quub.startGameLoop({
	update(dt) {
		// spin the cube
		cubeRenderer.worldTransform.rot[0] += dt / 1000
		cubeRenderer.worldTransform.rot[1] += dt / 2345

		// update camera translation (WASD/space/shift)
		quub.freemove.update(dt)
	},
	render() {
		// clear the canvas to dark blue, also fixes the resolution if necessary
		quub.resetCanvas(0.1, 0.2, 0.3, 1)

		// calculate the viewProjectionMatrix, which we will use to render all
		quub.camera.updateViewProjectionMatrix()

		cubeRenderer.render()
	}
})
