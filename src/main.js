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

// init freemove, which uses WASD/space/shift keys to translate the camera
quub.freemove.init()

// move camera back a bit, so we can see the cube, which will be rendered at 0,0,0
v3.set(quub.camera.transform.pos, 0, 0, 5)

let elapsedTime = 0

// start game loop, which uses requestAnimationFrame
quub.startGameLoop({
	update(dt) {
		elapsedTime += dt

		// spin the cube
		cubeRenderer.transform.rot[0] += dt / 1000
		cubeRenderer.transform.rot[1] += dt / 2345

		// update camera translation (WASD/space/shift)
		quub.freemove.update(dt)
	},
	render() {
		// clear the canvas to dark blue, also fixes the resolution if necessary
		quub.resetCanvas(0.1, 0.2, 0.3, 1)

		// calculate the viewProjectionMatrix, which we will use to render all
		quub.camera.updateViewProjectionMatrix()

		backgroundRenderer.render(elapsedTime)
		cubeRenderer.render()
	}
})
