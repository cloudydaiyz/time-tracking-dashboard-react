type TimecardProps = {
  type: string;
  currentTime: string; // current time in hrs
  prevTime: string; // previous time in hrs
  isTyping: boolean;
};

export function Timecard({
  type,
  currentTime,
  prevTime,
  isTyping,
}: TimecardProps) {
  const typeLower = type.toLowerCase().replace(" ", "-");
  const imgsrc = `${import.meta.env.BASE_URL}icon-${typeLower}.svg`;
  return (
    <div className={`timecard ${typeLower}`}>
      <div className="timecard-filler">
        <div className="filler-space">
          <img src={imgsrc} alt={`${typeLower} icon`} />
        </div>
      </div>
      <div className="timecard-foreground">
        <div className="timecard-header">
          <h2>{type}</h2>
          <i className="fa-solid fa-ellipsis"></i>
        </div>
        <div className="time">
          <h1>
            {currentTime}
            <span className={isTyping ? "typing" : ""}>|</span>
          </h1>
          <p>
            {prevTime}
            <span className={isTyping ? "typing" : ""}>|</span>
          </p>
        </div>
      </div>
    </div>
  );
}
