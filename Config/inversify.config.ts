'use strict';

import 'reflect-metadata';
import { Container } from 'inversify';
import IDENTIFIERS from '../Constants/Identifiers';
import { IUserRepository } from '../Repositories/IUserRepository';
import { UserRepository } from '../Repositories/UserRepository';

let container = new Container();

container.bind<IUserRepository>(IDENTIFIERS.IUserRepository).to(UserRepository);

export default container;