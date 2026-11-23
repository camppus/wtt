export default class Url {
  constructor(private readonly value: string) {
    this.validate();
  }

  private validate() {
    new URL(this.value);
  }
  public getValue() {
    return this.value;
  }
}
