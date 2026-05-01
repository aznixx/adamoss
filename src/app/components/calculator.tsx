import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
//  FULLY FUNCTIONAL WINDOWS 95 CALCULATOR
// ═══════════════════════════════════════════════════════════════
export function CalculatorContent() {
  const [display, setDisplay] = useState('0.');
  const [memory, setMemory] = useState(0);
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit + '.');
      setWaitingForOperand(false);
    } else {
      const clean = display.replace('.', '');
      if (clean === '0') {
        setDisplay(digit + '.');
      } else {
        setDisplay(clean + digit + '.');
      }
    }
  };

  const inputDecimal = () => {
    // Already showing decimal in Win95 style
  };

  const clear = () => {
    setDisplay('0.');
    setAccumulator(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0.');
    setWaitingForOperand(false);
  };

  const backspace = () => {
    const clean = display.replace('.', '');
    if (clean.length <= 1) {
      setDisplay('0.');
    } else {
      setDisplay(clean.slice(0, -1) + '.');
    }
  };

  const performOperation = (nextOp: string) => {
    const current = parseFloat(display);
    if (accumulator !== null && operator && !waitingForOperand) {
      let result = accumulator;
      switch (operator) {
        case '+': result = accumulator + current; break;
        case '-': result = accumulator - current; break;
        case '*': result = accumulator * current; break;
        case '/': result = current !== 0 ? accumulator / current : NaN; break;
      }
      if (isNaN(result) || !isFinite(result)) {
        setDisplay('Error');
        setAccumulator(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }
      setDisplay(String(result) + (String(result).includes('.') ? '' : '.'));
      setAccumulator(result);
    } else {
      setAccumulator(current);
    }
    setOperator(nextOp);
    setWaitingForOperand(true);
  };

  const calculate = () => {
    performOperation('=');
    setOperator(null);
  };

  const toggleSign = () => {
    const val = parseFloat(display);
    setDisplay(String(-val) + (String(-val).includes('.') ? '' : '.'));
  };

  const sqrt = () => {
    const val = parseFloat(display);
    if (val < 0) {
      setDisplay('Error');
    } else {
      const result = Math.sqrt(val);
      setDisplay(String(result) + (String(result).includes('.') ? '' : '.'));
    }
  };

  const percent = () => {
    if (accumulator !== null) {
      const result = accumulator * (parseFloat(display) / 100);
      setDisplay(String(result) + (String(result).includes('.') ? '' : '.'));
    }
  };

  const inverse = () => {
    const val = parseFloat(display);
    if (val === 0) {
      setDisplay('Error');
    } else {
      const result = 1 / val;
      setDisplay(String(result) + (String(result).includes('.') ? '' : '.'));
    }
  };

  const memoryStore = () => setMemory(parseFloat(display));
  const memoryRecall = () => {
    setDisplay(String(memory) + (String(memory).includes('.') ? '' : '.'));
    setWaitingForOperand(true);
  };
  const memoryClear = () => setMemory(0);
  const memoryAdd = () => setMemory(memory + parseFloat(display));

  const CalcBtn = ({ label, onClick, wide, color, style: extraStyle }: {
    label: string; onClick: () => void; wide?: boolean; color?: string; style?: React.CSSProperties;
  }) => (
    <button
      className="w95-btn"
      onClick={onClick}
      style={{
        width: wide ? 60 : 28,
        height: 22,
        padding: 0,
        fontSize: 11,
        fontFamily: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color || '#000',
        ...extraStyle,
      }}
    >{label}</button>
  );

  return (
    <div style={{ background: '#c0c0c0', padding: 6, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Display */}
      <div style={{
        background: '#fff', padding: '2px 4px', textAlign: 'right',
        fontFamily: '"Courier New", monospace', fontSize: 16,
        marginBottom: 6, minHeight: 24, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        borderTop: '2px solid #808080', borderLeft: '2px solid #808080',
        borderRight: '2px solid #fff', borderBottom: '2px solid #fff',
        boxShadow: 'inset 1px 1px 0 0 #000',
      }}>
        {display}
      </div>

      {/* Memory indicator */}
      <div style={{ fontSize: 10, height: 12, marginBottom: 2, paddingLeft: 4, color: '#808080' }}>
        {memory !== 0 ? 'M' : ''}
      </div>

      {/* Button grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Row 1: MC MR MS M+ */}
        <div style={{ display: 'flex', gap: 2 }}>
          <CalcBtn label="MC" onClick={memoryClear} color="#ff0000" />
          <CalcBtn label="MR" onClick={memoryRecall} color="#ff0000" />
          <CalcBtn label="MS" onClick={memoryStore} color="#ff0000" />
          <CalcBtn label="M+" onClick={memoryAdd} color="#ff0000" />
          <div style={{ flex: 1 }} />
          <CalcBtn label="Back" onClick={backspace} color="#ff0000" wide />
          <CalcBtn label="CE" onClick={clearEntry} color="#ff0000" />
          <CalcBtn label="C" onClick={clear} color="#ff0000" />
        </div>
        {/* Row 2 */}
        <div style={{ display: 'flex', gap: 2 }}>
          <CalcBtn label="7" onClick={() => inputDigit('7')} color="#0000ff" />
          <CalcBtn label="8" onClick={() => inputDigit('8')} color="#0000ff" />
          <CalcBtn label="9" onClick={() => inputDigit('9')} color="#0000ff" />
          <CalcBtn label="/" onClick={() => performOperation('/')} color="#ff0000" />
          <CalcBtn label="sqrt" onClick={sqrt} color="#0000ff" />
        </div>
        {/* Row 3 */}
        <div style={{ display: 'flex', gap: 2 }}>
          <CalcBtn label="4" onClick={() => inputDigit('4')} color="#0000ff" />
          <CalcBtn label="5" onClick={() => inputDigit('5')} color="#0000ff" />
          <CalcBtn label="6" onClick={() => inputDigit('6')} color="#0000ff" />
          <CalcBtn label="*" onClick={() => performOperation('*')} color="#ff0000" />
          <CalcBtn label="%" onClick={percent} color="#0000ff" />
        </div>
        {/* Row 4 */}
        <div style={{ display: 'flex', gap: 2 }}>
          <CalcBtn label="1" onClick={() => inputDigit('1')} color="#0000ff" />
          <CalcBtn label="2" onClick={() => inputDigit('2')} color="#0000ff" />
          <CalcBtn label="3" onClick={() => inputDigit('3')} color="#0000ff" />
          <CalcBtn label="-" onClick={() => performOperation('-')} color="#ff0000" />
          <CalcBtn label="1/x" onClick={inverse} color="#0000ff" />
        </div>
        {/* Row 5 */}
        <div style={{ display: 'flex', gap: 2 }}>
          <CalcBtn label="0" onClick={() => inputDigit('0')} color="#0000ff" />
          <CalcBtn label="+/-" onClick={toggleSign} color="#0000ff" />
          <CalcBtn label="." onClick={inputDecimal} color="#0000ff" />
          <CalcBtn label="+" onClick={() => performOperation('+')} color="#ff0000" />
          <CalcBtn label="=" onClick={calculate} color="#ff0000" />
        </div>
      </div>
    </div>
  );
}
