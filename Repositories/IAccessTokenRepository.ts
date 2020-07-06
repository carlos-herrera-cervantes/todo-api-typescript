'use strict';

import { IAccessToken } from '../Models/IAccessToken';

interface IAccessTokenRepository {
    getOneAsync(request: any): Promise<any>;

    createAsync(token: IAccessToken): Promise<any>;
}

export { IAccessTokenRepository };