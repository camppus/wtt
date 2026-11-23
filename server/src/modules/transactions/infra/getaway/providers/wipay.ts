import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { IPaymentGetaway } from '..';
import Money from '@/shared/entities/Money';
import Id from '@/shared/entities/Id';

interface WipayAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface WipayReturnType {
  paymentUrl: string;
  provider: 'WIPAY';
  redirect: true;
}

@Injectable()
export default class WipayService implements IPaymentGetaway<WipayReturnType> {
  private readonly api_key = process.env.WIPAY_API_KEY ?? '';
  private readonly api_url = process.env.WIPAY_API_URL ?? '';
  private readonly client_secret = process.env.WIPAY_CLIENT_SECRET ?? '';

  constructor() {
    if (!this.api_key || !this.api_url || !this.client_secret) {
      throw new Error(
        'Wipay API credentials are not set in environment variables',
      );
    }
  }

  public async pay(input: {
    amount: Money;
    userid: Id;
    reference: string;
  }): Promise<WipayReturnType> {
    const { amount, reference, userid } = input;
    const authResponse = await this.authenticate();
    try {
      const response = await axios.post(
        `${this.api_url}/payment`,
        {
          amount: amount.getValue(),
          userId: userid.getValue(),
          currency: 'aoa',
          reference_id: reference,
          customer: '923000000',
          success_url: 'https://your-site.ao/checkout/success',
          failure_url: 'https://your-site.ao/checkout/failure',
          callback_url: 'https://your-site.ao/webhooks/wipay',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authResponse.access_token}`,
          },
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400,
        },
      );
      const paymentUrl = response.headers.location as string | undefined;
      if (!paymentUrl) {
        throw new Error('Failed to obtain payment URL from Wipay');
      }
      return {
        paymentUrl,
        provider: 'WIPAY',
        redirect: true,
      };
    } catch (error) {
      console.error('Erro ao processar pagamento', error);
      throw new Error('Erro ao processar pagamento');
    }
  }

  private async authenticate(): Promise<WipayAuthResponse> {
    try {
      const { data } = await axios.post<WipayAuthResponse>(
        `${this.api_url}/v1/credentials/token`,
        {
          client_secret: this.client_secret,
          grant_type: 'client_credentials',
          client_id: this.api_key,
          scope: 'payment',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!data.access_token) {
        throw new Error('Failed to obtain access token from Wipay');
      }
      return data;
    } catch (error) {
      console.error('Erro ao autenticar com Wipay', error);
      throw new Error('Erro ao autenticar com Wipay');
    }
  }
}
