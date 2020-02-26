# Project2_Team7

### Team Members:  Ruby Mittal, Luis Santana, Jeff Eickholt

### Project Title: Do you want to relocate to ...?

### Description:  We created an interactive dashboard that allowed the uses to view some key informaton about a chosen city in the United States.  There are a total of 519 cities available.  To make the interaction more manageable, we allow the user to first choose the state that they are interested in through a standard drop-down list.  Based on the state chosen, a second drop-down is populated with the city available for that state.  This drop-down is searchable, so the user can type the first letter of the city to quickly find the city of interest.  Below is a quick description of how this project met the project requirements.

1.  We input data from the Census American Community Survey from csv files at the city and state level.  We also obtained weather data though webscraping at the state level.  This data was processed and then output to a PostgreSQL datebase.  The data from the database was then accessed by a Flask application, which had several routes and published the necessary data in a JSON format.

2.  We created an interactive dashboard using the data from the Flask application and javascript code.

3.  We used a new libary call numbers.js (http://numeraljs.com/).  This libary was used to apply formatting to numeric data that we presented on the dashboard, such as presenting numbers as a percentage or a currency.

4.  Our city level data had a total of 519 cities to choose from.

5.  Our dashboard had a total of 6 different views of the data.







### Original Proposal

### Project Title: Do you want to relocate to ...?

#### In this project, we will be creating an application that will allow users to view details of a state or city to decide if they want to move there.  This app will contain two dashoards.  The first will be for a particular State of City that the user chooses.  It will display some key statitics and chart about the city.  The second dashboard will allow the user to choose two states or cities and see a side by side comparison the the same key statistic and charts. This will allow them to compare the current state/city that they live in to anothre  state/city that they are thinking of moving to.

####  The main dataset will be the US Census Data American Community Data (link below).  We will also be attempting to gather temperature data from the National Centers for Environmental Education (second link below).  We haven't yet determined if we can figure out the weather API.  If we can't figure this out in the next couple of days, we will drop this data source and replace the chart with a different chart based on census data.

https://www.census.gov/acs/www/data/data-tables-and-tools/

https://www.ncei.noaa.gov/support/access-data-service-api-user-documentation


#### The final output will look very similar to the Dashboard_Preview Power Point included in the repo.

