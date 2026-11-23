export default class Password {
  constructor(private readonly value: string) {
    this.validate();
  }

  private validate() {
    if (this.value.length < 8) {
      throw new Error('Password lengh must be great then 8');
    }
  }

  public getValue() {
    return this.value;
  }
}
