'use strict';

import { ObjectID } from 'mongodb';
import { Request, Response, NextFunction } from 'express';
import { IAccessTokenRepository } from '../Repositories/IAccessTokenRepository';
import container from '../Config/inversify.config';
import IDENTIFIERS from '../Constants/Identifiers';
import { StringExtensions } from '../Extensions/StringExtensions';
import { ResponseDto } from '../Models/Response';
import _ from 'lodash';

class Validator {

    private readonly _tokenRepository: IAccessTokenRepository;

    constructor (tokenRepository: IAccessTokenRepository) {
        this._tokenRepository = tokenRepository;
    }

    public isValidObjectId (request: Request, response: Response, next: NextFunction): any {
        const { params: { id } } = request;
        const isInvalidId = !ObjectID.isValid(id);

        if (isInvalidId) {
            return ResponseDto.badRequest(false, response, 'InvalidObjectId');
        }

        next();
    }

    public validatePagination (request: Request, response: Response, next: NextFunction): any {
        const { query: { paginate, page, pageSize } } = request;

        if (!paginate) {
            return next();
        }

        const notHavePages = !page || !pageSize;
        const invalidPaginateParams = StringExtensions.toBoolean(paginate) && notHavePages;

        if (invalidPaginateParams) {
            return ResponseDto.badRequest(false, response, 'InvalidPaginateParams');
        }

        const intPage = StringExtensions.toInt(page);
        const intPageSize = StringExtensions.toInt(pageSize);
        const invalidPages = intPage <= 0 || intPageSize <= 0 || intPageSize > 100;

        if (invalidPages) {
            return ResponseDto.badRequest(false, response, 'InvalidPaginateNumbers');
        }

        next();
    }

    public validateRole = (...roles) => async (request: Request, response: Response, next: NextFunction): Promise<any> => {
        const { headers: { authorization } } = request;
        const extractedToken = authorization.split(' ').pop();
        const token = await this._tokenRepository.getOneAsync({ criteria: { token: extractedToken } });
        const isValidRole = roles.includes(_.get(token, 'role', ''));

        if (isValidRole) {
            return next();
        }

        return ResponseDto.unauthorize(false, response, 'AccessDenied');
    }

}

const accessTokenRepository = container.get<IAccessTokenRepository>(IDENTIFIERS.IAccessTokenRepository);
const validator = new Validator(accessTokenRepository);

export { validator };