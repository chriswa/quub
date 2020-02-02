import TileSet from './TileSet'
import * as twgl from 'twgl.js'
import gfx from '~/.'
import * as quadIndices from '~/quadIndices'
import * as camera from '~/camera'
import * as v3 from '~/math/v3'

const shaderAttributeOrder = [ 'a_instanceId', 'a_tileIndex', 'a_firefoxShim' ]

const vertexShaderSource = /* glsl */`
                #version 300 es
                precision mediump float;

                uniform mat4 u_worldViewProjection;
                uniform float u_tilePixelSize;
                uniform vec3 u_offset;
                uniform int u_tileMapSize;
                uniform int u_textureTilesAcross;
                in int a_instanceId;
                in int a_tileIndex;
                in float a_firefoxShim;
                out vec2 v_texcoord;
                out float v_brightness;

                void main() ${'{'}

                  // detemine position from a_instanceId
                  int quadX = a_instanceId % u_tileMapSize;
                  int quadY = a_instanceId / u_tileMapSize;
                  
                  // detemine corner from gl_VertexID
                  int cornerId = gl_VertexID % 4;
                  int cornerX = (((cornerId + 1) & 2) >> 1); // 0, 1, 1, 0
                  int cornerY = (((cornerId + 2) & 2) >> 1); // 0, 0, 1, 1

                  vec4 position = vec4(
                    float(quadX + cornerX) * u_tilePixelSize,
                    float(quadY + cornerY) * u_tilePixelSize,
                    -0.1,
                    1.
                  );
                  position += vec4(u_offset, 0.);

                  // get texcoord from attributes
                  vec2 texcoord = vec2(
                    (float(a_tileIndex % u_textureTilesAcross + cornerX)) / float(u_textureTilesAcross),
                    (float(a_tileIndex / u_textureTilesAcross + cornerY)) / float(u_textureTilesAcross)
                  );

                  // get brightness from attributes
                  float brightness = 1.; // float((a_vertexPackedInt[0] >> 0) & 0x1f) / 16.;

                  gl_Position = u_worldViewProjection * position;
                  v_texcoord = texcoord;
                  v_brightness = brightness * a_firefoxShim;
                }`

const fragmentShaderSource = /* glsl */`
                #version 300 es
                precision mediump float;

                uniform sampler2D u_texture;
                in vec2 v_texcoord;
                in float v_brightness;
                out vec4 fragColor;

                void main() {
                  fragColor = texture(u_texture, v_texcoord) * vec4(v_brightness, v_brightness, v_brightness, 1.);
                }`

export let programInfo: twgl.ProgramInfo | undefined = undefined

gfx.onReady((gl) => {
  programInfo = twgl.createProgramInfo(gl, [ vertexShaderSource, fragmentShaderSource ], shaderAttributeOrder)
})

export function createTexture(textureSrc: string, callback: (texture: WebGLTexture) => void) {
  return gfx.createBasicTexture(textureSrc, callback)
}

export const elementsPerQuad = quadIndices.elementsPerQuad

export class TileMapChunkInternals {

  size: number
  data: Uint32Array
  glBuffer: WebGLBuffer
  vaoInfo: twgl.VertexArrayInfo

  constructor(size_: number) {
    this.size = size_
    this.data = new Uint32Array(this.size * this.size)
    this.glBuffer = twgl.createBufferFromTypedArray(gfx.gl, this.data, gfx.gl.ARRAY_BUFFER, gfx.gl.DYNAMIC_DRAW)
    const stride = Number(Uint32Array.BYTES_PER_ELEMENT) * 1
    // this.vaoInfo = quadIndices.createVertexArrayInfo(programInfo!, this.size * this.size, {
    //   'a_tileIndex': { buffer: this.glBuffer, numComponents: 1, type: gfx.gl.BYTE, stride, divisor: 1, offset: 0 },
    // })
    this.vaoInfo = twgl.createVertexArrayInfo(gfx.gl, [ programInfo! ], {
      numElements: this.size * this.size * 1,
      indices: quadIndices.buffer,
      elementType: quadIndices.bufferGlType,
      attribs: {
        'a_instanceId': { buffer: quadIndices.instanceIdBuffer!, numComponents: 1, type: quadIndices.instanceIdBufferGlType, stride: quadIndices.instanceIdStride, divisor: 1, offset: 0 },
        'a_tileIndex': { buffer: this.glBuffer, numComponents: 1, type: gfx.gl.INT, stride, divisor: 1, offset: 0 },
        'a_firefoxShim': { buffer: quadIndices.firefoxShimBuffer!, numComponents: 1, type: quadIndices.firefoxShimBufferGlType, stride: 0, divisor: 0, offset: 0 },
      },
    })
  }

  buffer() {
    gfx.gl.bindBuffer(gfx.gl.ARRAY_BUFFER, this.glBuffer)
    gfx.gl.bufferSubData(gfx.gl.ARRAY_BUFFER, 0, this.data)
  }

  render(offset: v3.Vec3, pixelSize: number) {
    this.buffer() // TODO: TileMap should be responsible for buffering/subbuffering

    twgl.setUniforms(programInfo!, {
      u_tileMapSize: this.size,
      u_tilePixelSize: pixelSize,
      u_offset: offset,
    })

    twgl.setBuffersAndAttributes(gfx.gl, programInfo!, this.vaoInfo)

    twgl.drawBufferInfo(gfx.gl, this.vaoInfo, gfx.gl.TRIANGLES, 6, 0, this.size * this.size)
    // gfx.gl.drawElementsInstanced(gfx.gl.TRIANGLES, 6, this.vaoInfo.elementType!, 0, this.size * this.size)
  }
}


export function renderBegin() {
  gfx.gl.useProgram(programInfo!.program)
  twgl.setUniforms(programInfo!, {
    u_worldViewProjection: camera.viewProjectionMatrix,
  })
}

export function renderBeginTileSet(tileSet: TileSet) {
  twgl.setUniforms(programInfo!, {
    u_texture: tileSet.texture,
    u_textureTilesAcross: tileSet.textureTilesAcross,
  })
}

export function renderEnd() {
}
