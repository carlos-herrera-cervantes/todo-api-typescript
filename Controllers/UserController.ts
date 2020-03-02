'use strict';

import { Request, Response } from 'express';
import { IUserRepository } from '../Repositories/IUserRepository';

class UserController {

    private readonly _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    /**@POST */

    //#region snippet_Create

    public async createAsync(request: Request, response: Response): Promise<any> {
        try {
            let user = request.body;

            await this._userRepository.createAsync(user);
            
            return response.status(200).send(user);
        }
        catch (error) {
            return response.status(500).send(error);
        }
    }

    //#endregion
}

export { UserController };