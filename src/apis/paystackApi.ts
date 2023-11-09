import {paystackUtils} from '../utils';
import BaseApi from './baseApi';
import dotenv from 'dotenv';
dotenv.config();

interface Metadata {
  email: string;
  name: string;
  amount: number;
}

export interface InitializePaymentArgs {
  email: string;
  amount: number;
  callback_url?: string;
  metadata: Metadata;
}

interface PaystackAPIResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface InitializePaymentResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

interface VerifyPaymentResponse {
  amount: number;
  reference: string;
  status: string;
  metadata: Metadata;
}

class PaystackApi extends BaseApi {
  requestInit = {
    headers: {
      'Content-Type': 'Application/json',
      authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY!}`,
    },
  };

  constructor() {
    super(process.env.PAYSTACK_BASE_URL!);
  }

  initializePayment = async (paymentDetails: InitializePaymentArgs) => {
    const response = await this.post<
      PaystackAPIResponse<InitializePaymentResponse>
    >('/transaction/initialize', paymentDetails, undefined, this.requestInit);

    return paystackUtils.convertObjectFromSnakeToCamelCase<InitializePaymentResponse>(
      response.data
    );
  };

  verifyPayment = (paymentReference: string) =>
    this.get<PaystackAPIResponse<VerifyPaymentResponse>>(
      `/transaction/verify/${paymentReference}`,
      undefined,
      this.requestInit
    );
}

export const paystackApiInstance = new PaystackApi();

