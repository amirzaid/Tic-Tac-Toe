import './App.css';
import Cell from './components/cell';
import React, { useState, useEffect } from 'react';
import { freeCells, calculateOffset, bestMove, calculateWinner, setValue, style_reset } from './utilities';

function App() {
  const [cells, setCells] = useState(Array(9).fill(''));
  const [turn, setTurn] = useState('x');
  const [mode, setMode] = useState('easy'); // AI mode
  const line_pos = {
    offset_top: 0,
    offset_left: 0,
    angle: 0
  };
  const winner = calculateWinner(cells);

  // New game
  const restart = () => {
    setCells(['', '', '', '', '', '', '', '', '']);
    setTurn('x');
    document.getElementsByClassName('line')[0].style.display = 'none';
    document.getElementsByClassName('line')[0].classList.remove('stretch');
    style_reset();
  }

  if (winner) {
    if (winner.cell !== 'tie') {
      // Calculate line offset
      const new_offset = calculateOffset(winner.a, winner.c);
      line_pos.offset_top = new_offset.offset_top;
      line_pos.offset_left = new_offset.offset_left;
      line_pos.angle = new_offset.angle;
      document.getElementsByClassName('line')[0].classList.add('stretch');
    } else {
      // tie
      /* restart(); */
    }
  }


  // User move
  const handleClick = (e, i) => {
    if (winner || cells[i] !== '') {
      return;
    };
    setValue(cells, setCells, i, turn, setTurn);
  }

  // When a move is played
  useEffect(() => {
    // AI turn
    const pcTurn = () => {
      let free_cells = freeCells(cells);
      if (mode === 'easy') { // Easy mode
        setValue(cells, setCells, free_cells[Math.floor(Math.random() * freeCells.length)], turn, setTurn);
      } else { // Hard mode
        setValue(cells, setCells, bestMove(cells), turn, setTurn);
      }
    }

    if (!winner && turn === 'o') {
      setTimeout(pcTurn, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells])

  return (
    <div className="App">
      <div className='board'>
        {cells.map((cell, i) => (
          <Cell key={i} value={cell} onClick={(e) => turn === 'x' ? handleClick(e, i) : null}></Cell>
        ))}
      </div>
      <div className='line' style={
        {
          top: line_pos.offset_top,
          transform: `rotate(${line_pos.angle}deg)`,
          left: line_pos.offset_left
        }
      } />
      <h3> {winner ? `Winner: ${winner.cell}` : `Current Turn: ${turn}`}</h3>
      <button className='restart' onClick={() => restart()}>Restart</button>
      <div className='mode_selection'>
        <span>
          <input id='easy_mode' type='radio' name='game_mode' value='easy' onChange={(e) => setMode(e.target.value)} disabled={freeCells(cells).length < 9} defaultChecked />
          <label htmlFor='easy_mode'>easy</label>
        </span>
        <span>
          <input id='hard_mode' type='radio' name='game_mode' value='hard' onChange={(e) => setMode(e.target.value)} disabled={freeCells(cells).length < 9} />
          <label htmlFor='hard_mode'>hard</label>
        </span>
      </div>
    </div >
  );
}

export default App;
