'use strict';

import { injectable } from 'inversify';
import 'reflect-metadata';
import { IUserRepository } from './IUserRepository';
import { IDocumentRepository } from './IDocumentRepository';
import { User } from '../Models/User';
import { IUser } from '../Models/IUser';

@injectable()
class UserRepository implements IUserRepository, IDocumentRepository {

    public getAllAsync = async (): Promise<any> => await User.find();

    public getByIdAsync = async (id: String): Promise<any> => await User.findById(id);

    public createAsync = async (user: IUser): Promise<any>  => await User.create(user);

    public updateAsync = async (id: String, user: IUser): Promise<any> => await User.findOneAndUpdate({ _id: id }, { $set: user }, { new: true });

    public deleteByIdAsync = async (id: String): Promise<any> => await User.findOneAndDelete({ _id: id });

    public countAsync = async (): Promise<any> => await User.countDocuments();
}

export { UserRepository };