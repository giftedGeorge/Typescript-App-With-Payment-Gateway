import { StatusCodes } from "http-status-codes";
import { ApiError } from "./apiError";

export class ResourceNotFoundError extends ApiError {

    constructor(message:string){
        super(StatusCodes.NOT_FOUND, message);
    }
}