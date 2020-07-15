import * as v3 from '~/math/v3'
import * as tileMapRenderer from './renderer'

const scratchVec3 = v3.create()

export default class TileMapChunk {

  private chunkSize: number
  pixelSize = 16
  private chunkOffset: v3.Vec3
  internals: tileMapRenderer.TileMapChunkInternals

  constructor(chunkSize: number, pixelSize: number, chunkX: number, chunkY: number) {
    this.chunkSize = chunkSize
    this.pixelSize = pixelSize
    this.chunkOffset = v3.create(chunkSize * pixelSize * chunkY, chunkSize * pixelSize * chunkX) // n.b. y,x
    this.internals = new tileMapRenderer.TileMapChunkInternals(this.chunkSize)
  }

  render(offset: v3.Vec3) {
    v3.add(this.chunkOffset, offset, scratchVec3)
    this.internals.render(scratchVec3, this.pixelSize)
  }

}
