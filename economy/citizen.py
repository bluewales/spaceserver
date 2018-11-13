#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "Market.h"
#include "smallVector.h"
#include "rvpParser.h"
#include "MysqlPortal.h"
#include "Citizen.h"
#include "Profession.h"
#include "CitizensIndex.h"
#include "GoodsIndex.h"
#include "ProfessionsIndex.h"
#include "Good.h"
#include "City.h"
#include "Recipe.h"

import json
import random
import time

from citizenAI import CitizenAI
from reverse_polish import rvp_parse
from economy import Economy
from name_generator import generate_a_name

class Citizen:
  def __init__(self, city, data_path, data=None):

    self.city = city

    self.economy = Economy(data_path)
    self.goods = self.economy.goods
    self.recipes = self.economy.recipes
    self.professions = self.economy.professions

    self.one_round_food = 5
    self.utility_of_money = 0

    if data:
      self.money = data['money']
      
      self.first_name = data['first_name']
      self.last_name = data['last_name']

      self.skills = data['skills']
      self.affinities = data['affinities']
      self.possessions = data['possessions']

      self.birthdate = data['birthdate']
      
    else:    

      #print("RESTARTING")

      self.money = self.economy.default_money

      name = generate_a_name()
      self.first_name = name['first_name']
      self.last_name = name['last_name']

      self.skills = {}
      self.affinities = {}
      self.possessions = {}

      self.birthdate = random.randrange(20,100)

    for profession in self.professions:
      if profession not in self.skills:
        self.skills[profession] = random.randrange(0,101)
    for good_name in self.goods:
      good = self.goods[good_name]
      if good_name not in self.affinities:
        affinity = 0
        if 'function_for_affinity' in good:
          affinity = rvp_parse(good['function_for_affinity'])
        self.affinities[good_name] = affinity
      if good_name not in self.possessions:
        self.possessions[good_name] = 0
    
    self.margin = 0

  def expire_goods(self):
    for good_name in self.possessions:
      durability = self.goods[good_name]['durability']
      if durability == 0:
        continue
      possessed = self.possessions[good_name]
      if possessed == 0:
        continue
      if durability > possessed:
        if random.randrange(durability) < possessed:
          self.possessions[good_name] -= 1
          self.city.register_decayed(good_name, 1)
      else:
        self.possessions[good_name] -= int(possessed / durability)
        self.city.register_decayed(good_name, int(possessed / durability))

  def serialize(self):
    result = {
        "money": self.money,
        "first_name": self.first_name,
        "last_name": self.last_name,
        "skills": self.skills,
        "affinities": self.affinities,
        "possessions": self.possessions,
        "birthdate": self.birthdate
    }
    return result


  def add_new_good(self, good_name, count):

    if count < 0:
      print("ERROR NEGATIVE %s GAINED" % good_name)
      print("%s %s" % (self.first_name, self.last_name))
      raise ValueError("ERROR NEGATIVE %s GAINED" % good_name)

    if good_name in self.possessions:
      self.possessions[good_name] += count
    else:
      self.possessions[good_name] = count

  def remove_good(self, good_name, count):
    self.possessions[good_name] -= count

    if self.possessions[good_name] < 0:
      print("ERROR NEGATIVE %s" % good_name)
      print("%s %s" % (self.first_name, self.last_name))
      raise ValueError("ERROR NEGATIVE %s" % good_name)

  def add_money(self, delta_money):
    if delta_money < 0:
      print("ERROR NEGATIVE INCOME")
      print("%s %s" % (self.first_name, self.last_name))
      raise ValueError("ERROR NEGATIVE INCOME")
    self.money += delta_money
    
  def remove_money(self, delta_money):
    self.money -= delta_money

    if self.money < 0:
      print("ERROR NEGATIVE MONEY")
      print("%s %s" % (self.first_name, self.last_name))
      raise ValueError("ERROR NEGATIVE MONEY")

  def scavenge(self):

    for recipe in self.recipes:
      if "food" in recipe['products']:
        quantity = self.get_quantity_producable(recipe, True)
        if recipe['products']['food'] * quantity >= self.one_round_food:
          self.produce(recipe)
          # print("%s %s will scavenges by %s" % (self.first_name, self.last_name, recipe['action']))
          return
    self.city.register_starvation()
    newFood = 1
    self.add_new_good("food", newFood)

  def bought(self, good_name, quantity, price):
    self.add_new_good(good_name, quantity)
    self.remove_money(price * quantity)

  def sold(self, good_name, quantity, price):
    self.remove_good(good_name, quantity)
    self.add_money(price * quantity)

  def get_profit(self, recipe, realistic):
    
    production = self.get_quantity_producable(recipe, realistic)

    if production == 0:
      return 0

    cost = 0
    required_materials = recipe['required_materials']
    for good_name in required_materials:
      price = self.city.market.prices[good_name]
      quantity = required_materials[good_name]
      cost += price * quantity

    tool_cost = 0
    required_tools = recipe['required_tools']
    for tool_name in required_tools:
      quantity = required_tools[tool_name] - self.possessions[tool_name]
      if quantity > 0:
        price = self.city.market.prices[tool_name]
        tool_cost += price * quantity
    
    revenue = 0
    products = recipe['products']
    for good_name in products:
      price = self.city.market.prices[good_name]
      quantity = products[good_name]
      revenue += price * quantity

    profit = revenue - cost
    
    return production * profit - tool_cost

  def what_to_produce(self, recipes, realistic):
    max_profit = 0

    best_recipe = None
    
    # compare each recipe and find the one with the highest profit
    for recipe in recipes:
      profit = self.get_profit(recipe, realistic)

      if(profit >= max_profit):
        self.margin = profit - max_profit
        max_profit = profit
        best_recipe = recipe
      elif(self.margin > max_profit-profit):
        self.margin = max_profit-profit
    
    if best_recipe == None:
      print("Could not find a profession for citizen %s (profit=%d)\n" % (self.first_name, max_profit))
      exit(0)

    return best_recipe

  def buy_wants(self):
    
    self.rebuild_utility_index()
    self.get_most_coveted_good()

    to_buy = {}

    while self.money_spending < self.money:
      good_name = self.get_most_coveted_good()['name']
      price = self.city.market.prices[good_name]

      if good_name in to_buy:
        to_buy[good_name] += 1
      else:
        to_buy[good_name] = 1

      self.money_spending += price
      if good_name in self.goods_buying:
        self.goods_buying[good_name] += 1
      else:
        self.goods_buying[good_name] = 1

    for good_name in to_buy:
      price = self.city.market.prices[good_name]
      quantity = to_buy[good_name]

      self.city.market.submit_bid_from_citizen(self, good_name, quantity, price)

      

      # print(" will buy %d %s for %d money" % (quantity, good_name, price))

  def buy_needs(self):

    for good_name in self.goods_needed:
      possessed = self.possessions[good_name]
      needed = self.goods_needed[good_name]

      price = self.city.market.prices[good_name]

      if possessed < needed:
        quantity = needed - possessed
        self.city.market.submit_bid_from_citizen(self, good_name, quantity, price)
        # print(" will buy %d %s for %d money" % (quantity, good_name, price))

        self.money_spending += quantity*price
        if good_name in self.goods_buying:
          self.goods_buying[good_name] += quantity
        else:
          self.goods_buying[good_name] = quantity

  def sell_excess(self):

    for good_name in self.possessions:
      good = self.goods[good_name]

      must_keep = 0
      if good_name in self.goods_needed:
        must_keep = self.goods_needed[good_name]

      quantity = self.get_num_to_sell(good, need_to_keep=must_keep)

      if quantity == 0:
        continue

      price = self.city.market.prices[good_name]

      self.city.market.submit_offer_from_citizen(self, good_name, quantity, price)

      if good_name in self.goods_selling:
        self.goods_selling[good_name] += quantity
      else:
        self.goods_selling[good_name] = quantity

      # print(" will sell %d %s for %d money" % (quantity, good_name, price))

  def advance_day(self):

    # print("\n%s %s" % (self.first_name, self.last_name))

    self.money_spending = 0
    self.goods_selling = {}
    self.goods_buying = {}
    self.goods_needed = {"food": self.one_round_food}

    if not self.has_food_for_procution():
      # print(" will scavenge for food")
      self.scavenge()
    else:
      recipe = self.what_to_produce(self.recipes, True)
      # print(" will %s" % (recipe['action']))
      self.produce(recipe)

    self.plan_tomorrow()

    # print("buy needs")
    self.buy_needs()

    # print("buy wants")
    self.buy_wants()

    # print("sell excess")
    self.sell_excess()

    self.city.register_possessions(self.possessions)

  ## notice that this function assumes that the citizen has required materials for production
  ## if the citizen does not indeed have enough stuff, an error will occur, one that might be very hard indeed to detect and fix
  def produce(self, recipe):
    number_produced = self.get_quantity_producable(recipe, True)

    #   Remove goods consumed by production
    #
    required_goods = recipe['required_materials']
    for good_name in required_goods:
      num_required = required_goods[good_name]
      consumed = num_required * number_produced
      self.remove_good(good_name, consumed)

      self.city.register_consumed(good_name, consumed)

    #   Add goods produced by production
    #
    products = recipe['products']
    for product_name in products:
      count = products[product_name]
      produced = int(count * number_produced)
      self.add_new_good(product_name, produced)

      self.city.register_produced(product_name, produced)

      # print("Produced %d %s" % (produced, product_name))

    #   Remove food consumed
    # 
    self.remove_good("food", self.one_round_food)

    self.city.register_consumed("food", self.one_round_food)

    self.city.register_production(recipe['action'])


      


  def plan_tomorrow(self):
    recipe = self.what_to_produce(self.recipes, False)
    number_produced = self.get_quantity_producable(recipe, False)

    # print(" wants to %s tomorrow" % (recipe['action']))

    required_goods = recipe['required_materials']
    for good_name in required_goods:
      num_required = required_goods[good_name]

      if good_name in self.goods_needed:
        self.goods_needed[good_name] += num_required * number_produced
      else:
        self.goods_needed[good_name] = num_required * number_produced

    required_tools = recipe['required_tools']
    for tool_name in required_tools:
      quantity_needed = required_tools[tool_name]
      if tool_name in self.goods_needed:
        self.goods_needed[tool_name] += quantity_needed
      else:
        self.goods_needed[tool_name] = quantity_needed

    self.city.register_plan(recipe['action'])

  def has_food_for_procution(self):
    if "food" not in self.possessions:
      return False
    return self.possessions['food'] >= self.one_round_food

  def rebuild_utility_index(self):
    self.utility_index = []

    for good_name in self.goods:
      good = self.goods[good_name]
      utility = self.get_utility_of_good(good)
      value = self.city.market.prices[good_name]
      utility_value = utility/value

      self.utility_index.append({
        "name": good_name,
        "utility": utility_value
      })

    self.utility_index.sort(reverse=True, key=lambda b : b['utility'])
  
  def get_most_coveted_good(self):

    top_good = self.utility_index[0]
    good_name = top_good['name']

    good = self.goods[good_name]
    utility = self.get_utility_of_good(good)
    value = self.city.market.prices[good_name]
    utility_value = utility/value

    if utility_value != top_good['utility']:
      top_good['utility'] = utility_value

      for ix in range(1, len(self.utility_index)):
        if self.utility_index[ix]['utility'] > utility_value:
          self.utility_index[ix-1] = self.utility_index[ix]
          self.utility_index[ix] = top_good
        else:
          break

    self.utility_of_money

    top_good = self.utility_index[0]
    self.utility_of_money = top_good['utility']

    good_name = top_good['name']

    good = self.goods[good_name]

    return good


  def get_quantity_producable(self, recipe, realistic):

    ## find skill in producing profession
    made_by_profession = recipe['profession']
    skill = self.skills[made_by_profession]

    ## find score for beneficial tools possessed
    beneficial_tools = self.get_beneficial_tool_score(recipe)
    potential = self.city.potentials[made_by_profession]

    production = self.get_production(recipe, skill, beneficial_tools, potential)

    if realistic and production > 0:
      required_materials = recipe['required_materials']
      required_tools = recipe['required_tools']

      for tool_name in required_tools:
        quantity_needed = required_tools[tool_name]
        quantity_possessed = self.possessions[tool_name]

        if quantity_possessed < quantity_needed:
          production = 0

      for good_name in required_materials:
        quantity_needed = required_materials[good_name]
        quantity_possessed = self.possessions[good_name]

        if production > quantity_possessed / quantity_needed:
          production = int(quantity_possessed / quantity_needed)

    return int(production)

  def get_num_to_sell(self, good, need_to_keep=0):
    good_name = good['name']
    price = self.city.market.prices[good_name]

    max_to_keep = self.possessions[good_name]
    min_to_keep = need_to_keep

    while max_to_keep > min_to_keep:
      trial_keep = int((max_to_keep + min_to_keep+1)/2)

      utility = self.get_utility_of_good(good, possessed=trial_keep)
      utility_per_value = utility/price

      if utility_per_value < self.utility_of_money:
        max_to_keep = trial_keep - 1
      else:
        min_to_keep = trial_keep

    num_to_sell = self.possessions[good_name] - min_to_keep
    if num_to_sell < 0:
      num_to_sell = 0
    
    return num_to_sell

  def get_beneficial_tool_score(self, recipe):
    score = 0
    total_tools = 0
    
    tools = recipe['beneficial_tools']

    for tool_name in tools:
      
      quantity = tools[tool_name]

      possessed = self.possessions[tool_name]
      if possessed > quantity:
        score += quantity
      else:
        score += possessed
      total_tools += quantity

    if(total_tools == 0):
      return 0
    return (score * 100) / total_tools

  def get_utilizing_skill_score(self, good):
    score = 0

    for profession in good['used_by_profession']:
      skill = self.skills[profession]
      if(skill > score):
        score = skill
    return score
  
  def get_production(self, recipe, skill, beneficial_tools, potential):

    params = {
      "skill": skill,
      "beneficial_tools": beneficial_tools,
      "potential": potential
    }
    production = rvp_parse(recipe['function_for_production'], params)
    return int(production)

  def get_utility_of_good(self, good, possessed=None):

    good_name = good['name']

    made_by_profession = good['made_by_profession']

    if possessed is None:
      possessed = self.possessions[good_name]
      if good_name in self.goods_buying:
        possessed += self.goods_buying[good_name]

    params = {
      "quality": 100,
      "affinity": self.affinities[good_name],
      "alread_possessed": possessed,
      "producing_skill": self.skills[made_by_profession],
      "utilizing_skill": self.get_utilizing_skill_score(good),
      "age": self.birthdate
    }

    utility = rvp_parse(good['function_for_utility'], params)

    return utility