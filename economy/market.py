#include <stdio.h>
#include <stdlib.h>

#include "Market.h"
#include "MysqlPortal.h"
#include "Citizen.h"
#include "Good.h"
#include "GoodsIndex.h"
#include "myutil.h"
#include "City.h"
#include "CitizensIndex.h"
#include "fastRandom.h"
#include "PlayerTrades.h"
#include "Bid.h"
#include "Offer.h"
#include "CitizenBid.h"
#include "CitizenOffer.h"
#include "PlayerBid.h"
#include "PlayerOffer.h"

import random

from economy import Economy

class Market:
  def __init__(self, data_path, data=None):
    
    self.default_price = 1
    
    economy = Economy(data_path)
    self.goods = economy.goods

    self.bids = {}
    self.offers = {}

    if data is None:
      self.prices = {}
    else:
      self.prices = data['prices']

    for good_name in self.goods:
      if good_name not in self.prices:
        if "default_price" in self.goods[good_name]:
          self.prices[good_name] = self.goods[good_name]['default_price']
        else:
          self.prices[good_name] = self.default_price

  def serialize(self):
    return {
      "prices": self.prices
    }


  def submit_bid_from_citizen(self, citizen, good_name, count, max_price):

    bid = {
      "count": count,
      "max": max_price,
      "citizen": citizen
    }

    if good_name not in self.bids:
      self.bids[good_name] = []

    self.bids[good_name].append(bid)

    citizen.city.register_bids(good_name, count)

  def submit_offer_from_citizen(self, citizen, good_name, count, min_price):

    offer = {
      "count": count,
      "min": min_price,
      "citizen": citizen
    }

    if good_name not in self.offers:
      self.offers[good_name] = []

    self.offers[good_name].append(offer)

    citizen.city.register_offers(good_name, count)


  def facilitate_trades(self):

    ## This would be a good time to load trades from external sources, but I don't know how it works
    #this->load_player_trades(city);

    goods = list(set(self.offers.keys()).union(set(self.bids.keys())))

    random.shuffle(goods)

    for good_name in goods:
      if good_name in self.bids:
        good_bids = self.bids[good_name]
      else:
        good_bids = []

      if good_name in self.offers:
        good_offers = self.offers[good_name]
      else:
        good_offers = []

      price = self.prices[good_name]


      #   Shuffle then sort may seem silly, but we will have many trades of
      # equal price, and I don't want to give priority to a citizen's bids just
      # because they were simulated first.
      random.shuffle(good_bids)
      random.shuffle(good_offers)

      good_bids.sort(reverse=True, key=lambda b : b['max'])
      good_offers.sort(key=lambda o : o['min'])

      ## special case for coins
      if "coin" in good_name:
        price = self.goods[good_name]['default_price']

        for bid in good_bids:
          quantity = bid['count']
          if bid['citizen'].money < quantity*price:
            del good_bids[0]
            continue
          bid['citizen'].bought(good_name, quantity, price)
          bid['citizen'].city.register_trades(good_name, quantity)

        for offer in good_offers:
          quantity = offer['count']
          if offer['citizen'].possessions[good_name] < quantity:
            del good_offers[0]
            continue
          offer['citizen'].sold(good_name, quantity, price)
          offer['citizen'].city.register_trades(good_name, quantity)
        continue

      done = False
      while not done:
        if len(good_bids) == 0 or len(good_offers) == 0:
          done = True
          continue
        bid = good_bids[0]
        offer = good_offers[0]

        if bid['max'] < offer['min']:
          done = True
          continue

        if price < offer['min']:
          price = offer['min']
        if price > bid['max']:
          price = bid['max']

        quantity = min(bid['count'], offer['count'])

        if offer['citizen'].possessions[good_name] < 1:
          del good_offers[0]
          continue
        if bid['citizen'].money < price:
          del good_bids[0]
          continue

        if quantity > offer['citizen'].possessions[good_name]:
          quantity = offer['citizen'].possessions[good_name]
        if bid['citizen'].money < quantity*price:
          quantity = int(bid['citizen'].money / price)

        if quantity == 0:
          print("ERROR TRADING quantity zero")
          raise("ERROR TRADING quantity zero")

        bid['citizen'].bought(good_name, quantity, price)
        offer['citizen'].sold(good_name, quantity, price)

        # print("%s buys %d %s from %s for %d" % (bid['citizen'].first_name, quantity, good_name, offer['citizen'].first_name, price))
        bid['citizen'].city.register_trades(good_name, quantity)

        offer['count'] -= quantity
        bid['count'] -= quantity

        if offer['count'] == 0:
          del good_offers[0]

        if bid['count'] == 0:
          del good_bids[0]

      delta = int(price / 128)
      if delta == 0:
        delta = 1

      if price != self.prices[good_name]:
        self.prices[good_name] = price
      else:
        if (len(good_bids) > 0 and good_bids[0]['max'] < self.prices[good_name]):
          good_bids = []
        if (len(good_offers) > 0 and good_offers[0]['min'] > self.prices[good_name]):
          good_offers = []
        if len(good_bids) > len(good_offers):
          self.prices[good_name] += delta
        elif len(good_bids) < len(good_offers):
          self.prices[good_name] -= delta
          if self.prices[good_name] < 1:
            self.prices[good_name] = 1

      
