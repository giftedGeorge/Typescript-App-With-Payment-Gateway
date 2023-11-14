import { IsString, IsEmail, IsNotEmpty } from 'class-validator';


export class CreateTransferRecipientRequestModel{
    
    @IsString()
    @IsNotEmpty()
    recipientType: string;
    
    @IsString()
    @IsNotEmpty()
    recipientName: string;

    @IsString()
    @IsNotEmpty()
    recipientAccountNumber: string;

    @IsString()
    @IsNotEmpty()
    recipientBankCode: string;

    @IsString()
    @IsNotEmpty()
    currency: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEmail()
    @IsNotEmpty()
    recipientEmail: string;

    @IsString()
    @IsNotEmpty()
    recipientWalletId: string;

    constructor() {
        this.recipientType = '';
        this.recipientName = '';
        this.recipientAccountNumber = '';
        this.recipientBankCode = '';
        this.currency = '';
        this.description = '';
        this.recipientEmail = '';
        this.recipientWalletId = '';
    }
}