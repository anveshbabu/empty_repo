import moment from "moment";
export var apiProgressBar = ''
const { COURSE_LIST } = require('./constants')
export const setapiProgressBar = per => {
  apiProgressBar = per
  console.log(apiProgressBar)
};



export const alphabeticallyGrouping = (data = [], key) => {
  let result = data.reduce((r, e) => {

    // get first letter of name of current element
    let alphabet = e[key][0];

    // if there is no property in accumulator with this letter create it
    if (!r[alphabet]) r[alphabet] = { alphabet, record: [e] }

    // if there is push current element to children array for that letter
    else r[alphabet].record.push(e);

    // return accumulator
    return r;
  }, {});

  return Object.values(result);
}


export const removeDuplicateArray = (data, key) => {
  return [...new Map(data?.map(item => [item[key], item])).values()]
}

export const objectToQueryString = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return `?${queryString}`
}


/*
     * LetterAvatar
     * 
     * Artur Heinze
     * Create Letter avatar based on Initials
     * based on https://gist.github.com/leecrossley/6027780
     */


export const letterAvatar = (name, size, colour) => {

  name = name || '';
  size = size || 60;
  colour = colour || true;

  var colours = [
    "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
    "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"
  ],

    nameSplit = String(name).toUpperCase().split(' '),
    initials, charIndex, colourIndex, canvas, context, dataURI;


  if (nameSplit.length == 1) {
    initials = nameSplit[0] ? nameSplit[0].charAt(0) : '?';
  } else {
    initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
  }

  if (window.devicePixelRatio) {
    size = (size * window.devicePixelRatio);
  }

  charIndex = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64;
  colourIndex = charIndex % 20;
  canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  context = canvas.getContext("2d");

  context.fillStyle = colour ? colours[colourIndex - 1] : "transparent";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = Math.round(canvas.width / 2.2) + "px Arial";
  context.textAlign = "center";
  context.fillStyle = colour ? "#FFF" : "#454545";
  context.fillText(initials, size / 2, size / 1.5);

  dataURI = canvas.toDataURL();
  canvas = null;

  return dataURI;
}



export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}

export const getBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    }
  });
}


export const setStorage = (name, data) => {

  localStorage.setItem(name, data);
}

export const getStorage = (name) => {
  return localStorage.getItem(name);
}

export const removeStorage = (name) => {
  if (!!name) {
    localStorage.removeItem(name);
  } else {
    localStorage.clear();
  }
}


const timelineLabels = (desiredStartTime, interval, period) => {
  const periodsInADay = moment.duration(1, 'day').as(period);

  const timeLabels = [];
  const startTimeMoment = moment(desiredStartTime, 'hh:mm');
  for (let i = 0; i <= periodsInADay; i += interval) {
    startTimeMoment.add(i === 0 ? 0 : interval, period);
    let obj = {
      deActiveCount: 0,
      activeCount: 0,
      batchTiming: startTimeMoment.format('hh:mm A'),
      batchDetails: [
        {
          trainerName: "",
          trainerId: '',
          presentCount: 0,
          absentCount: 0,
          todayLeave: false,
        }
      ]
    }
    // createBatch(obj)
    timeLabels.push(obj);
  }

  return timeLabels;
};

export const formatter = Intl.NumberFormat('en-IN');


export const currencyFormat = (number, symbol = '₹') => {
  return `${symbol} ${formatter?.format(number)}`
}

export const userGetByRole = (userList, role) => {

  return userList.map((data) => {
  
    if (role.includes(data?.user_type)) {
      return data;
    }
  }).filter(Boolean)
}

export const candidateComplitPer = (courseStartDate, course) => {
  var date = moment(courseStartDate, "YYYY-MM-DD");
  var current = moment();
  var diff = current.diff(date, 'days');
  let courseDuration = COURSE_LIST.find(({ value }) => value === course)?.courseDuration;
  return  Math.round( ((diff * 100) / courseDuration));
}