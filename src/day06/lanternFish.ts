export class LanternFish {
  timer: number
  constructor(initialValue = 8) {
    this.timer = initialValue
  }

  public dayNext(): void {
    this.timer--
    if (this.timer === -1) {
      this.timer = 6
    }
  }

  public checkTimer(): LanternFish[] {
    // console.log('innerTimer', this.timer)
    if (this.timer === 0) {
      // console.log('PUSH!')
      return [new LanternFish()]
    }
    // console.log('NO PUSH!')
    return []
  }
}
