# Docs on session basics
# https://docs.sqlalchemy.org/en/13/orm/session_basics.html

import numpy as np
import os

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify
# from flask_cors import CORS



#################################################
# Database Setup
#################################################

# variables to populate the database connection string
db_user = 'postgres'
db_password = 'postgres'
db_host = 'localhost'
db_port = 5432

# This database must already exist
db_name = "city_state_data_db"

engine = create_engine(f"postgres://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}")
# Base.metadata.create_all(engine)

# reflect an existing database into a new model
Base = automap_base()
Base.prepare(engine, reflect=True)

# Save reference to the table
WeatherData = Base.classes.weather_data
CityData = Base.classes.city_data
StateData = Base.classes.state_data

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/weather/state/<state_name><br/>"
        f"/api/v1.0/weather/all_states<br/>"
    )


@app.route("/api/v1.0/census_city")
def census_city():
    """Return a list of all weather for the state"""

    # Query all passengers
    session = Session(engine)
    results = session.query(CityData).all()

    # close the session to end the communication with the database
    session.close()

    # Convert list of tuples into normal list
#     all_names = list(np.ravel(results))
    census_city_data = []

    for city in results:
        city_dict={'city_state': city.city_state}
        data_dict={}
        data_dict["state"] = city.state
        data_dict["median_income"] = city.median_income
        data_dict["mean_income"] = city.mean_income
        data_dict["median_value"] = city.median_value
        data_dict["unemployment_rate"] = city.unemployment_rate
        data_dict["population"] = city.population
        data_dict["private_auto"] = city.private_auto 
        data_dict["public_transport"] = city.public_transport 
        data_dict["walks"] = city.walks 
        data_dict["bike"] = city.bike
        data_dict["other"] = city.other 
        data_dict["works_home"] = city.works_home
        data_dict["total_population_over_25_years_old"] = city.total_population_over_25_years_old
        data_dict["less_than_9th_grade"] = city.less_than_9th_grade
        data_dict["grade_9th_to_12th_no_diploma"] = city.grade_9th_to_12th_no_diploma
        data_dict["high_school_diploma"] = city.high_school_diploma
        data_dict["some_college_no_degree"] = city.some_college_no_degree
        data_dict["associate_degree"] = city.associate_degree
        data_dict["bachelor_degree"] = city.bachelor_degree
        data_dict["graduate_proffesional_degree"] = city.graduate_proffesional_degree
        data_dict["high_school_graduate_or_higher"] = city.high_school_graduate_or_higher
        data_dict["bachelor_degree_or_higher"] = city.bachelor_degree_or_higher
        data_dict["white"] = city.white
        data_dict["black_african_american"] = city.black_african_american
        data_dict["american_indian_alaska_native"] = city.american_indian_alaska_native
        data_dict["asian"] = city.asian
        data_dict["some_other_race"] = city.some_other_race
        data_dict["hispanic_latino"] = city.hispanic_latino

        
        city_dict['data'] = data_dict
        census_city_data.append(city_dict)

    return jsonify(census_city_data)


@app.route("/api/v1.0/census_state")
def census_state():
    """Return a list of all weather for the state"""

    # Query all passengers
    session = Session(engine)
    results = session.query(StateData).all()

    # close the session to end the communication with the database
    session.close()

    # Convert list of tuples into normal list
#     all_names = list(np.ravel(results))
    census_state_data = []

    for state in results:
        state_dict={'state': state.state}
        data_dict={}
        data_dict["median_income"] = state.median_income
        data_dict["mean_income"] = state.mean_income
        data_dict["median_value"] = state.median_value
        data_dict["unemployment_rate"] = state.unemployment_rate
        data_dict["population"] = state.population
        data_dict["private_auto"] = state.private_auto 
        data_dict["public_transport"] = state.public_transport 
        data_dict["walks"] = state.walks 
        data_dict["bike"] = state.bike
        data_dict["other"] = state.other 
        data_dict["works_home"] = state.works_home
        data_dict["total_population_over_25_years_old"] = state.total_population_over_25_years_old
        data_dict["less_than_9th_grade"] = state.less_than_9th_grade
        data_dict["grade_9th_to_12th_no_diploma"] = state.grade_9th_to_12th_no_diploma
        data_dict["high_school_diploma"] = state.high_school_diploma
        data_dict["some_college_no_degree"] = state.some_college_no_degree
        data_dict["associate_degree"] = state.associate_degree
        data_dict["bachelor_degree"] = state.bachelor_degree
        data_dict["graduate_proffesional_degree"] = state.graduate_proffesional_degree
        data_dict["high_school_graduate_or_higher"] = state.high_school_graduate_or_higher
        data_dict["bachelor_degree_or_higher"] = state.bachelor_degree_or_higher
        data_dict["white"] = state.white
        data_dict["black_african_american"] = state.black_african_american
        data_dict["american_indian_alaska_native"] = state.american_indian_alaska_native
        data_dict["asian"] = state.asian
        data_dict["some_other_race"] = state.some_other_race
        data_dict["hispanic_latino"] = state.hispanic_latino

        
        state_dict['data'] = data_dict
        census_state_data.append(state_dict)

    return jsonify(census_state_data)






if __name__ == '__main__':
    app.run(debug=True)
