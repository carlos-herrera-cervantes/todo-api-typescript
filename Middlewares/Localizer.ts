'use strict';

import i18n from 'i18n';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

class Localizer {

    private setLanguagesDirectory = (): void => {
        i18n.configure({ directory: path.join(__dirname, '..', 'Locales'), defaultLocale: 'es' });
    }

    public configureLanguages = (request: Request, response: Response, next: NextFunction): void => {
        this.setLanguagesDirectory();
        i18n.init(request, response);
        next();
    }

}

const localizer = new Localizer();

export { localizer };