
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
import time

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

    self.history = None

    self.potentials = {}

    for profession in self.economy.professions:
      self.potentials[profession] = 50
    for potential in city_data['potentials']:
      self.potentials[potential] = city_data['potentials'][potential]

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

      if len(self.citizens) < self.default_population:
        self.citizens.append(Citizen(self, self.data_path))
      
      if len(self.citizens) > self.default_population:
        self.citizens = self.citizens[0:-1]

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

    start_time = time.time()

    self.history_blank_line()

    self.day += 1

    print("  %d citizens" % (len(self.citizens)))
    for citizen in self.citizens:
      citizen.advance_day()

    print("  citizens advanced in %d s" % (time.time() - start_time))

    self.market.facilitate_trades()

    print("  trades facilitated in %d s" % (time.time() - start_time))

    for citizen in self.citizens:
      citizen.expire_goods()

    print("  goods expired in %d s" % (time.time() - start_time))

    self.save_history()

    print("  history saved in %d s" % (time.time() - start_time))

  def history_blank_line(self):
    line = {
      "goods": {},
      "recipes": {},
      "day": 0,
      "money": 0,
      "starving": 0
    }
    for good_name in self.economy.goods:
      line['goods'][good_name] = {
        "price": self.market.default_price,
        "count": 0,
        "produced": 0,
        "consumed": 0,
        "offers": 0,
        "bids": 0,
        "trades": 0,
        "decayed": 0
      }
      if "default_price" in self.economy.goods[good_name]:
        line['goods'][good_name]['default_price'] = self.economy.goods[good_name]['default_price']

    for recipe in self.economy.recipes:
      action = recipe['action']
      line['recipes'][action] = {
        "planned": 0,
        "produced": 0
      }
    self.current_line = line
    return line

  def check_history(self):
    if self.history is None:
      self.history = {}


  def save_history(self):
    self.check_history()
    resolution = 1

    self.current_line['day'] = self.day

    for citizen in self.citizens:
      self.current_line['money'] += citizen.money

    for good_name in self.economy.goods:
      self.current_line['goods'][good_name]['price'] = self.market.prices[good_name]

    while resolution <= self.day:
      current_line = self.current_line
      ressolution_key = str(resolution)
      if ressolution_key not in self.history:
        self.history[ressolution_key] = []
        self.history[ressolution_key].append(self.history_blank_line())
        self.history[ressolution_key][0]['money'] = self.economy.default_money * self.default_population
      if self.day % resolution == 0:
        self.history[ressolution_key].append(current_line)

      if len(self.history[ressolution_key]) > 100:
        self.history[ressolution_key] = self.history[ressolution_key][-1000:]
      
      resolution *= 10

  def register_detail(self, detail, good_name, count):
    self.current_line['goods'][good_name][detail] += count

  def register_possessions(self, possessions):
    for good_name in possessions:
      count = possessions[good_name]
      self.register_detail("count", good_name, count)

  def register_produced(self, good_name, count):
    self.register_detail("produced", good_name, count)

  def register_consumed(self, good_name, count):
    self.register_detail("consumed", good_name, count)

  def register_offers(self, good_name, count):
    self.register_detail("offers", good_name, count)

  def register_bids(self, good_name, count):
    self.register_detail("bids", good_name, count)

  def register_trades(self, good_name, count):
    self.register_detail("trades", good_name, count)

  def register_decayed(self, good_name, count):
    self.register_detail("decayed", good_name, count)

  def register_starvation(self):
    self.current_line['starving'] += 1

  def register_plan(self, action):
    self.current_line['recipes'][action]['planned'] += 1

  def register_production(self, action):
    self.current_line['recipes'][action]['produced'] += 1

  