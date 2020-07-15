import * as twgl from 'twgl.js'
import { quub } from '~/.'

export const maxQuads = 10922 // theoretical max is 10922 (e.g. floor(UNSIGNED_SHORT / 6))

export const vertsPerQuad = 4
export const elementsPerQuad = 6
export const stride = Uint32Array.BYTES_PER_ELEMENT * elementsPerQuad

const indexList: Array<number> = []
for (let quadId = 0; quadId < maxQuads; quadId += 1) {
  indexList[ (quadId * elementsPerQuad) + 0 ] = (quadId * vertsPerQuad) + 0
  indexList[ (quadId * elementsPerQuad) + 1 ] = (quadId * vertsPerQuad) + 1
  indexList[ (quadId * elementsPerQuad) + 2 ] = (quadId * vertsPerQuad) + 2
  indexList[ (quadId * elementsPerQuad) + 3 ] = (quadId * vertsPerQuad) + 0
  indexList[ (quadId * elementsPerQuad) + 4 ] = (quadId * vertsPerQuad) + 2
  indexList[ (quadId * elementsPerQuad) + 5 ] = (quadId * vertsPerQuad) + 3
}

export let bufferGlType: GLenum | undefined = undefined
export let buffer: WebGLBuffer | undefined = undefined

quub.onReady((gl) => {
  bufferGlType = gl.UNSIGNED_SHORT
  buffer = twgl.createBufferFromTypedArray(gl, new Uint16Array(indexList), gl.ELEMENT_ARRAY_BUFFER)
})

export function createVertexArrayInfo(programInfo: twgl.ProgramInfo, quadCount: number, attribs: Record< string, twgl.AttribInfo >) {
  return twgl.createVertexArrayInfo(quub.gl, [ programInfo ], {
    numElements: quadCount * elementsPerQuad,
    indices: buffer,
    elementType: bufferGlType,
    attribs,
  })
}

// --- instance id buffer ---

const instanceIdArray: Int32Array = new Int32Array(maxQuads * vertsPerQuad)
for (let i = 0; i < instanceIdArray.length; i += 1) {
  instanceIdArray[ i ] = i // Math.floor(i / 4)
}

export let instanceIdBufferGlType: GLenum | undefined = undefined
export let instanceIdBuffer: WebGLBuffer | undefined = undefined
export const instanceIdStride = Int32Array.BYTES_PER_ELEMENT

quub.onReady((gl) => {
  instanceIdBufferGlType = gl.INT
  instanceIdBuffer = twgl.createBufferFromTypedArray(gl, instanceIdArray, gl.ARRAY_BUFFER)
})

// --- firefox shim buffer ---

const firefoxShimArray: Float32Array = new Float32Array(256 * 256)
for (let i = 0; i < firefoxShimArray.length; i += 1) {
  firefoxShimArray[ i ] = 1
}

export let firefoxShimBufferGlType: GLenum | undefined = undefined
export let firefoxShimBuffer: WebGLBuffer | undefined = undefined
export const firefoxShimStride = Float32Array.BYTES_PER_ELEMENT

quub.onReady((gl) => {
  firefoxShimBufferGlType = gl.FLOAT
  firefoxShimBuffer = twgl.createBufferFromTypedArray(gl, firefoxShimArray, gl.ARRAY_BUFFER)
})

