'use strict';

import { injectable } from 'inversify';
import 'reflect-metadata';
import { IUserRepository } from './IUserRepository';
import { User } from '../Models/User';
import { IUser } from '../Models/IUser';

@injectable()
class UserRepository implements IUserRepository {

    /**@POST */

    //#region snippet_Create

    async createAsync(user: IUser): Promise<any> {
        let userObject = await User.create(user);

        await userObject.save();
    }

    //#endregion

}

export { UserRepository };