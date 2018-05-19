import Helper from '@/helpers';

const Template = _ => {
    /**
     * @desc return raw strings.
     * @param str
     */
    const safe = str => String.raw `${str}`;

    const bind = ({ component, data, index, func = [], node = null, context = null }) => component.call(context, { data, index }, ...func);

    /**
     * @desc compile ES2015 template literal
     * @param args
     */
    const compile = (args) => {
        if(!args) Helper.err('Not exist template data!');

        const keys = Array.isArray(args) ? args : [args];
        const promise = new Promise((resolve, reject) => {
            if(typeof args === 'object' && keys.length){
                keys.map(v => {
                    const module = Array.isArray(args) ?  v : args;
                    const alive = module.alive || false;
                    const data = Array.isArray(module.data) ? module.data.length : module.data;

                    if(!module.target) reject('target is not found!');

                    if(alive) module.target.innerHTML = '';

                    if(!data){
                        const res = bind({ component: module.component, data: null });
                        return module.node ? Helper.$.append(module.target, res) : module.target.innerHTML += res, module.target;

                    } else {
                        ((Array.isArray(module.data) && module.data) || typeof module.data === 'object' && [{ ...module.data }] || [module.data]).reduce((p, c, i) => {
                            const { component, func = [], node = null, context = null } = module;
                            const map = { component, data: c, index: i, func, node, context }, res = bind(map);

                            return node ? Helper.$.append(p, res) : p.innerHTML += res, p;

                        }, module.target);
                    }
                });

                resolve({ render: true });
            }
        });

        return promise;
    };

    return {
        compile,
        safe
    }
};

export default Template;