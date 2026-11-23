import Id from '@/shared/entities/Id';
import Payment from '../entities/Payment';
import { Pagination, PaginationInput } from '@/shared/types';

export default interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  getByUnique(uniques: {
    id?: Id;
    reference?: string;
    externalReference?: string;
  }): Promise<Payment | null>;
  getPayments(pagination: PaginationInput): Promise<Pagination<Payment>>;
  getPaymentByUserid(
    pagination: PaginationInput,
    userId: Id,
  ): Promise<Pagination<Payment>>;
}
