import * as twgl from 'twgl.js'
import glConstants from './glConstants'
import AttribsBuilder from './attribsBuilder'
import MouseManager from './MouseManager'
import { ICamera } from './camera'

const glOptions = {
  antialias: false,
}

type ReadyCallback = (gl: WebGL2RenderingContext) => void

interface IQuubOptions {
  canvas?: HTMLCanvasElement // 
  camera: ICamera
  productionMode?: boolean // in production mode, logging cannot be turned on because no glProxy has been installed
  loggingEnabled?: boolean // start with logging enabled, which will log all GL calls in ReadyCallbacks (not available in productionMode)
}

export default class QuubCore {

  private productionMode = false
  private loggingEnabled = false
  readonly constants = glConstants
  private pendingReadyCallbacks: Array<ReadyCallback> = []
  AttribsBuilder = AttribsBuilder

  camera: ICamera

  private _canvas: HTMLCanvasElement | undefined = undefined
  private _gl: WebGL2RenderingContext | undefined = undefined
  private _glRaw: WebGL2RenderingContext | undefined = undefined
  private _glProxy: WebGL2RenderingContext | undefined = undefined
  private _mouse: MouseManager | undefined = undefined
  
  get canvas() {
    if (this._canvas === undefined) { throw new Error('_canvas is still undefined! quub.init() has not been called. you should probably be using quub.onReady() to queue your code') }
    return this._canvas
  }
  get gl() {
    if (this._gl === undefined) { throw new Error('_gl is still undefined! quub.init() has not been called. you should probably be using quub.onReady() to queue your code') }
    return this._gl
  }
  get mouse() {
    if (this._mouse === undefined) { throw new Error('_mouse is still undefined! quub.init() has not been called. you should probably be using quub.onReady() to queue your code') }
    return this._mouse
  }

  setLogging(enabled: boolean) {
    if (enabled && this.productionMode) { throw new Error('cannot enable logging because quub.init was called with productionMode') }
    this.loggingEnabled = enabled
    this._gl = enabled ? this._glProxy : this._glRaw
  }

  init(options: IQuubOptions) {

    this.productionMode = options.productionMode === true
    this.loggingEnabled = options.loggingEnabled === true
    this.camera = options.camera

    this._canvas = initCanvas(options.canvas)
    this._glRaw = initContext(this._canvas, glOptions)

    this._mouse = new MouseManager(this._canvas)

    this._glProxy = traceMethodCalls(this._glRaw, (methodName: string | number | symbol, args: Array<unknown>) => {
      if (this.loggingEnabled) {
        console.log(`gl.${methodName.toString()}`, args)
      }
    })

    this._gl = this.productionMode ? this._glRaw : this._glProxy

    this.setLogging(this.loggingEnabled)

    this._gl.enable(this._gl.CULL_FACE)
    this._gl.enable(this._gl.DEPTH_TEST)
    
    this._gl.enable(this._gl.BLEND)
    this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA)
  
    this.callAllPendingReadyCallbacks()
  }

  clear(r: number, g: number, b: number, a: number) {
    const canvas2 = this._canvas as HTMLCanvasElement
    const gl2 = this._gl as WebGL2RenderingContext
    twgl.resizeCanvasToDisplaySize(canvas2)
    gl2.viewport(0, 0, canvas2.width, canvas2.height)
    gl2.clearColor(r, g, b, a)
    gl2.clear(gl2.COLOR_BUFFER_BIT | gl2.DEPTH_BUFFER_BIT)
  }

  onReady(callback: ReadyCallback) {
    if (this._gl === undefined) {
      this.pendingReadyCallbacks.push(callback)
    }
    else {
      callback(this._gl)
    }
  }

  private callAllPendingReadyCallbacks() {
    this.pendingReadyCallbacks.forEach((callback) => callback(this._gl!))
    this.pendingReadyCallbacks.length = 0
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

}

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

function initCanvas(suppliedCanvas?: HTMLCanvasElement) {
  let el = suppliedCanvas
  if (suppliedCanvas === undefined) {
    const canvases = document.getElementsByTagName('canvas')
    if (canvases.length !== 0) {
      throw new Error('quub could not automatically init canvas: number of available canvases !== 1. pass a canvas element with the `canvas` option.')
    }
    el = canvases[ 0 ]
  }
  if (!(el instanceof HTMLCanvasElement)) {
    throw new Error('quub could not init canvas. the element provided is not an HTMLCanvasElement.')
  }
  return el
}

function initContext(canvas_: HTMLCanvasElement, glOptions_: unknown) {
  const ctx = canvas_.getContext('webgl2', glOptions_)
  if (ctx === null || !(ctx instanceof WebGL2RenderingContext)) {
    throw new Error('quub could not init webgl2. try a newer browser on a desktop?')
  }
  return ctx
}
