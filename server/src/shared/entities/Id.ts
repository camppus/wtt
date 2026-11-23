export default class Id {
  constructor(private readonly value: string) {}

  public static generate(): Id {
    return new Id(crypto.randomUUID());
  }

  public getValue() {
    return this.value;
  }
}
