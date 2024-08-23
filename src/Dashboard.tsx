import { useEffect, useState } from "react";
import {
  delay,
  Filter,
  incrementText,
  TimeLabel,
  TimeTrackingData,
  toTimeLabel,
} from "./utils";
import { Timecard } from "./Timecard";

// Could probably update this using some enum logic
const filters: Filter[] = ["daily", "weekly", "monthly"];

export function Dashboard() {
  const [data, setData] = useState<TimeTrackingData[] | undefined>(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const [filterIndex, setFilterIndex] = useState(0);
  const [times, setTimes] = useState<TimeLabel[] | undefined>(undefined);
  const selectedFilter = filters[filterIndex];

  // Retrieve the JSON data on initial render
  useEffect(() => {
    fetch("/data.json")
      .then((d) => d.json())
      .then((j) => {
        const newData = j as TimeTrackingData[];
        setData(newData);

        const newTimes = newData.map<TimeLabel>((ttd) => {
          const currentTime = ttd.timeframes[selectedFilter].current;
          const prevTime = ttd.timeframes[selectedFilter].previous;

          return toTimeLabel(ttd.title, currentTime, prevTime);
        });
        setTimes(newTimes);
      });
  }, []);

  // Update the state of the times for each timeframe if the data is available
  if (isTyping && data) {
    let currentLabelChanges = 0;
    let prevLabelChanges = 0;

    const newTimes = times?.map<TimeLabel>((time, index) => {
      // Find what the new text should eventually become based on the selected filter
      const newTimeLabel = toTimeLabel(
        time.title,
        data[index].timeframes[selectedFilter].current,
        data[index].timeframes[selectedFilter].previous
      );

      let currentLabel = time.currentTimeLabel;
      let prevLabel = time.prevTimeLabel;

      // If what we intially have doesn't match what we should have, update it
      if (currentLabel != newTimeLabel.currentTimeLabel) {
        // Obtain the next iteration of our text based on the current text and the new text
        currentLabel = incrementText(
          time.currentTimeLabel,
          newTimeLabel.currentTimeLabel
        );

        // Indicate that the change was made
        currentLabelChanges++;
      }

      // Same logic as above ^
      if (prevLabel != newTimeLabel.prevTimeLabel) {
        prevLabel = incrementText(
          time.prevTimeLabel,
          newTimeLabel.prevTimeLabel
        );
        prevLabelChanges++;
      }

      return {
        title: time.title,
        currentTimeLabel: currentLabel,
        prevTimeLabel: prevLabel,
      };
    });

    if (currentLabelChanges || prevLabelChanges) {
      delay(100).then(() => setTimes(newTimes));
    } else {
      delay(1000).then(() => setIsTyping(false));
    }
  }

  function switchFilter(index: number) {
    if (!isTyping && index != filterIndex) {
      setFilterIndex(index);
      setIsTyping(true);
    }
  }

  let cards: JSX.Element[] = [];
  if (data) {
    cards =
      times?.map((time) => (
        <Timecard
          key={time.title}
          type={time.title}
          currentTime={time.currentTimeLabel}
          prevTime={time.prevTimeLabel}
          isTyping={isTyping}
        />
      )) || [];
  }

  const buttons = filters.map((filter, index) => {
    return (
      <button
        key={filter}
        className={`${
          filterIndex == index ? "selected" : "unselected"
        } ${filter}`}
        onClick={() => switchFilter(index)}
      >
        {filter.charAt(0).toUpperCase() + filter.slice(1)}
      </button>
    );
  });

  return (
    <div className="dashboard">
      <div className="profile">
        <div className="person-info">
          <img src="/image-jeremy.png" alt="Jeremy Robson picture" />
          <div className="info-for">
            <h2>Report for</h2>
            <h1>Jeremy Robson</h1>
          </div>
        </div>
        <div className="frequency">{buttons}</div>
      </div>
      {cards}
    </div>
  );
}
