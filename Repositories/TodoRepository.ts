'use strict';

import { injectable } from 'inversify';
import 'reflect-metadata';
import { ITodoRepository } from './ITodoRepository';
import { IDocumentRepository } from './IDocumentRepository';
import { Todo } from '../Models/Todo';
import { ITodo } from '../Models/ITodo';

@injectable()
class TodoRepository implements ITodoRepository, IDocumentRepository<ITodo> {

    public getAllAsync = async (request: any): Promise<any> => 
        await Todo
            .find(request.criteria)
            .populate(request.relation[0])
            .skip(request.pagination.page)
            .limit(request.pagination.pageSize)
            .sort(request.sort);

    public getByIdAsync = async (id: String): Promise<any> => await Todo.findById(id);

    public getOneAsync = async (request: any): Promise<any> => await Todo.findOne(request.criteria);

    public createAsync = async (todo: ITodo): Promise<any> => await Todo.create(todo);

    public updateAsync = async (id: String, todo: ITodo): Promise<any> => await Todo.findOneAndUpdate({ _id: id }, { $set: todo }, { new: true });

    public deleteByIdAsync = async (id: String): Promise<any> => await Todo.findOneAndDelete({ _id: id });

    public countAsync = async (request: any): Promise<any> => await Todo.countDocuments(request.criteria);

}

export { TodoRepository };