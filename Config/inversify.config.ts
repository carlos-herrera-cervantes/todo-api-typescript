'use strict';

import 'reflect-metadata';
import { Container } from 'inversify';
import IDENTIFIERS from '../Constants/Identifiers';
import { IUserRepository } from '../Repositories/IUserRepository';
import { UserRepository } from '../Repositories/UserRepository';
import { ITodoRepository } from '../Repositories/ITodoRepository';
import { TodoRepository } from '../Repositories/TodoRepository';
import { IAccessTokenRepository } from '../Repositories/IAccessTokenRepository';
import { AccessTokenRepository } from '../Repositories/AccessTokenRepository';
import { IDocumentRepository } from '../Repositories/IDocumentRepository';
import { IUser } from '../Models/IUser';
import { ITodo } from '../Models/ITodo';

let container = new Container();

container.bind<IUserRepository>(IDENTIFIERS.IUserRepository).to(UserRepository);
container.bind<ITodoRepository>(IDENTIFIERS.ITodoRepository).to(TodoRepository);
container.bind<IAccessTokenRepository>(IDENTIFIERS.IAccessTokenRepository).to(AccessTokenRepository);
container.bind<IDocumentRepository<IUser>>(IDENTIFIERS.IDocumentRepositoryUser).to(UserRepository);
container.bind<IDocumentRepository<ITodo>>(IDENTIFIERS.IDocumentRepositoryTodo).to(TodoRepository);

export default container;