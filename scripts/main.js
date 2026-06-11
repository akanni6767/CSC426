
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
    console.log(first, second);
    return first % second;
}

const handle_power = (base, pow) => {
    let _pow = base;
    for (let i = 1; i < pow; i++) {
        _pow *= base;
    }
    return _pow;
}

// clear func
const handleClear = () => {
    op1 = '', op2 = '', basic_op = '', __error_result = '', __progress_result = '';
    used_op = '', allowInput = true, _live_calc='';
    update_progress(empty_space);
}

// raw
const raw = document.querySelector('#raw');


const update_progress = value => {
    document.querySelector('#progress').innerHTML = value;
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
            console.log('exp1', '3', exps[1]);
            if (await isAri_exp(exps[1])) {
                if (await basicMath(current_input)) {
                    console.log('back', exps[1])
                    op2 = handleBasic_op(exps[1]);
                }
            }
        }
        
    }

    
}

const show_progress = current_input => {
    if (!allowInput) return;
    if (__error_result != '') {
        return update_progress(__progress_result);
    }
    if(!back_fn.includes(current_input)) {
        if (ex_operators.includes(current_input) || operators.includes(current_input)) {
            current_input = ' '+current_input+' ';
        }
        __progress_result += current_input;

        update_progress(__progress_result);
    }

}

const save_recent = value => {
    __recent_result = value;
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
        raw.innerHTML = isBasic + used_op;
    
        res(isBasic);
    });
}

// arithemetic exp
const isAri_exp = async exp => {
    return new Promise((res, rej) => {
        exp.split("").forEach(str => {
            if (ex_operators.includes(str)) {
                console.log('ex ops', str)
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
    
    // raw.innerHTML = basicMath();
    show_progress(value);

    handle_used_operators(value);

    raw.innerHTML = used_op;
    // basic math
    if (await isAri_exp(__progress_result)) {
        if (await basicMath(value)) {
            // __error_result += ''
            _live_calc = handleBasic_op(__progress_result);
            
            save_recent(_live_calc);
        }
    } 

    // handle percentage
    if (isEx_operator(value) && value == '%') {
        let percent = handle_percentage(_live_calc);
        allowInput = false;
        save_recent(percent);
    }


    // Re-construct expression
    // handle mod
    const rem = "\\";
    if (isEx_operator(value) && value == rem) {
        __progress_result = _live_calc + ' '+rem+' ';
        update_progress(__progress_result);
        used_op = '';
    }


    // handle solve 

    
    handle_operands(__progress_result, value);
 
}

const handleBasic_op = exp => { 
    try {
        return eval(exp);
    } catch (error) {
        __error_result = 'Error!:'+exp+error;
        raw.innerHTML = __error_result;
        show_progress('');
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