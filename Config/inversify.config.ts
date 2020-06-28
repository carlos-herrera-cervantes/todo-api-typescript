'use strict';

import 'reflect-metadata';
import { Container } from 'inversify';
import IDENTIFIERS from '../Constants/Identifiers';
import { IUserRepository } from '../Repositories/IUserRepository';
import { UserRepository } from '../Repositories/UserRepository';
import { ITodoRepository } from '../Repositories/ITodoRepository';
import { TodoRepository } from '../Repositories/TodoRepository';

let container = new Container();

container.bind<IUserRepository>(IDENTIFIERS.IUserRepository).to(UserRepository);
container.bind<ITodoRepository>(IDENTIFIERS.ITodoRepository).to(TodoRepository);

export default container;