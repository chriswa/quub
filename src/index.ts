import * as twgl from 'twgl.js'
import glConstants from './glConstants'
import AttribsBuilder from './attribsBuilder'
import MouseManager from './MouseManager'

const glOptions = {
  antialias: false,
}

function initCanvas() {
  const el = document.getElementById('canvas')
  if (el === null || !(el instanceof HTMLCanvasElement)) {
    throw new Error('gfx could not init canvas')
  }
  return el
}

function initContext(canvas_: HTMLCanvasElement, glOptions_: unknown) {
  const ctx = canvas_.getContext('webgl2', glOptions_)
  if (ctx === null || !(ctx instanceof WebGL2RenderingContext)) {
    throw new Error('gfx could not init webgl2')
  }
  return ctx
}

let _canvas: HTMLCanvasElement | undefined = undefined
let _gl: WebGL2RenderingContext | undefined = undefined
let _glRaw: WebGL2RenderingContext | undefined = undefined
let _glProxy: WebGL2RenderingContext | undefined = undefined

type ReadyCallback = (gl: WebGL2RenderingContext) => void
const pendingReadyCallbacks: Array<ReadyCallback> = []

export default new class GfxClass {

  loggingAllowed = false
  loggingEnabled = false
  constants = glConstants
  AttribsBuilder = AttribsBuilder
  _mouse: MouseManager | undefined

  get canvas() {
    if (_canvas === undefined) { throw new Error('_canvas is still undefined!') }
    return _canvas
  }
  get gl() {
    if (_gl === undefined) { throw new Error('_gl is still undefined!') }
    return _gl
  }
  get mouse() {
    if (this._mouse === undefined) { throw new Error('_mouse is still undefined!') }
    return this._mouse
  }

  setLogging(enabled: boolean) {
    if (enabled && !this.loggingAllowed) { throw new Error('cannot enable logging because gfx.init was not called with loggingAllowed') }
    this.loggingEnabled = enabled
    _gl = enabled ? _glProxy : _glRaw
  }

  init(loggingAllowed_: boolean, loggingEnabled_: boolean) {
    _canvas = initCanvas()
    _glRaw = initContext(_canvas, glOptions)

    this._mouse = new MouseManager(_canvas)
    
    _glProxy = traceMethodCalls(_glRaw, (methodName: string | number | symbol, args: Array<unknown>) => {
      if (this.loggingEnabled) {
        console.log(`gl.${methodName.toString()}`, args)
      }
    })

    this.loggingAllowed = loggingAllowed_
    _gl = loggingAllowed_ ? _glProxy : _glRaw

    this.setLogging(loggingEnabled_)

    _gl.enable(_gl.CULL_FACE)
    _gl.enable(_gl.DEPTH_TEST)
    
    _gl.enable(_gl.BLEND)
    _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA)
  
    this.callAllPendingReadyCallbacks()
  }

  clear(r: number, g: number, b: number, a: number) {
    const canvas2 = _canvas as HTMLCanvasElement
    const gl2 = _gl as WebGL2RenderingContext
    twgl.resizeCanvasToDisplaySize(canvas2)
    gl2.viewport(0, 0, canvas2.width, canvas2.height)
    gl2.clearColor(r, g, b, a)
    gl2.clear(gl2.COLOR_BUFFER_BIT | gl2.DEPTH_BUFFER_BIT)
  }

  onReady(callback: ReadyCallback) {
    if (_gl === undefined) {
      pendingReadyCallbacks.push(callback)
    }
    else {
      callback(_gl)
    }
  }

  callAllPendingReadyCallbacks() {
    if (_gl === undefined) { throw new Error('_gl is still undefined!') }

    pendingReadyCallbacks.forEach((callback) => callback(_gl!))
    pendingReadyCallbacks.length = 0
  }

  // helpers

  createBasicTexture(textureSrc: string, callback: (texture: WebGLTexture) => void) {
    this.onReady((gl) => {
      const texture = twgl.createTexture(gl, {
        src: textureSrc,
        mag: gl.NEAREST,
        min: gl.NEAREST,
        level: 0,
        auto: false,
        crossOrigin: 'anonymous',
      })
      callback(texture)
    })
  }

}()

function traceMethodCalls<T extends any>(obj: T, traceCallback: (methodName: string | number | symbol, args: Array<unknown>) => void): T {
  const handler = {
    get(target: any, propKey: string | number | symbol, receiver: unknown) {
      const targetValue = Reflect.get(target, propKey, receiver)
      if (typeof targetValue === 'function') {
        return function wrapper(...args: Array<unknown>) {
          traceCallback(propKey, args)
          // return obj[ propKey ].apply(obj, args)
          return obj[ propKey ](...args)
        }
      }
      else {
        return targetValue
      }
    },
  }
  return new Proxy(obj, handler) as T
}
