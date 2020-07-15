import * as twgl from 'twgl.js'
import { quub, m4 } from '~/.'

const vertexShaderSource = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;

  uniform mat4 u_worldViewProjection;

  varying vec2 v_texcoord;

  void main() {
    gl_Position = u_worldViewProjection * a_position;
    v_texcoord = a_texcoord;
  }
`

const fragmentShaderSource = `
  precision mediump float;

  uniform sampler2D u_texture;

  varying vec2 v_texcoord;

  void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
`

export let programInfo: twgl.ProgramInfo | undefined = undefined
export let bufferInfo: twgl.BufferInfo | undefined = undefined
export let texture: WebGLTexture | undefined = undefined

quub.onReady((gl) => {
  programInfo = twgl.createProgramInfo(gl, [ vertexShaderSource, fragmentShaderSource ])

  const arrays = {
    a_position: [ 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1 ],
    // a_normal: [ 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1 ],
    a_texcoord: [ 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1 ],
    indices: [ 0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23 ],
  }
  bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

  texture = twgl.createTexture(gl, {
    src: 'nebula.jpg', // 512x512 nebula
    // mag: gl.NEAREST,
    // min: gl.NEAREST,
    // level: 0,
    // auto: false,
    crossOrigin: 'anonymous',
  })
})

const worldViewProjectionMatrix = m4.identity()

export function render() {

  // calculate our vertex shader's uniform matrix from the Transforms of the camera and our "world" transform
  // quub.camera.calcWorldViewProjectionMatrix(transform, worldViewProjectionMatrix) // TODO: viewProjectionMatrix != worldViewProjectionMatrix

  if (programInfo === undefined) { throw new Error('programInfo is undefined') }
  if (bufferInfo === undefined) { throw new Error('bufferInfo is undefined') }

  quub.gl.useProgram(programInfo.program)
  const uniforms = {
    u_worldViewProjection: worldViewProjectionMatrix,
    u_texture: texture,
  }
  twgl.setUniforms(programInfo, uniforms)
  twgl.setBuffersAndAttributes(quub.gl, programInfo, bufferInfo)
  quub.gl.drawElements(quub.gl.TRIANGLES, bufferInfo.numElements, quub.gl.UNSIGNED_SHORT, 0)
}
