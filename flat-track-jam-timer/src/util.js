export const formatDigits = (num) => {
  return num.toString().padStart(2, '0');
};

export const formatTime = (ms) => {
  return (
    formatDigits(Math.floor(ms / 60000)) +
    ':' +
    formatDigits(Math.floor((ms % 60000) / 1000)) +
    '.' +
    formatDigits(Math.floor((ms % 1000) / 10))
  );
};

export const msTime = ([minutes, seconds]) => 1000 * (minutes * 60 + seconds);

export const arrayTime = (ms) => [
  Math.floor(ms / 60000),
  Math.round((ms % 60000) / 1000),
];
