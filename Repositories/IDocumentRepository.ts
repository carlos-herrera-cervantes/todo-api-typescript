'use strict';

interface IDocumentRepository {
    countAsync(): Promise<any>
}

export { IDocumentRepository };