var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var operations = {
    add: function (a, b) { return a + b; },
    subtract: function (a, b) { return a - b; },
    multiply: function (a, b) { return a * b; },
    divide: function (a, b) { return a / b; },
    power: function (a, b) { return Math.pow(a, b); },
    sqrt: function (a) { return Math.sqrt(a); }
};

var initialState = {
    current: '0',
    previous: null,
    operator: null,
    resetDisplay: false
};

var updateDisplay = function (value) {
    var display = document.getElementById('display');
    display.textContent = value;
};
var handleNumber = function (state, num) {
    if (state.resetDisplay) {
        return __assign(__assign({}, state), { current: num, resetDisplay: false });
    }
    return __assign(__assign({}, state), { current: state.current === '0' ? num : state.current + num });
};
var handleOperator = function (state, operator) { return (__assign(__assign({}, state), { previous: state.current, operator: operator, resetDisplay: true })); };
var calculateResult = function (state) {
    if (!state.operator || !state.previous)
        return state;
    var prev = parseFloat(state.previous);
    var current = parseFloat(state.current);
    var result = operations[state.operator](prev, current).toString();
    return __assign(__assign({}, state), { current: result, previous: null, operator: null });
};

var createNumberHandler = function (num) { return function (state) { return handleNumber(state, num); }; };
var createOperatorHandler = function (operator) { return function (state) {
    return handleOperator(state, operator);
}; };

var app = function () {
    var state = __assign({}, initialState);
    var updateState = function (newState) {
        state = newState;
        updateDisplay(state.current);
    };

    document.querySelectorAll('.number').forEach(function (button) {
        button.addEventListener('click', function () {
            updateState(createNumberHandler(button.textContent)(state));
        });
    });
    document.querySelectorAll('.operator').forEach(function (button) {
        var operator = button.id;
        if (operator === 'sqrt') {
            button.addEventListener('click', function () {
                var current = parseFloat(state.current);
                updateState(__assign(__assign({}, state), { current: operations.sqrt(current).toString() }));
            });
        }
        else {
            button.addEventListener('click', function () {
                updateState(createOperatorHandler(operator)(state));
            });
        }
    });
    document.getElementById('equals').addEventListener('click', function () {
        updateState(calculateResult(state));
    });
    document.getElementById('clear').addEventListener('click', function () {
        updateState(__assign({}, initialState));
    });
    document.getElementById('dot').addEventListener('click', function () {
        if (!state.current.includes('.')) {
            updateState(__assign(__assign({}, state), { current: state.current + '.' }));
        }
    });
};

app();
