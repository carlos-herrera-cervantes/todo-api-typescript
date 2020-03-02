'use strict';

import { IUser } from "../Models/IUser";

interface IUserRepository  {
    createAsync(user: IUser): Promise<any>;
}

export { IUserRepository };