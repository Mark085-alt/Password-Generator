const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const indicator = document.querySelector("[data-indicator]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const generateBtn = document.querySelector(".generateButton");
const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$&";

let password = "";
let passwordLength = 10;
let checkCount = 0;


handleSlider();

setIndicator("#ccc")

// set the length of slider
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength)*100/(max) + "% 100%")
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min
}

function generateRndNumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const rndNum = getRndInteger(0, symbols.length);
    return symbols.charAt(rndNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>8){
        setIndicator("#0f0");
    }

    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch{
        copyMsg.innerText = "failed";   
    }

    copyMsg.classList.add("active");

    setTimeout(() =>{
        copyMsg.classList.remove("active");
    }, 2500)
}


function handleCheckBoxChange(){
    checkCount =0;
    allCheckBoxes.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        } 
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}


allCheckBoxes.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange)
});


inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value){
        copyContent();
    }
})


//fisher yates method
function shufflePassword(array){
    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', () =>{
        if(checkCount < 0) return;

        if(passwordLength < checkCount){
            passwordLength = checkCount;
            handleSlider();
        }

        password = "";

        // if(uppercaseCheck.checked){
        //     password += generateUppercase();
        // }
        // if(lowercaseCheck.checked){
        //     password += generateLowercase();
        // }
        // if(numbersCheck.checked){
        //     password += generateRndNumber();
        // }
        // if(symbolsCheck.checked){
        //     password += generateSymbol();
        // }


        let funArr = [];

        if(uppercaseCheck.checked){
            funArr.push(generateUppercase);
        }
        if(lowercaseCheck.checked){
            funArr.push(generateLowercase);
        }
        if(symbolsCheck.checked){
            funArr.push(generateSymbol);
        }
        if(numbersCheck.checked){
            funArr.push(generateRndNumber);
        }

        for(let i=0;i<funArr.length;i++){
            password += funArr[i]();
        }

        for(let i=0;i<passwordLength-funArr.length;i++){
            let randIndex = getRndInteger(0 , funArr.length-1);
            password += funArr[randIndex]();
        }

       //shuffle
       // password = shufflePassword(Array.from(password));
       
       
       passwordDisplay.value = password;
       calcStrength();


    });