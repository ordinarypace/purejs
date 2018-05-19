import Helper from '@/helpers';

const Tab = (_ => {
    /**
     * @class Tab
     */
    return class {
        /**
         * @constructor
         * @param options
         */
        constructor(options){
            this._prevIndex = null;
            this._currIndex = 0;
            this._loaded = false;

            this.assign(options);
            this.init();
            this.bindEvents();
        }

        /**
         * @desc 기본 엘레먼트 설정.
         * @param options
         */
        assign(options){
            const def = {
                list: '.futures-tab__list',
                items: '.futures-tab__item',
                panels: '.futures-tab__panel',
                cls: 'selected',
                startIndex: 0
            };

            Object.keys(options || def).forEach(v => {
                const target = (options && options[v] || def[v]);
                const cls = typeof target === 'string' && target.charAt(0) === '.';

                this[v] = cls ? Helper.$.get(target) : target;
            });
        }

        /**
         * @desc 정적 이벤트 바인딩.
         */
        bindEvents(){
            Helper.event.on(['click'], this.items, e => this.change(e), false);
        }

        /**
         * @desc 초기 설정.
         */
        init(){
            this._prevIndex = this.startIndex;

            this.command({
                target: [this.items, this.panels],
                command: 'add',
                index: this.startIndex
            });

            this._loaded = true;
        }

        /**
         * @desc current target 을 기준으로 아이템과 패널 변경.
         * @param e
         */
        change(e){
            Helper.event.prevent(e);

            const { currentTarget } = e;
            this.getIndex(currentTarget);
            this.changeItem();
            this.changePanel();
            this.changeIndex();
        }

        /**
         * @desc 선택된 탭 설정.
         */
        changeItem(){
            this.command({
                target: [this.items, this.panels],
                command: 'add',
                index: this._currIndex
            });
        }

        /**
         * @desc 이전 탭 설정.
         */
        changePanel(){
            this.command({
                target: [this.items, this.panels],
                command: 'remove',
                index: this._prevIndex
            });
        }

        /**
         * @desc 인덱스 변경.
         */
        changeIndex(){
            this._prevIndex = this._currIndex;
        }

        /**
         * @desc command 를 기준으로 실행하는 실행기.
         * @param target
         * @param command
         * @param index
         */
        command({ target, command, index }){
            if(!this._loaded || (this._loaded && this._prevIndex !== this._currIndex)) target.forEach(v => v[index].classList[command](this.cls));
        }

        /**
         * @desc target 을 기준으로 인덱스를 얻는다.
         * @param currentTarget
         */
        getIndex(currentTarget){
            this._currIndex = this.items.findIndex(v => v === currentTarget);
        }
    }
})();

export default Tab;