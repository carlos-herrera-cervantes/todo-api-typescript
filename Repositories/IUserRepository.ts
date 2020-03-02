'use strict';

import { IUser } from "../Models/IUser";

interface IUserRepository  {
    getAllAsync(): Promise<any>;
    getByIdAsync(id: String): Promise<any>;
    createAsync(user: IUser): Promise<any>;
}

export { IUserRepository };