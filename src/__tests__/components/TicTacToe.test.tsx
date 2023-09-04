import '@testing-library/jest-dom'; // TODO: put in a testSetup file.
import userEvent from '@testing-library/user-event';
import {render, screen} from '@testing-library/react';
import TicTacToe from '../../components/TicTacToe';

describe('Tic Tac Toe', () => {
  test('renders a new game of tic tac toe and X goes first', async () => {
    // Given
    render(<TicTacToe/>);

    // Then
    expect.hasAssertions();

    const board = screen.getByTestId('tic-tac-toe-board');
    expect(board).toBeInTheDocument();
    expect(board.getElementsByClassName('cell empty')).toHaveLength(9);
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

    const winningLine = screen.getByTestId('tic-tac-toe-winning-line');
    expect(winningLine).toBeInTheDocument();
    expect(winningLine).not.toHaveClass('active');

    const firstXMark = screen.getByTestId('tic-tac-toe-x-mark-00');
    const firstOMark = screen.getByTestId('tic-tac-toe-o-mark-00');

    expect(firstXMark).toBeInTheDocument();
    expect(firstOMark).toBeInTheDocument();

    expect(firstXMark).toHaveClass('icon', 'display-none', 'display-block', 'opacity-parent-hover-15');
    expect(firstOMark).toHaveClass('icon', 'display-none');
    expect(firstOMark).not.toHaveClass('display-block', 'opacity-parent-hover-15');
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

    expect(xMark).toHaveClass('icon display-none display-block');
    expect(xMark).not.toHaveClass('opacity-parent-hover-15');
    expect(oMark).toHaveClass('icon display-none display-block');
    expect(oMark).not.toHaveClass('opacity-parent-hover-15');

    expect(cell1).toContainElement(xMark);
    expect(cell2).toContainElement(oMark);
  });

  test('hovering on empty cells displays an O symbol given it is O turn', async () => {
    // Given
    render(<TicTacToe/>);
    const user = userEvent.setup();

    const cell = screen.getByTestId('tic-tac-toe-cell-00');

    // When
    await user.click(cell);

    // Then
    expect.hasAssertions();

    expect(screen.getByText(/Tic Tac Toe – Game Started/)).toBeInTheDocument();

    const xMark = screen.getByTestId('tic-tac-toe-x-mark-00');
    const oMark = screen.getByTestId('tic-tac-toe-o-mark-01');

    expect(xMark).toBeInTheDocument();
    expect(oMark).toBeInTheDocument();

    expect(oMark).toHaveClass('icon', 'display-none', 'display-block', 'opacity-parent-hover-15');
  })

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
    expect(screen.getByTestId('tic-tac-toe-winning-line')).toHaveClass('active');
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

  test('clicking restart resets the game state given the game already started', async () => {
    // Given
    render(<TicTacToe/>);
    const board = screen.getByTestId('tic-tac-toe-board');
    const user = userEvent.setup();

    // When
    await user.click(screen.getByTestId('tic-tac-toe-cell-00'));
    await user.click(screen.getByTestId('tic-tac-toe-cell-01'));

    // Then
    expect.hasAssertions();

    expect(screen.queryByText(/Tic Tac Toe – New Game/)).not.toBeInTheDocument();
    expect(board.getElementsByClassName('cell empty')).toHaveLength(7);

    // When
    await user.click(screen.getByTestId('tic-tac-toe-restart'));

    // Then
    expect(screen.getByText(/Tic Tac Toe – New Game/)).toBeInTheDocument();
    expect(board.getElementsByClassName('cell empty')).toHaveLength(9);
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
