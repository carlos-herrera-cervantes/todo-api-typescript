'use strict';

import { Request, Response, NextFunction } from 'express';
import container from '../Config/inversify.config';
import IDENTIFIERS from '../Constants/Identifiers';
import { ResponseDto } from '../Models/Response';
import { IUserRepository } from '../Repositories/IUserRepository';
import { IDocumentRepository } from '../Repositories/IDocumentRepository';
import { IUser } from '../Models/IUser';
import { Request as RequestDto } from '../Models/Request';

class UserExists {

    private readonly _userRepository: IUserRepository;
    private readonly _documentRepository: IDocumentRepository<IUser>;

    constructor (userRepository: IUserRepository, documentRepository: IDocumentRepository<IUser>) {
        this._userRepository = userRepository;
        this._documentRepository = documentRepository;
    }

    public userExistsById = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
        const { params: { id } } = request;
        const user = await this._userRepository.getByIdAsync(id);

        if (!user) {
            return ResponseDto.notFound(false, response, 'UserNotFound');
        }

        next();
    }

    public userExistsByEmail = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
        const { body: { email } } = request;
        const dto = new RequestDto({ email }).setCriteria();
        const user = await this._documentRepository.getOneAsync(dto.queryFilter);

        if (!user) {
            return ResponseDto.notFound(false, response, 'UserNotFound');
        }

        next();
    }

}

const userRepository = container.get<IUserRepository>(IDENTIFIERS.IUserRepository);
const documentRepository = container.get<IDocumentRepository<IUser>>(IDENTIFIERS.IDocumentRepositoryUser);
const userExists = new UserExists(userRepository, documentRepository);

export { userExists };