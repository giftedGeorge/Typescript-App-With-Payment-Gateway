import { StatusCodes } from "http-status-codes";
import { ApiError } from "./apiError";

export class BadRequestError extends ApiError {

    constructor(message:string){
        super(StatusCodes.BAD_REQUEST, message);
    }
}