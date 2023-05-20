const getRandomNum = (maxValue) => Math.floor(Math.random() * maxValue);

const showTimeInMinutes = (secCount) => (secCount < 0 ? '--:--' : `${Math.floor(secCount / 60)} : ${(secCount % 60).toString().padStart(2, '0')}`);

const preventDefault = (event) => event.preventDefault();

const createElement = (tag, classes, innerText = '') => {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  if (innerText) element.innerText = innerText;
  return element;
};

export { getRandomNum, showTimeInMinutes, preventDefault, createElement };
