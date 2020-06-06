window.addEventListener("load", function () {
  // Map
  mapboxgl.accessToken =
    "pk.eyJ1IjoiMHByb2RpZ3kiLCJhIjoiY2tiMzUzbnh3MDE0MDJ4bnYweWhiMmt2byJ9.KSMdGJTta-W3tR5Gv0Lf9w";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/0prodigy/ckb3c98ei0fmn1ip9s1vl7t1i", // stylesheet location
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 0, // starting zoom
    layers: [
      {
        id: "water",
        source: "mapbox-streets",
        "source-layer": "water",
        type: "fill",
        paint: {
          "fill-color": "#00ffff",
        },
      },
    ],
  });

  //chart
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Aggr. Confirmed",
          backgroundColor: "transparent",
          data: [0, 13, 2, 2, 5, 30, 23],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          devicePixelRatio: "2",
          steppedLine: false,
        },
        {
          label: "Recover",
          backgroundColor: "transparent",
          data: [0, 3, 5, 2, 10, 30, 45],
          borderColor: ["rgba(75, 192, 192, 1)"],
          devicePixelRatio: "2",
          steppedLine: false,
        },
        {
          label: "death",
          backgroundColor: "transparent",
          data: [0, 10, 5, 2, 5, 30, 40],
          borderColor: ["rgba(235, 34, 132, 1)"],
          steppedLine: false,
        },
      ],
    },
    // Configuration options go here
    options: {
      "border-color": "green",
    },
  });

  getSummary();
});
let summary = [];
function getSummary() {
  var req = new XMLHttpRequest();
  var url = "https://api.covid19api.com/summary";
  req.open("GET", url);
  req.send();
  req.onload = function () {
    let summary = JSON.parse(this.response);
    console.log(res);
    // res = res.Global;
    displaySummary(res.Global);
    displayCountryStats(res.Countries);
  };
}

function displaySummary(res) {
  var total = document.querySelector(".total");
  var active = document.querySelector(".active");
  var recoverd = document.querySelector(".recoverd");
  var death = document.querySelector(".death");
  total.textContent = res.TotalConfirmed;
  active.textContent = res.NewConfirmed;
  recoverd.textContent = res.TotalRecovered;
  death.textContent = res.TotalDeaths;
}

function displayCountryStats(res) {
  var countrylist = document.querySelector(".country-list ul");
  countrylist.textContent = "";
  for (var i = 0; i < res.length; i++) {
    var li = document.createElement("li");
    li.setAttribute("class", "country-data");
    var span = document.createElement("span");
    let name = res[i].Country;
    span.textContent = res[i].TotalConfirmed;
    li.append(span, name);
    countrylist.append(li);
  }
}
