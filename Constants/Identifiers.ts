'use strict';

const IDENTIFIERS = {
    IUserRepository: Symbol('UserRepository'),
    ITodoRepository: Symbol('TodoRepository'),
    IAccessTokenRepository: Symbol('AccessTokenRepository'),
    IDocumentRepositoryUser: Symbol('DocumentRepositoryUser'),
    IDocumentRepositoryTodo: Symbol('DocumentRepositoryTodo')
}

export default IDENTIFIERS;