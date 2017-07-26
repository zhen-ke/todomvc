let search = document.querySelector('input')
let weather = document.querySelector('.weather')
let userLocation
// 天气图标
let iconMap = {
  clearday: "☀️",
  clearnight: "🌔",
  fog: "🌫",
  partlycloudyday: "🌓",
  partlycloudynight: "🌓",
  rain: "🌧",
  sleet: "🌨",
  snow: "❄",
  wind: "🌪",
  cloudy: "☁️",
  partlycloudyday: "⛅",
}

search.addEventListener('input', debounce(function() {
  if (search.value.trim()) {
    jsonp('https://api.darksky.net/forecast/b534fc093637c2e5fccdbe93f777fcda/' + data[search.value] + '?units=si&lang=zh' + '&callback=callback')
  }
  userLocation = search.value
}, 500))

function jsonp(url) {
  console.log('jsonp')
  return new Promise(function(resolve, reject) {
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.body.appendChild(script);
    script.onload = function() {
      resolve()
    }
    script.onerror = function() {
      reject()
    }
  })
}

function callback(data) {
  let resultspan = document.querySelector('.result').querySelectorAll('span')
  resultspan[0].innerHTML = userLocation
  resultspan[1].innerHTML = iconMap[(data.currently.icon).split('-').join("")]
  resultspan[2].innerHTML = parseInt(data.currently.temperature) + "℃"
  moreDays(data)
  let headp = document.querySelector('.head').querySelectorAll('p')
  headp[0].innerHTML = userLocation + " " + parseInt(data.currently.temperature) + "℃"
  headp[1].innerHTML = data.hourly.summary
}

function debounce(fn, duration) {
  var timerId
  return function(...args) {
    clearTimeout(timerId)
    timerId = setTimeout(function() {
      fn(...args)
    }, duration)
  }
}

// 异步获取用户ip，如果获取失败使用 html5 的方式获取
// setTimeout(function() {
//jsonp("https://freegeoip.net/json/?callback=loc").catch(function() { getLocation() })
// }, 0)

jsonp("https://freegeoip.net/json/?callback=loc").catch(function() { getLocation() })

// 通过用户 IP 获取用户地理位置
function loc(str) {
  let latitude = parseInt(str.latitude)
  let longitude = parseInt(str.longitude)
  for (let key in data) {
    let temp = data[key].split(",")
    let latitudeTemp = parseInt(data[key].split(",")[0])
    let longitudeTemp = parseInt(data[key].split(",")[1])
    if (latitudeTemp === latitude && longitudeTemp === longitude) {
      jsonp('https://api.darksky.net/forecast/b534fc093637c2e5fccdbe93f777fcda/' + data[key] + '?units=si&lang=zh' + '&callback=callback').then(function() {
        weather.style.display = 'block'
      })
      userLocation = key
      break;
    }
  }
}

// 通过 HTML5 API 获取用户地理位置
function getLocation() {
  if ("geolocation" in navigator) {
    /* 地理位置服务可用 */
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    /* 地理位置服务不可用 */
    console.log('您的浏览器不支持地理位置定位');
  }
}

//处理用户地理位置
function onSuccess(position) {
  let latitude = parseInt(position.coords.latitude)
  let longitude = parseInt(position.coords.longitude)
  for (let key in data) {
    let temp = data[key].split(",")
    let latitudeTemp = parseInt(data[key].split(",")[0])
    let longitudeTemp = parseInt(data[key].split(",")[1])
    if (latitudeTemp === latitude && longitudeTemp === longitude) {
      jsonp('https://api.darksky.net/forecast/b534fc093637c2e5fccdbe93f777fcda/' + data[key] + '?units=si&lang=zh' + '&callback=callback').then(function() {
        weather.style.display = 'block'
      })
      userLocation = key
      break;
    }
  }
}

//处理用户地理位置错误时状态
function onError(error) {
  switch (error.code) {
    case 1:
      alert("位置服务被拒绝");
      break;
    case 2:
      alert("暂时获取不到位置信息");
      break;
    case 3:
      alert("获取信息超时");
      break;
    case 4:
      alert("未知错误");
      break;
  }
}
// 未来天气
function moreDays(str) {
  let moreDaysWeather = document.querySelector('.moreDaysWeather').querySelectorAll('li')
  for (let key in moreDaysWeather) {
    if (key === 'length') break
    let day = moreDaysWeather[key].querySelector('.days');
    let max = moreDaysWeather[key].querySelector('.max');
    let min = moreDaysWeather[key].querySelector('.min');
    let icon = moreDaysWeather[key].querySelector('.icon');
    max.innerHTML = parseInt(str.daily.data[key].temperatureMax) + "℃"
    min.innerHTML = parseInt(str.daily.data[key].temperatureMin) + "℃"
    icon.innerHTML = iconMap[(str.daily.data[key].icon).split('-').join('')]
    if (+key === 0) {
      continue
    } else {
      day.innerHTML = getDay(str.daily.data[key].time)
    }
  }
}

// 处理时间
function getDay(time) {
  let arr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return arr[new Date(new Date(parseInt(time) * 1000).toLocaleString().split(" ")[0]).getDay()]
}