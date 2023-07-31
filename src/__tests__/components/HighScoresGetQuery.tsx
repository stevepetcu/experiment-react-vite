import {render, screen, waitFor} from '@testing-library/react';
import HighScoresGetQuery from '../../components/HighScoresGetQuery';
import axios from 'axios';

jest.mock('axios');
describe('High Scores Get Query', () => {
  describe('given no errors', () => {
    test('renders title and progress bar', () => {
      expect.assertions(2);
      (axios.get as jest.Mock).mockReturnValue({
        data: []
      });

      render(<HighScoresGetQuery/>);

      expect(screen.getByText(/Pathfinder Game Live High Scores/)).toBeInTheDocument();
      expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    });

    test('renders and refreshes the high scores table', async () => {
      (axios.get as jest.Mock).mockReturnValueOnce({
        data: [
          {
            publicId: 'foo-1',
            name: 'Foo 1',
            timeToComplete: 30,
            createdAt: '2023-06-21T17:41:18.447Z',
            updatedAt: '2023-06-21T17:41:22.821Z'
          },
          {
            publicId: 'foo-2',
            name: 'Foo 2',
            timeToComplete: 30,
            createdAt: '2023-06-20T16:26:43.038Z',
            updatedAt: '2023-06-20T16:27:19.268Z'
          },
          {
            publicId: 'foo-3',
            name: 'Foo 3',
            timeToComplete: 30,
            createdAt: '2023-06-20T10:28:54.983Z',
            updatedAt: '2023-06-20T10:29:03.246Z'
          },
        ]
      }).mockReturnValueOnce({
        data: [
          {
            publicId: 'bar-1',
            name: 'Bar 1',
            timeToComplete: 25,
            createdAt: '2023-06-21T17:41:18.447Z',
            updatedAt: '2023-06-21T17:41:22.821Z'
          },
          {
            publicId: 'bar-2',
            name: 'Bar 2',
            timeToComplete: 25,
            createdAt: '2023-06-20T16:26:43.038Z',
            updatedAt: '2023-06-20T16:27:19.268Z'
          },
          {
            publicId: 'bar-3',
            name: 'Bar 3',
            timeToComplete: 25,
            createdAt: '2023-06-20T10:28:54.983Z',
            updatedAt: '2023-06-20T10:29:03.246Z'
          },
        ]
      });

      await waitFor(() => {
        expect(screen.getByText(/Foo 1/)).toBeInTheDocument();
        expect(screen.getByText(/Foo 2/)).toBeInTheDocument();
        expect(screen.getByText(/Foo 3/)).toBeInTheDocument();
      }, {
        interval: 500,
        timeout: 6000
      });

      await waitFor(() => {
        expect(screen.getByText(/Bar 1/)).toBeInTheDocument();
        expect(screen.getByText(/Bar 2/)).toBeInTheDocument();
        expect(screen.getByText(/Bar 3/)).toBeInTheDocument();
      }, {
        interval: 2000,
        timeout: 6000
      });
    });
  });

  describe('given errors', () => {
    test('renders failure message instead of the component', async () => {
      (axios.get as jest.Mock).mockReturnValue(new Error('Foo'));

      await waitFor(() =>
        expect(screen.getByText(/You have failed to retrieve the High Scores!/)).toBeInTheDocument(), {
        interval: 2000,
        timeout: 6000,
      });
    });
  });
});
