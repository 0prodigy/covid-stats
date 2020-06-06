window.addEventListener("load", function () {
  let totalConfirm = [2, 56, 6, 234, 53, 234, 34, 46, 364];
  let totalRecover = [3, 345, 3, 3, 6, 2, 64, 3, 4623, 4];
  let totalDeath = [436, 23, 6, 345, 2345, 643, 234];
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
    type: "line",
    data: {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Confirmed",
          data: [5294041, 4333463, 5399508, 6358757, 4420028, 3660341, 3340989],
          backgroundColor: ["transparent"],
          borderColor: [
            "rgba(23,210,38,1)",
            "rgba(0,255,29,0.6502976190476191)",
          ],
          borderWidth: 2,
        },
        {
          label: "Recoverd",
          data: [12, 19, 23, 75, 82, 23],
          backgroundColor: ["transparent"],
          borderColor: [
            " rgba(208,165,32,1)",
            "rgba(255,179,0,0.7035189075630253)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 2,
        },
        {
          label: "Deaths",
          data: [12, 19, 23, 75, 82, 23],
          backgroundColor: ["transparent"],
          borderColor: [
            "rgba(208,52,32,1)",
            "rgba(255,0,0,0.7819502801120448)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
            },
          },
        ],
      },
    },
  });

  // console.log(chart.data.datasets[0].data.push(5555));
  console.log(chart.data);
  //calling api to create chart

  // console.log(totalRecover, totalDeath, totalConfirm);
  function getDataByMonth() {
    var req = new XMLHttpRequest();
    var url =
      "https://api.covid19api.com/world?from=2020-01-04T00:00:00Z&to=2020-06-04T00:00:00Z";
    req.open("GET", url);
    req.send();
    req.onload = function () {
      var res = JSON.parse(this.response);
      chart.data.datasets[0].data = [];
      chart.data.datasets[1].data = [];
      chart.data.datasets[2].data = [];
      for (var i = 0; i < res.length; i += 8) {
        chart.data.datasets[0].data.push(res[i].TotalConfirmed);
        chart.data.datasets[1].data.push(res[i].TotalRecovered);
        chart.data.datasets[2].data.push(res[i].TotalDeaths);
      }
    };
  }
  getDataByMonth();
  // console.log(totalRecover, totalDeath, totalConfirm);

  //calling function on load to display data
  // getSummary();

  //getting search value and calling data after 2s
  var timer;
  var searchBtn = document.getElementById("searchByCountry");
  searchBtn.addEventListener("input", function () {
    clearTimeout(timer);
    if (searchBtn.value) {
      timer = setTimeout(function () {
        filterCountry(searchBtn.value);
      }, 2000);
    }
  });
});

// storing data of all countires to perform search opration without calling api again
var countries = [];

// filltering data and call function for serach result
function filterCountry(q) {
  q = q.toLowerCase();
  let result = countries.filter(function (country) {
    if (country.Country.toLowerCase().indexOf(q) != -1) {
      return country;
    }
  });
  displayCountryStats(result);
}

// getting and sotring data for display stats
function getSummary() {
  var req = new XMLHttpRequest();
  var url = "https://api.covid19api.com/summary";
  req.open("GET", url);
  req.send();
  req.onload = function () {
    let res = JSON.parse(this.response);
    countries = res.Countries;
    // console.log(countries);
    // res = res.Global;
    displaySummary(res.Global);
    displayCountryStats(res.Countries);
  };
}

//display data on html page
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

// display data country wise
function displayCountryStats(res) {
  var countrylist = document.querySelector(".country-list ul");
  countrylist.textContent = "";
  if (res.length == 0) {
    countrylist.innerHTML = "<li><h2>No data of this country</h2></li>";
  } else {
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
}
