'use strict';

import { STATUS_CODES } from '../Constants/StatusCodes';
import { ObjectID } from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import { IAccessTokenRepository } from '../Repositories/IAccessTokenRepository';
import container from '../Config/inversify.config';
import IDENTIFIERS from '../Constants/Identifiers';

class Validator {

    private readonly _tokenRepository: IAccessTokenRepository;

    constructor (tokenRepository: IAccessTokenRepository) {
        this._tokenRepository = tokenRepository;
    }

    public isValidObjectId (request: Request, response: Response, next: NextFunction): any {
        const { params: { id } } = request;
        const isInvalidId = !ObjectID.isValid(id);

        if (isInvalidId) {
            return response.status(STATUS_CODES.BAD_REQUEST).send({ status: false, message: response.__('InvalidObjectId') });
        }

        next();
    }

    public validateRole = (...roles) => async (request: Request, response: Response, next: NextFunction): Promise<any> => {
        const { headers: { authorization } } = request;
        const extractedToken = authorization.split(' ').pop();
        const token = await this._tokenRepository.getOneAsync({ criteria: { token: extractedToken } });
        const isValidRole = roles.includes(token.role);

        if (isValidRole) {
            return next();
        }

        return response.status(STATUS_CODES.UNAHUTORIZE).send({ status: false, message: response.__('AccessDenied') });
    }

}

const accessTokenRepository = container.get<IAccessTokenRepository>(IDENTIFIERS.IAccessTokenRepository);
const validator = new Validator(accessTokenRepository);

export { validator };