# Simple Calculator

A web-based calculator application built with HTML, CSS, and JavaScript that supports basic arithmetic operations and special operations like power and modulo.

## Features

-**Basic Arithmetic**: Addition, subtraction, multiplication, and division

-**Advanced Operations**:

- Power (`^`) - raise a number to a power
- Modulo (`\`) - get remainder of division
- Percentage (`%`) - convert to percentage

-**Clear Operations**:

-`AC` - Clear all (reset calculator)

-`DEL` - Delete last character

-**Real-time Progress Display** - shows your expression as you type

-**Result Display** - shows the most recent calculation result

## Project Structure

```

agents-documentation-output-report/

├── index.html          # Main HTML markup for the calculator interface

├── css/

│   └── style.css       # Styling for the calculator layout and buttons

├── scripts/

│   └── main.js         # Core calculator logic and event handling

├── svg/                # SVG icons for calculator buttons

│   ├── add.svg         # Addition operator icon

│   ├── minus.svg       # Subtraction operator icon

│   ├── divide.svg      # Division operator icon

│   ├── equal.svg       # Equals button icon

│   ├── delete.svg      # Delete icon

│   ├── del.svg         # Small delete icon

│   ├── percent.svg     # Percentage icon

│   ├── caret.svg       # Power operator icon

│   ├── mod.svg         # Modulo operator icon

│   └── clear.svg       # Clear/multiply icon

└── README.md           # This file

```

## Usage

### Opening the Calculator

1. Open `index.html` in a web browser
2. The calculator interface will display with a number pad and operation buttons

### Basic Operations

- Click number buttons (0-9) to enter digits
- Click operator buttons (+, -, *, /) to perform basic arithmetic
- Click `=` to calculate the result
- Click `AC` to clear all and start over
- Click `DEL` to remove the last character entered

### Advanced Operations

-**Power** (`^`): Enter first number, click `^`, enter power, click `=`

- Example: `2 ^ 3 = 8`

-**Modulo** (`\`): Enter first number, click `\`, enter divisor, click `=`

- Example: `10 \ 3 = 1`

-**Percentage** (`%`): Enter a number, click `%` to convert to percentage

- Example: `50 % = 0.5`

## Key Components

### HTML Structure

-**Result Screen** (`#result-screen`): Displays previous results and current progress

- Recent result display (`#recent`)
- Progress/current expression display (`#progress`)

-**Operator Buttons** (`#op-buttons`): Grid layout of all calculator buttons

### JavaScript Functions

#### Core Functions

-`handleClick(value)` - Main event handler for button clicks

-`handleBasic_op(exp)` - Evaluates basic arithmetic expressions

-`update_progress(value)` - Updates the display with current expression

-`handleClear(show_update)` - Resets calculator state

#### Operation Handlers

-`handle_operands(exp, current_input)` - Processes operands for special operations

-`solve_operands(op1, op2, operator, cur_input)` - Solves power and modulo operations

-`handle_power(base, pow)` - Calculates power (base^pow)

-`handle_reminder(first, second)` - Calculates modulo (remainder)

-`handle_percentage(val)` - Converts value to percentage

#### Helper Functions

-`delete_seq(exps)` - Handles deletion of characters

-`isAri_exp(exp)` - Checks if expression contains only arithmetic operations

-`basicMath(current_input)` - Validates if expression contains only basic math

-`isBack_op(value)` - Checks if value is a back-function (AC, DEL, =)

-`isEx_operator(value)` - Checks if value is an extended operator (^, \, %)

### CSS Styling

- Responsive grid layout for calculator buttons
- Visual feedback for different button types (numbers, operators, functions)
- Display areas for showing results and progress

## How It Works

1.**Input Handling**: When a button is clicked, its value is captured and passed to `handleClick()`

2.**Expression Building**: The calculator builds up an expression string as buttons are clicked

3.**Real-time Calculation**: For basic operations, results are calculated and displayed in real-time

4.**Progress Display**: The expression is formatted and displayed with spaces around operators for readability

5.**Result Calculation**: When `=` is clicked, the final result is computed and displayed

6.**Special Operations**: Power and modulo operations are handled separately with custom logic

## State Management

The calculator maintains several state variables:

-`__progress_result` - Current expression being built

-`__recent_result` - Most recent calculation result

-`op1`, `op2` - Operands for extended operations

-`basic_op` - Current basic operation

-`used_op` - String tracking which operators have been used

-`allowInput` - Flag controlling whether new input is accepted

-`_live_calc` - Current live calculation value

## Browser Compatibility

Works in all modern browsers that support:

- ES6 JavaScript (arrow functions, template literals)
- HTML5
- CSS3

## Known Limitations

- Uses `eval()` for expression evaluation (suitable for trusted user input in this context)
- Special operations (power, modulo) have specific sequencing requirements
- Decimal precision depends on JavaScript number handling

## Future Improvements

- Add parentheses support for complex expressions
- Implement calculator history
- Add keyboard support
- Improve error handling and validation
- Add number formatting for large results	
- Support for more mathematical functions (square root, trigonometric, etc.)

## Development

To modify the calculator:

1. Edit `scripts/main.js` to change logic
2. Edit `css/style.css` to change styling
3. Edit `index.html` to change layout or add new buttons
4. Test changes in your browser

## License

This project is part of CSC426 coursework.
