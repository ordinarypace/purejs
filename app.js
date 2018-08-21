import 'babel-polyfill';
import Service from '@/services';
import  '@/helpers';

const purejs = (global => {
    /**
     * @desc App 설정
     * @type {futures}
     */
    const service = new Service();

})(window || global);
