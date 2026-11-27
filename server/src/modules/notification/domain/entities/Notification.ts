export enum NotificationType {
  SYSTEM = 'SYSTEM',
  BET = 'BET',
  PAYMENT = 'PAYMENT',
  WITHDRAWAL = 'WITHDRAWAL',
  PROGRESSION = 'PROGRESSION',
  SECURITY = 'SECURITY',
  MESSAGE = 'MESSAGE',
}
export interface NotificationProps {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export default class Notification {
  private constructor(private readonly props: NotificationProps) {}

  static create(
    props: Omit<NotificationProps, 'id' | 'isRead' | 'createdAt'>,
  ): Notification {
    return new Notification({
      id: crypto.randomUUID(),
      userId: props.userId,
      type: props.type,
      title: props.title,
      message: props.message,
      isRead: false,
      createdAt: new Date(),
    });
  }

  static restore(props: NotificationProps): Notification {
    return new Notification(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get type(): NotificationType {
    return this.props.type;
  }

  get title(): string {
    return this.props.title;
  }

  get message(): string {
    return this.props.message;
  }

  get isRead(): boolean {
    return this.props.isRead;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  markAsRead(): void {
    this.props.isRead = true;
  }

  markAsUnread(): void {
    this.props.isRead = false;
  }

  toPrimitives(): NotificationProps {
    return {
      ...this.props,
    };
  }
}
