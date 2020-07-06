'use strict';

import { STATUS_CODES } from '../Constants/StatusCodes';
import { Response } from 'express';
import { StringExtensions } from '../Extensions/StringExtensions';
import { Paginate } from './Paginate';


class ResponseDto {

    public static ok = (status: boolean, data: any, response: Response, query: any = {}, totalDocuments?: number): any => {
        const { paginate } = query;
        
        if (StringExtensions.toBoolean(paginate)) {
            const paginate = Paginate.getPaginateObject(query, totalDocuments);
            return response.status(STATUS_CODES.OK).send({ status, data, paginate });
        }

        return response.status(STATUS_CODES.OK).send({ status, data });
    }

    public static created = (status: boolean, data: any, response: Response): any => response.status(STATUS_CODES.CREATED).send({ status, data });

    public static noContent = (status: boolean, response: Response): any => response.status(STATUS_CODES.NO_CONTENT).send({ status, data: {} });

    public static badRequest = (status: boolean, response: Response, key: string): any => response.status(STATUS_CODES.BAD_REQUEST).send({ status, message: response.__(key) });

    public static notFound = (status: boolean, response: Response, key: string): any => response.status(STATUS_CODES.NOT_FOUND).send({ status, message: response.__(key) });

    public static unauthorize = (status: boolean, response: Response, key: string): any => response.status(STATUS_CODES.UNAHUTORIZE).send({ status, message: response.__(key) });

    public static internalServerError = (status: boolean, response: Response, message: string): any => response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ status, message: response.__(message) });

}

export { ResponseDto };