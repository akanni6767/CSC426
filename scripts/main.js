
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
    used_op = '', allowInput = true;
    update_progress(empty_space);
}

// raw
const raw = document.querySelector('#raw');


const update_progress = value => {
    document.querySelector('#progress').innerHTML = value;
}




const show_progress = value => {
    if (!allowInput) return;
    if (__error_result != '') {
        return update_progress(__progress_result);
    }
    if(!back_fn.includes(value)) {
        if (ex_operators.includes(value) || operators.includes(value)) {
            value = ' '+value+' ';
        }
        __progress_result += value;

        update_progress(__progress_result);
    }

}

const save_recent = value => {
    __recent_result = value;
    document.querySelector('#recent').innerHTML = __recent_result;
}

// check basic math in expression
const basicMath = async value => {
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
        if (operators.includes(value)) isBasic = false;

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
    
    // raw.innerHTML = basicMath();
    show_progress(value);

    handle_used_operators(value)
    raw.innerHTML = used_op;
    // basic math
    if (await basicMath(value)) {
        __error_result += ''
        _live_calc = handleBasic_op(__progress_result);
        save_recent(_live_calc);
    }

    // handle percentage
    if (isEx_operator(value) && value == '%') {
        let percent = handle_percentage(_live_calc);
        allowInput = false;
        save_recent(percent);
    }

    // handle mod
    if (isEx_operator(value) && value == "\\") {

        let percent = handle_reminder(_live_calc, value);
        save_recent(percent);
    }


    // handle solve 


    // clear func
    if (isBack_op(value) && value == 'ac') {

        handleClear();
    }
    
    
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