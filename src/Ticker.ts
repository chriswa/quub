export interface ITickerEventConsumer {
  onFixedUpdate?(): void
  onAnimationFrame(): void
}

export default class Ticker {

  constructor(private eventConsumer: ITickerEventConsumer) {
  }

  public dt = 0
  public tt = 0
  public pt = 0 // partial time
  public tps = 30
  public maxTicksPerRender = 1

  public isPaused = false
  public isStepping = false

  public pause() {
    this.isPaused = true
  }
  public step() {
    this.isPaused = false
    this.isStepping = true
  }
  public play() {
    this.isPaused = false
    this.isStepping = false
  }

  isCancellingFixedUpdate = false
  public cancelFixedUpdate() {
    this.isCancellingFixedUpdate = true
  }

  public start() {
    let lastTime = performance.now()
    const mainLoop = () => {

      const now = performance.now()

      if (!this.isPaused) {

        this.dt = now - lastTime
        this.tt += this.dt

        const tickDuration = 1000 / this.tps
        this.pt += this.dt / tickDuration

        const ticksElapsed = Math.floor(this.pt)
        let ticksPending = ticksElapsed

        if (ticksPending > this.maxTicksPerRender) {
          ticksPending = this.maxTicksPerRender
          this.pt = this.maxTicksPerRender
        }

        if (this.isStepping && ticksPending > 0) {
          ticksPending = 1
          this.pt = 1
          this.isPaused = true
        }

        // call onFixedUpdate 0..maxTicksPerRender times
        for (let i = 0; i < ticksPending; i += 1) {
          let isTimeAdvancing = true
          if (this.eventConsumer.onFixedUpdate !== undefined) {
            this.eventConsumer.onFixedUpdate()
            if (this.isCancellingFixedUpdate) {
              this.isCancellingFixedUpdate = false
              this.pt = Math.floor(this.pt)
              isTimeAdvancing = false
            }
          }
          if (isTimeAdvancing) {
            this.pt -= 1
          }
        }

      }

      lastTime = now

      // call onAnimationFrame
      this.eventConsumer.onAnimationFrame()

      requestAnimationFrame(mainLoop)
    }
    requestAnimationFrame(mainLoop)
  }

}
