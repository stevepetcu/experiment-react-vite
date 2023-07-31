import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import "./HighScores.css";
import classNames from "classnames";

interface HighScore {
  publicId: string;
  name: string;
  timeToComplete: number;
  createdAt: string;
  updatedAt: string;
}

function setRefetchIntervalForProgressBar(ms: number) {
  document.documentElement.style.setProperty(
    "--refetch-interval",
    `${ms / 1000}s`
  );
}

export default function HighScoresGetQuery() {
  const REFETCH_INTERVAL_MS = 5000;
  useEffect(() => {
    setRefetchIntervalForProgressBar(REFETCH_INTERVAL_MS);
  }, []);

  const dateOrder = useRef<"-" | "asc" | "desc">("-");

  const queryClient = useQueryClient();

  const orderHsOnClick = (hs: HighScore[]) => {
    switch (dateOrder.current) {
      case "-": {
        dateOrder.current = "asc";
        queryClient.setQueryData(
          ["highScores"],
          hs.toSorted((a, b) => {
            const aTimestamp = new Date(a.createdAt).getTime();
            const bTimestamp = new Date(b.createdAt).getTime();
            return aTimestamp - bTimestamp;
          })
        );
        break;
      }
      case "asc": {
        dateOrder.current = "desc";
        queryClient.setQueryData(["highScores"], hs.toReversed());
        break;
      }
      default: {
        // "desc", order by the score value
        dateOrder.current = "-";
        queryClient.setQueryData(
          ["highScores"],
          hs.toSorted((a, b) => {
            return a.timeToComplete - b.timeToComplete;
          })
        );
      }
    }
  };

  const orderHsOnRefetch = (hs: HighScore[]): HighScore[] => {
    switch (dateOrder.current) {
      case "asc": {
        hs.sort((a, b) => {
          const aTimestamp = new Date(a.createdAt).getTime();
          const bTimestamp = new Date(b.createdAt).getTime();
          return aTimestamp - bTimestamp;
        });
        break;
      }
      case "desc": {
        hs.sort((a, b) => {
          const aTimestamp = new Date(a.createdAt).getTime();
          const bTimestamp = new Date(b.createdAt).getTime();
          return bTimestamp - aTimestamp;
        });
        break;
      }
      default: {
        // "-", order by the score value
        hs.sort((a, b) => {
          return a.timeToComplete - b.timeToComplete;
        });
      }
    }

    return hs;
  };

  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["highScores"],
    queryFn: () =>
      axios
        .get(
          "https://experiment-pathfinder-edge-bff.vercel.app/api/highscores?limit=20&offset=15"
        )
        .then((res) => orderHsOnRefetch(res.data)),
    refetchInterval: REFETCH_INTERVAL_MS,
    refetchIntervalInBackground: 30000,
  });

  if (error) {
    return <div>You have failed to retrieve the High Scores!</div>;
  }

  return (
    <div>
      <h2 style={{ textWrap: "balance" }}>Pathfinder Game Live High Scores</h2>
      <div className="progress-bar-group">
        <div>
          <div
            className={classNames("progress-bar", {
              "progress-bar-full": !isFetching,
              "progress-bar-empty": isFetching,
            })}
          />
        </div>
        <div>
          <span
            className={classNames("loading", {
              "is-loading": !data && (error || isLoading),
              "is-fetching": !isLoading && isFetching,
              "is-done-loading": !isLoading && !isFetching,
            })}
          >
            •
          </span>
        </div>
      </div>
      {!isLoading && data && (
        <>
          <table style={{ textAlign: "left", borderSpacing: "10px 5px" }}>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>
                Date&emsp;
                <button onClick={() => orderHsOnClick(data)}>
                  {dateOrder.current}
                </button>
              </th>
            </tr>
            {data.map((hs: HighScore) => (
              <tr key={hs.publicId}>
                <td>{hs.name}</td>
                <td>{hs.timeToComplete}s</td>
                <td>{hs.createdAt}</td>
              </tr>
            ))}
          </table>
        </>
      )}
    </div>
  );
}
