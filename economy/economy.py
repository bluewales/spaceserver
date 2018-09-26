import json
import os


goods = None
recipes = None
professions = None


class Economy:
  def __init__(self, data_path):

    global goods
    global recipes
    global professions

    if recipes is None:
      with open(data_path + "recipes.json") as json_file:
        recipes = json.load(json_file)
        json_file.close()
        for ix in range(len(recipes)):
          recipes[ix]['ix'] = ix

    if goods is None:
      with open(data_path + "goods.json") as json_file:
        goods_raw = json.load(json_file)
        json_file.close()

        goods = {}

        for good_name in goods_raw:
          good = goods_raw[good_name]
          if 'path' not in good:
            continue
          with open(data_path + "goods/" + good['path']) as good_file:
            good = json.load(good_file)
            good_file.close()
            goods[good_name] = good

    if professions is None:
      with open(data_path + "professions.json") as json_file:
        professions = json.load(json_file)
        json_file.close()

    self.goods = goods
    self.recipes = recipes
    self.professions = professions

    self.default_money = 100


if __name__ == '__main__':

  economy = Economy("dat/")

  for recipe in economy.recipes:
    print(recipe)
    print(Economy.parse_goods_string(recipe['required_materials']))
