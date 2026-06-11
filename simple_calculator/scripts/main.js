
const back_fn = ["del", "ac", "="];
const ex_operators = ["^", "\\", "%"];
const operators = ["*", "-", "+", "/"];
let used_op = '';
let __progress_result = '';
let __error_result = '';
let __recent_result = '';
const empty_space = '&nbsp;';
let allowInput = true;

let _live_calc = '', op1 = '', op2 = '', basic_op='';

const handle_percentage = val => {
    return val / 100;
}

const handle_used_operators = value => {
    const merge_ops = [...ex_operators, ...operators];
    used_op += merge_ops.includes(value) ? value : '';
}

const handle_reminder = (first, second) => {
    // console.log(first, second);
    return first % second;
}

const handle_power = (base, pow) => {
    let _pow = base;
    for (let i = 1; i < pow; i++) {
        _pow *= base;
    }
    return _pow;
}

// delete sequence
const delete_seq = exps => {
    if (exps == undefined) {
        return handleClear();
    }

    if (exps == empty_space) {
        return [];
    }
    exps = exps.split("");
    if (exps.length > 0) {
        exps = exps.slice(0, exps.length - 1);
    }
    return exps;
}

// clear func
const handleClear = (show_update=true) => {
    op1 = '', op2 = '', basic_op = '', __error_result = '', __progress_result = '';
    used_op = '', allowInput = true, _live_calc = '';
    
    show_update ? update_progress(empty_space) : '';
}

// raw
// const raw = document.querySelector('#raw');


const update_progress = (value = '') => {
    if (!value) {
        value = __progress_result;
    }
    // console.log(value, 'vlauel')
    if (value == 'undefined' || value == '') {
        document.querySelector('#progress').innerHTML = empty_space;
    } else {
        const merge_op = [...ex_operators, ...operators];
        let exprss = value;
        exprss = exprss.toString();
        merge_op.forEach(ops => {
            let re_ops = ' ' + ops + ' ';
            if (exprss.includes(ops)) {
                exprss = exprss.replaceAll(ops, re_ops);
                // console.log('resssp', exprss)
            }
        });
        document.querySelector('#progress').innerHTML = exprss;
    }
}

const isExpContain_ex_operators = exp => {
    let ex = [false];
    ex_operators.forEach(op => { 
        if (exp.includes(op)) {
            ex = [true, op];
        }
    });
    return ex;
}

// handle op1 and op2
const handle_operands = async (exp, current_input) => {
    const ops = isExpContain_ex_operators(exp);
    
    if (ops[0]) {
        const sep = ops[1];
        const exps = exp.split(sep);

        if (exps[0] && exps[0] != '') {
            op1 = handleBasic_op(exps[0]);
        }
        if (exps[1] && exps[1] != '') {
            if (await isAri_exp(exps[1])) {
                if (await basicMath(current_input)) {
                    op2 = handleBasic_op(exps[1]);
                    // perform operation on exps
                    if (op2 !== undefined) {
                        solve_operands(op1, op2, sep, current_input);
                    }
                        
                }
            }
        }
        
    }
}

const solve_operands = (op1, op2, operator, cur_input) => {
    if (operator == "\\") {
        const remind = handle_reminder(op1, op2);
        _live_calc = remind;
        save_recent(remind);
    }
    // console.log('operator',operator)
    if (operator == "^") {
        // console.log('powe')
        const _pow = handle_power(op1, op2);
        _live_calc = _pow;
        save_recent(_pow);
    }
};

const show_progress = current_input => {
    if (!allowInput) {
        allowInput = true;
        return;
    };
    
    if (__error_result != '') {
        return update_progress(__progress_result); 
    }
    if (!back_fn.includes(current_input)) {
        if (ex_operators.includes(current_input) || operators.includes(current_input)) {
            current_input = current_input;
        }
        __progress_result += current_input;
        if (ex_operators.includes(current_input.trim()) && __progress_result == current_input) {
            
            __progress_result = '';
            return handleClear();
        }
        // console.log('secod')
        update_progress(__progress_result);
    }

};

const save_recent = value => {
    if (!value) value = _live_calc;
    __recent_result = value ? value : 0;

    document.querySelector('#recent').innerHTML = __recent_result;
}

// check basic math in expression
const basicMath = async current_input => {
    return new Promise((res, rej) => {
        let isBasic = true;

        // only arithemetic operations
        // operators.forEach(ari_op => {
        //     if (used_op.includes(ari_op)) {
        //         console.log(ari_op)
        //         isBasic = true;
        //     }
        // });
        
        // if last value is ari_op => false
        if (operators.includes(current_input)) isBasic = false;

        // if expr contain ex_op false
        const merge_ex_ops = [...ex_operators, ...back_fn];
        merge_ex_ops.forEach(ex_op => {
            if (used_op.includes(ex_op)) {
                isBasic = false;
            }
        })
        // raw.innerHTML = isBasic + used_op;
    
        res(isBasic);
    });
}

// arithemetic exp
const isAri_exp = async exp => {
    return new Promise((res, rej) => {
        exp.split("").forEach(str => {
            if (ex_operators.includes(str)) {
                res(false);
            }
        });
        res(true);
    })
}

// backend_op
const isBack_op = value => {
    return back_fn.includes(value);
}

// isEx_operators
const isEx_operator = value => {
    return ex_operators.includes(value);
}

// operators used in exp

const handleClick = async (value) => {
    // clear func
    if (isBack_op(value) && value == 'ac') {

        return handleClear();
    }

     // handle sequence delete 
    if (isBack_op(value) && value == 'del') {
        let del_exp = (delete_seq(__progress_result));
        // console.log(del_exp)
        if (del_exp == undefined) return;
        del_exp = del_exp.join('');

        if (del_exp.length) {
            __progress_result = del_exp;
        } else {
            __progress_result = "";
        }

        // console.log(__progress_result, '__progress_result');
        return update_progress();
    }
    
    // raw.innerHTML = basicMath();
    show_progress(value);

    handle_used_operators(value);

    // raw.innerHTML = used_op;
    // basic math
    if (await isAri_exp(__progress_result)) {
        if (await basicMath(value)) {
            // __error_result += ''
            _live_calc = handleBasic_op(__progress_result);
            
            save_recent(_live_calc);
        }
        // handle percentage
    } 
    if (isEx_operator(value) && value == '%') {
        let percent = handle_percentage(_live_calc);
        allowInput = false;
        save_recent(percent);
    }
    
    
    // Re-construct expression
    // handle mod
    const rem = "\\";
    if (isEx_operator(value) && value == rem) {
        if (__progress_result.trim() == '') {
            __progress_result = '';
            return handleClear();
        }
        __progress_result = _live_calc + rem+' ';
        update_progress(__progress_result);
        used_op = '';
    }
    
    // handle mod
    const _pow = "^";
    if (isEx_operator(value) && value == _pow) {
        __progress_result = _live_calc + ' '+_pow+' ';
        update_progress(__progress_result);
        used_op = '';
    }


    // handle solve 
    if (isBack_op(value) && value == '=') {
        __recent_result = _live_calc;
        __progress_result = _live_calc ? _live_calc : 0;
        update_progress('');
        save_recent();
        handleClear(false);
    } else {
        handle_operands(__progress_result, value);
    }
    
 
}

const handleBasic_op = exp => { 
    try {
        return eval(exp);
    } catch ( error ) {
        __error_result = 'Error!';
        op2 = '';
        // raw.innerHTML = __error_result;
        show_progress('');
        handleClear();
        update_progress(__error_result);
        __progress_result = '';
    }
}

const btns = document.querySelectorAll('button');

function solve_fn() {

}

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');
        handleClick(value);
    })
})