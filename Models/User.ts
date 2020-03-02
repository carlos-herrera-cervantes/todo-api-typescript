'use strict';

import mongoose, { Schema } from 'mongoose';
import { IUser } from './IUser';

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
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export { User }