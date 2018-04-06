export function timefy(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds >= 10 ? remainingSeconds : `0${remainingSeconds}`}`;
}
