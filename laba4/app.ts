const operations = {
    add: (a: number, b: number) => a + b,
    subtract: (a: number, b: number) => a - b,
    multiply: (a: number, b: number) => a * b,
    divide: (a: number, b: number) => a / b,
    power: (a: number, b: number) => Math.pow(a, b),
    sqrt: (a: number) => Math.sqrt(a)
};

type CalculatorState = {
    current: string;
    previous: string | null;
    operator: keyof typeof operations | null;
    resetDisplay: boolean;
};

const initialState: CalculatorState = {
    current: '0',
    previous: null,
    operator: null,
    resetDisplay: false
};

const updateDisplay = (value: string) => {
    const display = document.getElementById('display')!;
    display.textContent = value;
};

const handleNumber = (state: CalculatorState, num: string): CalculatorState => {
    if (state.resetDisplay) {
        return { ...state, current: num, resetDisplay: false };
    }
    return { ...state, current: state.current === '0' ? num : state.current + num };
};

const handleOperator = (state: CalculatorState, operator: keyof typeof operations): CalculatorState => ({
    ...state,
    previous: state.current,
    operator,
    resetDisplay: true
});

const calculateResult = (state: CalculatorState): CalculatorState => {
    if (!state.operator || !state.previous) return state;
    
    const prev = parseFloat(state.previous);
    const current = parseFloat(state.current);
    
    const result = operations[state.operator](prev, current).toString();
    return { ...state, current: result, previous: null, operator: null };
};

const createNumberHandler = (num: string) => (state: CalculatorState) => handleNumber(state, num);
const createOperatorHandler = (operator: keyof typeof operations) => (state: CalculatorState) => 
    handleOperator(state, operator);

const app = () => {
    let state: CalculatorState = { ...initialState };
    
    const updateState = (newState: CalculatorState) => {
        state = newState;
        updateDisplay(state.current);
    };
    
    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', () => {
            updateState(createNumberHandler(button.textContent!)(state));
        });
    });
    
    document.querySelectorAll('.operator').forEach(button => {
        const operator = button.id as keyof typeof operations;
        if (operator === 'sqrt') {
            button.addEventListener('click', () => {
                const current = parseFloat(state.current);
                updateState({ ...state, current: operations.sqrt(current).toString() });
            });
        } else {
            button.addEventListener('click', () => {
                updateState(createOperatorHandler(operator)(state));
            });
        }
    });
    
    document.getElementById('equals')!.addEventListener('click', () => {
        updateState(calculateResult(state));
    });
    
    document.getElementById('clear')!.addEventListener('click', () => {
        updateState({ ...initialState });
    });
    
    document.getElementById('dot')!.addEventListener('click', () => {
        if (!state.current.includes('.')) {
            updateState({ ...state, current: state.current + '.' });
        }
    });
};

app();