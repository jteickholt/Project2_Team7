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

function stateSelected(stateName) {
  url = "http://127.0.0.1:5000/api/v1.0/weather/state/" + stateName;

  d3.json(url).then(function(weatherData) {

    // Parse Weather data
    // ==============================
    monthArray = [];
    minArray = [];
    maxArray = [];
    weatherData.forEach(function(data) {
    //   console.log("here is the data:", weatherData);
    monthArray.push(data.month);
    minArray.push(data.avg_low);
    maxArray.push(data.avg_high);
    });
    console.log("hello", weatherData);

    // Create our first trace
    var trace1 = {
      x: monthArray,
      y: maxArray,
      type: 'scatter',
      name: "Max Temperature"
    };

    // Create our second trace 
    var trace2 = {
      x: monthArray,
      y: minArray,
      type: 'scatter',
      name: "Min Temperature"
    };

    // The data array consists of all 2 traces
    var data = [trace1, trace2];

    var layout = {
      title: "Temperature Chart for the Year",
      xaxis: { title: "Month" },
      yaxis: { title: "Temperature"}
    }; 
    
    Plotly.newPlot('lineChart', data, layout);
  }); 
}


d3.json("http://127.0.0.1:5000/api/v1.0/stateList").then(function(states) {
  setSelectStates(states);
});

