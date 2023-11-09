import { BaseRequestModel } from "./baseRequestModel";
import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';


export class CreateUserRequestModel extends BaseRequestModel{
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @Length(11, 11, { message: 'Value must be exactly 11 characters' })
    @IsNotEmpty()
    bvn: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    constructor() {
        super();
        this.firstName = '';
        this.lastName = '';
        this.bvn = '';
        this.email = '';
      }
}