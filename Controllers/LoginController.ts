'use strict';

import { Request, Response } from 'express';
import { localizer } from '../Middlewares/Localizer';
import { Controller, Post, ClassMiddleware, Middleware } from '@overnightjs/core';
import { ErrorMiddleware } from '../Decorators/ErrorMiddleware';
import { IDocumentRepository } from '../Repositories/IDocumentRepository';
import { IAccessTokenRepository } from '../Repositories/IAccessTokenRepository';
import { IUser } from '../Models/IUser';
import { AccessToken } from '../Models/AccessToken';
import { Request as RequestDto} from '../Models/Request';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { userExists } from '../Middlewares/User';
import { ResponseDto } from '../Models/Response';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/users/login')
class LoginController {

    private readonly _documentRepository: IDocumentRepository<IUser>;
    private readonly _accessTokenRepository: IAccessTokenRepository;

    constructor (documentRepository: IDocumentRepository<IUser>, accessTokenRepository: IAccessTokenRepository) {
        this._documentRepository = documentRepository;
        this._accessTokenRepository = accessTokenRepository;
    }

    @Post()
    @Middleware(userExists.userExistsByEmail)
    @ErrorMiddleware
    public async login (request: Request, response: Response): Promise<any> {
        const { body: { email, password } } = request;
        const dto = new RequestDto({ email }).setCriteria();
        const user = await this._documentRepository.getOneAsync(dto.queryFilter);
        const isValidPassword = await compare(password, user.password);

        if (!isValidPassword) {
            return ResponseDto.badRequest(false, response, 'InvalidCredentials');
        }

        const token = sign({ email }, process.env.SECRET_KEY);
        const instance = new AccessToken({ token, email, role: user.role, userId: user._id });
        await this._accessTokenRepository.createAsync(instance);
        return ResponseDto.ok(true, { token }, response);
    }

}

export { LoginController };