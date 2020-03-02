'use strict';

import { Document } from 'mongoose';

interface IUser extends Document {
    email: String,
    firstName: String,
    lastName: String,
    ageInYears: Number,
    password: String
}

export { IUser }