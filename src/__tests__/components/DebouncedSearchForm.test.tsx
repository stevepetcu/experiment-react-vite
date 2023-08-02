import {render, screen, waitFor} from '@testing-library/react';
import DebouncedSearchForm from '../../components/DebouncedSearchForm';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // TODO: put in a testSetup file.

describe('Debounce Search Form', () => {
  test('updates the "live update" field synchronously given user types stuff', async () => {
    // Given
    const user = userEvent.setup();
    render(<DebouncedSearchForm debounceTimeMs={100}/>);

    // When
    const input: HTMLInputElement = screen.getByLabelText(/Search input field/);
    const text: HTMLSpanElement = screen.getByTestId('live-update-text');
    await user.type(input, 'Hello, World!');

    // Then
    expect.hasAssertions();
    expect(input.value).toBe('Hello, World!');
    expect(text).toHaveTextContent('Hello, World!');
  });

  test('updates the "debounced update" field synchronously given user types stuff', async () => {
    // Given
    const user = userEvent.setup();
    render(<DebouncedSearchForm debounceTimeMs={200}/>);

    // When
    const input: HTMLInputElement = screen.getByLabelText(/Search input field/);
    const text: HTMLSpanElement = screen.getByTestId('debounced-update-text');
    await user.type(input, 'Hello, World!');

    // Then
    expect.hasAssertions();
    expect(input.value).toBe('Hello, World!');
    expect(text).toHaveTextContent('');
    // TODO: might be able to use advance timers option of userEvent.setup() instead of this Promise:
    await waitFor(() => expect(text).toHaveTextContent('Hello, World!'));
  });
});
