import {render, screen} from '@testing-library/react';
import CounterButton from '../../../components/reusable/CounterButton';
import getTestStore from '../../../__test-stubs__/redux/store';
import {Provider} from 'react-redux';
import {describe, expect, test} from '@jest/globals';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {LoadLogContext} from '../../../App';

describe('Counter Button', () => {
  test('renders and displays the redux store value given initial store value', () => {
    // Given
    const {store} = getTestStore(5);

    // When
    render(<Provider store={store}>
        {/*@ts-ignore*/}
        <LoadLogContext.Provider value={{setLoadLog: jest.fn()}}>
          <CounterButton side="left"
                         onClick={() => {
                           return;
                         }}/>
        </LoadLogContext.Provider>
      </Provider>
    );

    // Then
    expect.assertions(1);
    expect(screen.getByText(/“a” team score: 5/)).toBeInTheDocument();
  });

  test('executes callback given is pressed', async () => {
    // Given
    const {store} = getTestStore(0);
    const fakeCallback = jest.fn();
    const user = userEvent.setup();

    // When
    // @ts-ignore
    render(
      <Provider store={store}>
        {/*@ts-ignore*/}
        <LoadLogContext.Provider value={{setLoadLog: jest.fn()}}>
          <CounterButton side="left"
                         onClick={fakeCallback}/>
        </LoadLogContext.Provider>
      </Provider>
    );


    // Then
    expect.assertions(2);

    const button = screen.getByTestId('counter-button');

    expect(button).toBeInTheDocument();

    await user.click(screen.getByTestId('counter-button'));
    expect(fakeCallback).toHaveBeenCalledTimes(1);
  });
});
