// Select DOM elements
const inputSlider = document.querySelector("[data-lengthSlider");
const lengthDisplay = document.querySelector("[data-lengthNumber");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

// Symbols set for password generation
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// Initialize password and password length variables
let password = "";
let passwordLength = 10; // Default password length
let checkCount = 0; // Number of checkboxes checked

// Function to handle slider input and update password length display
function handleSlider() {
  inputSlider.value = passwordLength; // Set slider value
  lengthDisplay.innerText = passwordLength; // Update length display
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";
}
handleSlider(); // Initial call to handleSlider

// Function to generate a random integer within a specified range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Functions to generate random characters for each category
function generateRandomNumber() {
  return getRandomInt(0, 9); // Generate a random number between 0 and 9
}

function generateLowwercase() {
  return String.fromCharCode(getRandomInt(97, 122)); // Generate a random lowercase letter
}

function generateUppercase() {
  return String.fromCharCode(getRandomInt(65, 90)); // Generate a random uppercase letter
}

function generateSymbols() {
  const random = getRandomInt(0, symbols.length); // Generate a random index for symbols
  return symbols.charAt(random); // Return a random symbol from the symbols string
}

// Function to set the color indicator based on password strength
function setIndicator(color) {
  indicator.style.backgroundColor = color; // Set background color
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`; // Set box shadow
}

setIndicator("#ccc"); // Default indicator color

// Function to calculate password strength and update indicator
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  // Check which checkboxes are checked
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymbol = true;

  // Set strength indicator color based on conditions
  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0"); // Green for strong password
  } else if (
    (hasUpper || hasLower) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0"); // Yellow for medium password
  } else {
    setIndicator("#f00"); // Red for weak password
  }
}

// Function to copy password content to clipboard
async function copyContent() {
  try {
    // Check if password is empty
    if (password === "") {
      alert("First Generate Password to copy");
      throw "Failed";
    }

    // Copy password to clipboard
    await navigator.clipboard.writeText(password);
    copyMsg.innerText = "copied"; // Set copied message
  } catch (e) {
    copyMsg.innerText = "failed"; // If error occurs, show failed message
  }
  copyMsg.classList.add("active"); // Show the message

  // Hide the copy message after 2 seconds
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

// Function to shuffle the password characters to make it more random
function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Get a random index
    const j = Math.floor(Math.random() * (i + 1));
    // Swap two elements in the array
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  // Join array into a string and return it
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

// Function to handle changes in the checkboxes
function handleCheckBoxChange() {
  checkCount = 0; // Reset checkbox count
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++; // Count the number of checked checkboxes
  });

  // Ensure password length is at least equal to the number of checked checkboxes
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider(); // Update the slider
  }
}

// Add event listener to each checkbox to call handleCheckBoxChange when a checkbox is checked or unchecked
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

// Add event listener to slider to update password length and display when the slider is moved
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// Add event listener to the copy button to trigger the copyContent function when clicked
copyBtn.addEventListener("click", () => {
  copyContent();
});

// Add event listener to the generate button to trigger password generation
generateBtn.addEventListener("click", generatePassword);

// Function to generate a random password based on selected options
function generatePassword() {
  // Ensure at least one checkbox is checked
  if (checkCount <= 0) {
    alert("Atleast check one checkbox");
    return;
  }

  // Ensure password length is at least the number of checked checkboxes
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password = ""; // Reset password

  // Create an array to store the functions to generate different types of characters
  let funArr = [];

  // Add functions to the array based on the checked checkboxes
  if (uppercaseCheck.checked) {
    funArr.push(generateUppercase);
  }

  if (lowercaseCheck.checked) {
    funArr.push(generateLowwercase);
  }

  if (numbersCheck.checked) {
    funArr.push(generateRandomNumber);
  }

  if (symbolsCheck.checked) {
    funArr.push(generateSymbols);
  }

  // Generate at least one character of each selected type
  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }

  // Generate random characters to fill up the rest of the password length
  for (let i = 0; i < passwordLength - funArr.length; i++) {
    let randInd = getRandomInt(0, funArr.length); // Get a random index from the functions array
    password += funArr[randInd](); // Add the generated character to the password
  }

  // Shuffle the password to increase randomness
  password = shufflePassword(Array.from(password));

  // Display the generated password
  passwordDisplay.value = password;

  // Calculate and update password strength indicator
  calcStrength();
}
