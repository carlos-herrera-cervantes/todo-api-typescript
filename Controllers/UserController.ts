'use strict';

import { Request, Response } from 'express';
import { STATUS_CODES } from '../Constants/StatusCodes';
import { localizer } from '../Middlewares/Localizer';
import { userExists } from '../Middlewares/UserExists';
import { validator } from '../Middlewares/Validator';
import { Controller, Get, Post, Patch, Delete, Middleware, ClassMiddleware } from '@overnightjs/core';
import { ErrorMiddleware } from '../Decorators/ErrorMiddleware';
import { IUserRepository } from '../Repositories/IUserRepository';
import { Request as RequestDto } from '../Models/Request';
import { authorize } from '../Middlewares/Authorization';
import { hash } from 'bcrypt';
import { ROLES } from '../Constants/Roles';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/users')
class UserController {

    private readonly _userRepository: IUserRepository;

    constructor (userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    @Get()
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @ErrorMiddleware
    public async getAllAsync (request: Request, response: Response): Promise<any> {
        const { query } = request;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const users = await this._userRepository.getAllAsync(dto.queryFilter);
        return response.status(STATUS_CODES.OK).send({ status: true, data: users });
    }


    @Get(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @Middleware(validator.isValidObjectId)
    @Middleware(userExists.userExistsById)
    @ErrorMiddleware
    public async getByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        const user = await this._userRepository.getByIdAsync(id);
        return response.status(STATUS_CODES.OK).send({ status: true, data: user });
    }
    
    @Post()
    @ErrorMiddleware
    public async createAsync (request: Request, response: Response): Promise<any> {
        const { body } = request;
        body.password = await hash(body.password, 10);
        const result = await this._userRepository.createAsync(body);
        return response.status(STATUS_CODES.CREATED).send({ status: true, data: result });
    }

    @Patch(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @Middleware(validator.isValidObjectId)
    @Middleware(userExists.userExistsById)
    @ErrorMiddleware
    public async updateAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._userRepository.updateAsync(id, body);
        return response.status(STATUS_CODES.CREATED).send({ status: true, data: result });
    }

    @Delete(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @Middleware(validator.isValidObjectId)
    @Middleware(userExists.userExistsById)
    public async deleteAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        await this._userRepository.deleteByIdAsync(id);
        return response.status(STATUS_CODES.NO_CONTENT).send({ status: true, data: {} });
    }

}

export { UserController };