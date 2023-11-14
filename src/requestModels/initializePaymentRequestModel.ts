import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';


export class InitializePaymentRequestModel{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty({ message: 'Callback URL is required' })
    callbackUrl: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    constructor() {
        this.name = '';
        this.amount = 0;
        this.callbackUrl = '';
        this.email = '';
      }
}