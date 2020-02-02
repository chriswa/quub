/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-magic-numbers */
/* eslint-disable init-declarations */
/* eslint-disable no-mixed-operators */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */

export type Vec3 = Float32Array

export function create(x?: number, y?: number, z?: number): Vec3 {
  const dst = new Float32Array(3)
  if (x) {
    dst[ 0 ] = x
  }
  if (y) {
    dst[ 1 ] = y
  }
  if (z) {
    dst[ 2 ] = z
  }
  return dst
}

export function add(a: Vec3, b: Vec3, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  dst[ 0 ] = a[ 0 ] + b[ 0 ]
  dst[ 1 ] = a[ 1 ] + b[ 1 ]
  dst[ 2 ] = a[ 2 ] + b[ 2 ]
  return dst
}

export function subtract(a: Vec3, b: Vec3, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  dst[ 0 ] = a[ 0 ] - b[ 0 ]
  dst[ 1 ] = a[ 1 ] - b[ 1 ]
  dst[ 2 ] = a[ 2 ] - b[ 2 ]
  return dst
}

export function lerp(a: Vec3, b: Vec3, t: number, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  dst[ 0 ] = (1 - t) * a[ 0 ] + t * b[ 0 ]
  dst[ 1 ] = (1 - t) * a[ 1 ] + t * b[ 1 ]
  dst[ 2 ] = (1 - t) * a[ 2 ] + t * b[ 2 ]
  return dst
}

export function mulScalar(v: Vec3, k: number, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  dst[ 0 ] = v[ 0 ] * k
  dst[ 1 ] = v[ 1 ] * k
  dst[ 2 ] = v[ 2 ] * k
  return dst
}

export function divScalar(v: Vec3, k: number, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  dst[ 0 ] = v[ 0 ] / k
  dst[ 1 ] = v[ 1 ] / k
  dst[ 2 ] = v[ 2 ] / k
  return dst
}

export function cross(a: Vec3, b: Vec3, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  const t1 = a[ 2 ] * b[ 0 ] - a[ 0 ] * b[ 2 ]
  const t2 = a[ 0 ] * b[ 1 ] - a[ 1 ] * b[ 0 ]
  dst[ 0 ] = a[ 1 ] * b[ 2 ] - a[ 2 ] * b[ 1 ]
  dst[ 1 ] = t1
  dst[ 2 ] = t2
  return dst
}

export function dot(a: Vec3, b: Vec3): number {
  return a[ 0 ] * b[ 0 ] + a[ 1 ] * b[ 1 ] + a[ 2 ] * b[ 2 ]
}

export function length(v: Vec3): number {
  return Math.sqrt(v[ 0 ] * v[ 0 ] + v[ 1 ] * v[ 1 ] + v[ 2 ] * v[ 2 ])
}

export function lengthSq(v: Vec3): number {
  return v[ 0 ] * v[ 0 ] + v[ 1 ] * v[ 1 ] + v[ 2 ] * v[ 2 ]
}

export function distance(a: Vec3, b: Vec3): number {
  const dx = a[ 0 ] - b[ 0 ]
  const dy = a[ 1 ] - b[ 1 ]
  const dz = a[ 2 ] - b[ 2 ]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

export function distanceSq(a: Vec3, b: Vec3): number {
  const dx = a[ 0 ] - b[ 0 ]
  const dy = a[ 1 ] - b[ 1 ]
  const dz = a[ 2 ] - b[ 2 ]
  return dx * dx + dy * dy + dz * dz
}

export function manhattan(a: Vec3, b: Vec3): number {
  const dx = a[ 0 ] - b[ 0 ]
  const dy = a[ 1 ] - b[ 1 ]
  const dz = a[ 2 ] - b[ 2 ]
  return Math.abs(dx) + Math.abs(dy) + Math.abs(dz)
}

export function normalize(a: Vec3, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  const lenSq = a[ 0 ] * a[ 0 ] + a[ 1 ] * a[ 1 ] + a[ 2 ] * a[ 2 ]
  const len = Math.sqrt(lenSq)
  if (len > 0.00001) {
    dst[ 0 ] = a[ 0 ] / len
    dst[ 1 ] = a[ 1 ] / len
    dst[ 2 ] = a[ 2 ] / len
  }
  else {
    dst[ 0 ] = 0
    dst[ 1 ] = 0
    dst[ 2 ] = 0
  }
  return dst
}

export function negate(v: Vec3, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  dst[ 0 ] = -v[ 0 ]
  dst[ 1 ] = -v[ 1 ]
  dst[ 2 ] = -v[ 2 ]
  return dst
}

export function copy(v: Vec3, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  dst[ 0 ] = v[ 0 ]
  dst[ 1 ] = v[ 1 ]
  dst[ 2 ] = v[ 2 ]
  return dst
}

export function multiply(a: Vec3, b: Vec3, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  dst[ 0 ] = a[ 0 ] * b[ 0 ]
  dst[ 1 ] = a[ 1 ] * b[ 1 ]
  dst[ 2 ] = a[ 2 ] * b[ 2 ]
  return dst
}

export function divide(a: Vec3, b: Vec3, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  dst[ 0 ] = a[ 0 ] / b[ 0 ]
  dst[ 1 ] = a[ 1 ] / b[ 1 ]
  dst[ 2 ] = a[ 2 ] / b[ 2 ]
  return dst
}

export function set(v: Vec3, x = 0, y = 0, z = 0) {
  v[ 0 ] = x
  v[ 1 ] = y
  v[ 2 ] = z
}

export function dot3(v: Vec3, x: number, y: number, z: number): number {
  return v[ 0 ] * x + v[ 1 ] * y + v[ 2 ] * z
}

export function dot2(v: Vec3, x: number, y: number): number {
  return v[ 0 ] * x + v[ 1 ] * y
}

export function clone(v: Vec3): Vec3 {
  const dst = new Float32Array(3)
  dst[ 0 ] = v[ 0 ]
  dst[ 1 ] = v[ 1 ]
  dst[ 2 ] = v[ 2 ]
  return dst
}

export function eulerToDirectional(v: Vec3, dst?: Vec3): Vec3 {
  dst = dst || new Float32Array(3)
  dst[ 0 ] = Math.sin(-v[ 0 ]) * Math.cos(v[ 1 ])
  dst[ 1 ] = Math.sin(v[ 1 ])
  dst[ 2 ] = -Math.cos(-v[ 0 ]) * Math.cos(v[ 1 ])
  return dst
}
