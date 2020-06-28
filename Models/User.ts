'use strict';

import mongoose, { Schema } from 'mongoose';
import moment from 'moment';
import { IUser } from './IUser';
import { ROLES } from '../Constants/Roles';

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    ageInYears: {
        type: Number,
        default: 18
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: ROLES.Client
    },
    createdAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    updatedAt: {
        type: Date,
        default: moment().utc().format('YYYY-MM-DDTHH:mm:ss')
    },
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
});

const User = mongoose.model<IUser>('User', userSchema);

export { User };