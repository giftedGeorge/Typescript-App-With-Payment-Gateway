import {paystackUtils} from '../utils';
import BaseApi from './baseApi';
import dotenv from 'dotenv';
dotenv.config();

interface Metadata {
  email?: string;
  name: string;
  amount?: number;
  walletId?: string
}

export interface CreateCustomerArgs {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface CreateTransferRecipientArgs {
  type: string;
  name: string;
  account_number: string;
  bank_code: string;
  currency: string;
  description?: string;
  metadata?: Metadata;
}

export interface InitiateTransferArgs {
  source: string;
  reason: string; 
  amount: number;
  recipient: string;
  reference: string;
}

export interface InitializePaymentArgs {
  email: string;
  amount: number;
  callback_url?: string;
  reference?: string;
  metadata: Metadata;
}

export interface FinalizeTransferArgs {
  transfer_code: string; 
  otp: string;
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

interface CreateCustomerResponse {
  email: string;
  customerCode: string;
  id: number;
}

interface Bank {
  name: string;
  code: string;
  currency: string;
}

interface ResolveAccountNumberResponse {
  accountNumber: string;
  accountName: string;
}

interface ListBanksResponse {
  data: Bank[];
}

interface CreateTransferRecipientResponse {
  type: string;
  recipientCode: string;
  currency: string;
  details: object;
}

interface InitiateTransferResponse {
  amount: number;
  transferCode: string;
  currency: string;
  reason: string;
  recipient: string;
}

interface FinalizeTransferResponse {
  amount: number;
  currency: string;
  reference: string;
  source: string;
  status: string;
}

interface VerifyTransferResponse {
  recipient: {
    type: string;
    currency: string;
    name: string;
    details: {
      accountNumber: string;
      accountName: string;
      bankCode: string;
      bankName: string;
    },
    metadata: Metadata;
    description: string;
    recipientCode: string;
    email: string;
  },
  amount: number;
  currency: string;
  reference: string;
  source: string;
  reason: string;
  status: string;
  transferCode: string;
  id: number;
  createdAt: string;
  updatedAt: string;
  metadata: Metadata;
};

interface GetRecipientResponse {
  domain: string;
  type: string;
  currency: string;
  name: string;
  details: {
    account_number: string;
    account_name: string;
    bank_code: string;
    bank_name: string;
  }
}


class PaystackApi extends BaseApi {
  requestInit = {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY!}`,
    },
  };

  constructor() {
    super(process.env.PAYSTACK_BASE_URL!);
  }

  createCustomer = async (customerDetails: CreateCustomerArgs) => {
    const response = await this.post<PaystackAPIResponse<CreateCustomerResponse>
    >('/customer', customerDetails, undefined, this.requestInit);

    return paystackUtils.
    convertObjectFromSnakeToCamelCase<CreateCustomerResponse>(
      response.data
    )
  }

  initializePayment = async (paymentDetails: InitializePaymentArgs) => {
    const response = await this.post<
      PaystackAPIResponse<InitializePaymentResponse>
    >('/transaction/initialize', paymentDetails, undefined, this.requestInit);

    return paystackUtils.convertObjectFromSnakeToCamelCase<InitializePaymentResponse>(
      response.data
    );
  };

  verifyPayment = async (paymentReference: string) => {
    return await this.get<PaystackAPIResponse<VerifyPaymentResponse>>(
      `/transaction/verify/${paymentReference}`,
      undefined,
      this.requestInit
    );
  }

  createTransferRecipient = async (transferDetails: CreateTransferRecipientArgs) => {
    const response = await this.post<
      PaystackAPIResponse<CreateTransferRecipientResponse>
    >('/transferrecipient', transferDetails, undefined, this.requestInit);

    return paystackUtils.convertObjectFromSnakeToCamelCase<CreateTransferRecipientResponse>(
      response.data
    );
  };

  getRecipientCode = async (recipientCode: string) => {
    const response = await this.get<PaystackAPIResponse<GetRecipientResponse>>(
      `/transferrecipient/${recipientCode}`,
      undefined,
      this.requestInit
    );

    return paystackUtils.convertObjectFromSnakeToCamelCase<GetRecipientResponse>(
      response.data
    );
  }

  initiateTransfer = async (transferDetails: InitiateTransferArgs) => {
    const response = await this.post<PaystackAPIResponse<InitiateTransferResponse>>(
      '/transfer',
      transferDetails,
      undefined,
      this.requestInit
    );

    return paystackUtils.convertObjectFromSnakeToCamelCase<InitiateTransferResponse>(
      response.data
    );
  }

  finalizeTransfer = async (transferDetails: FinalizeTransferArgs) => {
    const response =  await this.post<PaystackAPIResponse<FinalizeTransferResponse>>(
      '/transfer/finalize_transfer',
      transferDetails,
      undefined,
      this.requestInit
    );

    return paystackUtils.convertObjectFromSnakeToCamelCase<FinalizeTransferResponse>(
      response.data
    );
  }
    
  listBanks = async (currency: string) => {
  const response = await this.get<PaystackAPIResponse<ListBanksResponse>>(
      `/bank?currency=${currency}`,
      undefined,
      this.requestInit
    );

    return paystackUtils.convertObjectFromSnakeToCamelCase<ListBanksResponse>(
      response
    );
  }

  resolveAccountNumber = async (accountNumber: string, bankCode: string) => {
    const response = await this.get<PaystackAPIResponse<ResolveAccountNumberResponse>>(
      `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      undefined,
      this.requestInit
    );

    return paystackUtils.convertObjectFromSnakeToCamelCase<ResolveAccountNumberResponse>(
      response.data
    );
  }
  
  verifyTransfer = async (transferReference: string) => {
    const response = await this.get<PaystackAPIResponse<VerifyTransferResponse>>(
      `/transfer/verify/${transferReference}`,
      undefined,
      this.requestInit
    );

    return paystackUtils.convertObjectFromSnakeToCamelCase<VerifyTransferResponse>(
      response.data
    );
  }

  
}

export const paystackApiInstance = new PaystackApi();