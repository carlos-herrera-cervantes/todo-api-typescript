'use strict';

import { Request, Response } from 'express';
import { STATUS_CODES } from '../Constants/StatusCodes';
import { localizer } from '../Middlewares/Localizer';
import { todoAttribute } from '../Middlewares/TodoAttribute';
import { validator } from '../Middlewares/Validator';
import { Controller, Get, Post, Patch, Delete, Middleware, ClassMiddleware } from '@overnightjs/core';
import { ErrorMiddleware } from '../Decorators/ErrorMiddleware';
import { ITodoRepository } from '../Repositories/ITodoRepository';
import { Request as RequestDto } from '../Models/Request';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/todos')
class TodoController {

    private readonly _todoRepository: ITodoRepository;

    constructor (todoRepository: ITodoRepository) {
        this._todoRepository = todoRepository;
    }

    @Get()
    @ErrorMiddleware
    public async getAllAsync (request: Request, response: Response): Promise<any> {
        const { query } = request;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const todos = await this._todoRepository.getAllAsync(dto.queryFilter);
        return response.status(STATUS_CODES.OK).send({ status: true, data: todos });
    }

    @Get(':id')
    @Middleware(validator.isValidObjectId)
    @Middleware(todoAttribute.todoExistsById)
    @ErrorMiddleware
    public async getByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        const todo = await this._todoRepository.getByIdAsync(id);
        return response.status(STATUS_CODES.OK).send({ status: true, data: todo });
    }

    @Post(':id/users')
    @ErrorMiddleware
    public async createAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        body.user = id;
        const result = await this._todoRepository.createAsync(body);
        return response.status(STATUS_CODES.CREATED).send({ status: true, data: result });
    }

    @Patch(':id')
    @Middleware(validator.isValidObjectId)
    @Middleware(todoAttribute.todoExistsById)
    @ErrorMiddleware
    public async updateAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._todoRepository.updateAsync(id, body);
        return response.status(STATUS_CODES.CREATED).send({ status: true, data: result });
    }

    @Delete(':id')
    @Middleware(validator.isValidObjectId)
    @Middleware(todoAttribute.todoExistsById)
    @ErrorMiddleware
    public async deleteAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        await this._todoRepository.deleteByIdAsync(id);
        return response.status(STATUS_CODES.NO_CONTENT).send({ status: true, data: {} });
    }

}

export { TodoController };