import { IsString, IsNotEmpty } from 'class-validator';


export class ResolveAccountRequestModel{
    @IsString()
    @IsNotEmpty()
    accountNumber: string;

    @IsString()
    @IsNotEmpty()
    bankCode: string;

    constructor() {
        this.accountNumber = '';
        this.bankCode = '';
    }
}