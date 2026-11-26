export default class Name {
  constructor(private readonly name: string) {
    this.validate();
  }

  private validate(): void {
    const parts = this.name.trim().split(/\s+/);

    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    if (!firstName || firstName.length < 3) {
      throw new Error('FirstName error');
    }

    if (!lastName || lastName.length < 3) {
      throw new Error('Lastname error');
    }
  }

  public getName() {
    const [firstName, ...restNames] = this.name.trim().split(/\s+/);
    const lastName = restNames.join(' ');

    return {
      firstName,
      lastName,
      initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
    };
  }
}
