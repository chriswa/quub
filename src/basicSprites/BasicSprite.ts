import * as renderer from './renderer'
import BasicSpriteGroup from './BasicSpriteGroup'

export default class BasicSprite {

  group: BasicSpriteGroup
  internals: renderer.BasicSpriteInternals

  quadId: number
  x: number // int32
  y: number // int32
  w: number // uint16
  h: number // uint16
  u: number // uint16
  v: number // uint16
  rot: number // float32

  constructor(group_: BasicSpriteGroup, x_: number, y_: number, w_: number, h_: number, u_: number, v_: number, rot_: number) {
    this.group = group_
    this.quadId = this.group.acquireQuad()
    this.internals = new renderer.BasicSpriteInternals(this.group.internals, this.quadId)

    this.x = x_ ?? 0
    this.y = y_ ?? 0
    this.w = w_ ?? 16
    this.h = h_ ?? 16
    this.u = u_ ?? 0
    this.v = v_ ?? 0
    this.rot = rot_ ?? 0
    
    this.update()
  }

  destroy() {
    this.group.releaseQuad(this.quadId)
    this.w = 0
    this.update()
  }

  update() {
    this.internals.update(this)
  }
  
}
