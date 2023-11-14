import { IsString, IsNotEmpty, Length } from 'class-validator';


export class FinalizeTransferRequestModel{
    
    @IsString()
    @IsNotEmpty()
    transferCode: string;
    
    @IsString()
    @Length(6,6)
    @IsNotEmpty()
    otp: string;

    constructor() {
        this.transferCode = '';
        this.otp = '';        
    }
}