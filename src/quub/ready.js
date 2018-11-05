let glIsReady = false
const readyCallbacks = []

export function glReady(callback) {
	if (glIsReady) {
		callback()
	}
	else {
		readyCallbacks.push(callback)
	}
}

export function setGlToReadyState() {
	if (glIsReady) { throw new Error('setGlToReadyState has already been called') }
	glIsReady = true
	readyCallbacks.forEach(callback => callback())
	readyCallbacks.length = 0
}
