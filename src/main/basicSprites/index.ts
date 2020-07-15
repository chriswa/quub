import * as renderer from './renderer'
import BasicSpriteGroup from './BasicSpriteGroup'
import BasicSprite from './BasicSprite'

export { BasicSprite }
export { BasicSpriteGroup }

export const spriteGroups: Array<BasicSpriteGroup> = []

export function init() {
  // pass
}

export function createGroup(textureSrc: string, textureWidth: number, textureHeight: number, maxQuads: number) {
  const spriteGroup = new BasicSpriteGroup(textureSrc, textureWidth, textureHeight, maxQuads)
  spriteGroups.push(spriteGroup)
  return spriteGroup
}

export function render() {
  renderer.render(spriteGroups)
}
