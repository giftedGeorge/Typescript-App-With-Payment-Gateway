import { StatusCodes } from "http-status-codes";
import { ApiError } from "./apiError";

export class NotFoundError extends ApiError {

    constructor(path:string){
        super(StatusCodes.NOT_FOUND, `The requested path ${path} does not exist`);
    }
}