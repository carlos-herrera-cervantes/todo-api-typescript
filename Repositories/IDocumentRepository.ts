'use strict';

interface IDocumentRepository {
    countAsync(request: any): Promise<any>;

    getOneAsync(request: any): Promise<any>;
}

export { IDocumentRepository };