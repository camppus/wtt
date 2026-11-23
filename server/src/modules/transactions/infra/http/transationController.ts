import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import Id from '@/shared/entities/Id';
import { CurrentUserId } from '@/infra/http/decorators/userId.decorator';

import CreatePaymentUseCase from '../../application/usecase/createPaymentUseCase';
import CreateWidthdrawslsUseCase from '../../application/usecase/createWidthdrawlsUseCase';
import GetPaymentUseCases from '../../application/usecase/getPaymentUseCase';
import GetWidthrawlsUseCase from '../../application/usecase/getWitdhDrawlsUseCase';

import { CreatePaymentDto } from '../../application/dto/createPaymentDto';
import { CreateWidthdrawlsDto } from '../../application/dto/createWidthdrawlsDto';

@ApiTags('Transactions')
@Controller('transactions')
export default class TransactionController {
  constructor(
    private readonly createPaymentUC: CreatePaymentUseCase,
    private readonly createWithdrawalUC: CreateWidthdrawslsUseCase,
    private readonly getPaymentsUC: GetPaymentUseCases,
    private readonly getWithdrawalsUC: GetWidthrawlsUseCase,
  ) {}

  @Post('payments')
  @ApiOperation({ summary: 'Criar um pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento criado' })
  public async createPayment(
    @CurrentUserId() userId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.createPaymentUC.handle(new Id(userId), dto);
  }

  @Get('payments/me')
  @ApiOperation({ summary: 'Listar pagamentos do usuário autenticado' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  public async getMyPayments(
    @CurrentUserId() userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.getPaymentsUC.handle(
      { page: Number(page), limit: Number(limit) },
      new Id(userId),
    );
  }

  @Post('withdrawals')
  @ApiOperation({ summary: 'Solicitar um saque' })
  @ApiResponse({ status: 201, description: 'Solicitação de saque criada' })
  public async createWithdrawal(
    @CurrentUserId() userId: string,
    @Body() dto: CreateWidthdrawlsDto,
  ) {
    return this.createWithdrawalUC.handle(new Id(userId), dto);
  }

  @Get('withdrawals/me')
  @ApiOperation({ summary: 'Listar saques do usuário autenticado' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  public async getMyWithdrawals(
    @CurrentUserId() userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.getWithdrawalsUC.handle(
      { page: Number(page), limit: Number(limit) },
      new Id(userId),
    );
  }
}
