let htmlSunRise, htmlSunSet, htmlLocation, htmlSun, htmlMinutesLeft;

const convertTime = function (time) {
  let date = new Date(time * 1000);
  let hours = "0" + date.getHours();
  let minutes = "0" + date.getMinutes();
  return hours.substr(-2) + ":" + minutes.substr(-2);
};

const updateSun = function (sun, left, bottom, today) {
  sun.style.left = `${left}%`;
  sun.style.bottom = `${bottom}%`;
  sun.setAttribute(
    "data-time",
    ("0" + today.getHours()).slice(-2) +
      ":" +
      ("0" + today.getMinutes()).slice(-2)
  );
};

const nightMode = function () {
  document.querySelector("html").classList.add("is-night");
};

const dayMode = function () {
  document.querySelector("html").classList.add("is-day");
};

const placeSunAndStartMoving = function (totalMinutes, sunrise, sunset) {
  let today = new Date();
  const sunriseDate = new Date(sunrise * 1000);
  let minutesSunUp =
    today.getHours() * 60 +
    today.getMinutes() -
    (sunriseDate.getHours() * 60 + sunriseDate.getMinutes());

  let now = new Date().toLocaleTimeString("nl-BE", {
    hour: "numeric",
    minute: "numeric",
  });
  if (now > sunset || now < convertTime(sunrise)) {
    nightMode();
  } else {
    dayMode();
  }

  let percentage = (100 / totalMinutes) * minutesSunUp;
  let sunLeft = percentage;
  let sunBottom = percentage < 50 ? percentage * 2 : (100 - percentage) * 2;
  updateSun(htmlSun, sunLeft, sunBottom, today);

  htmlMinutesLeft.innerHTML = `${totalMinutes - minutesSunUp} minutes`;
};

const showResult = function (obj) {
  htmlSunRise.innerHTML = convertTime(obj.city.sunrise);
  htmlSunSet.innerHTML = convertTime(obj.city.sunset);
  htmlLocation.innerHTML = `${obj.city.name}, ${obj.city.country}`;

  let difference = new Date(obj.city.sunset * 1000 - obj.city.sunrise * 1000);

  placeSunAndStartMoving(
    difference.getHours() * 60 + difference.getMinutes(),
    obj.city.sunrise,
    convertTime(obj.city.sunset)
  );
};

const getAPI = async function (position) {
  try {
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=0fa8e2223e2ea01ded3a600df8ce08d1`;
    const request = await fetch(`${url}`);
    const data = await request.json();
    showResult(data);
  } catch (error) {
    console.log(error);
  }
};

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getAPI);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  htmlSunRise = document.querySelector(".js-sunrise");
  htmlSunSet = document.querySelector(".js-sunset");
  htmlLocation = document.querySelector(".js-location");
  htmlSun = document.querySelector(".js-sun");
  htmlMinutesLeft = document.querySelector(".js-time-left");
  getLocation();
});
