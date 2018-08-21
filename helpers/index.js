// polyfill
(arr => {
    arr.forEach(item => {
        if (item.hasOwnProperty('remove')){
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: _ => {
                if(this.parentNode !== null) this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

// throw error
const error = str => {
    throw new Error(str ? str : 'Must be override');
};

// generate singleton
const Singleton = class extends WeakMap {
    has(){
        error();
    }
    get(){
        error();
    }
    set(){
        error();
    }
    getInstance(v){
        if(!super.has(v.constructor)) super.set(v.constructor, v);
        return super.get(v.constructor);
    }
};

const singleton = new Singleton();

const Js = class {
    constructor(){
        this._dom = null;
        this._events = {
            events: '',
            callback: null,
            capture: false
        };

        return singleton.getInstance(this);
    }

    /**
     * @desc 노드 환경일 경우 환경 현재 환경 반환
     * @returns {*}
     */
    get env(){
        return process.env.NODE_ENV
    }

    /**
     * @desc 셀렉터
     * @param selector
     * @param parent
     * @returns {Js}
     */
    $(selector, parent){
        if(!selector) error('Must be selector');

        this._dom = Array.from((parent || document).querySelectorAll(selector));

        return this;
    }

    /**
     * @desc 이벤트 on, off 헬퍼
     * @param command
     */
    bind(command){
        if(this._dom.length > 1) this._dom.forEach(v => this._events.events.split(',').forEach(e => v[command](e.trim(), this._events.callback, this._events.capture)));

        this._events.events.split(',').forEach(v => this._dom[command](v, this._events.callback, this._events.capture));
    }

    /**
     * @desc 이벤트 on
     * @param events
     * @param callback
     * @param capture
     */
    on(events, callback, capture){
        this.props(this._events, { events, callback, capture });

        if(!this._dom.length) error('Must be 1 element');

        this.bind('addEventListener');
    }

    /**
     * @desc 이벤트 off
     */
    off(){
        this.bind('removeEventListener');
    }

    /**
     * @desc element 가 존재할 경우 하위 자식 찾기
     * @param selector
     */
    find(selector){
        if(this._dom.length > 1) error('mandatory in 1 parameter');

        this._dom.querySelectorAll(selector);
    }

    /**
     * @desc default prevent
     * @param e
     * @returns {Js}
     */
    prevent(e){
        e.preventDefault();
        return this;
    }

    /**
     * @desc stop propagation event
     * @param e
     */
    stop(e){
        e.stopPropagation();
        return this;
    }

    /**
     * @desc 객체의 프로퍼티 확장
     * @param target
     * @param properties
     * @returns {*}
     */
    props(target, properties){
        return Object.assign(target, ...properties);
    }

    /**
     * @desc dataset 가져오기, 설정
     * @param data
     * @param value
     * @returns {*}
     */
    dataset(data, value){
        const string =  data.replace(/\-([a-z])/ig, (m, letter) => letter.toUpperCase());

        if(this._dom.hasOwnProperty('dataset')) return value ? this._dom.dataset[string] = value : this._dom.dataset[string];
        else return value ? this._dom.setAttribute(`data-${data}`, value) : this._dom.getAttribute(`data-${data}`);

        return this;
    }

    /**
     * @desc 배열 판별
     * @param arr
     * @returns {boolean}
     */
    isArray(arr){
        return Array.isArray(arr);
    }

    /**
     * @desc 빈 값 판별
     * @param obj
     * @returns {Number}
     */
    empty(obj){
        if(typeof obj === 'string') return obj.trim().length;

        if(this.isArray(obj)) return obj.length;

        return Object.keys(obj).length;
    }

    /**
     * @desc append children
     * @param parent
     * @param elements
     */
    append(parent, ...elements){
        return elements.forEach(v => (typeof parent === 'string' && this.$(parent) || parent).appendChild(v)), parent;
    }

    /**
     * @desc prepend children
     * @param parent
     * @param elements
     */
    prepend(parent, ...elements){
        return elements.reverse().forEach(v => (typeof parent === 'string' && this.$(parent) || parent).insertBefore(v, parent.firstChild)), parent;
    }

    /**
     * @desc 세자리 수 콤마 삽입
     * @param number
     * @returns {*}
     */
    numberFormat(number){
        if(!number) return number;

        return number.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    }

    /**
     * @desc 객체를 쿼리 스트링으로 변환
     * @param o
     * @returns {*|string}
     */
    query(o){
        return Object.keys(o).reduce((p, c) => { return p.push(`${c}=${o[c]}`), p; }, []).join('&');
    }

    /**
     * @desc 쿼리 스트링 얻기
     */
    params(url){
        const params = {}, scheme = (url ? url : location.search).split('?');

        if(scheme.length > 1){
            (url ? url : location.search).split('?')[1].split('&').forEach((v, i) => {
                const [key, value] = v.split('=');

                params[key] = value;
                params.length = i + 1;
            });

        } else params.length = 0;

        return params;
    }

    /**
     * @desc function 이름 얻기
     * @param v
     * @returns {*}
     */
    name(v){
        return (v.toString().match(/^function\s*([^\s(]+)/) || [])[1];
    }

    /**
     * @desc 쿠키 얻기
     * @param cname
     * @returns {*}
     */
    getCookie(cname){
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');

        for(let i = 0; i < ca.length; i += 1) {
            let c = ca[i];

            while(c.charAt(0) == ' ') c = c.substring(1);

            if(c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    /**
     * @desc 쿠키 설정
     * @param cname
     * @param cvalue
     * @param exdays
     */
    setCookie(cname, cvalue, exdays){
        const d = new Date();

        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

        const expires = "expires="+d.toUTCString();

        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    /**
     * @desc 인스턴스 포함 여부 확
     * @param target
     * @param parent
     * @returns {boolean}
     */
    is(target, parent){
        return target instanceof parent;
    }
};

const js = new Js();

window.addEventListener('load', _ => {
    window.js = js;
});
