import * as quub from './quub/index.js'
import * as backgroundRenderer from './screenRenderer.js'
import * as cubeRenderer from './cubeRenderer.js'

// initialize mobile support library
PleaseFullscreen()

// add FPS stats to corner of page
quub.addMrDoobStats()

// add canvas, init gl
quub.createCanvasAndInitGL()

// init mouselook, which uses pointerlock to rotate the camera
quub.mouselook.init()

// init freemove, which uses WASD/space/X keys to translate the camera
quub.freemove.init()

// move camera back a bit, so we can see the cube, which will be rendered at 0,0,0
v3.set(quub.camera.transform.pos, 0, 0, 5)

// start game loop, which uses requestAnimationFrame
quub.startGameLoop({
	update() {

		// spin the cube
		cubeRenderer.transform.rot[0] += quub.dt / 1000
		cubeRenderer.transform.rot[1] += quub.dt / 2345

		// update camera translation (WASD/space/X)
		quub.freemove.update()
	},
	render() {
		// clear the canvas to dark blue, also fixes the resolution if necessary
		quub.resetCanvas(0.1, 0.2, 0.3, 1)

		// calculate the viewProjectionMatrix, which we will use to render all
		quub.camera.updateViewProjectionMatrix()

		backgroundRenderer.render()
		cubeRenderer.render()
	}
})
