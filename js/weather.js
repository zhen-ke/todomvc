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
let todayWeatheruvIndex = todayWeather.querySelector('.uvIndex')
let weatherError = document.querySelector('.error')

// 天气错误代码
let errorMap = {
  "1": "位置服务被拒绝",
  "2": "暂时获取不到位置信息",
  "3": "获取信息超时",
  "4": "未知错误"
}

// 通过 JSONP 请求数据
function jsonp(url) {
  // debugger
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

// 处理 JSONP 请求数据的回调
function callback(data) {
  refreshWeather(data)
  moreDays(data)
}

// 刷新天气
function refreshWeather(data) {
  weatherUpdateTime.innerHTML = getTime(data.currently.time).replace(/[^0-9]*/, "") + " Update"
  weathertopIcon.src = todayWeatherIcon.src = iconMap[(data.currently.icon).split('-').join("")]
  weathertopTemperature.innerHTML = todayWeatherCurrently.innerHTML = Math.ceil(data.currently.temperature) + "˚"
  todayWeatherSummary.innerHTML = data.currently.summary
  todayWeatherdewPoint.innerHTML = parseInt(data.currently.dewPoint) + "%"
  todayWeatherPrecipProbability.innerHTML = parseInt(data.currently.precipProbability * 100) + "%"
  todayWeatheruvIndex.innerHTML = data.currently.uvIndex
}

// 使用 IP 请求用户地理位置
// 如果失败则通过 navigator.geolocation 获取用户地理位置
jsonp("https://freegeoip.net/json/?callback=loc").catch(function() {
  getLocation()
})


// 如果获取到 IP ，则开始生成天气
function loc(str) {
  getWeather(str)
}

// 如果获取到经纬度，则开始生成天气
function onSuccess(position) {
  getWeather(position.coords)
}

// 通过 navigator.geolocation 获取用户地理位置
function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError); // 地理位置服务可用
  } else {
    console.log('您的浏览器不支持地理位置定位'); // 地理位置服务不可用
  }
}

// 处理用户地理位置错误时状态
function onError(error) {
  switch (error.code) {
    case 1:
      weatherError.innerHTML = errorMap[error.code]
      werror()
      break;
    case 2:
      weatherError.innerHTML = errorMap[error.code]
      werror()
      break;
    case 3:
      weatherError.innerHTML = errorMap[error.code]
      werror()
      break;
    case 4:
      weatherError.innerHTML = errorMap[error.code]
      werror()
      break;
  }
}

// 天气错误提示
function werror() {
  weatherError.classList.add('erroroff')
  setTimeout(function() {
    weatherError.classList.remove('erroroff')
  }, 2000)
}

// 请求用户天气数据
function getWeather(str) {
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

// 刷新未来天气
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
    let weatherPrecipProbability = weatherWbodyDl[key].querySelector('.summary')
    weatherPrecipProbability.innerHTML = parseInt(str.daily.data[key].precipProbability * 100) + "%"
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