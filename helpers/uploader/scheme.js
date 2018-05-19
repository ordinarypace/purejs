import Helper from '@/helpers';

const Scheme = class {
    constructor({
        target = {},
        type,
        key,
        render = {},
        regexp = null
    }){
        Helper.object.prop(this, {
            target,
            type,
            key,
            render,
            values: [...target.files],
            regexp,
            state: 'PENDING'
        });
    }

    get size(){
        return this.values.length;
    }

    get instance(){
        return `${this.type.charAt(0).toUpperCase()}${this.type.slice(1, this.type.length)}`;
    }
};

export default Scheme;