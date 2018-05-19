const Preset = {
    name: {
        rule: /[a-zA-Z]|[가-힇]/,
        required: '사용자 이름을 입력해 주세요.',
        invalid: '한글, 영문으로만 입력해 주세요.'
    },

    email: {
        rule: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        required: '이메일을 입력해 주세요.',
        invalid: '이메일을 양식에 맞게 다시 입력해 주세요.'
    },

    birthday: {
        rule: /[0-9]{4}(1[0-2]|0[1-9])(3[01]|[12][0-9]|0[1-9])/,
        required: '생년월일을 입력해 주세요.',
        invalid: '생년월일 \'_\' 없이 8자리로만 입력해주세요.'
    },

    password: {
        rule: /((?=.*\d)(?=.*[a-zA-Z])(?=.*$).{6,15})/,
        required: '비밀번호를 입력해 주세요.',
        invalid: '비밀번호를 정확히 입력해 주세요.'
    },

    password2: {
        rule: /((?=.*\d)(?=.*[a-zA-Z])(?=.*$).{6,15})/,
        required: '비밀번호를 한번 더 입력해 주세요.',
        invalid: '비밀번호를 정확히 입력해 주세요.'
    },

    pw_2digit: {
        rule: /^[0-9]\d{1}$/,
        required: '비밀번호 앞 2자리를 입력해 주세요.',
        invalid: '비밀번호 앞 2자리는 숫자만 가능합니다.'
    },

    credit: {
        rule: /^\d{15,16}$/,
        required: '카드 번호를 입력해 주세요.',
        invalid: '카드 번호를 정확히 입력해 주세요.'
    },

    birthday: {
        rule: /^\d{6,10}$/,
        required: '생년월일이나 사업자등록 번호를 입력해 주세요.',
        invalid: '생년월일이나 사업자등록 번호를 정확히 입력해 주세요.'
    }
};

export default Preset;