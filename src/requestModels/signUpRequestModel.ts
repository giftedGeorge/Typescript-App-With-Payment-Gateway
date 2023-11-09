import { BaseRequestModel } from "./baseRequestModel";
import { IsEnum, IsBoolean, IsNotEmpty } from 'class-validator';
import {UserType} from '../enums';


export class SignUpRequestModel extends BaseRequestModel{
    @IsEnum(UserType, { message: 'Value must be either 1 or 2' })
    @IsNotEmpty()
    userType: UserType;

    @IsBoolean()
    @IsNotEmpty()
    isInterestAllowed: boolean;

    constructor() {
        super();
        this.userType = 1;
        this.isInterestAllowed = false;
      }
}