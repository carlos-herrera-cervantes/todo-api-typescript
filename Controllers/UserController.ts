'use strict';

import { Request, Response } from 'express';
import { STATUS_CODES } from '../Constants/StatusCodes';
import { localizer } from '../Middlewares/Localizer';
import { userExists } from '../Middlewares/UserExists';
import { validator } from '../Middlewares/Validator';
import { Controller, Get, Post, Patch, Delete, Middleware, ClassMiddleware } from '@overnightjs/core';
import { IUserRepository } from '../Repositories/IUserRepository';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/users')
class UserController {

    private readonly _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    @Get()
    public getAllAsync = async (request: Request, response: Response): Promise<any> => {
        try {
            const users = await this._userRepository.getAllAsync();

            return response.status(STATUS_CODES.OK).send({ status: true, data: users });
        }
        catch (error) {
            return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ status: false, message: error.message });
        }
    }


    @Get(':id')
    @Middleware(validator.isValidObjectId)
    @Middleware(userExists.userExistsById)
    public getByIdAsync = async (request: Request, response: Response): Promise<any> => {
        try {
            const { params: { id } } = request;
            const user = await this._userRepository.getByIdAsync(id);

            return response.status(STATUS_CODES.OK).send({ status: true, data: user });
        }
        catch (error) {
            return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ status: false, message: error.message });
        }
    }
    
    @Post()
    public createAsync = async (request: Request, response: Response): Promise<any> => {
        try {
            const { body } = request;

            const result = await this._userRepository.createAsync(body);

            return response.status(STATUS_CODES.CREATED).send({ status: true, data: result });
        }
        catch (error) {
            return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ status: false, message: error.message });
        }
    }

    @Patch(':id')
    @Middleware(validator.isValidObjectId)
    @Middleware(userExists.userExistsById)
    public updateAsync = async (request: Request, response: Response): Promise<any> => {
        try {
            const { params: { id }, body } = request;
            
            const result = await this._userRepository.updateAsync(id, body);

            return response.status(STATUS_CODES.CREATED).send({ status: true, data: result });
        }
        catch (error) {
            return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ status: false, message: error.message });
        }
    }

    @Delete(':id')
    @Middleware(validator.isValidObjectId)
    @Middleware(userExists.userExistsById)
    public deleteAsync = async (request: Request, response: Response): Promise<any> => {
        try {
            const { params: { id } } = request;

            await this._userRepository.deleteByIdAsync(id);

            return response.status(STATUS_CODES.NO_CONTENT).send({ status: true, data: {} });
        }
        catch (error) {
            return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ status: false, message: error.message });
        }
    }

}

export { UserController };