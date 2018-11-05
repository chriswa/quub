import { setGlToReadyState } from './ready.js'

export function createCanvasAndInitGL() {
	document.body.style.margin = '0'

	canvas = document.createElement('canvas')
	canvas.style.display = 'block'
	canvas.style.height = '100vh'
	canvas.style.width = '100vw'
	document.body.appendChild(canvas)

	gl = canvas.getContext('webgl', {
		antialias: false,
	})

	if (!gl) {
		alert(`Sorry!\n\nYour browser does not support WebGL.\n\nTry Chrome?`)
		throw new Error('Your browser does not support WebGL')
	}

	gl.enable(gl.CULL_FACE)
	gl.enable(gl.DEPTH_TEST)

	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

	setGlToReadyState()
}

export function resetCanvas(r, g, b, a) {
	twgl.resizeCanvasToDisplaySize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	gl.clearColor(r, g, b, a)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

export function startGameLoop({ update, render }) {
	let lastTime = performance.now()
	function mainLoop() {
		const now = performance.now()
		const dt = now - lastTime
		lastTime = now
		update(dt)
		render()
		requestAnimationFrame(mainLoop)
	}
	requestAnimationFrame(mainLoop)
}


export function addMrDoobStats(styleModifications = {}) {
	const script = document.createElement('script')
	script.onload = () => {
		const stats = new Stats()
		Object.entries(styleModifications).forEach(([key, value]) => {
			console.log([key, value])
			stats.dom.style[key] = value
		})
		//stats.dom.style.left = null
		//stats.dom.style.right = '0px'
		const mountPoint = document.body
		mountPoint.appendChild(stats.dom)
		requestAnimationFrame(function loop() {
			stats.update()
			requestAnimationFrame(loop)
		})
	}
	script.src = '//rawcdn.githack.com/mrdoob/stats.js/28632bd87e0ea56acafc9b8779d813eb95e62c08/build/stats.min.js'
	document.head.appendChild(script)
}