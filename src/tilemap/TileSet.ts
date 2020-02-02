import * as tileMapRenderer from './renderer'
import TileMap from './TileMap'

export default class TileSet {

  tileSetId: string
  textureSrc: string
  textureSize: number
  textureTilesAcross: number
  tileMaps: Array< TileMap > = []

  texture: WebGLTexture

  constructor(tileSetId_: string, textureSrc_: string, textureSize_: number, textureTilesAcross_: number) {
    this.tileSetId = tileSetId_
    this.textureSrc = textureSrc_
    this.textureSize = textureSize_
    this.textureTilesAcross = textureTilesAcross_

    tileMapRenderer.createTexture(this.textureSrc, (texture) => {
      this.texture = texture
    })
  }

  createTileMap(mapSize: number, pixelSize: number) {
    const tileMap = new TileMap(this, mapSize, pixelSize)
    this.tileMaps.push(tileMap)
    return tileMap
  }

  render() {
    tileMapRenderer.renderBeginTileSet(this)
    this.tileMaps.forEach((tileMap) => {
      tileMap.render()
    })
  }

}

