import Entity from '@/shared/entities/Entiry';
import Id from '@/shared/entities/Id';

export interface MessageProps {
  id: Id;
  chatId: Id;
  senderId: Id;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default class Message extends Entity {
  constructor(private readonly props: MessageProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.validate();
  }

  private validate(): void {
    if (!this.props.content.trim()) {
      throw new Error('Message content cannot be empty');
    }
  }

  public getChatId(): Id {
    return this.props.chatId;
  }

  public getSenderId(): Id {
    return this.props.senderId;
  }

  public getContent(): string {
    return this.props.content;
  }

  public isRead(): boolean {
    return this.props.isRead;
  }

  public markAsRead(): void {
    if (this.props.isRead) {
      return;
    }

    this.props.isRead = true;
    this.touch();
  }

  public belongsToChat(chatId: Id): boolean {
    return this.props.chatId.getValue() === chatId.getValue();
  }

  public sentBy(userId: Id): boolean {
    return this.props.senderId.getValue() === userId.getValue();
  }

  public toEntitie(): MessageProps {
    return this.props;
  }
}
