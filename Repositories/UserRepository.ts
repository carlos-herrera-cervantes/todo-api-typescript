'use strict';

import { injectable } from 'inversify';
import 'reflect-metadata';
import { IUserRepository } from './IUserRepository';
import { User } from '../Models/User';
import { IUser } from '../Models/IUser';

@injectable()
class UserRepository implements IUserRepository {

    public getAllAsync = async (): Promise<any> => await User.find();

    public getByIdAsync = async (id: String): Promise<any> => await User.findById(id);

    public async createAsync(user: IUser): Promise<any> {
        const userObject = await User.create(user);

        await userObject.save();
    }

}

export { UserRepository };