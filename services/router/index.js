import Helper from '@/helpers';

/**
* @desc Scheme Loader. dynamic importer. supported mobile, pc, etc.
*/
const Loader = _ => import('./scheme/index');

/**
* @desc Router
*/
const Router = ({ Scheme, context, global }) => {
    const instances = new Map(), { pathname } = location;
    const g = pathname.split('/');

    const matcher = (p, g) => {
        if(p === g) return p;
        else if(p.startsWith(':')) return g;
        else return false;
    };

    const explore = (v) => v.path.split('/').map((p, i) => matcher(p, g[i])).join('/') === pathname ? [v] : false;
    const route = (() => {
        for(let i = 0; i < Scheme.length; i += 1){
            const v = Scheme[i];
            const p = explore(v);

            if(v.path.substr(1).trim() !== g[1]) continue;
            if(v.hasOwnProperty('children')){
                const c = v.children.filter(c => c.path.split('/').map((p, i) => matcher(p, g[i + 1])).slice(1).join('/') === g.slice(2).join('/'));

                if(c.length) return c;
                else {
                    if(p && p[0].path === v.path) return p;
                    else continue;
                }

            } else {
                if(p.length) return p;
                else continue;
            }
        }
    })();

    if(!route) Helper.err('invalid Route!');

    const [module] = route, { path, component, template } = module, { referrer } = document;
    const procedure = {
        get info(){
            return {
                from: referrer,
                to: path,
                component: component.name
            }
        },

        get instance(){
            if(!instances.has(component.name)) Helper.err('Must be instance name!');

            return instances.get(component.name);
        },

        set(v){
            if(typeof component === 'function' && 'prototype' in component) instances.set(component.name, new component(v, template));
        },

        go(v){
            location.href = v === -1 ? referrer : v;
        }
    };

    procedure.set(context);
    if(!('futures' in global)){
        global.futures = {};
        global.futures.router = procedure;
    }
};

export { Router, Loader };
