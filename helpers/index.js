import Md from 'mobile-detect';

const Helpers = (_ => {
    const elementsCache = new Map();
    const helpers = {
        string: {
            /**
             * @desc 문자열의 길이를 체크하여 Boolean 을 반환한다.
             * @param str
             */
            isEmpty(str){
                if(!this.isPrimitive(str)) helpers.err('Type must be STRING!');
                return str.trim().length;
            },

            /**
             * @desc 문자 타입을 검사하여 Boolean 을 반환한다.
             * @param str
             * @returns {boolean}
             */
            isPrimitive(str){
                return typeof str === 'string';
            }
        },

        object: {
            /**
             * @desc 객체에 해당 프로퍼티 존재 유무 검사하여 Boolean 을 반환한다.
             * @param p
             * @param c
             * @returns {boolean}
             */
            has(p, c){
                return p.hasOwnProperty(c);
            },

            /**
             * @desc 객체를 순회하며 해당 프로퍼티 검사 후 리턴 타입에 맞게 상위 객체의 key or 해당 프로퍼티를 반환한다.
             * @param o (검사할 오브젝트)
             * @param t (타겟이 될 프로퍼티)
             * @param p (parent key 리턴 유무)
             * @returns {*}
             */
            find(o, t, p){
                let node = null;

                for(const k of Object.keys(o)){
                    if(this.has(o, k)){
                        if(typeof o[k] === 'object' && (node = o[k])) while(node){
                            const keys = Object.keys(node);

                            if(keys.includes(t)) return p ? k : t;
                        }
                    }
                }
            },

            /**
             * @desc 객체 인스턴스에 타겟이 될 객체의 getter 를 생성한다.
             * @param c
             * @param o
             * @returns {*}
             */
            extend(c = {}, o){
                return this.prop(c, Object.keys(o).reduce((p, c) => { return this.prop(p, { get [c](){ return p[c] } }), p; }, o));
            },

            /**
             * @desc 타겟에 프로퍼티를 설정한다.
             * @param t
             * @param p
             */
            prop(t, p){
                return Object.assign(t, p);
            }
        },

        func: {
            /**
             * @desc function 의 이름을 얻는다.
             * @param v
             * @returns {string | *}
             */
            name(v){
                return (v.toString().match(/^function\s*([^\s(]+)/) || [])[1];
            }
        },

        query: {
            /**
             * @desc query string 생성기.
             * @param o
             * @returns {*|string}
             */
            join(o){
                return Object.keys(o).reduce((p, c) => { p.push(`${c}=${o[c]}`), p; }, []).join('&');
            },

            /**
             * @desc query string 얻기.
             */
            params(){
                const params = {};

                location.search.substr(1).split('&').forEach(v => {
                    const [key, value] = v.split('=');

                    params[key] = value;
                });

                return params;
            }
        },

        number: {
            /**
             * @desc locale 에 맞는 숫자 콤마 포맷을 반환한다.
             * @param n
             * @returns {string}
             */
            format(n){
                return n.toLocaleString();
            }
        },

        storage: {
            set type(v){
                this._storage = v === 'session' ? sessionStorage : localStorage;
            },

            get type(){
                return this._storage;
            },

            set(k, v){
                if(!helpers.string.isPrimitive(k)) helpers.err('Key must be string type!!!');

                this._storage.setItem(k, JSON.stringify(v));
            },

            get(k){
                if(!helpers.string.isPrimitive(k)) helpers.err('Key must be string type!!!');

                return JSON.parse(this._storage.getItem(k));
            },

            remove(k){
                if(!helpers.string.isPrimitive(k)) helpers.err('Key must be string type!!!');

                this._storage.removeItem(k);
            },

            clear(){
                this._storage.clear();
            },

            has(k){
                return helpers.object.has(this._storage, k);
            }
        },

        $: {
            /**
             * @desc 부모 노드가 있으면 부모 노드에서 자식 노드를 찾아서 반환, 없으면 document 에서 찾아서 반환한다. 길이가 1일 경우 node 자체를 반환 하며 이상일 경우 Array 타입으로 변경하여 반환한다. (caching 추가)
             * @param target
             * @param parent
             * @returns {Array}
             */
            get(target, parent, isCache){
                if(isCache && elementsCache.has(target)) return elementsCache.get(target);
                else {
                    const el = (parent || document).querySelectorAll(target);
                    const result = el.length === 1 ? el[0] : Array.from(el);

                    elementsCache.set(target, result);

                    return result;
                }
            },

            /**
             * @desc 엘리먼트를 생성하고 타입에 맞는 프로퍼티를 설정한다.
             * @param tag
             * @param attr
             * @returns {HTMLElement}
             */
            el(tag, ...attr){
                const el = typeof tag === 'string' ? document.createElement(tag) : tag;

                for(let i = 0; i < attr.length;){
                    const k = attr[i++], v = attr[i++];

                    switch(true){
                        case typeof el[k] === 'function': {
                            el[k](...(Array.isArray(v) ? v : [v]));
                            break;
                        }
                        case k[0] === '@': {
                            el.style[k.substr(1)] = v;
                            break;
                        }
                        default: {
                            el[k] = v;
                            break;
                        }
                    }
                }
                return el;
            },

            /**
             * @desc 트리를 타입에 따라 순회하며 원하는 노드를 찾아서 리턴한다.
             * @param item
             * @param className
             * @param type: 'next', 'prev', default: child
             * @returns {*}
             */
            find({ target, className, type, tag }){
                let node = target;

                while(node){
                    if(node.nodeType === 1 && (!className ? node.tagName.toLowerCase() === tag : node.classList.contains(className))) return node;

                    node = {
                        next: node.nextSibling,
                        prev: node.previousSibling,
                        parent: node.parentNode

                    }[type] || node.children;
                }
            },

            /**
             * @desc 커스텀 데이터 헬퍼.
             * @param target
             * @param data
             * @param value
             * @returns {*}
             */
            dataset(target, data, value){
                const string =  data.replace(/\-([a-z])/ig, (m, letter) => letter.toUpperCase());

                if(target.hasOwnProperty('dataset')) return value ? target.dataset[string] = value : target.dataset[string];
                else return value ? target.setAttribute(`data-${data}`, value) : target.getAttribute(`data-${data}`);
            },

            /**
             * @desc append node
             * @param p
             * @param el
             */
            append(p, ...el){
                return el.forEach(v => (typeof p === 'string' && helpers.$.get(p) || p).appendChild(v)), p;
            },

            /**
             * @desc prepend node
             * @param p
             * @param el
             */
            prepend(p, ...el){
                return el.reverse().forEach(v => (typeof p === 'string' && helpers.$.get(p) || p).insertBefore(v, p.firstChild)), p;
            }
        },

        event: {
            init(event, target, callback, capture){
                helpers.object.prop(this, { event, target, callback, capture });
            },

            /**
             * @desc 이벤트 리스너.
             * @param type
             * @param target
             * @param callback
             * @param capture
             */
            on(event, target, callback, capture){
                if(!this.event) this.init(event, target, callback, capture);

                if(Array.isArray(this.target)) this.target.forEach(v => this.event.forEach(e => v.addEventListener(e, this.callback, this.capture)));
                else this.event.forEach(e => Helpers.$.get(this.target).addEventListener(e, this.callback, this.capture));

                return this;
            },

            /**
             * @desc 이벤트 prevent.
             * @param e
             * @returns {helpers}
             */
            prevent(e){
                e.preventDefault();
                return this;
            },

            /**
             * @desc 이벤트 stop propagation.
             * @param e
             * @returns {helpers}
             */
            stop(e){
                e.stopPropagation();
                return this;
            }
        },

        /**
         * @desc throw error.
         * @param v
         */
        err(v = 'invalid'){
            throw v;
        },

        /**
         * @desc instanceof 판별.
         * @param t
         * @param p
         * @returns {boolean}
         */
        is(t, p){
            return t instanceof p;
        },

        isLogged(){
            helpers.storage.type = 'session';
            return helpers.storage.has('session') ? helpers.storage.get('session') : false;
        },

        /**
         * @desc PC / Mobile 판별.
         */
        isMobile(){
            let md;

            if(!md) md = new Md(window.navigator.userAgent);

            return md.mobile();
        }
    };

    return helpers;
})();

export default Helpers;