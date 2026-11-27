export default class Money {
  constructor(
    private readonly value: number,
    private readonly isInitial: boolean = false,
  ) {
    if (!isInitial) {
      this.validate();
    }
  }

  static zero() {
    return new Money(0, true);
  }
  private validate() {
    if (this.value <= 1) {
      throw new Error('Money cant be 0');
    }
  }

  public getValue() {
    return this.value;
  }

  public multiply(value: number): Money {
    return new Money(this.value * value);
  }

  public isMinorThen(money: Money) {
    return this.getValue() < money.getValue();
  }

  public isZero() {
    return this.getValue() === 0;
  }

  isNegative() {
    return this.getValue() < 0;
  }
}
