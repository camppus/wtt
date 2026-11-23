import Id from '@/shared/entities/Id';
import { TransactionStatus } from './TransactionStatus';
import Money from '@/shared/entities/Money';
import { TransationsMehtod } from './TransationsMehtod';
import Url from '@/shared/entities/Url';
import Entity from '@/shared/entities/Entiry';
import { PhoneNumber } from '@/shared/entities/PhoneNumber';
import Iban from './Iban';

export interface WidthdrawlsProps {
  id: Id;
  userId: Id;
  status: TransactionStatus;
  fee: Money;
  amount: Money;
  coordnate: string;
  method: TransationsMehtod;
  replayedById?: Id;
  fileUrl?: Url;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  cancelledAt?: Date;
}

export default class Widthdrawsl extends Entity {
  constructor(private readonly props: WidthdrawlsProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this.validateCoordante();
  }

  public belongsTo(userId: Id) {
    return this.props.userId.getValue() === userId.getValue();
  }
  public anextTo(userid: Id) {
    this.props.replayedById = userid;
    this.touch();
  }

  public setNotes(notes: string) {
    if (!notes) {
      throw new Error('Notes error');
    }
    this.props.notes = notes;
    this.touch();
  }

  public approve(fileUrl: string) {
    if (this.props.status !== TransactionStatus.PENDING) {
      throw new Error('Only pending payment can be approved');
    }
    this.props.status = TransactionStatus.SUCCESS;
    this.props.fileUrl = new Url(fileUrl);
    this.props.paidAt = new Date();
    this.touch();
  }

  public fail() {
    if (this.props.status !== TransactionStatus.PENDING) {
      throw new Error('Only pending payment can be cancelled');
    }
    this.props.status = TransactionStatus.FAILED;
    this.props.cancelledAt = new Date();
    this.touch();
  }

  public toEntitie(): WidthdrawlsProps {
    return this.props;
  }

  private validateCoordante(): void {
    const validationStrategies: Record<
      TransationsMehtod,
      new (value: string) => unknown
    > = {
      EXPRESS: PhoneNumber,
      IBAN: Iban,
    };
    const SelectedValidator = validationStrategies[this.props.method];
    new SelectedValidator(this.props.coordnate);
  }
}
