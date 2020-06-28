'use strict';

import { Request, Response, NextFunction } from 'express';
import container from '../Config/inversify.config';
import IDENTIFIERS from '../Constants/Identifiers';
import { STATUS_CODES } from '../Constants/StatusCodes';
import { ITodoRepository } from '../Repositories/ITodoRepository';

class TodoAttribute {

    private readonly _todoRepository: ITodoRepository;

    constructor (todoRepository: ITodoRepository) {
        this._todoRepository = todoRepository;
    }

    public async todoExistsById (request: Request, response: Response, next: NextFunction): Promise<any> {
        const { params: { id } } = request;
        const todo = this._todoRepository.getByIdAsync(id);

        if (!todo) {
            return response.status(STATUS_CODES.NOT_FOUND).send({ status: false, message: response.__('TodoNotFound') });
        }

        next();
    }

}

const todoRepository = container.get<ITodoRepository>(IDENTIFIERS.ITodoRepository);
const todoAttribute = new TodoAttribute(todoRepository);

export { todoAttribute };