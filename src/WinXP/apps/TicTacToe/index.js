import React, { useState } from 'react';

import styled from '@emotion/styled';
import './index.css';
// import 'xp.css/dist/XP.css';

const Cell = ({ num, handleClick, cells }) => {
  return <td onClick={() => handleClick(num)}>{cells[num]}</td>;
};

export default function TicTacToe({ onClose }) {
  const [turn, setTurn] = useState('x');
  const [cells, setCells] = useState(Array(9).fill(''));
  const [winner, setWinner] = useState();

  const checkForWinner = (squares) => {
    const combos = {
      across: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ],
      down: [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
      ],
      diagonal: [
        [0, 4, 8],
        [2, 4, 6],
      ],
    };
    for (let combo in combos) {
      combos[combo].forEach((pattern) => {
        if (
          squares[pattern[0]] === squares[pattern[1]] &&
          squares[pattern[1]] === squares[pattern[2]]
        ) {
          setWinner(squares[pattern[0]]);
        }
      });
    }
  };

  function handleClick(num) {
    let squares = [...cells];
    if (cells[num] !== '') {
      return;
    }

    if (turn === 'x') {
      squares[num] = 'x';
      setTurn('o');
    } else {
      squares[num] = 'o';
      setTurn('x');
    }

    setCells(squares);
    checkForWinner(squares);
  }

  const handleRestart = () => {
    setWinner(null);
    setCells(Array(9).fill(''));
  };

  return (
    <Div>
      {winner && (
        <div>
          <p className="winner">{winner} is the winner!</p>
          <button className="play-again" onClick={() => handleRestart()}>
            Play Again
          </button>
        </div>
      )}
      <table>
        <tr>
          <Cell num={0} handleClick={handleClick} cells={cells} />
          <Cell num={1} handleClick={handleClick} cells={cells} />
          <Cell num={2} handleClick={handleClick} cells={cells} />
        </tr>
        <tr>
          <Cell num={3} handleClick={handleClick} cells={cells} />
          <Cell num={4} handleClick={handleClick} cells={cells} />
          <Cell num={5} handleClick={handleClick} cells={cells} />
        </tr>
        <tr>
          <Cell num={6} handleClick={handleClick} cells={cells} />
          <Cell num={7} handleClick={handleClick} cells={cells} />
          <Cell num={8} handleClick={handleClick} cells={cells} />
        </tr>
      </table>
    </Div>
  );
}

const Div = styled.div`
  height: 100%;
  background: linear-gradient(to right, #edede5 0%, #ede8cd 100%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
