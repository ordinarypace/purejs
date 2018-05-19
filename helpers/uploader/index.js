import Scheme from './scheme';
import Helper from '@/helpers';

const Uploader = (_ => {
    const State = class {
        constructor(){
            this.pending = 'pending';
            this.uploading = 'uploading';
            this.completed = 'completed';
            this.failed = 'failed';
            this.canceled = 'canceled';
            this.current = null;
        }
    };

    const Uploader = class {
        static extension(v){
            return v.split('.')[1];
        }

        constructor(data){
            Helper.object.prop(this, {
                data,
                formData: new FormData(),
                multipart: data.size > 1
            });
        }

        validate(cb){
            if(!this.data || !(Helper.is(this.data, Scheme))) Helper.err('invalid data!');

            this._validate(cb);
        }

        _validate(cb){
            Helper.err('override!');
        }

        upload(cb){
            this.data.values.reduce((p, c) => { return p.append(this.data.key, c), p; }, this.formData);

            this._upload(cb);
        }

        _upload(cb){
            Helper.err('override!');
        }
    };

    const Image = class extends Uploader {
        constructor(data){
            super(data);

            if(!this.isRegExp(data)) Helper.object.prop(data, { regexp: /(bmp|gif|jpg|jpeg|png)/i });
        }

        _validate(cb){
            if(this.process()) this.upload(cb);
            else {
                alert('해당 파일 형식은 지원하지 않습니다.');
                this.data.target.value = '';
            }
        }

        _upload(callback){
            if(callback && typeof callback === 'function') callback.call(null, this.formData);
            else Helper.err('Must be Callback Function!');
        }

        isRegExp(obj){
            return obj.hasOwnProperty('regexp') && obj.regexp;
        }

        process(){
            const { regexp, values } = this.data;

            return !this.multipart ? regexp.test(Uploader.extension(values[0].name)) : values.every(v => regexp.test(Uploader.extension(v.name)));
        }

        loadImages(e){
            const container = document.querySelector(this.data.render.target), { dataset } = container, key = Object.keys(dataset)[0];

            container.innerHTML += `<li class="image-upload__preview-item" data-${key}><img src="${e.target.result}" data-${key} alt="load Image"></li>`;
        }

        render(){
            if(!this.data.render.use) return false;

            this.data.values.map(v => {
                const reader = new FileReader();

                reader.onload = e => this.loadImages(e, reader);
                reader.readAsDataURL(v);
            });
        }
    };

    return {
        Image,
        init(options){
            const data = new Scheme({ ...options });

            return new this[data.instance](data);
        }
    };
})();

export default Uploader;