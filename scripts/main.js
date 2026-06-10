
const back_fn = ["del", "ac", "="];
const ex_operators = ["\\", "%"];
const operators = ["^", "*", "-", "+", "/"];

const handle_percentage = val => {
    return val / 100;
}

const handle_reminder = (first, second) => {
    return first % second;
}

const handle_power = (base, pow) => {
    let _pow = base;
    for (let i = 1; i < pow; i++) {
        _pow *= base;
    }
    return _pow;
}

let __progress_result = '';
let __error_result = '';
let __recent_result = '';

let _live_calc = '', op1 = '', op2 = '', basic_op='';



const show_progress = value => {
    if (__error_result != '') {
        return document.querySelector('#progress').innerHTML = __progress_result;
    }
    if(!back_fn.includes(value)) {
        if (ex_operators.includes(value) || operators.includes(value)) {
            value = ' '+value+' ';
        }
        __progress_result += value;

        document.querySelector('#progress').innerHTML = __progress_result;
    }

}

const save_recent = value => {
    __recent_result = value;
    document.querySelector('#recent').innerHTML = __recent_result;
}

// check basic math in expression
const basicMath = () => {
    let isBasic = false;
    operators.forEach(op => {
        if (__progress_result.includes(op)) {
            isBasic = true;
        }
    })
}

const handleClick = (value) => {
    
    // basic math
    if (basicMath()) {
        _live_calc = handleBasic_op(__progress_result);
    }
    show_progress(value);
}

const handleBasic_op = exp => {
    try {
        return eval(exp);
    } catch (error) {
        __error_result = 'Error!';
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