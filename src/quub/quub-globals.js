if (!window.twgl) {
	throw new Error('quub-globals: window.twgl has not been set: missing <script src="lib/twgl-full@3.8.0.js"></script>')
}

window.global = window
global.v3 = twgl.v3
global.m4 = twgl.m4
global.canvas = new Proxy({}, { get(obj, key) { throw new Error('global `canvas` has not been initialized yet') } })
global.gl = new Proxy({}, { get(obj, key) { throw new Error('global `gl` has not been initialized yet') } })
