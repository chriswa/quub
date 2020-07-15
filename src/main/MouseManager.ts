import * as v3 from '~/math/v3'
import EventEmitter from 'eventemitter3'

function setVec3FromMouseEvent(v: v3.Vec3, ev: MouseEvent) {
  return v3.set(v, ev.pageX, ev.pageY)
}

const dragManhattanThreshold = 4

export default class MouseManager extends EventEmitter {
  canvas: HTMLCanvasElement
  isMouseDown = false
  isDragging = false
  pos = v3.create()
  dragStart = v3.create()

  constructor(canvas: HTMLCanvasElement) {
    super()
    this.canvas = canvas
    this.initEventListeners()
  }

  initEventListeners() {
    this.canvas.addEventListener('mousedown', (ev) => {
      this.isMouseDown = true
      this.isDragging = false
      setVec3FromMouseEvent(this.dragStart, ev)
    })
    this.canvas.addEventListener('mouseup', (ev) => {
      setVec3FromMouseEvent(this.pos, ev)
      if (this.isDragging) {
        this.emit('dragEnd', this.pos, this.dragStart)
      }
      else {
        this.emit('click', this.pos)
      }
      this.isMouseDown = false
      this.isDragging = false
    })
    this.canvas.addEventListener('mousemove', (ev) => {
      setVec3FromMouseEvent(this.pos, ev)
      // has the user dragged the mouse far enough to trigger a drag?
      if (this.isMouseDown) {
        if (!this.isDragging) {
          if (v3.manhattan(this.pos, this.dragStart) >= dragManhattanThreshold) {
            this.isDragging = true
            this.emit('dragStart', this.pos)
          }
        }
      }
      if (this.isDragging) {
        this.emit('dragMove', this.pos, this.dragStart)
      }
      else {
        this.emit('hover', this.pos)
      }
    })
    this.canvas.addEventListener('wheel', (ev) => {
      setVec3FromMouseEvent(this.pos, ev)
      const wheelDirection = ev.deltaY > 0 ? 1 : -1
      this.emit('wheel', wheelDirection, this.pos)
    })
  }
}
