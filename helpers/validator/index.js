import Validate from './validate';
import Helper from '@/helpers';

const Validator = (_ => {
    /**
     * @desc General validation. ( text, password ...etc )
     * @type {validation}
     */
    const validation = class extends Validate {
        constructor(options){
            super();

            Object.keys(options).map(v => {
                if(Array.isArray(options[v]) && v === 'extends') options[v].map(a => this.add(a));
                else this[v] = (typeof options[v] === 'string' && this._pattern.test(options[v]) && v !== 'message') ? Helper.$.get(options[v]) : options[v];
            });
        }

        /**
         * @desc validate 실행 구상 메소드.
         * @param callback
         */
        run(callback, fail){
            if(!this._loaded && this.watch) this._watch(callback, fail);
            this.target.addEventListener('click', e => this.validate(e, callback, fail), false);
        }

        /**
         * @desc 초기화 구상 메소드.
         */
        _clear(){
            this._data.length = 0;
        }

        /**
         * @desc validate 구상 메소드.
         * @param callback
         * @private
         */
        _validate(callback, fail){
            this.clear();

            for(const v of this.els) this._valid(v);

            if(this.options.length) this._optional();

            if(!this.error) callback.call(null, this.data);
            else if(fail) fail.call(null, this.error);
        }

        /**
         * @desc validate 실제 구현부.
         * @param v
         * @returns {boolean}
         * @private
         */
        _valid(v){
            const { valid } = v.dataset;
            const value = v.value.trim();
            const state = this._getState({ valid, value });

            if(!this._ignore({ v, valid })) return false;

            this._primitive({ state, v, valid, value });

            if(this.compare && this.data[this.compare[0]]) this._compare({ v, valid, value });
        }

        /**
         * @desc 원시값 검사 메소드.
         * @param state
         * @param v
         * @param valid
         * @param value
         * @private
         */
        _primitive({ state, v, valid, value }){
            state ? this._fail({ state, target: v, valid }) : this._success({ target: v, valid, value });
        }

        /**
         * @desc 비교값 검사 메소드.
         * @param v
         * @param valid
         * @param value
         * @private
         */
        _compare({ v, valid, value }){
            if(valid === this.compare[1]){
                const compare = this.data[this.compare[0]];

                if(compare !== value) this._fail({ state: this._state.invalid, target: v, valid: 'compare' });
                else this._success({ target: v, valid: 'compare', value });
            }
        }

        /**
         * @desc 옵션값 검사 메소드.
         * @private
         */
        _optional(){
            const target = this.options[0], { valid } = target.dataset;
            const checked = this.options.filter(v => v.checked)[0];

            if(!this.options.some(v => v.checked)) this._fail({ state: this._state.required, target, valid });
            else this._success({ target: checked, valid, value: checked.id });
        }

        /**
         * @desc 특정 값 제외 메소드.
         * @param v
         * @param valid
         * @returns {boolean}
         * @private
         */
        _ignore({ v, valid }){
            if(valid === this._state.ignore) return false;
            else {
                if(v.type === 'radio'){
                    this.options = v;
                    return false;
                }
            }
            return true;
        }

        /**
         * @desc validate 성공 구상 메소드.
         * @param target
         * @param valid
         * @param value
         * @private
         */
        _success({ target, valid, value }){
            this.error = 0;
            this.data = { target, valid, value };
            this._render({ target });
        }

        /**
         * @desc validate 실패 구상 메소드.
         * @param state
         * @param target
         * @param valid
         * @private
         */
        _fail({ state, target, valid }){
            this.error = 1;
            this._render({ state, target, valid });
        }

        /**
         * @desc 메세지 렌더링 구상 메소드.
         * @param state
         * @param target
         * @param valid
         * @private
         */
        _render({ state, target, valid }){
            const parent = Helper.$.find({ target, type: 'parent', className: this.container });
            const node = Helper.$.get(this.message, parent);
            let message;

            if(!state){
                node.classList.remove('invalid');
                node.innerHTML = '';

            } else {
                if(!this._preset[valid]) Helper.err('Not exist PRESET KEY!');

                message = this._preset[valid][state];

                if(this.alert) alert(message);
                else {
                    node.classList.add('invalid');
                    node.innerHTML = message;
                }
            }

            this.enable();
        }

        /**
         * @desc key 이벤트 감시 구상 메소드
         * @private
         */
        _watch(callback, fail){
            Helper.event.on(['keyup', 'change', 'focusin'], this.els, e => this._valid(e.target), false);
        }
    };

    /**
     * @desc Optional validation. ( checkbox, radio )
     * @type {optional}
     */
    const checked = class extends Validate {
        constructor(options){
            super();

            Object.keys(options).map(v => this[v] = (typeof options[v] === 'string' && this._pattern.test(options[v]) && v !== 'message') ? Helper.$.get(options[v]) : options[v]);
        }

        /**
         * @desc validate 실행 구상 메소드.
         * @param callback
         */
        run(callback){
            if(this.watch) this._watch(callback);
            this.target.addEventListener('click', e => this.validate(e, callback), false);
        }

        /**
         * @desc 초기화 구상 메소드.
         * @private
         */
        _clear(){
            this._data.length = 0;
        }

        /**
         * @desc validate 구상 메소드.
         * @param callback
         * @private
         */
        _validate(callback){
            this.clear();
            this.els.map(v => v.checked ? this._success({ target: v, value: v.checked }) : this._fail({ target: v }));

            if(!this.error && callback) callback.call(null, this.data);
            else return false;
        }

        /**
         * @desc validate 성공 구상 메소드.
         * @param target
         * @param valid
         * @param value
         * @private
         */
        _success({ target, value }){
            this.error = 0;
            this.data = { target, value };
            this._render({ state: true, target });
        }

        /**
         * @desc validate 실패 구상 메소드.
         * @param state
         * @param target
         * @param valid
         * @private
         */
        _fail({ target }){
            this.error = 1;
            this._render({ state: false, target });
        }

        /**
         * @desc 메세지 렌더링 구상 메소드.
         * @param state
         * @param target
         * @param valid
         * @private
         */
        _render({ state, target }){
            const parent = Helper.$.find({ target, type: 'parent', className: this.container });
            const node = Helper.$.get(this.message, parent);

            if(!state){
                const { message } = target.dataset;

                if(!message) Helper.err('Not exist property!');

                if(this.alert) alert(message);
                else {
                    node.classList.add('invalid');
                    node.innerHTML = message;
                }
            } else {
                node.classList.remove('invalid');
                node.innerHTML = '';
            }

            this.enable();
        }

        _watch(){
            Helper.event.on(['click'], this.els, e => this._validate(), false);
        }
    };

    return { validation, checked };
})();

export default Validator;