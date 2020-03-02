'use strict';

import { IUser } from "../Models/IUser";

interface IUserRepository  {
    getAllAsync(): Promise<any>;
    createAsync(user: IUser): Promise<any>;
}

export { IUserRepository };