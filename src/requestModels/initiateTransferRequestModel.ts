import { IsString, IsNotEmpty, IsNumber } from 'class-validator';


export class InitiateTransferRequestModel{
    
    @IsString()
    @IsNotEmpty()
    source: string;
    
    @IsString()
    @IsNotEmpty()
    reason: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    recipientCode: string;

    @IsString()
    @IsNotEmpty()
    recipientAccountNo: string;
    
    @IsString()
    @IsNotEmpty()
    recipientBankName: string;

    @IsString()
    @IsNotEmpty()
    recipientaccountName: string;

    @IsString()
    @IsNotEmpty()
    recipientWalletId: string;

    constructor() {
        this.source = '';
        this.reason = '';
        this.amount = 0;
        this.recipientCode = '';
        this.recipientAccountNo = '';
        this.recipientBankName = '';
        this.recipientaccountName = '';
        this.recipientWalletId = '';
    }
}