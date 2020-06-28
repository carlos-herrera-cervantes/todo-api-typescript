'use strict';

import { Request, Response, NextFunction } from 'express';
import container from '../Config/inversify.config';
import IDENTIFIERS from '../Constants/Identifiers';
import { STATUS_CODES } from '../Constants/StatusCodes';
import { IUserRepository } from '../Repositories/IUserRepository';

class UserExists {

    private readonly _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    public userExistsById = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
        try {
            const { params: { id } } = request;
            const user = await this._userRepository.getByIdAsync(id);

            if (!user) {
                return response.status(STATUS_CODES.NOT_FOUND).send({ status: false, message: response.__('UserNotFound') });
            }

            next();
        }
        catch (error) {
            return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ status: false, message: error.message });
        }
    }

}

const userRepository = container.get<IUserRepository>(IDENTIFIERS.IUserRepository);
const userExists = new UserExists(userRepository);

export { userExists };