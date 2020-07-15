import * as renderer from './renderer'
import { BasicSprite } from '.'

export default class BasicSpriteGroup {

  quadCount: number
  quadHoles: Array< number >

  internals: renderer.BasicSpriteGroupInternals

  constructor(textureSrc: string, textureWidth: number, textureHeight: number, maxQuads: number) {
    this.internals = new renderer.BasicSpriteGroupInternals(textureSrc, textureWidth, textureHeight, maxQuads)

    this.quadCount = 0
    this.quadHoles = []
  }
  
  createSprite(x: number, y: number, w: number, h: number, u: number, v: number, rot: number) {
    return new BasicSprite(this, x, y, w, h, u, v, rot)
  }

  acquireQuad() {
    let quadId = this.quadHoles.pop()
    if (quadId !== undefined) {
      return quadId
    }
    else if (this.quadCount < this.internals.maxQuads) {
      quadId = this.quadCount
      this.quadCount += 1
      return quadId
    }
    else {
      throw new Error('BasicSpriteGroup.acquireQuad: quad limit exceeded!')
    }
  }

  releaseQuad(quadId: number) {
    this.quadHoles.push(quadId)
  }
  
}
