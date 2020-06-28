'use strict';

import { injectable } from 'inversify';
import 'reflect-metadata';
import { ITodoRepository } from './ITodoRepository';
import { IDocumentRepository } from './IDocumentRepository';
import { Todo } from '../Models/Todo';
import { ITodo } from '../Models/ITodo';

@injectable()
class TodoRepository implements ITodoRepository, IDocumentRepository {

    public getAllAsync = async (): Promise<any> => await Todo.find();

    public getByIdAsync = async (id: String): Promise<any> => await Todo.findById(id);

    public createAsync = async (todo: ITodo): Promise<any> => await Todo.create(todo);

    public updateAsync = async (id: String, todo: ITodo): Promise<any> => await Todo.findOneAndUpdate({ _id: id }, { $set: todo }, { new: true });

    public deleteByIdAsync = async (id: String): Promise<any> => await Todo.findOneAndDelete({ _id: id });

    public countAsync = async (): Promise<any> => await Todo.countDocuments();

}

export { TodoRepository };