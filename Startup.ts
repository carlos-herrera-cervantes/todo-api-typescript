'use strict';

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import container from './Config/inversify.config';
import IDENTIFIERS from './Constants/Identifiers';
import { IUserRepository } from './Repositories/IUserRepository';
import { UserController } from './Controllers/UserController';

class App {
    
    public app: express.Application;
    private userController: UserController;

    constructor() {
        dotenv.config();
        this.app = express();
        this.configureServices();        
        this.configure();
    }

    //#region snippet_ConfigureServices

    private configureServices(): void {
        this.setupDatabase();
        this.setupControllers();
    }

    //#endregion

    //#region snippet_Configure

    private configure(): void {
        this.app.use(express.json());

        this.app.use('/api/v1/users', this.setupUserRoutes());
    }

    //#endregion

    /** @HELPERS */

    //#region snippet_StartApp

    public listen = (): void => this.app.listen(process.env.PORT, () => console.log(`Server running at port ${process.env.PORT}`));

    //#endregion

    //#region snippet_SetupDatabase

    private setupDatabase(): void {
        const URI =  `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`;
        mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const database = mongoose.connection;
        database.on('error', console.error.bind(console, 'MongoDB connection error'));
    }

    //#endregion

    //#region snippet_SetupControllers

    private setupControllers(): void {
        const userRepository = container.get<IUserRepository>(IDENTIFIERS.IUserRepository);
        this.userController = new UserController(userRepository);
    }

    //#endregion

    //#region snipept_SetupRoutes

    private setupUserRoutes(): void {
        const userRoutes = express.Router();

        userRoutes.route('/')
        .get((request: Request, response: Response) => this.userController.getAllAsync(request, response))
        .post((request: Request, response: Response) => this.userController.createAsync(request, response));

        return userRoutes;
    }

    //#endregion

}

export { App };