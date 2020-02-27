
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

  // console.log(filteredData);


  
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
      label:{
        textfont: "white",
      },
      textinfo: "label+percent",
      // textposition: "outside",
      automargin: true,
      showlegend: true,
      outsidetextfont: 'white'
    }]
    
    var layout = {
      height: 400,
      width: 400,
      margin: {"t": 0, "b": 0, "l": 0, "r": 0},
      showlegend: false,
      paper_bgcolor: "rgb(6, 38, 53)",
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
      textposition: 'auto',
      textcolor: 'rgba(255,255,255,1)',
      marker:{color: ['hsla(0,100%,30%,1.0)', 'rgb(255,227,164,1.0)', 'rgb(255,227,164,1.0)','rgb(255,227,164,1.0)',//
      'rgb(255,227,164,1.0)','rgb(255,227,164,1.0)','rgb(255,227,164,1.0)','rgb(255,204,255,1.0)','rgb(255,204,255,1.0)'],
      },
      type: "bar",
      
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
        title: {text: "Population",
        zerolinecolor:"white",
        font:{
          color: 'rgb(102,255,178)',
          size: 25,
            }
          },
          gridcolor:"white",
          tickfont: {
            // family: 'Old Standard TT, serif',
            // size: 14,
            color: 'white',
          }
      },
      xaxis: {
        // outlinecolor:"white",
        title:{text: "",
        font:{
          color: 'rgb(102,255,178)',
          size: 25,
            }
          },
          tickfont: {
            // family: 'Old Standard TT, serif',
            // size: 14,
            color: 'white',
          }
      },
      plot_bgcolor: "rgb(6, 38, 53)",
      paper_bgcolor:"rgb(6, 38, 53)",

      
  };

  // Render the plot to the div tag with id "eduLevel"
  Plotly.newPlot("eduLevel", data_edu, layout);
}

    
})  


