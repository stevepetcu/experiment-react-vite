import {render, screen, waitFor} from '@testing-library/react';
import SearchForm from '../../components/SearchForm';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // TODO: put in a testSetup file.

describe('Search Form', () => {
  test('updates the "live update" field synchronously given user types stuff', async () => {
    // Given
    const user = userEvent.setup();
    render(<SearchForm debounceTimeMs={200} throttleTimeMs={50}/>);

    // When
    const input: HTMLInputElement = screen.getByLabelText(/Search input field/);
    const text: HTMLSpanElement = screen.getByTestId('live-update-text');
    await user.type(input, 'Hello, World!');

    // Then
    expect.hasAssertions();
    expect(input.value).toBe('Hello, World!');
    expect(text).toHaveTextContent('Hello, World!');
  });

  test('updates the "debounced update" field after the debounce time given user types stuff', async () => {
    // Given
    const user = userEvent.setup();
    render(<SearchForm debounceTimeMs={200} throttleTimeMs={50}/>);

    // When
    const input: HTMLInputElement = screen.getByLabelText(/Search input field/);
    const text: HTMLSpanElement = screen.getByTestId('debounced-update-text');
    await user.type(input, 'Hello, World!');

    // Then
    expect.hasAssertions();
    expect(input.value).toBe('Hello, World!');
    expect(text).toHaveTextContent('');
    // TODO: look into Jest fake timers https://jestjs.io/docs/timer-mocks to more accurately test this.
    await waitFor(() => expect(text).toHaveTextContent('Hello, World!'));

    await user.type(input, '!!');
    expect(text).toHaveTextContent('Hello, World!');
    await waitFor(() => expect(text).toHaveTextContent('Hello, World!!!'));
  });

  test('updates the "throttled update" field after the throttle time given user types stuff', async () => {
    // Given
    const user = userEvent.setup();
    render(<SearchForm debounceTimeMs={200} throttleTimeMs={50}/>);

    // When
    const input: HTMLInputElement = screen.getByLabelText(/Search input field/);
    const text: HTMLSpanElement = screen.getByTestId('throttled-update-text');
    await user.type(input, 'Hello, World!');

    // Then
    expect.hasAssertions();
    expect(input.value).toBe('Hello, World!');
    expect(text).toHaveTextContent('');
    // TODO: look into Jest fake timers https://jestjs.io/docs/timer-mocks to more accurately test this.
    await waitFor(() => expect(text).toHaveTextContent('Hello, World!'));

    await user.type(input, '!!');
    expect(text).toHaveTextContent('Hello, World!');
    await waitFor(() => expect(text).toHaveTextContent('Hello, World!!!'));
  });
});
