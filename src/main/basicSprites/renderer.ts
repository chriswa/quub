import * as twgl from 'twgl.js'
import { quub } from '~/.'
import * as quadIndices from '~/quadIndices'
import BasicSpriteGroup from './BasicSpriteGroup'
import BasicSprite from './BasicSprite'

type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array
type TypedArrayConstructor = Int8ArrayConstructor | Uint8ArrayConstructor | Uint8ClampedArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor
type TypedArrayForTypedArrayConstructor<T extends TypedArrayConstructor> =
  T extends Int8ArrayConstructor ? Int8Array :
    T extends Uint8ArrayConstructor ? Uint8Array :
      T extends Uint8ClampedArrayConstructor ? Uint8ClampedArray :
        T extends Int16ArrayConstructor ? Int16Array :
          T extends Uint16ArrayConstructor ? Uint16Array :
            T extends Int32ArrayConstructor ? Int32Array :
              T extends Uint32ArrayConstructor ? Uint32Array :
                T extends Float32ArrayConstructor ? Float32Array :
                  T extends Float64ArrayConstructor ? Float64Array :
                    never

const attribs = new quub.AttribsBuilder([
  { name: 'a_pos', numComponents: 2, type: quub.constants.INT },
  { name: 'a_size', numComponents: 2, type: quub.constants.UNSIGNED_SHORT },
  { name: 'a_uv', numComponents: 2, type: quub.constants.UNSIGNED_SHORT },
  { name: 'a_rotation', numComponents: 1, type: quub.constants.FLOAT },
])

const shaderAttributeOrder = [ ...attribs.orderedNames, 'a_firefoxShim' ]

export const bytesPerQuad = attribs.stride

const vertexShaderSource = /* glsl */`
                #version 300 es
                precision mediump float;

                uniform mat4 u_worldViewProjection;
                uniform ivec2 u_textureSize;
                in vec2 a_pos;
                in vec2 a_size;
                in vec2 a_uv;
                in float a_rotation;
                in float a_firefoxShim;
                out vec2 v_texcoord;
                out float v_brightness;

                void main() {

                  // detemine corner from gl_VertexID!
                  int cornerId = gl_VertexID % 4;

                  vec2 corner = vec2(
                    float(((cornerId + 1) & 2) >> 1), // 0, 1, 1, 0
                    float(((cornerId + 2) & 2) >> 1)  // 0, 0, 1, 1
                  );

                  mat2 rotationMatrix = mat2( cos(a_rotation), -sin(a_rotation),
                                              sin(a_rotation),  cos(a_rotation));

                  vec2 offsetPos = ((corner - vec2(0.5, 0.5)) * rotationMatrix + vec2(0.5, 0.5)) * a_size;

                  vec4 position = vec4(offsetPos + a_pos, 0., 1. );

                  vec2 texcoord = (a_uv + corner * a_size) / float(u_textureSize);

                  v_brightness = 1.;

                  gl_Position = u_worldViewProjection * position;
                  v_texcoord = texcoord;
                  
                  v_brightness *= a_firefoxShim; // a_firefoxShim mustn't be optimized away
                }`

const fragmentShaderSource = /* glsl */`
                #version 300 es
                precision mediump float;

                uniform sampler2D u_texture;
                in vec2 v_texcoord;
                in float v_brightness;
                out vec4 fragColor;

                void main() {
                  vec4 texColor = texture(u_texture, v_texcoord);
                  if (texColor.a == 0.) { discard; } // don't write to depth buffer if texel is transparent
                  fragColor = texColor * vec4(v_brightness, v_brightness, v_brightness, 1.);
                }`

export let programInfo: twgl.ProgramInfo | undefined = undefined

quub.onReady((gl) => {
  programInfo = twgl.createProgramInfo(gl, [ vertexShaderSource, fragmentShaderSource ], shaderAttributeOrder)
})


export function createVao(numQuads: number, buffer: WebGLBuffer) {
  const vaoInfo = quadIndices.createVertexArrayInfo(programInfo!, numQuads, {
    ...attribs.build({ buffer, divisor: 1 }),
    'a_firefoxShim': { buffer: quadIndices.firefoxShimBuffer!, numComponents: 1, type: quadIndices.firefoxShimBufferGlType, stride: 0, divisor: 0, offset: 0 },
  })
  return vaoInfo
}

export class BasicSpriteGroupInternals {

  maxQuads: number
  private texture: WebGLTexture
  private textureWidth: number
  private textureHeight: number

  instanceArray: Int32Array
  private glBuffer: WebGLBuffer
  private vaoInfo: twgl.VertexArrayInfo
  
  constructor(textureSrc: string, textureWidth_: number, textureHeight_: number, maxQuads_: number) {
    quub.createBasicTexture(textureSrc, (texture) => {
      this.texture = texture
    })
    this.textureWidth = textureWidth_
    this.textureHeight = textureHeight_
    this.maxQuads = maxQuads_

    const arrayBuffer = new ArrayBuffer(this.maxQuads * bytesPerQuad)
    this.instanceArray = new Int32Array(arrayBuffer)
    this.glBuffer = twgl.createBufferFromTypedArray(quub.gl, this.instanceArray, quub.gl.ARRAY_BUFFER, quub.gl.DYNAMIC_DRAW)
    this.vaoInfo = createVao(this.maxQuads, this.glBuffer)
  }

  getSubarray<T extends TypedArrayConstructor>(quadId: number, typedArrayConstructor: T): TypedArrayForTypedArrayConstructor<T> {
    const elementsPerQuad = bytesPerQuad / typedArrayConstructor.BYTES_PER_ELEMENT
    const index = quadId * elementsPerQuad
    return new typedArrayConstructor(this.instanceArray.buffer).subarray(index, index + elementsPerQuad) as TypedArrayForTypedArrayConstructor<T>
  }

  buffer() {
    quub.gl.bindBuffer(quub.gl.ARRAY_BUFFER, this.glBuffer)
    quub.gl.bufferSubData(quub.gl.ARRAY_BUFFER, 0, this.instanceArray)
  }
  
  render(quadCount: number) {
    this.buffer() // TODO: BasicSpriteGroup should be responsible for buffering/subbuffering
    
    twgl.setUniforms(programInfo!, { u_texture: this.texture, u_textureSize: [ this.textureWidth, this.textureHeight ]})
    twgl.setBuffersAndAttributes(quub.gl, programInfo!, this.vaoInfo)
    twgl.drawBufferInfo(quub.gl, this.vaoInfo, quub.gl.TRIANGLES, 6, 0, quadCount)
  }
}

export class BasicSpriteInternals {
  int32: Int32Array
  // uint32: Uint32Array
  uint16: Uint16Array
  float32: Float32Array
  constructor(private groupInternals: BasicSpriteGroupInternals, quadId: number) {
    this.int32 = this.groupInternals.getSubarray(quadId, Int32Array)
    // this.uint32 = this.groupInternals.getSubarray(quadId, Uint32Array)
    this.uint16 = this.groupInternals.getSubarray(quadId, Uint16Array)
    this.float32 = this.groupInternals.getSubarray(quadId, Float32Array)
  }
  update(sprite: BasicSprite) {
    this.int32[ 0 ] = Math.round(sprite.x) // without rounding, this gets trunc'd, which results in artifacts around +/- 0
    this.int32[ 1 ] = Math.round(sprite.y) // without rounding, this gets trunc'd, which results in artifacts around +/- 0
    this.uint16[ 4 ] = sprite.w
    this.uint16[ 5 ] = sprite.h
    this.uint16[ 6 ] = sprite.u
    this.uint16[ 7 ] = sprite.v
    this.float32[ 4 ] = sprite.rot
  }
}

export function render(simpleSpriteGroups: Array< BasicSpriteGroup >) {

  quub.gl.useProgram(programInfo!.program)

  quub.gl.enable(quub.gl.BLEND)
  quub.gl.blendFunc(quub.gl.SRC_ALPHA, quub.gl.ONE_MINUS_SRC_ALPHA)

  twgl.setUniforms(programInfo!, { u_worldViewProjection: quub.camera.viewProjectionMatrix })
  
  simpleSpriteGroups.forEach((simpleSpriteGroup) => {
    simpleSpriteGroup.internals.render(simpleSpriteGroup.quadCount)
  })
  
  quub.gl.bindVertexArray(null)
}
