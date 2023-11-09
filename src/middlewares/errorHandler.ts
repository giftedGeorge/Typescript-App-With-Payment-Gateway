import { StatusCodes } from "http-status-codes";
import { ApiError } from "../errors";
import { NextFunction, Request, Response } from "express";

export class ErrorHandler {
    static handle = async (
        err:ApiError, 
        req:Request, 
        res:Response, 
        next:NextFunction 
    ) => {
        const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).json({
            success: false,
            message: err.message,
        })
    }
}