import {render, screen} from '@testing-library/react';
import CounterButton from '../../../components/reusable/CounterButton';
import getTestStore from '../../../__test-utils__/redux/store';
import {Provider} from 'react-redux';
import React from 'react';
import {describe, expect, test} from '@jest/globals';
import userEvent from '@testing-library/user-event';

describe('Counter Button', () => {
  test('renders and displays the redux store value given initial store value', () => {
    expect.assertions(1);

    const {store} = getTestStore(5);

    render(
      <Provider store={store}>
        <CounterButton onClick={() => {
          return;
        }}/>
      </Provider>
    );

    expect(screen.getByText(/you clicked me 5 times/)).toBeInTheDocument();
  });

  test('executes callback given is pressed', async () => {
    const {store} = getTestStore(0);
    const fakeCallback = jest.fn();
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <CounterButton onClick={fakeCallback}/>
      </Provider>
    );

    const button = screen.getByTestId('counter-button');

    expect(button).toBeInTheDocument();

    await user.click(screen.getByTestId('counter-button'));
    expect(fakeCallback).toHaveBeenCalledTimes(1);
  });
});
