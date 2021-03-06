'use strict';

import moment from 'moment';
import mongoose, { Schema, Query } from 'mongoose';
import { ITodo } from './ITodo';
import { User } from './User';

const todoSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: String,
        trim: true
    },
    done: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    updatedAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

todoSchema.post<ITodo>('findOneAndDelete', async function(document) {
    const { todos } = await User.findById(document.userId);
    const cleanTodos = todos.filter(todo => todo.toString() !== document._id.toString());
    const request = { todos: cleanTodos };
    await User.findOneAndUpdate({ _id: document.userId }, { $set: request }, { new: true });
});

todoSchema.post('save', async function(document) {
    const { userId } = await Todo.findById(document._id);
    const { todos } = await User.findById(userId);
    todos.push(document._id);
    const response = { todos };
    await User.findOneAndUpdate({ _id: userId }, { $set: response }, { new: true });
});

const Todo = mongoose.model<ITodo>('Todo', todoSchema);

export { Todo };