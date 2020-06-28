'use strict';

import mongoose, { Document } from 'mongoose';

interface ITodo extends Document {
    title: String,
    description: String,
    done: Boolean,
    createdAt: Date,
    updatedAt: Date,
    user: mongoose.Schema.Types.ObjectId
}

export { ITodo }