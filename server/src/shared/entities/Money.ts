export default class Money {
  constructor(
    private readonly value: number,
    private readonly isInitial: boolean = false,
  ) {
    if (!isInitial) {
      this.validate();
    }
  }

  private validate() {
    if (this.value <= 1) {
      throw new Error('Money cant be 0');
    }
  }

  public getValue() {
    return this.value;
  }
}
