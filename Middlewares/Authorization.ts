'use strict';

import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../Constants/StatusCodes';
import { verify } from 'jsonwebtoken';

class Authorize {

    public async authenticateUser (request: Request, response: Response, next: NextFunction): Promise<any> {
        const { headers: { authorization } } = request;

        if (!authorization) {
            return response.status(STATUS_CODES.UNAHUTORIZE).send({ status: false, message: response.__('InvalidPermissions') });
        }

        const isValidToken = await verify(authorization.split(' ').pop(), process.env.SECRET_KEY);

        if (isValidToken) {
            return next();
        }

        return response.status(STATUS_CODES.UNAHUTORIZE).send({ status: false, message: response.__('InvalidToken') });
    }

}

const authorize = new Authorize();

export { authorize };