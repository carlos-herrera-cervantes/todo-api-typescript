'use strict';

import { Server } from '@overnightjs/core';
import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import container from './Config/inversify.config';
import IDENTIFIERS from './Constants/Identifiers';
import { IUserRepository } from './Repositories/IUserRepository';
import { UserController } from './Controllers/UserController';
import { ITodoRepository } from './Repositories/ITodoRepository';
import { TodoController } from './Controllers/TodoController';
import { IDocumentRepository } from './Repositories/IDocumentRepository';
import { IAccessTokenRepository } from './Repositories/IAccessTokenRepository';
import { LoginController } from './Controllers/LoginController';
import { IUser } from './Models/IUser';
import { ITodo } from './Models/ITodo';

class Startup extends Server {

    constructor () {
        super();

        dotenv.config();
        this.setupDatabase();
        this.app.use(express.json());

        super.addControllers(this.setupControllers());
    }

    /**
     * Starts the server
     * @returns {Void}
     */
    public listen (): void {
        this.app.listen(process.env.PORT, () => console.info(`Server starts in the port ${process.env.PORT}`));
    }

    /**
     * Connect with MongoDB Server
     * @returns {Void}
     */
    private setupDatabase (): void {
        const URI = `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`;
        mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const database = mongoose.connection;
        database.on('error', console.error.bind(console, 'MongoDB connection error'));
    }

    /**
     * Setup the controllers
     * @returns {Array}
     */
    private setupControllers (): Array<any> {
        const documentRepositoryTodo = container.get<IDocumentRepository<ITodo>>(IDENTIFIERS.IDocumentRepositoryTodo);
        const todoRepository = container.get<ITodoRepository>(IDENTIFIERS.ITodoRepository);
        const documentRepositoryUser = container.get<IDocumentRepository<IUser>>(IDENTIFIERS.IDocumentRepositoryUser);
        const accessTokenRepository = container.get<IAccessTokenRepository>(IDENTIFIERS.IAccessTokenRepository);
        const userRepository = container.get<IUserRepository>(IDENTIFIERS.IUserRepository);

        const todoController = new TodoController(todoRepository, documentRepositoryTodo);
        const loginController = new LoginController(documentRepositoryUser, accessTokenRepository);
        const userController = new UserController(userRepository, documentRepositoryUser, todoRepository, documentRepositoryTodo, accessTokenRepository);

        const controllers = [ userController, todoController, loginController ];
        return controllers;
    }
}

export { Startup };