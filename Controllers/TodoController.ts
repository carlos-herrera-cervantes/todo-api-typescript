'use strict';

import { Request, Response } from 'express';
import { localizer } from '../Middlewares/Localizer';
import { todoAttribute } from '../Middlewares/Todo';
import { validator } from '../Middlewares/Validator';
import { Controller, Get, Post, Patch, Delete, Middleware, ClassMiddleware } from '@overnightjs/core';
import { ErrorMiddleware } from '../Decorators/ErrorMiddleware';
import { ITodoRepository } from '../Repositories/ITodoRepository';
import { Request as RequestDto } from '../Models/Request';
import { authorize } from '../Middlewares/Authorization';
import { ROLES } from '../Constants/Roles';
import { ResponseDto } from '../Models/Response';
import { IDocumentRepository } from '../Repositories/IDocumentRepository';
import { ITodo } from '../Models/ITodo';
import { patch } from '../Middlewares/Patch';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/todos')
class TodoController {

    private readonly _todoRepository: ITodoRepository;
    private readonly _documentRepository: IDocumentRepository<ITodo>;

    constructor (todoRepository: ITodoRepository, documentRepository: IDocumentRepository<ITodo>) {
        this._todoRepository = todoRepository;
        this._documentRepository = documentRepository;
    }

    @Get()
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @Middleware(validator.validatePagination)
    @ErrorMiddleware
    public async getAllAsync (request: Request, response: Response): Promise<any> {
        const { query } = request;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const totalDocuments = await this._documentRepository.countAsync(dto.queryFilter);
        const todos = await this._todoRepository.getAllAsync(dto.queryFilter);
        return ResponseDto.ok(true, todos, response, query, totalDocuments);
    }

    @Get(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @Middleware(validator.isValidObjectId)
    @Middleware(todoAttribute.todoExistsById)
    @ErrorMiddleware
    public async getByIdAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        const todo = await this._todoRepository.getByIdAsync(id);
        return ResponseDto.ok(true, todo, response);
    }

    @Post(':id/users')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @ErrorMiddleware
    public async createAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        body.userId = id;
        const result = await this._todoRepository.createAsync(body);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @Middleware(validator.isValidObjectId)
    @Middleware(todoAttribute.todoExistsById)
    @Middleware(patch.updateDate)
    @ErrorMiddleware
    public async updateAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._todoRepository.updateAsync(id, body);
        return ResponseDto.created(true, result, response);
    }

    @Delete(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @Middleware(validator.isValidObjectId)
    @Middleware(todoAttribute.todoExistsById)
    @ErrorMiddleware
    public async deleteAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        await this._todoRepository.deleteByIdAsync(id);
        return ResponseDto.noContent(true, response);
    }

}

export { TodoController };