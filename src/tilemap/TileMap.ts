import TileSet from './TileSet'
import * as v3 from '~/math/v3'
import TileMapChunk from './TileMapChunk'

const chunkSize = 200

export default class TileMap {

  private tileSet: TileSet
  mapSize: number
  offset: v3.Vec3 = v3.create()
  private chunksAcross: number
  private chunks: Array<TileMapChunk> = []

  constructor(tileSet: TileSet, mapSize: number, pixelSize: number) {
    this.tileSet = tileSet
    this.mapSize = mapSize

    this.chunksAcross = Math.ceil(this.mapSize / chunkSize)

    for (let chunkX = 0; chunkX < this.chunksAcross; chunkX += 1) {
      for (let chunkY = 0; chunkY < this.chunksAcross; chunkY += 1) {
        this.chunks.push(new TileMapChunk(chunkSize, pixelSize, chunkX, chunkY))
      }
    }
  }

  // get data() {
  //   return this.internals.data
  // }

  set(x: number, y: number, newTileData: number) {
    const chunkX = Math.floor(x / chunkSize)
    const chunkY = Math.floor(y / chunkSize)
    const chunkIndex = chunkX + (chunkY * this.chunksAcross)
    const chunk = this.chunks[ chunkIndex ]

    const index = (x % chunkSize) + ((y % chunkSize) * chunkSize)
    chunk.internals.data[ index ] = newTileData
  }

  render() {
    this.chunks.forEach((chunk) => {
      chunk.render(this.offset)
    })
  }

}
