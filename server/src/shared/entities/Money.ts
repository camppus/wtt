export default class Money {
  constructor(private readonly value: number) {
    this.validate();
  }

  static zero(): Money {
    return new Money(0);
  }

  public format(): string {
    return `${this.getValue().toLocaleString('pt-PT')} Kz`;
  }

  private validate(): void {
    if (!Number.isFinite(this.value)) {
      throw new Error('Money value must be a valid number');
    }

    if (this.value < 0) {
      throw new Error('Money cannot be negative');
    }
  }

  public getValue(): number {
    return this.value;
  }

  public multiply(value: number): Money {
    return new Money(this.value * value);
  }

  public subtract(value: Money): Money {
    return new Money(this.value - value.getValue());
  }

  public isMinorThan(money: Money): boolean {
    return this.value < money.getValue();
  }

  public isNotMinor(money: Money): boolean {
    return this.value >= money.getValue();
  }

  public isZero(): boolean {
    return this.value === 0;
  }

  public isNegative(): boolean {
    return this.value < 0;
  }

  public static ensureIsPayable(value: number): void {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('O valor da aposta deve ser positivo');
    }
  }
}
