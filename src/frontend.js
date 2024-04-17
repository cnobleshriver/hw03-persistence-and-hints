const changeText = () => {
  const para = document.querySelector(".description");
  para.textContent = "The text has been changed!";
};

const button = document.querySelector("#click-me");
button.addEventListener("click", changeText);
