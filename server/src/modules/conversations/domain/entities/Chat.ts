import Entity from '@/shared/entities/Entiry';
import Id from '@/shared/entities/Id';
import Message from './Message';

export interface ChatProps {
  id: Id;
  userId: Id;
  adminId: Id;
  messages?: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export default class Chat extends Entity {
  constructor(private readonly props: ChatProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.validate();
  }

  private validate(): void {
    if (this.props.userId.getValue() === this.props.adminId.getValue()) {
      throw new Error('User and admin cannot be the same person');
    }
  }

  public getUserId(): Id {
    return this.props.userId;
  }

  public getAdminId(): Id {
    return this.props.adminId;
  }

  public getMessages(): Message[] {
    return this.props.messages ?? [];
  }

  public belongsTo(userId: Id): boolean {
    return (
      this.props.userId.getValue() === userId.getValue() ||
      this.props.adminId.getValue() === userId.getValue()
    );
  }

  public isAdmin(userId: Id): boolean {
    return this.props.adminId.getValue() === userId.getValue();
  }

  public isUser(userId: Id): boolean {
    return this.props.userId.getValue() === userId.getValue();
  }

  public addMessage(message: Message): void {
    if (message.toEntitie().chatId.getValue() !== this.props.id.getValue()) {
      throw new Error('Message does not belong to this chat');
    }

    if (!this.props.messages) {
      this.props.messages = [];
    }

    this.props.messages.push(message);
    this.touch();
  }

  public toEntitie(): ChatProps {
    return this.props;
  }
}
