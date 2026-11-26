import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import Id from '@/shared/entities/Id';
import {
  CurrentUserId,
  IsAdminDecorator,
} from '@/modules/auth/infra/http/userContextDecorator';
import CreatePaymentUseCase from '../../application/usecase/createPaymentUseCase';
import CreateWidthdrawslsUseCase from '../../application/usecase/createWidthdrawlsUseCase';
import GetPaymentUseCases from '../../application/usecase/getPaymentUseCase';
import GetWidthrawlsUseCase from '../../application/usecase/getWitdhDrawlsUseCase';
import CreatePaymentDto from '../../application/dto/createPaymentDto';
import CreateWidthDralwsDto from '../../application/dto/createWidthdrawlsUseCase';
import ToogleWidthdralwsDto from '../../application/dto/toogleWidthDralwsDto';
import ToggleWidthDrawlsUseCase from '../../application/usecase/toggleWidthdrawlsUseCase';
import IsAdminGuard from '@/modules/auth/infra/http/isAdminGuard';
import IsActiveUserGuard from '@/modules/auth/infra/http/userStatusGuard';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(IsActiveUserGuard)
export default class TransactionController {
  constructor(
    private readonly createPaymentUC: CreatePaymentUseCase,
    private readonly createWithdrawalUC: CreateWidthdrawslsUseCase,
    private readonly getPaymentsUC: GetPaymentUseCases,
    private readonly getWithdrawalsUC: GetWidthrawlsUseCase,
    private readonly toggleWithdrawslUc: ToggleWidthDrawlsUseCase,
  ) {}

  @Post('payments')
  @ApiOperation({ summary: 'Criar um pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento criado' })
  public async createPayment(
    @CurrentUserId() userId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.createPaymentUC.handle(dto, new Id(userId));
  }

  @Get('payments')
  @ApiOperation({ summary: 'Listar pagamentos do usuário autenticado' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  public async getMyPayments(
    @CurrentUserId() userId: string,
    @IsAdminDecorator() isadmin: boolean,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.getPaymentsUC.getAll({
      pagination: { page: Number(page), limit: Number(limit) },
      userId: new Id(userId),
      isAdmin: isadmin,
    });
  }

  @Post('withdrawals')
  @ApiOperation({ summary: 'Solicitar um saque' })
  @ApiResponse({ status: 201, description: 'Solicitação de saque criada' })
  public async createWithdrawal(
    @CurrentUserId() userId: string,
    @Body() dto: CreateWidthDralwsDto,
  ) {
    return this.createWithdrawalUC.handle(dto, new Id(userId));
  }

  @UseGuards(IsAdminGuard)
  @Put('withdrawals/:id')
  @ApiOperation({ summary: 'Solicitar um saque' })
  @ApiResponse({ status: 201, description: 'Solicitação de saque criada' })
  public async toggleWithdalws(
    @CurrentUserId() userId: string,
    @Body() dto: ToogleWidthdralwsDto,
    @Param('id') id: string,
  ) {
    return this.toggleWithdrawslUc.handle({
      ...dto,
      userId: new Id(userId),
      id: new Id(id),
    });
  }

  @Get('withdrawals')
  @ApiOperation({ summary: 'Listar saques do usuário autenticado' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  public async getMyWithdrawals(
    @CurrentUserId() userId: string,
    @IsAdminDecorator() isadmin: boolean,
    @Query('page')
    page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.getWithdrawalsUC.getAll({
      pagination: { page: Number(page), limit: Number(limit) },
      userId: new Id(userId),
      isAdmin: isadmin,
    });
  }
}
