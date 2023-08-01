import {render, screen, waitFor} from '@testing-library/react';
import HighScoresGetQuery from '../../components/HighScoresGetQuery';
import axios from 'axios';
import {describe, expect, test} from '@jest/globals';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import '@testing-library/jest-dom'; // TODO: put in a testSetup file.

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('High Scores Get Query', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        cacheTime: 0,
        staleTime: 0,
        retry: false, // Makes testing errors easier.
      },
    },
  });
  describe('given no errors', () => {
    test('renders title and progress bar', () => {
      // Given
      mockedAxios.get.mockResolvedValue({
        data: []
      });

      // When
      render(<QueryClientProvider client={queryClient}>
        <HighScoresGetQuery refetchIntervalMs={250}/>
      </QueryClientProvider>);

      // Then
      expect.hasAssertions();
      expect(screen.getByText(/Pathfinder Game Live High Scores/)).toBeInTheDocument();
      expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    });

    test('renders and refreshes the high scores table', async () => {
      // Given
      mockedAxios.get.mockResolvedValue({
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
      });

      // When
      render(<QueryClientProvider client={queryClient}>
        <HighScoresGetQuery refetchIntervalMs={500}/>
      </QueryClientProvider>);

      // Then
      expect.hasAssertions();

      await waitFor(() => {
        expect(screen.getByText(/Foo 1/)).toBeInTheDocument();
        expect(screen.getByText(/Foo 2/)).toBeInTheDocument();
        expect(screen.getByText(/Foo 3/)).toBeInTheDocument();
      });

      // Given (part 2) –– why can't I chain mockResolvedValueOnce above and have it behaved as expected? B/c… Jest?
      mockedAxios.get.mockResolvedValue({
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

      // Then (part 2)
      await waitFor(() => {
        expect(screen.getByText(/Bar 1/)).toBeInTheDocument();
        expect(screen.getByText(/Bar 2/)).toBeInTheDocument();
        expect(screen.getByText(/Bar 3/)).toBeInTheDocument();
      });
    });
  });

  describe('given errors', () => {
    test('renders failure message instead of the component', async () => {
      // Given
      mockedAxios.get.mockRejectedValue({data: new Error('Foo')});

      // When
      render(<QueryClientProvider client={queryClient}>
        <HighScoresGetQuery refetchIntervalMs={15000}/>
      </QueryClientProvider>);

      // Then
      expect.hasAssertions();
      await waitFor(() =>
        expect(screen.getByText(/You have failed to retrieve the High Scores!/)).toBeInTheDocument(), {
        interval: 100,
        timeout: 1500,
      });
    });
  });
});
