const letterBoxes: NodeListOf<HTMLElement> = document.querySelectorAll('.letter-div');
const endBoard = document.querySelector('section');
const endText = document.querySelector('section > p');
const button = document.querySelector('button');
const letterBoxesArray = Array.from(letterBoxes);
const dividedArrays: HTMLElement[][] = [];
let currentRowIndex = 0;
let currentRow = dividedArrays[currentRowIndex];
let pickedWord: string | undefined = "";
let wordsArr: string[] = [];
let letterArr: string[] = [];
let foundLetters: string[] = [];
let indexArr: number[] = [];
let arrIndex = 0;
let wordsChecked = 0;


for (let i = 0; i < letterBoxesArray.length; i += 5) {
  dividedArrays.push(letterBoxesArray.slice(i, i + 5));
}

switchRow(currentRowIndex);

loadFile()
  .then((words) => {
    wordsArr = words.split("\n");
    pickedWord = wordsArr[Math.floor(Math.random() * wordsArr.length)].trim();
  })
  .catch((err) => {
    console.error(err);
  });

async function loadFile() {
  const response = await fetch('/words.txt');
  const file = await response.text();
  return file;
}

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (arrIndex < 5 && /^[a-zA-Z]$/.test(event.key)) {
    AddLetter(event.key, arrIndex)
  }
  else if (event.key === "Backspace" && arrIndex > 0){
    DeleteLetter(arrIndex)
  }
  else if (event.key === "Enter" && arrIndex === 5){
    CheckWord();
  }
});

button?.addEventListener("click", () => {
  location.reload();
});

function switchRow(index: number) {
  if (index >= 0 && index < dividedArrays.length) {
    currentRowIndex = index;
    currentRow = dividedArrays[currentRowIndex];
  }
}

function AddLetter(letter: string, index: number): void {
  currentRow[index].textContent = letter.toLocaleUpperCase();
  letterArr[index] = letter;
  arrIndex++;
}

function DeleteLetter(index: number): void{
  currentRow[index - 1].textContent = " ";
  letterArr.pop();
  arrIndex--;
}

function CheckWord(): void{
  wordsArr = wordsArr.map(word => word.replace(/\r/g, ''));
  if (!pickedWord || !wordsArr.includes(letterArr.join('').trim())) return;

  const pickedWordArr = pickedWord.split('');
  const matchedIndexes = Array(pickedWordArr.length).fill(false);
  let allMatch = true;
  wordsChecked += 1;

  letterArr.forEach((letter, index) => {
    if (letter === pickedWordArr[index]) {
      currentRow[index].style.backgroundColor = "rgb(82, 142, 77)";
      matchedIndexes[index] = true;
      indexArr.push(index);
    } else {
      allMatch = false;
    }
  });

  letterArr.forEach((letter, index) => {
    if (currentRow[index].style.backgroundColor === "rgb(82, 142, 77)") return;

    const misplacedIndex = pickedWordArr.findIndex(
      (char, i) => char === letter && !matchedIndexes[i]
    );

    if (misplacedIndex !== -1) {
      currentRow[index].style.backgroundColor = "rgb(181, 160, 60)";
      matchedIndexes[misplacedIndex] = true;
    } else {
      currentRow[index].style.backgroundColor = "rgb(58, 58, 60)";
    }
  });

  if (allMatch && endBoard && endText) {
    endText.innerHTML = "YOU WIN!"
    endBoard.style.display = 'flex';
  } else if (wordsChecked === 5 && endBoard && endText) {
    endText.innerHTML = "YOU LOOSE!"
    endBoard.style.display = 'flex';
  } else {
    arrIndex = 0;
    currentRowIndex += 1;
    switchRow(currentRowIndex);
  }
}