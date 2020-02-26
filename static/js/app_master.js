////////////////////////////////////////////////////////////////////////////////////////
///  The following code will populate the city dropdown based on the state chosen
///////////////////////////////////////////////////////////////////////////////////////


var city_url = "http://localhost:5000/api/v1.0/weather/census_city"

function popCityDrop(stateChosen) {
  d3.json(city_url).then(function(data) {
    var cityData = data;

    // Filter the list of cities based on the state chosen
    if (stateChosen === "Select") {
        filteredState = cityData
    }
    else {
      var filteredState = cityData.filter(cityData => cityData.data.state === stateChosen);
    }

    filteredState.sort(function(a, b){
      return a.city_state - b.city_state;
    });
    
    // Get the element id for the city dropdown
    var sel = document.getElementById('selCity');

    // clear out any data that was already there
    sel.innerHTML="";

    // sort the list of cities
  

    // iterate through the filtered list of cites and add the cities to the dropdown
    filteredState.forEach(function(item) {
      var cityList = item.city_state;

      // create new option element
      var opt = document.createElement('option');
      // create text node to add to option element (opt)
      opt.appendChild( document.createTextNode(item.city_state) );
      // set value property of opt
      opt.value = item.city_state; 
      // add opt to end of select box (sel)
      sel.appendChild(opt); 
    });
    
  });

}




//////////////////////////////////////////////////////////////
// State selection dropdown
/////////////////////////////////////////////////////////////


function setSelectStates(states) {
  var sel = document.getElementById('selState');

  states.forEach(state => {
    // create new option element
    var opt = document.createElement('option');
    // create text node to add to option element (opt)
    opt.appendChild( document.createTextNode(state.state) );
    // set value property of opt
    opt.value = state.state; 
    // add opt to end of select box (sel)
    sel.appendChild(opt); 
    
  });

}

var statelatLong;
d3.csv('static/data/state_lat_long.csv').then(function(data) {
  statelatLong = data;
  console.log(statelatLong);
})

function stateSelected(stateName) {
  url = "http://127.0.0.1:5000/api/v1.0/weather/state/" + stateName;
  //lets find the state abbr
  stateAbbr = '';

  statesList.forEach(function(state){
    if (state.state == stateName){
      stateAbbr = state.state_abbr;
    }
  });
  console.log('state abbr found', stateAbbr);
  
  
  // lets see if we have the state then we zoom to that and change the level
  statelatLong.forEach(function(data) {
      if (data.StateName === stateName) {
        myMap.flyTo([data.Latitude, data.Longitude], 6)
      }
    });

  



/////////////////////////////////////////////////////
// WEATHER 
//////////////////////////////////////////////////////

  d3.json(url).then(function(weatherData) {

   
    monthArray = [];
    minArray = [];
    maxArray = [];
    precArray = [];
    
    weatherData.forEach(function(data) {
    //   console.log("here is the data:", weatherData);
    monthArray.push(data.month);
    minArray.push(data.avg_low);
    maxArray.push(data.avg_high);
    precArray.push(data.avg_prec);
    });
    console.log("hello", weatherData);


        // Create our first trace
        var trace1 = {
          x: monthArray,
          y: maxArray,
          type: 'scatter',
          name: "Max Temp",
          marker: {
            color: 'rgb(255,0,0)'
          }
        };
    
        // Create our second trace 
        var trace2 = {
          x: monthArray,
          y: minArray,
          type: 'scatter',
          name: "Min Temp",
          marker: {
            color: 'rgb(0,0,255)'
          }
        };
    
        // Create our third trace 
        var trace3 = {
          x: monthArray,
          y: precArray,
          color: "red",
          yaxis: 'y2',
          // showInLegend: true,
          type: 'bar',
          name: "Precipitation",
          marker: {
            color: 'rgb(82,215,255)'
          }
      };
        // The data array consists of all 3 traces
        var data = [trace1, trace2, trace3];
    
    
        var layout = {
          title: "Climate Chart",
          xaxis: { title: "Month" },
          yaxis: { title: "Temperature (F)", range: [0, 110], autorange: false},
          yaxis2: {
            title: 'Precipitation in Inches',
            // titlefont: {color: '#ff7f0e'},
            // tickfont: {color: '#ff7f0e'},
            anchor: 'free',
            overlaying: 'y',
            side: 'right',
            position: 1, range: [0, 10], autorange: false
          }
        }; 
   
    Plotly.newPlot('lineChart', data, layout);
  });
  
  // Call the popCityDrop function that will populate the city dropdown list based on the 
  // state chosen in the state dropdow list
  popCityDrop(stateName);
}

var statesList;
d3.json("http://127.0.0.1:5000/api/v1.0/stateList").then(function(states) {
  statesList = states;
  setSelectStates(states);
});



// Creating map object
var myMap = L.map('map', {
  center: [38, -100],
  zoom: 4
});

// Adding tile layer
L.tileLayer(
  'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 19,
    id: 'mapbox.streets',
    accessToken: API_KEY_MAP
  }
).addTo(myMap);



var geoState = L.geoJson({features:[]}, {class: "path2"}, {onEachFeature:function popUp(f,l){
  var out = [];
  if (f.properties){
      for(var key in f.properties ){
        if (key === 'NAME') {
          out.push(f.properties[key]);
        }
  }
  l.bindPopup(out.join("<br />"));
}
}}).addTo(myMap);

var geo = L.geoJson({features:[]},{onEachFeature:function popUp(f,l){
  var out = [];
  if (f.properties){
      for(var key in f.properties ){
        if (key === 'NAME') {
          out.push(f.properties[key]);
        }
  }
  l.bindPopup(out.join("<br />"));
}
}}).addTo(myMap);





var cityData;
d3.json("http://127.0.0.1:5000/api/v1.0/weather/census_city").then(function(cities) {
  cityData = cities;
});

function loadCityData(state_abbr) {
  var base = 'static/data/cb_2018_us_cbsa_20m.zip';
  shp(base).then(function(data){
    console.log("data loop", data);
    d3.json("http://127.0.0.1:5000/api/v1.0/weather/census_city").then(function(cities) {
      allFeatures = data.features;
      sel_features = []
      cities.forEach(city => {
        allFeatures.forEach(feature =>{
            if (city.data.geo_id === feature.properties.AFFGEOID) {
              sel_features.push(feature);  
            }
        });
      });
      data.features = sel_features;
      geo.addData(data);
    });
  });
  
}
loadCityData();

function loadState() {
  var baseState = 'static/data/cb_2018_us_state_20m.zip';
  shp(baseState).then(function(data){
    console.log(" statedata loop", data);
      geoState.addData(data);
    });
}
loadState();





//////////////////////////////////////////////////////////////////////////////////////
/// Will need to include all of the city plot data in this function that is called
/// when the city drop-down is changed
//////////////////////////////////////////////////////////////////////////////////////

function citySelected(cityName) {
  console.log(cityName);


}




// ///////////////////////////////////////////////////////////////////////////////////////////////////////
// /// This section bring in the city level data and filters for the chosen city
// ///////////////////////////////////////////////////////////////////////////////////////////////////////

// var city_url = "http://localhost:5000/api/v1.0/weather/census_city"

// /// will replace this next line with reference to the city chosen from the webpage
// cityholder="Beaver Dam,WI"
// // cityholder="Carson City,NV"

// d3.json(city_url).then(function(data) {
//   var cityData = data;


//   // console.log(cityData);
//   // Filter the data to keep only records for the chosen city
//   var filteredData = cityData.filter(cityData => cityData.city_state === cityholder)[0];
  
//   var data=filteredData.data;

//   console.log(filteredData);




