'use strict';

import { Document } from 'mongoose';
import mongoose from 'mongoose';

interface IUser extends Document {
    email: String,
    firstName: String,
    lastName: String,
    ageInYears: Number,
    password: String,
    role: String,
    createdAt: Date,
    updatedAt: Date,
    todos: Array<mongoose.Schema.Types.ObjectId>
}

export { IUser }