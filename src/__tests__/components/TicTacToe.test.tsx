import '@testing-library/jest-dom'; // TODO: put in a testSetup file.
import userEvent from '@testing-library/user-event';
import {render, screen} from '@testing-library/react';
import TicTacToe from '../../components/TicTacToe';

describe('Tic Tac Toe', () => {
  test('renders a new game of tic tac toe', () => {
    // Given
    render(<TicTacToe/>);

    // Then
    expect.hasAssertions();

    const board = screen.getByTestId('tic-tac-toe-board');
    expect(board).toBeInTheDocument();
    expect(board.childElementCount).toBe(10); // 9 cells + the "winning line"

    expect(screen.getByText(/Tic Tac Toe – New Game/)).toBeInTheDocument();

    const restartButton = screen.getByTestId('tic-tac-toe-restart');
    expect(restartButton).toBeInTheDocument();
    expect(restartButton).toBeDisabled();

    const undoButton = screen.getByTestId('tic-tac-toe-undo');
    expect(undoButton).toBeInTheDocument();
    expect(undoButton).toBeDisabled();

    const redoButton = screen.getByTestId('tic-tac-toe-redo');
    expect(redoButton).toBeInTheDocument();
    expect(redoButton).toBeDisabled();
  });

  test('adds Xs and Os given a user clicks 2 cells in succession', async () => {
    // Given
    render(<TicTacToe/>);
    const user = userEvent.setup();

    const cell1 = screen.getByTestId('tic-tac-toe-cell-00');
    const cell2 = screen.getByTestId('tic-tac-toe-cell-01');

    // When
    await user.click(cell1);
    await user.click(cell2);

    // Then
    expect.hasAssertions();

    expect(screen.getByText(/Tic Tac Toe – Game Started/)).toBeInTheDocument();

    const xMark = screen.getByTestId('tic-tac-toe-x-mark-00');
    const oMark = screen.getByTestId('tic-tac-toe-o-mark-01');

    expect(xMark).toBeInTheDocument();
    expect(oMark).toBeInTheDocument();

    expect(cell1).toContainElement(xMark);
    expect(cell2).toContainElement(oMark);
  });

  // TODO: how can we test all the winning and draw combinations? Property-based testing?

  test('X wins game given they add 3 Xs in a line', async () => {
    // Given
    render(<TicTacToe/>);
    const user = userEvent.setup();

    // When
    await user.click(screen.getByTestId('tic-tac-toe-cell-00'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-10'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-01'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-11'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-02'));

    // Then
    expect.hasAssertions();

    expect(screen.getByText(/Tic Tac Toe – X Won/)).toBeInTheDocument();

    // TODO: test winning line position
  });

  test('O wins game given they add 3 Os in a line', async () => {
    // Given
    render(<TicTacToe/>);
    const user = userEvent.setup();

    // When
    await user.click(screen.getByTestId('tic-tac-toe-cell-00'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-10'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-01'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-11'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-21'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-12'));

    // Then
    expect.hasAssertions();

    expect(screen.getByText(/Tic Tac Toe – O Won/)).toBeInTheDocument();
  });

  test('game is a draw given all cells are filled and no consecutive 3 same chars occur', async () => {
    // Given
    render(<TicTacToe/>);
    const user = userEvent.setup();

    // When
    await user.click(screen.getByTestId('tic-tac-toe-cell-00'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-22'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-20'));

    await user.click(screen.getByTestId('tic-tac-toe-cell-02'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-01'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-21'));

    await user.click(screen.getByTestId('tic-tac-toe-cell-12'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-10'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-11'));

    // Then
    expect.hasAssertions();

    expect(screen.getByText(/Tic Tac Toe – Draw/)).toBeInTheDocument();
  });

  test('clicking restart resets the game state given the game already started', () => {
    // TODO
  });

  test('redo button is disabled given there are no moves to redo', () => {
    // TODO
  });

  test('undo button is disabled given there are no moves to undo', () => {
    // TODO
  });

  test('clicking undo and redo moves game state back and forward', () => {
    // TODO
  });

  test('clicking a cell does nothing given the cell is not empty', () => {
    // TODO
  });
});
