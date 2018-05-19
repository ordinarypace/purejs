import Preset from '../preset/index';
import Helper from '@/helpers';

/**
 * @desc 상태 관리 클래스.
 * @type {State}
 */
const State = class {
    constructor(){
        this.required = 'required';
        this.invalid = 'invalid';
        this.ignore = 'ignore';
        this.current = null;
    }

    set state(v){
        this.current = v;
    }

    get state(){
        return this.current;
    }
};

const Validate = class {
    /**
     * @desc Preset 에 등록되어 있는 rule 테스트를 위한 스태틱 메소드.
     * @param r
     * @param v
     */
    static test(r, v){
        return r.test(v);
    }

    /**
     * @desc value 의 유무 체크를 위한 스태틱 메소드.
     * @param v
     * @returns {*}
     */
    static empty(v){
        return Helper.string.isEmpty(v);
    }

    /**
     * @desc 체크박스나 라디오 버튼일 경우 체크 유무를 위한 스태틱 메소드.
     * @param t
     * @returns {checked|boolean|ot.selectors.pseudos.checked|*|ga.selectors.pseudos.checked}
     */
    static checked(t){
        if(t.type !== 'checkbox' || t.type !== 'radio') Helper.err('Type is not correct!');

        return t.checked;
    }

    /**
     * @desc validator 초기 설정.
     */
    constructor(){
        this._error = 0;
        this._state = new State();
        this._data = {};
        this._options = [];
        this._preset = Preset;
        this._pattern = /^[.|\[]/;
    }

    /**
     * @desc 에러 setter
     * @param result
     */
    set error(v){
        this._error += v;
    }

    /**
     * @desc 에러 getter
     * @returns {number|*}
     */
    get error(){
        return this._error;
    }

    /**
     * @desc 데이터 setter
     * @param v
     */
    set data(v){
        this._data[v.valid] = v.value;
    }

    /**
     * @desc 데이터 getter
     * @returns {Array}
     */
    get data(){
        return this._data;
    }

    /**
     * @desc 옵션 setter
     * @param v
     */
    set options(v){
        this._options.push(v);
    }

    /**
     * @desc 옵션 getter
     * @returns {Array}
     */
    get options(){
        return this._options;
    }

    /**
     * @desc validate 실행 추상 메소드.
     */
    run(){
        Helper.err('override!');
    }

    clear(){
        this._error = 0;
        this._clear();
    }

    /**
     * @desc 초기화 추상 메소드.
     */
    _clear(){
        Helper.err('override!');
    }

    /**
     * @desc 상태를 얻어오는 메소드.
     * @param valid
     * @param value
     * @returns {string}
     * @private
     */
    _getState({ valid, value }){
        let state;

        if(!Validate.empty(value)) state = this._state.required;
        else if(this._preset[valid].rule && !Validate.test(this._preset[valid].rule, value)) state = this._state.invalid;
        else state = null;

        return state;
    }

    /**
     * @desc validate 템플릿 메소드.
     * @param e
     * @param callback
     */
    validate(e, callback, fail){
        e.preventDefault();

        if(!(Helper.is(this._state, State))) Helper.err('Invalid STATE!');

        if(typeof callback !== 'function') Helper.err('Callback must be FUNCTION!');

        this.disable();
        this._validate(callback, fail);
    }

    /**
     * @desc validate 추상 메소드.
     * @param callback
     * @private
     */
    _validate(callback){
        Helper.err('override!');
    }

    /**
     * @desc validate 성공 추상 메소드.
     * @param target
     * @param valid
     * @param value
     * @private
     */
    _success({ target, valid, value }){
        Helper.err('override!');
    }

    /**
     * @desc validate 실패 추상 메소드.
     * @param state
     * @param target
     * @param valid
     * @private
     */
    _fail({ state, target, valid }){
        Helper.err('override!');
    }

    /**
     * @desc 메세지 렌더링 추상 메소드.
     * @param state
     * @param target
     * @param valid
     * @private
     */
    _render({ state, target, valid }){
        Helper.err('override!');
    }

    /**
     * @desc key 이벤트 감시 추상 메소드.
     * @private
     */
    _watch(){
        Helper.err('override!');
    }

    /**
     * @desc 타겟 버튼을 disable 하기 위한 메소드.
     */
    disable(){
        if('disabled' in this.target) this.target.disabled = true;
    }

    /**
     * @desc 타겟 버튼을 enable 하기 위한 메소드.
     */
    enable(){
        if('disabled' in this.target) this.target.disabled = false;
    }

    /**
     * @desc Preset 에 원하는 타입을 추가하기 위한 메소드.
     * @param key
     * @param rule
     * @param required
     * @param invalid
     */
    add({ key, rule = null, required = '', invalid = '' }){
        if(key in this._preset) Helper.err('Exist KEY!');

        Helper.object.prop(this._preset, { [key]: { rule, required, invalid } });
    }

    /**
     * @desc Preset 에 추가한 타입을 제거하기 위한 메소드.
     * @param key
     */
    remove(key){
        delete this._preset[key];
    }
};

export default Validate;