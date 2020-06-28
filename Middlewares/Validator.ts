'use strict';

import { STATUS_CODES } from '../Constants/StatusCodes';
import { ObjectID } from 'mongodb';
import { Request, Response, NextFunction } from 'express';

class Validator {

    public isValidObjectId = (request: Request, response: Response, next: NextFunction): any => {
        try {
            const { params: { id } } = request;
            const isInvalidId = !ObjectID.isValid(id);

            if (isInvalidId) {
                return response.status(STATUS_CODES.BAD_REQUEST).send({ status: false, message: response.__('InvalidObjectId') });
            }

            next();
        }
        catch (error) {
            return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ status: false, message: error.message });
        }
    }

}

const validator = new Validator();

export { validator };