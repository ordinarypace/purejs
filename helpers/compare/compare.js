const Parser = (_ => {
    /**
     * @desc validate value, reassign stacks
     * @type {{object: (function(*=, *, *)), array: (function(*, *, *))}}
     */
    const valid = {
        object(a, b, stacks){
            let k;

            for(k in a) if(Object.hasOwnProperty.call(a, k)) stacks.push([a[k], b[k]]);

            return stacks;
        },

        array(a, b, stacks){
            a.forEach((v, i) => stacks.push([v, b[i]]));

            return stacks;
        }
    };

    /**
     * @desc JSON을 type에 맞춰 literal 단위로 쪼개어 검사
     * @param a
     * @param b
     * @returns {boolean}
     */
    const tokenizer = (a, b) => {
        let stacks = [];
        let stack = [a, b];

        do{
            const [A, B] = stack;

            if(A && typeof A === 'object'){
                if(Array.isArray(A)){
                    if(!Array.isArray(B) || A.length !== B.length) return false;

                    stacks = valid.array(A, B, stacks);

                } else stacks = valid.object(A, B, stacks);

            } else if(A !== B) return false;

        } while(stack = stacks.pop());

        return true;
    };

    return {
        tokenizer
    };
})();

export default Parser;