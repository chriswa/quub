import * as v3 from './v3'
import * as m4 from './m4'

export default class Transform {

  public pos: v3.Vec3
  public rot: v3.Vec3
  public matrix: m4.Mat4

  constructor(x = 0, y = 0, z = 0, pitch = 0, heading = 0, roll = 0) {
    this.pos = v3.create(x, y, z)
    this.rot = v3.create(pitch, heading, roll)
    this.matrix = m4.identity()
  }

  calcMatrix() {
    m4.translation(this.pos, this.matrix)
    m4.rotateY(this.matrix, this.rot[ 0 ], this.matrix)
    m4.rotateX(this.matrix, this.rot[ 1 ], this.matrix)
    return this.matrix
  }
	
}
