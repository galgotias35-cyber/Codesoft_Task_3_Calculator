// script.js

const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = calculator.querySelector('.calculator-screen');

let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

// --- Event Listener for Calculator Buttons ---

keys.addEventListener('click', (event) => {
    const target = event.target;
    const value = target.value;

    if (!target.matches('button')) {
        return;
    }

    // Number Inputs
    if (!isNaN(value)) {
        inputDigit(value);
        return;
    }
    
    // Operator, Equal, Decimal, and AC
    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(value);
            break;
        case '=':
            calculate();
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
    }
});

// --- Core Logic Functions ---

function inputDigit(digit) {
    const displayValue = display.value;
    
    if (waitingForSecondValue === true) {
        display.value = digit;
        waitingForSecondValue = false;
    } else {
        // If display is '0', replace it; otherwise, append the digit
        display.value = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (waitingForSecondValue === true) {
        display.value = '0.';
        waitingForSecondValue = false;
        return;
    }
    
    if (!display.value.includes(dot)) {
        display.value += dot;
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(display.value);
    
    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        return;
    }

    if (firstValue === null) {
        firstValue = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstValue, inputValue);
        
        // Update display and set result as the new firstValue for chaining
        display.value = String(result);
        firstValue = result;
    }
    
    waitingForSecondValue = true;
    operator = nextOperator;
}

// --- Calculation Object ---

const performCalculation = {
    '/': (first, second) => first / second,
    '*': (first, second) => first * second,
    '+': (first, second) => first + second,
    '-': (first, second) => first - second
};

function calculate() {
    if (operator === null || waitingForSecondValue) {
        return; 
    }
    
    const inputValue = parseFloat(display.value);
    
    // Store values for history before calculation
    const currentFirstValue = firstValue;
    const currentOperator = operator;
    const secondValue = display.value; 
    
    const result = performCalculation[currentOperator](currentFirstValue, inputValue);
    
    // Update History
    const calculationString = `${currentFirstValue} ${currentOperator} ${secondValue}`;
    updateHistory(calculationString, result);
    
    // Update the state for the next calculation
    display.value = String(result);
    firstValue = result;
    operator = null; 
    waitingForSecondValue = true; 
}

function resetCalculator() {
    display.value = '0'; 
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
}

// --- History Functions ---

function updateHistory(calculationString, result) {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    
    listItem.innerHTML = `
        <span>${calculationString}</span>
        <span style="font-weight: bold;">${result}</span>
    `;
    
    historyList.prepend(listItem);
}

function clearHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
}

// --- Keyboard Support Logic ---

document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Numbers (0-9)
    if (!isNaN(key)) {
        inputDigit(key);
        return;
    }

    // Operators
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(key);
        return;
    }

    // Decimal Point
    if (key === '.') {
        inputDecimal(key);
        return;
    }

    // Enter Key for calculation (Acts as '=')
    if (key === 'Enter') {
        event.preventDefault(); // Prevents form submission/scrolling
        calculate();
        return;
    }

    // Delete Key for All Clear (Acts as 'AC')
    if (key === 'Delete' || key === 'c' || key === 'C') {
        resetCalculator();
        return;
    }
});
