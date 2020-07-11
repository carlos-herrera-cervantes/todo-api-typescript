'use strict';

import { injectable } from 'inversify';
import 'reflect-metadata';
import { IAccessTokenRepository } from './IAccessTokenRepository';
import { AccessToken } from '../Models/AccessToken';
import { IAccessToken } from '../Models/IAccessToken';

@injectable()
class AccessTokenRepository implements IAccessTokenRepository {

    public getOneAsync = async (request: any): Promise<any> => await AccessToken.findOne(request.criteria);

    public createAsync = async (token: IAccessToken): Promise<any> => await AccessToken.create(token);

    public deleteManyAsync = async (request: any): Promise<any> => await AccessToken.deleteMany(request.criteria);

}

export { AccessTokenRepository };