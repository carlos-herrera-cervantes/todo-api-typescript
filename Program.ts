'use strcit';

import { Startup } from './Startup';

class Program {
    
    constructor() { }

    public createHostBuilder = (): void =>{
        const app = new Startup();
        app.listen();
    }

}

new Program().createHostBuilder();