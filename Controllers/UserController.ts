'use strict';

import { Request, Response } from 'express';
import { STATUS_CODES } from '../Constants/StatusCodes';
import { localizer } from '../Middlewares/Localizer';
import { userExists } from '../Middlewares/UserExists';
import { validator } from '../Middlewares/Validator';
import { Controller, Get, Post, Patch, Delete, Middleware, ClassMiddleware } from '@overnightjs/core';
import { ErrorMiddleware } from '../Decorators/ErrorMiddleware';
import { IUserRepository } from '../Repositories/IUserRepository';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/users')
class UserController {

    private readonly _userRepository: IUserRepository;

    constructor (userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    @Get()
    @ErrorMiddleware
    public async getAllAsync (request: Request, response: Response): Promise<any> {
        const users = await this._userRepository.getAllAsync();
        return response.status(STATUS_CODES.OK).send({ status: true, data: users });
    }


    @Get(':id')
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
        const result = await this._userRepository.createAsync(body);
        return response.status(STATUS_CODES.CREATED).send({ status: true, data: result });
    }

    @Patch(':id')
    @Middleware(validator.isValidObjectId)
    @Middleware(userExists.userExistsById)
    @ErrorMiddleware
    public async updateAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._userRepository.updateAsync(id, body);
        return response.status(STATUS_CODES.CREATED).send({ status: true, data: result });
    }

    @Delete(':id')
    @Middleware(validator.isValidObjectId)
    @Middleware(userExists.userExistsById)
    public async deleteAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        await this._userRepository.deleteByIdAsync(id);
        return response.status(STATUS_CODES.NO_CONTENT).send({ status: true, data: {} });
    }

}

export { UserController };