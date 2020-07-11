'use strict';

import { Request, Response, NextFunction } from 'express';
import container from '../Config/inversify.config';
import IDENTIFIERS from '../Constants/Identifiers';
import { ResponseDto } from '../Models/Response';
import { ITodoRepository } from '../Repositories/ITodoRepository';

class TodoAttribute {

    private readonly _todoRepository: ITodoRepository;

    constructor (todoRepository: ITodoRepository) {
        this._todoRepository = todoRepository;
    }

    public todoExistsById = async (request: Request, response: Response, next: NextFunction): Promise<any> => {
        const { params: { id } } = request;
        const todo = await this._todoRepository.getByIdAsync(id);

        if (!todo) {
            return ResponseDto.notFound(false, response, 'TodoNotFound');
        }

        next();
    }

}

const todoRepository = container.get<ITodoRepository>(IDENTIFIERS.ITodoRepository);
const todoAttribute = new TodoAttribute(todoRepository);

export { todoAttribute };