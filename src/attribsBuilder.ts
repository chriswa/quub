import * as twgl from 'twgl.js'
import glConstants from './glConstants'

const bytesForGlType = {
  [ glConstants.BYTE ]: 1,
  [ glConstants.UNSIGNED_BYTE ]: 1,
  [ glConstants.SHORT ]: 2,
  [ glConstants.UNSIGNED_SHORT ]: 2,
  [ glConstants.INT ]: 4,
  [ glConstants.UNSIGNED_INT ]: 4,
  [ glConstants.FLOAT ]: 4,
}

export default class AttribsBuilder {

  orderedNames: Array<string> = []
  private attribsSansBuffer: Record<string, { numComponents: number; type: number; offset: number }> = {}
  stride = 0

  constructor(list: Array<{ name: string; numComponents: number; type: number }>) {
    list.forEach(({ name, numComponents, type }) => {
      this.orderedNames.push(name)
      this.attribsSansBuffer[ name ] = { numComponents, type, offset: this.stride }
      const bytes = bytesForGlType[ type ]
      if (bytes === undefined) { throw new Error(`AttribsBuilder doesn't know how many bytes to assign for glType ${type}`) }
      this.stride += bytes * numComponents
    })
  }

  build(merge: twgl.AttribInfo) {
    const result: Record<string, twgl.AttribInfo> = {}
    Object.entries(this.attribsSansBuffer).forEach(([ name, attribs ]) => {
      result[ name ] = { ...attribs, stride: this.stride, ...merge }
    })
    return result
  }
  
}
