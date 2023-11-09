import {IsString, IsNotEmpty, Length, Validate } from 'class-validator';
import { StartsWithPlus234Constraint } from './customValidator';

export class BaseRequestModel {
    @IsString()
    @IsNotEmpty()
    @Length(14, 14, { message: 'Value must be exactly 14 characters long' })
    @Validate(StartsWithPlus234Constraint)
    phoneNumber: string;

    constructor() {
        this.phoneNumber = '';
      }
}