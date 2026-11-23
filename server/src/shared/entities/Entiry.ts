import Id from './Id';

export default class Entity {
  constructor(
    private readonly id: Id,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  protected touch(): void {
    this.updatedAt = new Date();
  }

  public getCreatedAt() {
    return this.createdAt;
  }
  public getUpdatedAt() {
    return this.updatedAt;
  }

  public getId() {
    return this.id;
  }

  public getStringfiedId() {
    return this.id.getValue();
  }
}
