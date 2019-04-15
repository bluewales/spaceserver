

#include "citizenAI.h"
#include "fastRandom.h"
#include "Market.h"
#include "CitiesIndex.h"
#include "City.h"
#include "myutil.h"

import json
import math
import os
import random
import sys
import time


from city import City
from economy import Economy



def main() :
  print("We can run the economy, Captain!")

  start_time = time.time()

  # TODO: create list of cities

  data_path = "dat/"

  with open(data_path + "economy.json") as json_file:
    economy_raw = json.load(json_file)
    json_file.close()
  cities_raw = economy_raw['cities']
  
  history_file = "history.json"

  cities = []
  histories = []
  if os.path.isfile(history_file) :
    if "reset" not in sys.argv:
      with open(history_file, "r") as fd:
        histories = json.load(fd)
        fd.close()

  for city_data in cities_raw:
    if "reset" in sys.argv:
      filename = data_path + city_data['file']
      if os.path.isfile(filename):
        os.remove(filename)
    city = City(data_path, city_data)
    if city.name in histories:
      city.history = histories[city.name]
    cities.append(city)


  days_to_simulate = 1
  for arg in sys.argv:
    try:
      days_to_simulate = int(arg)
    except:
      pass

  stop_up_time = time.time()
  print("start up % 6ld s" % (stop_up_time - start_time))

  
  for i in range(days_to_simulate):

    for city in cities:

      print("%s Day %d" % (city.name, city.day))
      start_inner_time = time.time()
      city.advance_day()
      stop_inner_time = time.time()
      print("city cycle %d % 6ld s" % (i, stop_inner_time - start_inner_time))


    end_time = time.time()
    seconds = end_time - start_time


    millis = seconds * 1000
    minutes = seconds / 60
    hours = minutes / 60

    millis %= 1000
    seconds %= 60
    minutes %= 60

    print("%02d:%02d:%02d.%03d" % (hours, minutes, seconds, millis))

  histories = {}
  for city in cities:
    city.save()
    histories[city.name] = city.history

  with open("prices.json", "w") as fd:
    city_prices = {}
    for city in cities:
      city_prices[city.name] = city.market.prices

    json.dump(city_prices, fd)
    fd.close()
  
  with open(history_file, "w") as fd:
    #json.dump(histories, fd, indent=2)
    json.dump(histories, fd)

  economy = Economy(data_path)
  economy.reset()



    
if __name__ == '__main__':
  while True:
    main()
    if "repeat" not in sys.argv:
      break
    
