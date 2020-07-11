'use strict';

import { IAccessToken } from '../Models/IAccessToken';

interface IAccessTokenRepository {
    getOneAsync(request: any): Promise<any>;

    createAsync(token: IAccessToken): Promise<any>;

    deleteManyAsync(id: String): Promise<any>;
}

export { IAccessTokenRepository };