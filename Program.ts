'use strcit';

import { App } from './Startup';

class Startup {
    
    constructor() { }

    public createHostBuilder(): void {
        const app = new App();
        app.listen();
    }

}

new Startup().createHostBuilder();