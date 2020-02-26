// @TODO: YOUR CODE HERE!
// var svgWidth = 960;
// var svgHeight = 500;

// var margin = {
//   top: 20,
//   right: 40,
//   bottom: 60,
//   left: 100
// };

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

  d3.json(url).then(function(weatherData) {

    // Parse Weather data
    // ==============================
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

// var geo = L.geoJson({features:[]}).addTo(myMap);

// var shpfile = new L.Shapefile("static/data/cb_2018_us_cbsa_20m.zip");
// shpfile.addTo(map);
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


///////////////////////////////////////////////////////////////////////////////////////////////////////
/// This section bring in the city level data and filters for the chosen city
///////////////////////////////////////////////////////////////////////////////////////////////////////

var city_url = "http://localhost:5000/api/v1.0/weather/census_city"

/// will replace this next line with reference to the city chosen from the webpage
cityholder="Beaver Dam,WI"
// cityholder="Carson City,NV"

d3.json(city_url).then(function(data) {
  var cityData = data;


  // console.log(cityData);
  // Filter the data to keep only records for the chosen city
  var filteredData = cityData.filter(cityData => cityData.city_state === cityholder)[0];
  
  var data=filteredData.data;

  console.log(filteredData);

///////////////////////////////////////////////////////////////////////////////////////////////
/// This section outputs the key statistics for the city
//////////////////////////////////////////////////////////////////////////////////////////////


  // Prepare values to be inclued in key information section of page
  var city = filteredData.city_state.split(",")[0]
  var cityToPrint = city.concat(", ", data.state);
  // numberal libary used to format values for printing
  var populationFormat = numeral(data.population).format('0,0');
  var populationToPrint =`Population: ${populationFormat}`;
  var unemploymentFormat = numeral(data.unemployment_rate/100).format('0.0%');
  var unemployToPrint = `Unemployment Rate: ${unemploymentFormat}`;
  var incomeFormat = numeral(data.median_income).format('$0,0');
  var incomeToPrint = `Median Income: ${incomeFormat}`;
  var homeFormat = numeral(data.median_value).format('$0,0');
  var homeToPrint = `Median Home Value: ${homeFormat}`;
 


  d3.select("#keyInfo")
    .append("h4")
    .text(cityToPrint)
    .append("p")
    .text(populationToPrint)
    .style("font-size", "20px")
    .append("p")
    .text(unemployToPrint)
    .append("p")
    .text(incomeToPrint)
    .append("p")
    .text(homeToPrint)

  ////////////////////////////////////////////////////////////////////////////////////////////
  /// This section creates the bar chart on the mode of commuting
  ////////////////////////////////////////////////////////////////////////////////////////////

  // A few cities are missing data on commuting, so included this if statement  to test
  // if no data before attempting to create plot.
  if (filteredData.data.private_auto==="N") {
    d3.select("#commute")
      .append("H4")
      .text("No Data Available")
  }
  else {

    var commute = [data.private_auto, data.public_transport, data.bike, data.walks, data.works_home , data.other] 
    
    var commuteLabels = ["Private Auto", "Pulic Transport", "Bike", "Walks", "Works at Home", "Other"]
    
    var trace1 = {
      x: commuteLabels,
      y: commute,
      text: commuteLabels,
      name: "Sample",
      type: "bar",
      // orientation: "h"
  };

  // define data
  var data = [trace1];
          
  // Define layout
  var layout = {
      margin: {
      l: 40,
      r: 30,
      t: 20,
      b: 70
      },
      yaxis: {
        range: [0, 100],
        title: {text: "Percentage (%)"},
      },
      plot_bgcolor: "LightGrey",
      // paper_bgcolor:"LightGrey"
  };

  // Render the plot to the div tag with id "commute"
  Plotly.newPlot("commute", data, layout);
}

})

///////////////////////////////////////////////////////////////////////////////////////////////////////
/// This section bring in the city level data and filters for the chosen city
///////////////////////////////////////////////////////////////////////////////////////////////////////

var city_url = "http://localhost:5000/api/v1.0/weather/census_city"

/// will replace this next line with reference to the city chosen from the webpage
cityholder="Beaver Dam,WI"
// cityholder="Carson City,NV"

d3.json(city_url).then(function(data) {
  var cityData = data;


  // console.log(cityData);
  // Filter the data to keep only records for the chosen city
  var filteredData = cityData.filter(cityData => cityData.city_state === cityholder)[0];
  
  var data=filteredData.data;

  console.log(filteredData);


///======================================================================
/// This section creates the bar chart on Diversity 
///=====================================================================


  if (filteredData.data.private_auto==="N") {
    d3.select("#diversity")
      .append("H4")
      .text("No Data Available")
  }
  else {
    d3.select("#diversity")
      .append("div")

    var diver = [data.white, data.black_african_american, //
      data.american_indian_alaska_native, data.asian , data.hispanic_latino, data.some_other_race] 


    var diverLabels = ["White", "Black African American", "American Indian Alaskan Native", "Asian",//
     "Hispanic Latino", "Some Other Race"]
    

  
     var data_diver = [{
      type: "pie",
      values: diver,
      labels: diverLabels,
      textinfo: "label+percent",
      // textposition: "outside",
      automargin: true,
      showlegend: true
    }]
    
    var layout = {
      height: 400,
      width: 400,
      margin: {"t": 0, "b": 0, "l": 0, "r": 0},
      showlegend: false,
      paper_bgcolor: "rgb(6, 38, 53)"
      }
    
      Plotly.newPlot("diversity", data_diver, layout);


///======================================================================
/// This section creates the bar chart on Education Level 
///=====================================================================


    d3.select("#eduLevel")
      .append("div")

    var education = [data.total_population_over_25_years_old, data.less_than_9th_grade, //
      data.high_school_diploma, data.some_college_no_degree , data.associate_degree, data.bachelor_degree, //
      data.graduate_proffesional_degree, data.high_school_graduate_or_higher, data.bachelor_degree_or_higher] 



    var educationLabels = ["Population Over 25 Years Old", "Less than 9th Grade", "High School", "Some College",//
     "Associate", "Bachelor", "Graduate Proffesional", "High School or Higher", "Bachelor or Higher"]
    
    var trace_edu = {
      x: educationLabels,
      y: education,
      text: educationLabels,
      name: "Sample",
      type: "bar",
      // colorbar: rgb(6, 38, 53),
      // tickcolor: "white"
  };

  // define data
    var data_edu = [trace_edu];
          
  
  // Define layout
    var layout = {
      margin: {
      l: 60,
      r: 50,
      t: 30,
      b: 100
      },
      yaxis: {
        title: {text: "Education Lavel (Population)"},
      },
      plot_bgcolor: "rgb(6, 38, 53)",
      paper_bgcolor:"rgb(6, 38, 53)",
      // coloraxis: "white",
  };

  // Render the plot to the div tag with id "eduLevel"
  Plotly.newPlot("eduLevel", data_edu, layout);
}

    
  })  


