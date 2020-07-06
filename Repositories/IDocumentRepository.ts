'use strict';

interface IDocumentRepository<T> {
    countAsync(request: any): Promise<any>;

    getOneAsync(request: any): Promise<any>;
}

export { IDocumentRepository };