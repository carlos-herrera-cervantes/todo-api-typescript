'use strict';

import { Request, Response } from 'express';
import { IUserRepository } from '../Repositories/IUserRepository';

class UserController {

    private readonly _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    /** @GET */

    //#region snippet_GetAll

    public async getAllAsync(request: Request, response: Response): Promise<any> {
        try {
            let users = await this._userRepository.getAllAsync();

            return response.status(200).send(users);
        }
        catch (error) {
            return response.status(500).send(error);
        }
    }

    //#endregion

    //#region snippet_GetByIdAsync

    public async getByIdAsync(request: Request, response: Response): Promise<any> {
        try {
            let id = request.params.id;
            let user = await this._userRepository.getByIdAsync(id);

            if (!user) { return response.status(404).send({ message: 'Usuario no encontrado' }); }

            return response.status(200).send(user);
        }
        catch (error) {
            return response.status(500).send(error);
        }
    }

    //#endregion

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