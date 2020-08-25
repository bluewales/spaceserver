import sys

from economy import Economy
from reverse_polish import rvp_parse

data_path = "dat/"
economy = Economy(data_path)

recipes = economy.recipes


max = 0
max_action = ""

def draw_function():

  for recipe in recipes:
    if "mine gold" in recipe['action']:
      break
   
  print(recipe)

  line = "% 4s | " % ("")
  for skill in range(0,101,2):
    line += str("% 3d" % (skill))
  print(line)
  line_length = len(line)
  line = ""
  for i in range(line_length):
    line += "-"
  print(line)

  for potential in range(0,101,2):
    line = "% 4d | " % (potential)

    for skill in range(0,101,2):
      params = {
        "skill": 100,
        "beneficial_tools": 00,
        "potential": 100
      }

      params['potential'] = potential
      params['skill'] = skill

      


      trials = 1000
      sum = 0
      float_sum = 0
      max = 0

      for i in range(0, trials):
        production = rvp_parse(recipe['function_for_production'], params)
        float_sum += production
        sum += int(production)
        if production > max:
          max = int(production)

      average = sum / trials
      float_avg = float_sum / trials

      line += str("% 3d" % (average))
        
      #print("%s %d -> %g (%g), max=%d" % (recipe['action'], potential, average, float_avg, max))
    print(line)

good_list = []

for good_name in economy.goods:
  good = economy.goods[good_name]

  good_list.append(good)

good_list.sort(key=lambda x: x['durability'])

for i in range(len(good_list)):
  print(str(i) + " " + str(good_list[i]['durability']) + " "  + good_list[i]['name'])

draw_function()
