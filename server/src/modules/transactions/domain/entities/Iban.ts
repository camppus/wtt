export default class Iban {
  private readonly value: string;

  constructor(value: string) {
    this.value = value.replace(/\s+/g, '').toUpperCase();
    this.validate();
  }

  private validate(): void {
    if (!/^AO\d{23}$/.test(this.value)) {
      throw new Error('Invalid Angolan IBAN format');
    }

    const rearranged = this.value.slice(4) + this.value.slice(0, 4);

    const numeric = rearranged.replace(/[A-Z]/g, (char) =>
      String(char.charCodeAt(0) - 55),
    );

    let remainder = 0;

    for (const digit of numeric) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }

    if (remainder !== 1) {
      throw new Error('Invalid IBAN checksum');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(iban: Iban): boolean {
    return this.value === iban.value;
  }
}
