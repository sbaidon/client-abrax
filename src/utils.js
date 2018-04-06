export function timefy(seconds) {
  return `${Math.floor(seconds / 60)}:${seconds % 60 >= 10 ? seconds % 60 : `0${seconds % 60}`}`;
}
