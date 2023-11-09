import { BaseRequestModel } from "./baseRequestModel";
import {IsString, IsNotEmpty, Length } from 'class-validator';


export class CreatePinRequestModel extends BaseRequestModel{
    @IsString()
    @IsNotEmpty()
    @Length(6, 6, { message: 'Value must be exactly 6 characters' })
    pin: string;

    constructor() {
        super();
        this.pin = '';
    }
}