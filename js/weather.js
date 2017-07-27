let weathertop = document.querySelector('.weathertop')
let weathertopCity = weathertop.querySelector('.city')
let weathertopIcon = weathertop.querySelector('.icon').querySelector('img')
let weathertopTemperature = weathertop.querySelector('.temperature')
let weatherapp = document.querySelector('.weatherapp')
let userLocation = weatherapp.querySelector('.city')
let weatherUpdateTime = weatherapp.querySelector('time')
let todayWeather = weatherapp.querySelector('.todayweather')
let todayWeatherIcon = todayWeather.querySelector('.icon').querySelector('img')
let todayWeatherCurrently = todayWeather.querySelector('.temperature')
let todayWeatherSummary = todayWeather.querySelector('.summary')
let todayWeatherdewPoint = todayWeather.querySelector('.dewPoint')
let todayWeatherPrecipProbability = todayWeather.querySelector('.precipProbability')
let todayWeatherWindSpeed = todayWeather.querySelector('.windSpeed')

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
  weatherUpdateTime.innerHTML = getTime(data.currently.time).replace(/[^0-9]*/, "") + "发布"
  weathertopIcon.src = todayWeatherIcon.src = iconMap[(data.currently.icon).split('-').join("")]
  weathertopTemperature.innerHTML = todayWeatherCurrently.innerHTML = Math.ceil(data.currently.temperature) + "˚"
  todayWeatherSummary.innerHTML = data.currently.summary

  todayWeatherdewPoint.innerHTML = parseInt(data.currently.dewPoint) + "%"
  todayWeatherPrecipProbability.innerHTML = parseInt(data.currently.precipProbability) + "%"
  todayWeatherWindSpeed.innerHTML = data.currently.windSpeed
  moreDays(data)
}

// 异步获取用户ip，如果获取失败使用 html5 的方式获取
// setTimeout(function() {
//   jsonp("https://freegeoip.net/json/?callback=loc").catch(function() { getLocation() })
// }, 0)

jsonp("https://freegeoip.net/json/?callback=loc").catch(function() {
  getLocation()
})

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
        weathertop.style.display = 'block'
      })
      userLocation.innerHTML = weathertopCity.innerHTML = key
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
        weathertop.style.display = 'block'
      })
      userLocation.innerHTML = weathertopCity.innerHTML = key
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
  let weatherWbody = weatherapp.querySelector('.wbody')
  let weatherWbodyDl = weatherapp.querySelectorAll('dl')
  for (let key in weatherWbodyDl) {
    if (key === 'length') break
    let weatherWbodyWeek = weatherWbodyDl[key].querySelector('dt')
    let weatherWbodyIcon = weatherWbodyDl[key].querySelector('.icon').querySelector('img')
    let weatherWbodySummary = weatherWbodyDl[key].querySelector('.summary')
    let weatherWbodyTemperatureMin = weatherWbodyDl[key].querySelector('.temperaturemin')
    let weatherWbodyTemperatureMax = weatherWbodyDl[key].querySelector('.temperaturemax')

    weatherWbodyIcon.src = iconMap[(str.daily.data[key].icon).split('-').join('')]
    weatherWbodyTemperatureMin.innerHTML = Math.ceil(str.daily.data[key].temperatureMin) + "˚"
    weatherWbodyTemperatureMax.innerHTML = Math.ceil(str.daily.data[key].temperatureMax) + "˚"
    // weatherWbodySummary.innerHTML = str.daily.data[key].summary
    if (+key === 0) {
      continue
    } else {
      weatherWbodyWeek.innerHTML = getDay(str.daily.data[key].time)
    }
  }
}

// 秒转星期
function getDay(time) {
  let arr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return arr[new Date(new Date(parseInt(time) * 1000).toLocaleString().split(" ")[0]).getDay()]
}

// 秒转时间
function getTime(time) {
  return new Date(parseInt(time) * 1000).toLocaleString().split(" ")[1]
}

// let search = document.querySelector('input')
// search.addEventListener('input', debounce(function() {
//   if (search.value.trim()) {
//     jsonp('https://api.darksky.net/forecast/b534fc093637c2e5fccdbe93f777fcda/' + data[search.value] + '?units=si&lang=zh' + '&callback=callback')
//   }
//   userLocation = search.value
// }, 500))

// function debounce(fn, duration) {
//   var timerId
//   return function(...args) {
//     clearTimeout(timerId)
//     timerId = setTimeout(function() {
//       fn(...args)
//     }, duration)
//   }
// }