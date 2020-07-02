'use strict';

import { IUser } from "../Models/IUser";

interface IUserRepository  {
    getAllAsync(request: any): Promise<any>;

    getByIdAsync(id: String): Promise<any>;

    createAsync(user: IUser): Promise<any>;
    
    updateAsync(id: String, user: IUser): Promise<any>;

    deleteByIdAsync(id: String): Promise<any>;
}

export { IUserRepository };