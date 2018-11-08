// make sure our dependencies are loaded
if (!window.twgl) {
	throw new Error('quub-globals: window.twgl has not been set: missing <script src="lib/twgl-full@3.8.0.js"></script>')
}

// set up some helpful global aliases
window.global = window
global.v3 = twgl.v3
global.m4 = twgl.m4

// declare globals `canvas` and `gl`
global.canvas = new Proxy({}, { get(obj, key) { throw new Error('global `canvas` has not been initialized yet') } })
global.gl = new Proxy({}, { get(obj, key) { throw new Error('global `gl` has not been initialized yet') } })

// add some extra helper functions to twgl
twgl.v3.set = function (v, x = 0, y = 0, z = 0) { v[0] = x; v[1] = y; v[2] = z }
