const body = document.querySelector('body');
const warpperElem = document.querySelector('.wrapper');
const appNameElem = document.querySelector('.app-name');

const nameFormElem = document.querySelector('.name-form');
const nameInputElem = document.querySelector('.name-form input');
const displayName = document.querySelector('.user-name');
const moodWrapperElem = document.querySelector('.mood-wrapper');
const monthElem = document.querySelector('.month');

const btnMood = document.querySelector('.btn-mood');
const moodSlcWrapperElem = document.querySelector('.mood-slc-wrapper');
const btnMoodSlcElems = document.querySelectorAll('.btn-mood-slc');

const btnShareElem = document.querySelector('.share');
const shareResultElem = document.querySelector('.share-result');

const savedUsername = localStorage.getItem('username');


const scoreEmoji = ['⚫️', '🔴', '🟠', '🟡', '🔵', '🟢'];

let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1;  // 월
let date = today.getDate();  // 날짜
let padMonth = String(month).padStart(2, '0');
let padDate = String(date).padStart(2, '0');
let lastdate = new Date(year, month, 0).getDate();
let monthNameShort = today.toLocaleString('en-US', { month: 'short' });

let moods = [];


monthElem.textContent = `${year}${padMonth}${padDate}`;

function saveData() {
  localStorage.setItem('moods', JSON.stringify(moods));
}

function setDateDay1() {
  moods = [];
  setData();
  saveData();
}


function setData() {
  let dateNum = 1;
  for (let i = 0; i < lastdate; i++) {
    if (dateNum < date) {
      const setMoods =  {
        month: month,
        date: dateNum,
        score: 0, //검정동그라미
      };
      moods.push(setMoods);
    } else {
      const setMoods =  {
        month: month,
        date: dateNum,
        score: 6, //빈동그라미
      };
      moods.push(setMoods);
    }
    dateNum++;
  }
  saveData();
}


function onSubmit(e) {
  e.preventDefault() // 이벤트 실행 시 브라우저의 기본 행동을 막는다
  const username = nameInputElem.value;
  nameFormElem.classList.add('hidden');
  localStorage.setItem('username', username);
  renderUsername(username);
  btnMood.classList.remove('hidden');
}

function focusOut() {
  const username = nameInputElem.value;
  nameFormElem.classList.add('hidden');
  localStorage.setItem('username', username);
  renderUsername(username);
  btnMood.classList.remove('hidden');
}


function renderUsername(username) {
  displayName.textContent = `${username}`
  displayName.classList.remove('hidden')
}


function modUsername() {
  displayName.classList.add('hidden');
  nameFormElem.classList.remove('hidden');
  nameFormElem.addEventListener('submit', onSubmit);
  nameFormElem.addEventListener('focusout', () => {
    const username = nameInputElem.value;
    console.log(username)
    if (username !== '' & username !== ' ') {
      focusOut();
    }
  });
}

displayName.addEventListener('touchend', modUsername);
displayName.addEventListener('click', modUsername);



function renderCircle(mood, i) {
  const moodCircleDiv = document.createElement('div');
  const circleDateSpan = document.createElement('span');
  circleDateSpan.classList.add('circle-date');
  circleDateSpan.classList.add('opa-0');
  moodCircleDiv.classList.add('mood-circle');
  moodCircleDiv.dataset.date = i + 1;
  moodCircleDiv.dataset.score = mood.score;
  circleDateSpan.innerText = i + 1;
  moodWrapperElem.appendChild(moodCircleDiv);
  moodCircleDiv.appendChild(circleDateSpan);
}



// 날짜 토글
window.addEventListener('DOMContentLoaded', () => {
  const moodCircleElems = document.querySelectorAll('.mood-circle');
  const circleDateSpanElems = document.querySelectorAll('.circle-date');
  moodCircleElems.forEach((item, i) => {
    let toggle = true;
    item.addEventListener('click', () => {
      if (toggle) {
        circleDateSpanElems.forEach((item) => {
          item.classList.remove('opa-0');
          item.classList.add('opa-100');
        });
        toggle = !toggle;
      } else {
        circleDateSpanElems.forEach((item) => {
          item.classList.remove('opa-100');
          item.classList.add('opa-0');
        });
        toggle = !toggle;
      }
    });
  });
});



if (savedUsername === null) {
  nameFormElem.classList.remove('hidden');
  nameFormElem.addEventListener('submit', onSubmit); //submit : 엔터를 누르거나 버튼을 클릭할 때 발생
  nameFormElem.addEventListener('focusout', () => {
    const username = nameInputElem.value;
    console.log(username)
    if (username !== '') {
      focusOut();
    }
  });
} else {
  renderUsername(savedUsername);
  btnMood.classList.remove('hidden');
}



const savedMoods = localStorage.getItem('moods');

if (savedMoods === null) {
  setData();
  moods.forEach(renderCircle);
} else {
    let parseMoods = JSON.parse(savedMoods);
    moods = parseMoods;
  if (moods[0].month != month) {
    setDateDay1();
    moods.forEach(renderCircle);
  } else {
    moods.forEach((item) => {
      if (item.score == 6 && item.date < date) {
        item.score = 0;
      }
    });
    moods.forEach(renderCircle);
  }
}


if (moods[date - 1].score != 0 && moods[date - 1].score != 6) {
  btnShareElem.classList.remove('hidden');
} else {
  btnShareElem.classList.add('hidden');
}


function submitMood() {
  btnMoodSlcElems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const todayScore = e.currentTarget.dataset.score;
      const todayCircle = document.querySelector(`.mood-circle:nth-child(${date})`);
      todayCircle.dataset.score = todayScore;
      moods[date - 1].score = todayScore;
      saveData()
      moodSlcWrapperElem.classList.remove('open');
      moodSlcWrapperElem.classList.add('close');
      btnShareElem.classList.remove('hidden');
    });
  });
}

submitMood();



let result = [];
let resultText = '';
function share() {
  result = [];
  const moodCircleElems = document.querySelectorAll('.mood-circle');
  let shareResult = '';
  resultText = '';
  moodCircleElems.forEach((item) => {
    item.dataset.score == 6 ? false : shareResult += scoreEmoji[item.dataset.score];
  });
  const resultLine = Math.ceil((shareResult.length / 2) / 7);
  for (let i = 0; i < resultLine; i++) {
    result.push(shareResult.substr(i * 14, 14));
    resultText += `${result[i]}%0a`;
  }
  console.log(resultText);
}

btnShareElem.addEventListener('click', () => {
  share();
  shareTwitter();
});


// URL Encoding
// %0a : 줄바꿈
// %2f : 슬래시
function shareTwitter() {
  const shareUrl = "https://mood-trckr.netlify.app"; // 전달할 URL
  window.open(`https://twitter.com/intent/tweet?text=Mood rating for today: ${moods[date - 1].score}%2f5 ${scoreEmoji[moods[date - 1].score]}%0a%0a${monthNameShort} Mood:%0a${resultText}%0a%23MoodTracker %23Mood`);
}


// 모달창 열기/닫기
btnMood.addEventListener('click', () => {
  moodSlcWrapperElem.classList.remove('close');
  moodSlcWrapperElem.classList.add('open');
});



// 모달창 외부 영역 클릭 시 숨기기
window.addEventListener('click', (e) => {
  if (e.target !== moodSlcWrapperElem && e.target !== btnMood) {
    moodSlcWrapperElem.classList.add('close');
    moodSlcWrapperElem.classList.remove('open');
  } else {
    return;
  }
});

window.addEventListener('touchend', (e) => {
  if (e.target !== moodSlcWrapperElem && e.target !== btnMood) {
    moodSlcWrapperElem.classList.add('close');
    moodSlcWrapperElem.classList.remove('open');
  } else {
    return;
  }
});



let darkToggle = false;

function drakModeToggle() {
  if (darkToggle === true) {
    darkToggle = !darkToggle;
    localStorage.setItem('darkmode', darkToggle);
  } else {
    darkToggle = !darkToggle;
    localStorage.setItem('darkmode', darkToggle);
  }
}

function darkMode() {
  if (darkToggle == true) { //다크모드 활성화
    body.classList.remove('white-bg');
    body.classList.add('dark-bg');
    warpperElem.classList.add('dark');
    nameFormElem.classList.add('dark');
    moodSlcWrapperElem.classList.add('dark');
    btnMood.classList.add('white');
    document.querySelectorAll('.circle-date').forEach((item) => {
      item.classList.add('dark');
    });
  } else { //다크모드 비활성화
    body.classList.remove('dark-bg');
    body.classList.add('white-bg');
    warpperElem.classList.remove('dark');
    nameFormElem.classList.remove('dark');
    moodSlcWrapperElem.classList.remove('dark');
    btnMood.classList.remove('white');
    document.querySelectorAll('.circle-date').forEach((item) => {
      item.classList.remove('dark');
    });
  }
}

const savedDarkMode = localStorage.getItem('darkmode');

if (savedDarkMode === null) {
  darkToggle = false;
} else {
  darkToggle = JSON.parse(savedDarkMode);
  darkMode();
}

appNameElem.addEventListener('click', () => {
  drakModeToggle();
  darkMode();
});


// appNameElem.addEventListener('touchend', () => {
//   drakModeToggle();
//   darkMode();
// });
