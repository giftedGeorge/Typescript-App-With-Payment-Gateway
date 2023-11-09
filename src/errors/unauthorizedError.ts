import { StatusCodes } from "http-status-codes";
import { ApiError } from "./apiError";

export class UnauthorizedError extends ApiError {

    constructor(message:string){
        super(StatusCodes.UNAUTHORIZED, message);
    }
}