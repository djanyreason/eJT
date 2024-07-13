export const formatTime = (ms) => {
  return (
    Math.floor(ms / 60000)
      .toString()
      .padStart(2, '0') +
    ':' +
    Math.floor((ms % 60000) / 1000)
      .toString()
      .padStart(2, '0') +
    '.' +
    Math.floor((ms % 1000) / 10)
      .toString()
      .padStart(2, '0')
  );
};

export const msTime = ([minutes, seconds]) => 1000 * (minutes * 60 + seconds);

export const arrayTime = (ms) => [
  Math.floor(ms / 60000),
  Math.round((ms % 60000) / 1000),
];
