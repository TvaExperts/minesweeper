const getRandomNum = (maxValue) => Math.floor(Math.random() * maxValue);

const showTimeInMinutes = (secCount) => `${Math.floor(secCount / 60)} : ${(secCount % 60).toString().padStart(2, '0')}`;

const preventDefault = (event) => event.preventDefault();

const createElement = (tag, classes) => {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  return element;
};

export { getRandomNum, showTimeInMinutes, preventDefault, createElement };
