
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

  



