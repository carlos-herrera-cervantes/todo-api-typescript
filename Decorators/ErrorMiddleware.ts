'use strict';

import { STATUS_CODES } from '../Constants/StatusCodes';

function ErrorMiddleware (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        try {
            return await original.apply(this, args);
        }
        catch (error) {
            const [ , response, ] = args;
            
            return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ status: false, message: error.message });
        }
    }

    return descriptor;
}

export { ErrorMiddleware };