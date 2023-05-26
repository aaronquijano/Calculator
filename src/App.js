// import logo from './logo.svg';
// import './App.css';
import React, { useState, useEffect } from 'react';


function Calculator() {
  const [computation, setComputation] = useState('');
  const [answer, setAnswer] = useState('0');

  // Remove trailing decimals
  const removeTrailingDecimals = input => {
    let new_input = input; 
    let corrected = [];

    let ops = new_input.match(/[\+\*\-\/]+/g);
    if (ops) {
      ops.reverse();
    }

    if (!ops) {
        
      let x = new_input.split(".");
      x.splice(1, 0, '.');
      return x.join('');

    } else {
      let nums = new_input.split(/[\+\-\/\*]+/g).reverse();

      const splittedDecimals = nums.map(c => {
        if (/\./g.test(c)) {
          let x = c.split('.');
          x.splice(1, 0, '.');
          return x.join('');
        } 
      });
      
      splittedDecimals.map((c, i) => {
        corrected.push(c);
        corrected.push(ops[i]);
      });
    }

    return corrected.filter(x => {
      return x !== undefined; 
    }).reverse().join('');
  } 

  // Remove excess decimals
  useEffect(() => {
    let cloned = answer;
    let cloned2 = computation;
    if (/\.{2,}/g.test(cloned)) {
      setAnswer(cloned.replace(/\.{2,}/g, '.'));
      setComputation(cloned.replace(/\.{2,}/g, '.'));
    }
    if (/\d+\.\d+\.\d+/g.test(cloned) || /\d+\.\d+\.\d+/g.test(cloned)) {
      let excessDecimalRemoved = removeTrailingDecimals(cloned);
      setAnswer(excessDecimalRemoved);
      let excessDecimalRemoved2 = removeTrailingDecimals(cloned2);
      setComputation(excessDecimalRemoved2);
    }
    if (/^[\+\*\/]+/g.test(cloned2)) {
      setComputation(cloned2.replace(/^[\+\*\/]+/g, ''));
      setAnswer('0');
    }
    if (/^\-{2,}/g.test(cloned2)) {
      setComputation(cloned2.replace(/^\-{2,}/g, '-'));
    }
    if (/^\-[\+\*\/]+/g.test(cloned2)) {
      setComputation(cloned2.replace(/^\-[\+\*\/]+/g, '-'));
      setAnswer('-');
    }
  }, [answer, computation]);

  const clearDisplay = () => {
    setComputation('');
    setAnswer('0');
  }

  // Compute an answer from a postfix notation input
  const computeAnswer = input => {
    let forEvaluation = [];

    input.forEach(x => {
      if (isNaN(x)) {
        let a = forEvaluation.pop();
        let b = forEvaluation.pop();
        switch(x) {
          case '+': 
            forEvaluation.push(a + b);
            break;
          case '-': 
            // Handle negative numbers
            if (b < 0) {
              b = (b * (-1));
            } 
            forEvaluation.push(a - b);
            break;
          case '/':
            forEvaluation.push(a / b);
            break;
          case '*': 
            forEvaluation.push(a * b);
            break;
        }
      } else {
        forEvaluation.push(x);
      }
    });

    return forEvaluation[0];
  }

  // Parse user input into postfix notation
  const computeInput = () => {

    if (/^\-?\.?\d+$/g.test(computation) 
        || /[\+\-\*\/]+$/g.test(computation)
        || (answer === '0' && computation === '')) return;

    let prefixedString = [];
    let operators = [];
    let ops = ['-','+','/','*'];
    let new_input = [];

    // Remove excess operators
    let numberInput = computation.match(/\-?\d+(\.\d+)?|\-?\.?\d+/g).reverse();

    let splittedOperators = computation.match(/[\+\/\*\-]+/g).map(x => {
      if (x.charAt(x.length-1) === '-' && x.length > 1) {
        return x.charAt(x.length-2);
      } else {
        return x.charAt(x.length-1);
      } 
    }).reverse();

    for (let i = 0; i < numberInput.length; i++) {
      new_input.push(Number(numberInput[i]));
      new_input.push(splittedOperators[i]);
    }

    new_input = new_input.filter(x => {
      return x !== undefined;
    });

    if (/\-/.test(new_input[new_input.length-1])) {
      new_input.pop();
    } 

    // Filling the stack for evaluation
    for (let i = 0; i < new_input.length; i++) {
      if (!isNaN(new_input[i])) {
        prefixedString.push(new_input[i]);
      } else {
        if (operators.length === 0) {
          operators.push(new_input[i]);
        } else {
          if (operators[operators.length-1] === new_input[i] 
              || (ops.indexOf(new_input[i]) > ops.indexOf(operators[operators.length-1]))) {
                operators.push(new_input[i]);
          } else {
            do {
              prefixedString.push(operators.pop());
              if (ops.indexOf(new_input[i]) === ops.indexOf(operators[operators.length-1]) 
                  || (ops.indexOf(new_input[i]) > ops.indexOf(operators[operators.length-1]))) {
                operators.push(new_input[i]);
                break;
              }
            } while (operators.length > 0);
          }
        }
      }
    }

    do {
      prefixedString.push(operators.pop());
    } while(operators.length > 0);

    const ans = computeAnswer(prefixedString);
    setAnswer(ans);
    setComputation(ans);
  }

  // Handle keypad events
  const handleKeypad = (e) => {
    let input = '';

    switch(e.target.id) {
      case 'clear': clearDisplay(); break;
      case 'divide': input = '/';break;
      case 'multiply': input = '*'; break;
      case 'add': input = '+'; break;
      case 'subtract': input = '-'; break;
      case 'zero': input = '0'; break;
      case 'one': input = '1'; break;
      case 'two': input = '2'; break;
      case 'three': input = '3'; break;
      case 'four': input = '4'; break;
      case 'five': input = '5'; break;
      case 'six': input = '6'; break;
      case 'seven': input = '7'; break;
      case 'eight': input = '8'; break;
      case 'nine': input = '9'; break;
      case 'decimal': input = '.'; break;
      case 'equals': computeInput();  break;
    }
    
    if (input) {
      if (answer === '0') {
        if (input !== answer) {
          setAnswer('');
          setAnswer((current) => { 
            return (current + input); 
          });
          setComputation('');
          setComputation((current) => {
            return (current + input);
          });
        } 
      } else {
        if (input === '+' || input === '-' || input === '*' || input === '/') {
          setAnswer(input);
        } else {
          if (answer === '+' || answer === '-' || answer === '*' || answer === '/') {
            setAnswer('');
          }
          setAnswer((current) => { 
            return (current + input); 
          });
        }
        setComputation((current) => {
          return (current + input);
        });
      }
    } 
  }

  return (
    <div className='container'>
      <div className='calc'>
        <div className='display-container'>
          <div className='computation' 
          dangerouslySetInnerHTML={{ __html: computation }}
          ></div>
          <div id='display'
          dangerouslySetInnerHTML={{ __html: answer }}
          ></div>
        </div>
        <div className='keypad' onClick={(e) => handleKeypad(e)}>
          <button className='num' id='clear'>{'A/C'}</button>
          <button className='num' id='divide'>{'/'}</button>
          <button className='num' id='multiply'>{'*'}</button>
          <button className='num' id='seven'>{7}</button>
          <button className='num' id='eight'>{8}</button>
          <button className='num' id='nine'>{9}</button>
          <button className='num' id='add'>{'+'}</button>
          <button className='num' id='four'>{4}</button>
          <button className='num' id='five'>{5}</button>
          <button className='num' id='six'>{6}</button>
          <button className='num' id='subtract'>{'-'}</button>
          <button className='num' id='one'>{1}</button>
          <button className='num' id='two'>{2}</button>
          <button className='num' id='three'>{3}</button>
          <button className='num' id='zero'>{0}</button>
          <button className='num' id='decimal'>{'.'}</button>
          <button className='num' id='equals'>{'='}</button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
