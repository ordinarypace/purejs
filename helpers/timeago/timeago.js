const TimeAGo = (_ => {
    /**
     *
     YEAR  : now - last / 1000 / 60 * 60 * 24 * 30 * 12
     MONTH : now - last / 1000 / 60 * 60 * 24 * 30
     DAY   : now - last / 1000 / 60 * 60 * 24
     HOUR  : now - last / 1000 / 60 * 60
     MINUTE: now - last / 60
     SECOND: now - last ( Based on milliseconds )
     *
     * @type {{MILLISECOND: number, YEAR: number, MONTH: number, DAY: number, HOUR: number, MINUTE: number}}
     */
    const CONST = {
        MILLISECOND: 1000,
        YEAR: 31104000,
        MONTH: 2592000,
        DAY: 86400,
        HOUR: 3600,
        MINUTE: 60
    };

    /**
     * @desc choice language
     * @type {{ko: {YY: string, MM: string, DD: string, hh: string, mm: string, ss: string}}}
     */
    const suffix = {
        ko: {
            YY: '년 전',
            MM: '달 전',
            DD: '일 전',
            hh: '시간 전',
            mm: '분 전',
            ss: '초 전'
        }
    };

    let language;

    /**
     * @desc Decimal point abscission calculation result
     * @param timeTable
     * @returns {{}}
     */
    const getCalculatedTable = (timeMap) => {
        const result = {};

        for(const k of Object.keys(timeMap)) result[k] = Math.floor(timeMap[k]);

        return result;
    };

    /**
     * @desc ios 계열일 경우 ISO 표준 타입의 date 방식이 아닌경우 작동하지 않아서 polyfill
     * @param date
     * @returns {Date}
     */
    const isAppleDevice = (date) => {
        if(navigator.userAgent.match(/(iPhone|iPod|iPad)/) !== null){
            const d = new Date(date.replace(/-/g, '/'));

            return d;
        }

        return new Date(date);
    };

    /**
     * @desc Millisecond to second & create time table
     * @param time
     * @returns {{}}
     */
    const getLastTime = ({ time, lang }) => {
        const last = isAppleDevice(time).getTime();
        const now = Date.now();
        const second = (now - last) / CONST.MILLISECOND;
        const timeMap = {
            YY: second / CONST.YEAR,
            MM: second / CONST.MONTH,
            DD: second / CONST.DAY,
            hh: second / CONST.HOUR,
            mm: second / CONST.MINUTE,
            ss: second
        };

        language = lang;

        return getCalculatedTable(timeMap);
    };

    /**
     * @desc Return results based on conditions in the timetable.
     * @param time
     * @returns {string}
     */
    const getConditions = (timeMap) => {
        let result;

        if(timeMap.ss < CONST.MINUTE) result = 'ss';
        else if(timeMap.ss > CONST.MINUTE && timeMap.ss < CONST.HOUR) result = 'mm';
        else if(timeMap.ss > CONST.HOUR && timeMap.ss < CONST.DAY) result = 'hh';
        else if(timeMap.ss > CONST.DAY && timeMap.ss < CONST.MONTH) result = 'DD';
        else if(timeMap.ss > CONST.MONTH && timeMap.ss < CONST.YEAR) result = 'MM';
        else result = 'YY';

        return `${timeMap[result]}${suffix[language][result]}`;
    };

    return ({ time, lang }) => getConditions(getLastTime({ time, lang }));
})();

export default TimeAGo;