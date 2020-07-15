import * as tileMapRenderer from './renderer'
import TileSet from './TileSet'
import TileMap from './TileMap'

export { TileSet, TileMap }

export const tileSets: Map<string, TileSet> = new Map()

export function init() {
  // pass
}

export function createTileSet(tileSetId: string, textureSrc: string, textureSize: number, textureTilesAcross: number) {
  const tileSet = new TileSet(tileSetId, textureSrc, textureSize, textureTilesAcross)
  tileSets.set(tileSetId, tileSet)
  return tileSet
}

export function render() {
  tileMapRenderer.renderBegin()
  tileSets.forEach((tileSet, _tileSetId) => {
    tileSet.render()
  })
  tileMapRenderer.renderEnd()
}
