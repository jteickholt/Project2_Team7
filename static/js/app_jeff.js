
var city_url = "http://localhost:5000/api/v1.0/weather/census_city"

city="Beaver Dam,WI"

d3.json(city_url).then(function(data) {
  var cityData = data;

  // console.log(cityData);
  // Filter the data to keep only records for the chosen city
  var filteredData = cityData.filter(cityData => cityData.city_state === city)[0];
  console.log(filteredData);
  var data=filteredData.data;

  var commute = [data.private_auto, data.public_transport, data.bike, data.walks, data.other,data.works_home ]  
  var commutelabels = ["Private Auto", "Pulic Transport", "Bike", "Walks", "Other", "Works at Home"]
  
  var trace1 = {
    x: commutelabels,
    y: commute,
    text: otuLabels,
    name: "Sample",
    type: "bar",
    orientation: "h"
};


})

  



