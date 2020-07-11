'use strict';

import { ITodo } from '../Models/ITodo';

interface ITodoRepository {
    getAllAsync(request: any): Promise<any>;

    getByIdAsync(id: String): Promise<any>;

    createAsync(todo: ITodo): Promise<any>;

    updateAsync(id: String, todo: ITodo): Promise<any>;

    deleteByIdAsync(id: String): Promise<any>;

    deleteManyAsync(id: String): Promise<any>;
}

export { ITodoRepository };