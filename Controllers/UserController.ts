'use strict';

import { Request, Response } from 'express';
import { localizer } from '../Middlewares/Localizer';
import { userExists } from '../Middlewares/User';
import { validator } from '../Middlewares/Validator';
import { Controller, Get, Post, Patch, Delete, Middleware, ClassMiddleware } from '@overnightjs/core';
import { ErrorMiddleware } from '../Decorators/ErrorMiddleware';
import { IUserRepository } from '../Repositories/IUserRepository';
import { Request as RequestDto } from '../Models/Request';
import { authorize } from '../Middlewares/Authorization';
import { hash } from 'bcrypt';
import { ROLES } from '../Constants/Roles';
import { IDocumentRepository } from '../Repositories/IDocumentRepository';
import { IUser } from '../Models/IUser';
import { ResponseDto } from '../Models/Response'
import { ITodoRepository } from '../Repositories/ITodoRepository';
import { ITodo } from '../Models/ITodo';
import { IAccessTokenRepository } from '../Repositories/IAccessTokenRepository';
import { patch } from '../Middlewares/Patch';

@ClassMiddleware(localizer.configureLanguages)
@Controller('api/v1/users')
class UserController {

    private readonly _userRepository: IUserRepository;
    private readonly _documentRepositoryUser: IDocumentRepository<IUser>;
    private readonly _todoRepository: ITodoRepository;
    private readonly _documentRepositoryTodo: IDocumentRepository<ITodo>
    private readonly _tokenRepository: IAccessTokenRepository;

    constructor (
        userRepository: IUserRepository, 
        documentRepositoryUser: IDocumentRepository<IUser>, 
        todoRepository: ITodoRepository,
        documentRepositoryTodo: IDocumentRepository<ITodo>,
        tokenRepository: IAccessTokenRepository
    ) {
        this._userRepository = userRepository;
        this._documentRepositoryUser = documentRepositoryUser;
        this._todoRepository = todoRepository;
        this._documentRepositoryTodo = documentRepositoryTodo;
        this._tokenRepository = tokenRepository;
    }

    @Get()
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @Middleware(validator.validatePagination)
    @ErrorMiddleware
    public async getAllAsync (request: Request, response: Response): Promise<any> {
        const { query } = request;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const totalDocuments = await this._documentRepositoryUser.countAsync(dto.queryFilter);
        const users = await this._userRepository.getAllAsync(dto.queryFilter);
        return ResponseDto.ok(true, users, response, query, totalDocuments);
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
        return ResponseDto.ok(true, user, response);
    }

    @Get(':id/todos')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @Middleware(validator.isValidObjectId)
    @Middleware(validator.validatePagination)
    @Middleware(userExists.userExistsById)
    @ErrorMiddleware
    public async getTodosByUserId (request: Request, response: Response): Promise<any> {
        const { params: { id }, query } = request;
        query.user = id;
        const dto = new RequestDto(query).setSort().setPagination().setCriteria().setRelation();
        const totalDocuments = await this._documentRepositoryTodo.countAsync(dto.queryFilter);
        const todos = await this._todoRepository.getAllAsync(dto.queryFilter);
        return ResponseDto.ok(true, todos, response, query, totalDocuments);
    }
    
    @Post()
    @ErrorMiddleware
    public async createAsync (request: Request, response: Response): Promise<any> {
        const { body } = request;
        body.password = await hash(body.password, 10);
        const result = await this._userRepository.createAsync(body);
        return ResponseDto.created(true, result, response);
    }

    @Patch(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @Middleware(validator.isValidObjectId)
    @Middleware(userExists.userExistsById)
    @Middleware(patch.updateDate)
    @ErrorMiddleware
    public async updateAsync (request: Request, response: Response): Promise<any> {
        const { params: { id }, body } = request;
        const result = await this._userRepository.updateAsync(id, body);
        return ResponseDto.created(true, result, response);
    }

    @Delete(':id')
    @Middleware(authorize.authenticateUser)
    @Middleware(validator.validateRole(ROLES.Client, ROLES.Admin))
    @Middleware(validator.isValidObjectId)
    @Middleware(userExists.userExistsById)
    public async deleteAsync (request: Request, response: Response): Promise<any> {
        const { params: { id } } = request;
        await this._userRepository.deleteByIdAsync(id);
        const dto = new RequestDto({ userId: id }).setCriteria();
        await this._todoRepository.deleteManyAsync(dto.queryFilter);
        await this._tokenRepository.deleteManyAsync(dto.queryFilter);
        return ResponseDto.noContent(true, response);
    }

}

export { UserController };