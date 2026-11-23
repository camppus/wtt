export default class Name {
  constructor(private readonly name: string) {
    this.validate();
  }

  private validate() {
    const [firstName, ...restNames] = this.name.split(' ');
    const lastName = restNames.join();
    if (!firstName || firstName.length < 3) {
      throw new Error('FirstName error');
    }
    if (!lastName || lastName.length < 3) {
      throw new Error('Lastname error');
    }
  }

  public getName() {
    const [firstName, ...restNames] = this.name.split(' ');
    const lastName = restNames.join();
    return {
      firstName,
      lastName,
      initials: firstName[0] + lastName[0],
    };
  }
}
