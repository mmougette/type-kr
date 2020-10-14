import React, { useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import './App.css';
import cat from './keyboardCat.gif';
import hello from './hello.gif';
import keyboard from './keyboard.png'
import { generate } from './utils/words';
import useKeyPress from './hooks/useKeyPress';
import { currentTime } from './utils/time';

const initialWords = generate();
//const initialWords = "와 원 있 안녕하세요! 타이핑 연습하자! 빨리 치고 싶어요... 시작 오늘은 가게에 가서 사과를 샀다. 아가 일이 감사합니다 ㅁㄴㅇㄹ ㅁㄴㅇ ㅁㄴㅇㄹ ㅁㄴㅇㄹ ㅁㄴㅇ ㅁㄴㅇㄹ ㅁㄴㅇㄹ ㅁㄴㅇ ㄹㅁㄴㅇ ㅁㄴㅇㄹ ㅁㄴㅇ ㄹㅁㄴㅇㄹ ㅁㄴㅇ ㄹㅁㄴㅇㄹ "
console.log(initialWords);
let block = '';


function App() {
  const [leftPadding, setLeftPadding] = useState(
      new Array(20).fill(' ').join(''),
  );
  const [outgoingChars, setOutgoingChars] = useState('');
  const [currentChar, setCurrentChar] = useState(initialWords.charAt(0));
  const [incomingChars, setIncomingChars] = useState(initialWords.substr(1));
  // Used for WPM
  const [startTime, setStartTime] = useState();
  const [wordCount, setWordCount] = useState(0)
  const [wpm, setWpm] = useState(0)
  // Used for Accuracy
  const [accuracy, setAccuracy] = useState(0);
  const [typedChars, setTypedChars] = useState('');
  let numBackSp = 0;
  let numTyped = 0;

  let checker = '';

  useKeyPress(key => {
    numTyped++;

    if (!startTime) {
      setStartTime(currentTime());
    }

    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;
    if (key === "Backspace") {
      block = block.substr(0, block.length-1);
      numBackSp++;
    }
    else {
      key = romanToHangul(key);
      block += key;
    }
    console.log("Key: " + key);
    console.log("Block: " + block);
    checker = joinHangul(block);
    console.log("Checker: " + checker);

    if (checker === currentChar) {
      block = '';
      if (leftPadding.length > 0) {
        setLeftPadding(leftPadding.substring(1));
      }
      if (incomingChars.charAt(0) === ' ') {
        setWordCount(wordCount + 1);
        const durrationInMinutes = (currentTime() - startTime) / 60000.0;
        setWpm(((wordCount + 1) / durrationInMinutes).toFixed(2));
      }

      updatedOutgoingChars += currentChar;
      setOutgoingChars(updatedOutgoingChars);

      setCurrentChar(incomingChars.charAt(0));

      updatedIncomingChars = incomingChars.substring(1);
      /**
      if (updatedIncomingChars.split(' ').length < 10) {
        updatedIncomingChars += ' ' + generate();
      }
       **/
      setIncomingChars(updatedIncomingChars);

    }
    // Accuracy is bugged for korean typing
    const updatedTypedChars = typedChars + key;
    if (key.length === 1) {
      const updatedTypedChars = typedChars + key;
      setTypedChars(updatedTypedChars);
      //setAccuracy(((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(2,),);
      setAccuracy((100 - numBackSp), ); //((numTyped-numBackSp / numTyped).toFixed(2,));
    }

  });

  return (
      <Router>
        <Route path="/" exact render ={
          ()=> {
            return (
                <div className="App">
                  <header className="App-header">
                    <p>
                    Welcome to TypeKR! Let's practice typing in Korean!
                  </p>
                    <img className="gif-player" width="500" src={cat} alt="Keyboard Cat"/>
                    <p className="Character">
                      <img className="gif-player" src={hello} alt="Welcome Text"/>
                    </p>
                    <Link className="button" type="button" to="/play">Let's Begin! </Link>
                  </header>
                </div>
            )
          }
        }>
        </Route>
        <Route path="/play" exact render ={
          ()=> {
            return (
                <div className="App">
                  <header className="App-header">
                    <p>
                      You may now begin typing! 시작!
                    </p>
                    <img className="gif-player" src={keyboard} alt="Welcome Text"/>
                    <p className="Character">
                      <span className="Character-out">
                        {(leftPadding + outgoingChars).slice(-20)}
                      </span>
                      <span className="Character-current">{currentChar}</span>
                      <span>{incomingChars.substr(0, 20)}</span>
                    </p>
                    <h3>
                      : { block }
                    </h3>
                    <h3>
                      WPM: {wpm}
                    </h3>
                    <button className="button" onClick={() => window.location.reload(false)}>New Passage</button>
                  </header>
                </div>
            )
          }
        }>
        </Route>

      </Router>

  );
}

/**
 * Takes a string of Jamo and attempts to create a valid Hangul syllable block
 * @param s - String of characters
 * @returns {string|*} - Syllable block in Hangul (Korean written language)
 */
function joinHangul(s) {
  const initialIndex = 588;
  const medialIndex = 28;
  const initial = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const middle = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const final = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ',
    'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  if (s.length < 2) return s;

  if (s.length == 2) {
    let c1 = initial.indexOf(s.charAt(0));
    let c2 = middle.indexOf(s.charAt(1));
    let f = (c1 * 588) + (c2 * 28) + 44032;
    let hangul = String.fromCharCode(f);
    return hangul;
  }

  if (s.length == 3) {
    // Possibility 0: two consonants:
    if (initial.includes(s.charAt(1))) {
      let c1 = initial.indexOf(s.charAt(1)) + 1;
      let c2 = middle.indexOf(s.charAt(2));
      let f = (c1 * 588) + (c2 * 28) + 44032;
      let hangul = String.fromCharCode(f);
      return hangul;
    }
    // Possibility 1: two vowels ex: 외
    if (middle.includes(s.charAt(2))) {
      let c1 = initial.indexOf(s.charAt(0));
      let c2 = joinJamo(s.charAt(1), s.charAt(2));
      c2 = middle.indexOf(c2);
      let f = (c1 * 588) + (c2 * 28) + 44032;
      let hangul = String.fromCharCode(f);
      return hangul;
    }
    // Possibility 2: single batchim ex: 일
    if (initial.includes(s.charAt(0)) && middle.includes(s.charAt(1)) && final.includes(s.charAt(2))) {
      let c1 = initial.indexOf(s.charAt(0));
      let c2 = middle.indexOf(s.charAt(1));
      let c3 = final.indexOf(s.charAt(2));
      let f = (c1 * 588) + (c2 * 28) + c3 + 44032;
      let hangul = String.fromCharCode(f);
      return hangul;
    }
  }
  // Add Check for possible size 4: ex: 없 entered as ㅇ ㅓ ㅂ ㅅ
  if (s.length === 4) {
    // Possibility 0: single initial, single middle, double final ex: 없
    if (initial.includes(s.charAt(2)) && initial.includes(s.charAt(3))) {
      let c1 = initial.indexOf(s.charAt(0));
      let c2 = middle.indexOf(s.charAt(1));
      let c3 = joinHangul(s.charAt(2), s.charAt(3));
      c3 = final.indexOf(c3) + 1; // add one since final
      let f = (c1 * 588) + (c2 * 28) + c3 + 44032;
      let hangul = String.fromCharCode(f);
      return hangul;
    }
    // Possibility 1: single initial, double middle, single final: 원 ㅇ ㅜ ㅓ ㄴ
    if (middle.includes(s.charAt(1)) && middle.includes(s.charAt(2))) {
      let c1 = initial.indexOf(s.charAt(0));
      let c2 = joinJamo(s.charAt(1), s.charAt(2));
      c2 = middle.indexOf(c2);
      let c3 = final.indexOf(s.charAt(3));
      let f = (c1 * 588) + (c2 * 28) + c3 + 44032;
      let hangul = String.fromCharCode(f);
      return hangul;
    }
    // Possibility 2: double initial added manually: ㅃ typed as ㅂㅂ
    // come back to fix later, since this condition only occurs with improper typing technique
 }

  return s;
}

/**
 * Takes to Jamo Characters and checks if they can be combined into one Hangul char.
 * @param s1 - The first char to be merged
 * @param s2 - The second char to be merged
 * @returns {string|*|string} - Single Hangul block
 */
function joinJamo(s1, s2) {
  const initial = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const middle = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const final = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ',
    'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  const m1 = ['ㅘ', 'ㅙ', 'ㅚ'];
  const m1_1 = ['ㅏ', 'ㅐ', 'ㅣ'];
  const m2 = ['ㅝ', 'ㅞ', 'ㅟ'];
  const m2_1 = ['ㅓ', 'ㅔ', 'ㅣ'];

  const f1 = ['ㄳ', 'ㄵ'];
  const f1_1 = ['ㅅ', 'ㅈ'];
  const f2 = ['ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ'];
  const f2_1 = ['ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅌ', 'ㅍ', 'ㅎ'];

  // same double start or end
  if (s1 === s2) {
    let c1 = initial.indexOf(s1) + 1;
    return initial[c1];
  }
  // double middle: ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ;
  else if(middle.includes(s1)) {
    if (s1 === 'ㅗ') {
      let c1 = m1_1.indexOf(s2);
      return m1[c1];
    }
    if (s1 === 'ㅜ') {
      let c1 = m2_1.indexOf(s2);
      return m2[c1];
    }
    if (s1 === 'ㅡ' && s2 === 'ㅣ') {
      return 'ㅢ';
    }
  }
  // different double end: ㄳ, ㄵ, ㄶ, ㄺ, ㄻ, ㄼ, ㄽ, ㄾ, ㄿ, ㅀ, ㅄ
  else if(final.includes(s1)) {
      if (s1 === 'ㄴ') {
        let c1 = f1_1.indexOf(s2);
        return f1[c1];
      }
      if (s1 === 'ㄹ') {
        let c1 = f2_1.indexOf(s2);
        return f2[c1];
      }
      if (s1 === 'ㄱ' && s2 === 'ㅅ') {
        return 'ㄳ';
      }
      if (s1 === 'ㅂ' && s2 === 'ㅅ') {
        return 'ㅄ';
      }
  }
  // could not combine into single block
  return s1+s2;
}

/**
 * Takes roman(English) letters as input and maps the letter to the appropriate Korean Jamo(letter)
 * This eliminates the need to have korean set up on your keyboard.
 * @param keyStroke - Returns a single Jamo  (korean letter)
 */
function romanToHangul(keyStroke) {
  // Parallel arrays mapping english letter to korean letter
  const engl = [
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
      'z', 'x', 'c', 'v', 'b', 'n', 'm',
      'Q', 'W', 'E', 'R', 'T', 'O', 'P' // Caps for doubled letters
  ];
  const kr = [
      'ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ',
      'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ',
      'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ',
      'ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ', 'ㅒ', 'ㅖ' // Caps for doubled letters
  ];

  if (engl.includes(keyStroke)) {
    let x = engl.indexOf(keyStroke);
    return kr[x];
  }
  // Already korean input? Just return
  // Maybe add detection for other letters that happen to be capital.
  return keyStroke
}


export default App;
