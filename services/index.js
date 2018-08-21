import { Router, Loader } from './router';
import Http from './http';
import Template from './template';

const Service = (_ => {
    const service = Symbol('purejs');

    return class {
        /**
         * @desc initialized
         * @param modules
         */
        constructor(global){
            this[service] = { __version__: 1.0 };

            this.use([Http, Template]);
            this.setRouter(global);
        }

        /**
         * @desc internal contract
         * @param module
         */
        use(modules){
            if(!Array.isArray(modules)) modules = [modules];

            modules.map(v => js.props(this, { [(v.name || js.name(v)).toLowerCase()]: typeof v === 'function' && 'prototype' in v ? new v() : v }));
        }

        /**
         * @desc router loader
         */
        setRouter(global){
            Loader().then(v => Router({ Scheme: v.default, context: this, global }));
        }
    };
})();

export default Service;
