'use strict';

import { Document, Types } from 'mongoose';

interface IAccessToken extends Document {
    token: String,
    email: String,
    role: String,
    createdAt?: Date,
    updatedAt?: Date,
    userId: Types.ObjectId
}

export { IAccessToken };