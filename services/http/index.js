import Helper from '@/helpers';
import axios from 'axios';

const Http = _ => {
    const env = process.env.NODE_ENV;
    const csrf = 'Laravel' in window && Laravel.csrfToken;
    const http = axios.create(csrf && { headers: { 'X-CSRF-TOKEN': csrf.content } });

    /**
     * @desc response success 일 경우 response 를 리턴하는 인터셉터 핸들러.
     * @param response
     * @returns {*}
     */
    const handleHttpSuccess = (response) => {
        const successCode = 200;

        if(response.status === successCode) return response;
    };

    /**
     * @desc response fail 일 경우 에러 로그를 보여주는 인터셉터 핸들러.
     * @param error
     */
    const handleHttpFail = (error) => {
        console.log(`response error:${error}`);

        return error;
    };

    http.interceptors.response.use(handleHttpSuccess, handleHttpFail);

    /**
     * @desc Asynchronous JavaScript and XML 를 도와주는 helper 메소드. 기본적으로 X-CSRF-TOKEN 헤더를 포함하고 있다.
     * @param method
     * @param url
     * @param payload
     * @param headers
     * @returns {Promise.<*>}
     */
    const request = async ({ method, url, payload = {}, headers }) => {
        const { Helpers } = http.defaults.headers;

        if(!Helper.string.isEmpty(url) && !Helper.string.isPrimitive(url)) Helper.err('Invalid url!');

        if(headers) Helpers[headers.key] = headers.value;

        const promise = await http({ method, url: `${url}`, data: payload, headers });

        return promise;
    };

    return {
        request
    }
};

export default Http;