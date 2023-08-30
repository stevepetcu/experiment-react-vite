import './TicTacToe.css';
import XIcon from './reusable/XIcon';
import OIcon from './reusable/OIcon';
import {useReducer} from 'react';
import classNames from 'classnames';
import * as _ from 'lodash';

enum CellValue {
  EMPTY = 'Empty',
  X = 'X',
  O = 'O'
}

enum ActionType {
  PLACE_LETTER,
  UNDO,
  REDO,
  RESTART
}

enum TURN {
  X_TURN,
  O_TURN
}

enum GAME_STATE {
  NEW = 'New Game',
  STARTED = 'Game Started',
  X_WON = 'X Won',
  O_WON = 'O Won',
  DRAW = 'Draw'
}

interface Cell {
  row: number,
  col: number,
  value: CellValue
}

interface HVLine {
  start: number,
  direction: 'H' | 'V'
}

interface DiagLine {
  direction: 'D1' | 'D2';
}

interface GridState {
  cells: Cell[][],
  turn: TURN,
  gameState: GAME_STATE,
  undoStatesStack: GridState[],
  redoStatesStack: GridState[],
  winningLineDetails: HVLine | DiagLine | null
}

interface HistoryAction {
  type: ActionType.UNDO | ActionType.REDO | ActionType.RESTART;
}

interface PlaceAction {
  type: ActionType.PLACE_LETTER,
  cell: Cell
}

function reducer(state: GridState, action: HistoryAction | PlaceAction): GridState {
  // TODO: seems it will use a tonne of memory for undo/redo.
  switch (action.type) {
    case ActionType.PLACE_LETTER: { // TODO: simplify this function.
      if (state.gameState === GAME_STATE.DRAW ||
        state.gameState === GAME_STATE.X_WON ||
        state.gameState === GAME_STATE.O_WON) {

        return state;
      }

      // W/o the deep clone, the empty cell check below simply causes the state to never update.
      const newState = _.cloneDeep(state);
      const clickedCell = newState.cells
        .flat()
        .find(c => c.col === action.cell.col && c.row === action.cell.row);

      if (!clickedCell) {
        throw new Error('Invalid cell.');
      }

      if (clickedCell.value !== CellValue.EMPTY) {
        return newState;
      }

      newState.undoStatesStack.push({..._.cloneDeep(newState), redoStatesStack: []});

      if (newState.turn === TURN.X_TURN) {
        clickedCell.value = CellValue.X;
        newState.turn = TURN.O_TURN;
      } else {
        clickedCell.value = CellValue.O;
        newState.turn = TURN.X_TURN;
      }

      if (newState.gameState === GAME_STATE.NEW) {
        newState.gameState = GAME_STATE.STARTED;
      } else if (newState.gameState === GAME_STATE.STARTED) {
        const flattenedCells = newState.cells.flat();
        // Check vertical win
        const colCells = flattenedCells.filter(c => c.col === clickedCell.col);
        if (colCells.every(c => c.value === clickedCell.value)) {
          newState.gameState = clickedCell.value === CellValue.X ? GAME_STATE.X_WON : GAME_STATE.O_WON;
          newState.winningLineDetails = {
            start: colCells.sort((a, b) => a.col - b.col)[0].col, // any column will do.
            direction: 'V'
          };

          return {...newState, redoStatesStack: []};
        }

        // Check horizontal win
        const rowCells = flattenedCells.filter(c => c.row === clickedCell.row);
        if (rowCells.every(c => c.value === clickedCell.value)) {
          newState.gameState = clickedCell.value === CellValue.X ? GAME_STATE.X_WON : GAME_STATE.O_WON;
          newState.winningLineDetails = {
            start: rowCells.sort((a, b) => a.row - b.row)[0].row, // any row will do.
            direction: 'H'
          };

          return {...newState, redoStatesStack: []};
        }

        // Check diagonal 1 (top left to bottom right) win
        const diag1Cells = flattenedCells.filter(c => c.row === c.col);
        if (diag1Cells.every(c => c.value === clickedCell.value)) {
          newState.gameState = clickedCell.value === CellValue.X ? GAME_STATE.X_WON : GAME_STATE.O_WON;
          newState.winningLineDetails = {
            direction: 'D1'
          };

          return {...newState, redoStatesStack: []};
        }

        // Check diagonal 2 (top right to bottom left) win
        const diag2Cells = flattenedCells.filter(c =>
          (c.row === 0 && c.col === 2) ||
          (c.row === 1 && c.col === 1) ||
          (c.row === 2 && c.col === 0));
        if (diag2Cells.every(c => c.value === clickedCell.value)) {
          newState.gameState = clickedCell.value === CellValue.X ? GAME_STATE.X_WON : GAME_STATE.O_WON;
          newState.winningLineDetails = {
            direction: 'D2'
          };

          return {...newState, redoStatesStack: []};
        }

        // Check draw
        if (flattenedCells.filter(c => c.value === CellValue.EMPTY).length === 0) {
          newState.gameState = GAME_STATE.DRAW;

          return {...newState, redoStatesStack: []};
        }
      }

      return {...newState, redoStatesStack: []};
    }
    case ActionType.RESTART: {
      const turn = state.gameState === GAME_STATE.X_WON ? TURN.O_TURN : TURN.X_TURN;

      return createInitialState(turn);
    }
    case ActionType.UNDO: {
      const newState = _.cloneDeep(state);

      const prevState = newState.undoStatesStack.pop();
      if (!prevState) {
        return newState;
      }

      newState.redoStatesStack.push(newState);

      return {...prevState, redoStatesStack: newState.redoStatesStack};
    }
    case ActionType.REDO: {
      const newState = _.cloneDeep(state);

      const nextState = newState.redoStatesStack.pop();
      if (!nextState) {
        return newState;
      }

      newState.undoStatesStack.push(newState);

      return {...nextState, undoStatesStack: newState.undoStatesStack};
    }
    default: {
      throw new Error('Action not implemented.');
    }
  }
}

function createInitialState(turn: TURN): GridState {
  const GRID_SIZE = 3;
  const cells: Cell[][] = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    cells[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      cells[i].push({
        row: i,
        col: j,
        value: CellValue.EMPTY
      });
    }
  }

  return {
    cells,
    turn,
    gameState: GAME_STATE.NEW,
    undoStatesStack: [],
    redoStatesStack: [],
    winningLineDetails: null
  };
}

export default function TicTacToe() {
  // TODO:
  //  - Style the cells as previously, but dynamically (see commented out JSX below).
  //  - Try to simplify all the game states, turns etc.; see if they can be integrated and consolidated somehow.

  const [state, dispatch] =
    useReducer<(state: GridState, action: HistoryAction | PlaceAction) => GridState, TURN>
    (reducer, TURN.X_TURN, createInitialState);

  return (
    <>
      <h2>Tic Tac Toe – {state.gameState}</h2>
      <div className="controls">
        <button data-testid="tic-tac-toe-restart"
                disabled={state.gameState === GAME_STATE.NEW}
                onClick={() => dispatch({type: ActionType.RESTART})}>Restart
        </button>
        <button data-testid="tic-tac-toe-undo"
                disabled={state.undoStatesStack.length === 0}
                onClick={() => dispatch({type: ActionType.UNDO})}>Undo
        </button>
        <button data-testid="tic-tac-toe-redo"
                disabled={state.redoStatesStack.length === 0}
                onClick={() => dispatch({type: ActionType.REDO})}>Redo
        </button>
      </div>
      <div data-testid="tic-tac-toe-board"
           className="container position-relative">
        <div data-testid="tic-tac-toe-winning-line"
             className={classNames('winning-line position-absolute', {
               'active': [GAME_STATE.X_WON, GAME_STATE.O_WON].includes(state.gameState)
             })}
             style={{
               'top': state.winningLineDetails?.direction === 'H' ?
                 `${(state.winningLineDetails.start + 1) * 55 + state.winningLineDetails.start * 59}px` :
                 '169px',
               'left': state.winningLineDetails?.direction === 'V' ?
                 `${(state.winningLineDetails.start - 1) * 98 - (2 - state.winningLineDetails.start) * 16}px` :
                 state.winningLineDetails?.direction === 'H' ||
                 state.winningLineDetails?.direction === 'D2' ||
                 state.winningLineDetails?.direction === 'D1' ?
                   '-16px' :
                   '169px',
               'transform': state.winningLineDetails?.direction === 'V' ?
                 'rotate(90deg)' :
                 state.winningLineDetails?.direction === 'D1' ?
                   'rotate(45deg)' :
                   state.winningLineDetails?.direction === 'D2' ?
                     'rotate(-45deg)' :
                     'initial',
             }}/>
        {
          state.cells.flat().map((cell) => {
            return (
              <div data-testid={`tic-tac-toe-cell-${'' + cell.row + cell.col}`}
                   onClick={() => dispatch({type: ActionType.PLACE_LETTER, cell})}
                   key={'' + cell.row + cell.col}
                   className={classNames('cell', {
                     'active': cell.value === CellValue.EMPTY &&
                       [GAME_STATE.NEW, GAME_STATE.STARTED].includes(state.gameState)
                   })}>
                <XIcon testId={`tic-tac-toe-x-mark-${'' + cell.row + cell.col}`}
                       width={50} height={50} classes={classNames('display-none', {
                  'display-block': cell.value === CellValue.X ||
                    ([GAME_STATE.NEW, GAME_STATE.STARTED].includes(state.gameState) &&
                      state.turn === TURN.X_TURN && cell.value === CellValue.EMPTY),
                  'opacity-parent-hover-15': state.turn === TURN.X_TURN && cell.value === CellValue.EMPTY
                })}/>
                <OIcon testId={`tic-tac-toe-o-mark-${'' + cell.row + cell.col}`}
                       width={40} height={40} classes={classNames('display-none', {
                  'display-block': cell.value === CellValue.O ||
                    ([GAME_STATE.NEW, GAME_STATE.STARTED].includes(state.gameState) &&
                      state.turn === TURN.O_TURN && cell.value === CellValue.EMPTY),
                  'opacity-parent-hover-15': state.turn === TURN.O_TURN && cell.value === CellValue.EMPTY
                })}/>
              </div>
            );
          })
        }
        {/*<div className="cell"*/}
        {/*     style={{borderRight: '5px solid #121212', borderBottom: '5px solid #121212'}}>*/}
        {/*</div>*/}
        {/*<div className="cell"*/}
        {/*     style={{borderBottom: '5px solid #121212'}}>*/}
        {/*  <XIcon width={50} height={50} />*/}
        {/*</div>*/}
        {/*<div className="cell"*/}
        {/*     style={{borderBottom: '5px solid #121212', borderLeft: '5px solid #121212'}}>*/}
        {/*  <OIcon width={40} height={40} />*/}
        {/*</div>*/}
        {/*<div className="cell"*/}
        {/*     style={{borderRight: '5px solid #121212'}}></div>*/}
        {/*<div className="cell">*/}
        {/*  <OIcon width={40} height={40} />*/}
        {/*</div>*/}
        {/*<div className="cell"*/}
        {/*     style={{borderLeft: '5px solid #121212'}}></div>*/}
        {/*<div className="cell filled"*/}
        {/*     style={{borderTop: '5px solid #121212', borderRight: '5px solid #121212'}}>*/}
        {/*  <OIcon width={40} height={40} />*/}
        {/*</div>*/}
        {/*<div className="cell"*/}
        {/*     style={{borderTop: '5px solid #121212'}}></div>*/}
        {/*<div className="cell"*/}
        {/*     style={{borderTop: '5px solid #121212', borderLeft: '5px solid #121212'}}></div>*/}
      </div>
    </>
  );
}
