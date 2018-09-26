
#include "stdlib.h"
#include "string.h"

#include "City.h"
#include "MysqlPortal.h"
#include "Market.h"
#include "GoodsIndex.h"
#include "RecipesIndex.h"
#include "CitizensIndex.h"
#include "ProfessionsIndex.h"
#include "citizenAI.h"
#include "Citizen.h"

import json
import os

from citizen import Citizen
from market import Market
from economy import Economy


class City:
  def __init__(self, data_path, city_data):

    self.data_path = data_path

    self.file_name = data_path + city_data['file']
    self.name = city_data['name']
    self.default_population = city_data['default_population']

    self.economy = Economy(data_path)

    if os.path.isfile(self.file_name):
      self.load()
    else:
      self.init()    

  def load(self):
    print(self.file_name)
    with open(self.file_name) as json_file:
      data = json.load(json_file)
      json_file.close()


      self.citizens = []
      for citizen_data in data['citizens']:
        self.citizens.append(Citizen(self, self.data_path, citizen_data))

      self.market = Market(self.data_path, data['market'])

      self.day = data['day']

  def init(self):
    self.citizens = []
    for i in range(self.default_population):
      self.citizens.append(Citizen(self, self.data_path))
      
    self.market = Market(self.data_path)

    self.day = 0


  def save(self):
    citizen_data = []
    for citizen in self.citizens:
      citizen_data.append(citizen.serialize())
    market_data = self.market.serialize()

    city_data = {
      "citizens": citizen_data,
      "market": market_data,
      "day": self.day
    }

    with open(self.file_name, 'w') as json_file:
      json.dump(city_data, json_file)
      json_file.close()


  


  def advance_day(self) :
    self.day += 1

    print("%d citizens" % (len(self.citizens)))
    for citizen in self.citizens:
      citizen.advance_day()

    self.market.facilitate_trades()

    for citizen in self.citizens:
      citizen.expire_goods()
