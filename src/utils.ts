// Removes/adds one character to the element's inner text to get closer to the
// desired text. Returns true if the element's current text matches the desired
// text, false otherwise
export function incrementText(textNode: string, desiredText: string): string {
  const length = textNode.length;
  const desiredLength = desiredText.length;

  if (desiredLength < length) {
    // remove one character from the inner text
    textNode = textNode.substring(0, length - 1);
    return textNode;
  }

  if (desiredLength >= length && desiredLength > 0) {
    // Remove one character from the inner text if any character before the
    // length of the current string is different
    for (let i = 0; i < length; i++) {
      if (desiredText[i] != textNode[i]) {
        textNode = textNode.substring(0, length - 1);
        return textNode;
      }
    }
  }

  if (desiredLength > length) {
    const nextChar = desiredText[length];
    textNode += nextChar;
  }

  return textNode;
}

// Delay utility function that can be awaited for
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type TimeframeData = {
  current: number;
  previous: number;
};

export type TimeTrackingData = {
  title: string;
  timeframes: {
    daily: TimeframeData;
    weekly: TimeframeData;
    monthly: TimeframeData;
  };
};

export type Filter = keyof TimeTrackingData["timeframes"];

export type TimeLabel = {
  title: string;
  currentTimeLabel: string;
  prevTimeLabel: string;
};

export function toTimeLabel(
  title: string,
  currentTime: number,
  previousTime: number
): TimeLabel {
  return {
    title: title,
    currentTimeLabel: currentTime + "hr" + (currentTime == 1 ? "" : "s"),
    prevTimeLabel:
      "Previous - " + previousTime + "hr" + (previousTime == 1 ? "" : "s"),
  };
}
