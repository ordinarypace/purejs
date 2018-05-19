const TemplateHelpers = (_ => {
    return {
        lineBreak(str){
            return str.includes('\n') ? str.replace(/\n/, '<br>') : '';
        },

        numberFormat(n){
            return n.toLocaleString();
        },

        dateFormat(d){
            return new Date(d).toString().split(' ').slice(1, 4).join(' ');
        }
    }
})();

export default TemplateHelpers;
