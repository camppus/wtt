import Entity from '@/shared/entities/Entiry';
import Id from '@/shared/entities/Id';

export enum ChallengeContext {
  LOGIN = 'LOGIN',
  RECOVERY = 'RECOVERY',
}

export interface ChallengeProps {
  id: Id;
  context: ChallengeContext;
  code: string;
  userId: Id;
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export default class Challenge extends Entity {
  constructor(private readonly props: ChallengeProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.validate();
  }

  private validate(): void {
    if (!this.props.code) {
      throw new Error('Challenge code must has a value');
    }

    if (this.props.expiresAt <= this.props.createdAt) {
      throw new Error('Challenge expiration must be after creation');
    }

    if (this.props.maxAttempts <= 0) {
      throw new Error('Challenge max attempts must be greater than zero');
    }

    if (this.props.attempts < 0) {
      throw new Error('Challenge attempts cannot be negative');
    }
  }

  getContext(): ChallengeContext {
    return this.props.context;
  }

  public registerFailedAttempt(): void {
    if (this.props.isUsed) {
      throw new Error('Challenge has already been used');
    }

    if (this.isExpired()) {
      throw new Error('Challenge has expired');
    }

    if (this.props.attempts >= this.props.maxAttempts) {
      throw new Error('Maximum challenge attempts exceeded');
    }

    this.props.attempts += 1;

    this.touch();
  }
  getUserId(): Id {
    return this.props.userId;
  }

  getCode(): string {
    return this.props.code;
  }

  getExpiresAt(): Date {
    return this.props.expiresAt;
  }

  getAttempts(): number {
    return this.props.attempts;
  }

  isUsed(): boolean {
    return this.props.isUsed;
  }

  isExpired(): boolean {
    return new Date() >= this.props.expiresAt;
  }

  isValid(): boolean {
    return !this.isUsed() && !this.isExpired();
  }

  canAttempt(): boolean {
    return this.isValid() && this.props.attempts < this.props.maxAttempts;
  }

  verify(code: string): boolean {
    if (!this.canAttempt()) {
      return false;
    }

    this.props.attempts++;

    if (this.props.code !== code) {
      this.touch();
      return false;
    }

    this.props.isUsed = true;
    this.touch();

    return true;
  }

  markAsUsed(): void {
    if (this.isExpired()) {
      throw new Error('Cannot use an expired challenge');
    }

    if (this.props.isUsed) {
      throw new Error('Challenge has already been used');
    }

    this.props.isUsed = true;
    this.touch();
  }

  toEntitie(): ChallengeProps {
    return this.props;
  }

  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  static nowPlusFiveMinutes(): Date {
    return new Date(Date.now() + 5 * 60 * 1000);
  }
}
