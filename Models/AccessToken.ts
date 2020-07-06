'use strict';

import { Schema, Types, model } from 'mongoose';
import moment from 'moment';
import { IAccessToken } from './IAccessToken';

const accessTokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
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
        type: Types.ObjectId,
        ref: 'User'
    }
});

const AccessToken = model<IAccessToken>('AccessToken', accessTokenSchema);

export { AccessToken };