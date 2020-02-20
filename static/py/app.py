# Docs on session basics
# https://docs.sqlalchemy.org/en/13/orm/session_basics.html

import numpy as np
import os

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify



#################################################
# Database Setup
#################################################

# variables to populate the database connection string
db_user = 'postgres'
db_password = 'Postgres2019'
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


@app.route("/api/v1.0/weather/state/<state_name>")
def stateData(state_name):
    """Return a list of all weather for the state"""

    # Query all passengers
    session = Session(engine)
    results = session.query(WeatherData).filter(WeatherData.State==state_name).all()

    # close the session to end the communication with the database
    session.close()

    # Convert list of tuples into normal list
#     all_names = list(np.ravel(results))
    all_data = []
    for weather in results:
        weather_dict = {}
        weather_dict["State"] = weather.State
        weather_dict["avg_high"] = weather.avg_high
        weather_dict["avg_low"] = weather.avg_low
        weather_dict["avg_prec"] = weather.avg_prec
        weather_dict["Month"] = weather.Month
        all_data.append(weather_dict)

    return jsonify(all_data)


@app.route("/api/v1.0/weather/all_states")
def all_states():
    """Return a list of all weather for the state"""

    # Query all passengers
    session = Session(engine)
    results = session.query(WeatherData).all()

    # close the session to end the communication with the database
    session.close()

    # Convert list of tuples into normal list
#     all_names = list(np.ravel(results))
    all_data = []
    for weather in results:
        weather_dict = {}
        weather_dict["State"] = weather.State
        weather_dict["avg_high"] = weather.avg_high
        weather_dict["avg_low"] = weather.avg_low
        weather_dict["avg_prec"] = weather.avg_prec
        weather_dict["Month"] = weather.Month
        all_data.append(weather_dict)

    return jsonify(all_data)


#     return jsonify(all_names)


# @app.route("/api/v1.0/passengers")
# def passengers():
#     """Return a list of passenger data including the name, age, and sex of each passenger"""

#     # Open a communication session with the database
#     session = Session(engine)

#     # Query all passengers
#     results = session.query(Passenger).all()

#     # close the session to end the communication with the database
#     session.close()

#     # Create a dictionary from the row data and append to a list of all_passengers
#     all_passengers = []
#     for passenger in results:
#         passenger_dict = {}
#         passenger_dict["name"] = passenger.name
#         passenger_dict["age"] = passenger.age
#         passenger_dict["sex"] = passenger.sex
#         all_passengers.append(passenger_dict)

#     return jsonify(all_passengers)


if __name__ == '__main__':
    app.run(debug=True)
