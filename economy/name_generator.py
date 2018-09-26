




import random
import json


male_names_file = "dat/names/dutch_boy_first_names.txt"
female_names_file = "dat/names/dutch_girl_first_names.txt"
last_names_file = "dat/names/dutch_last_names.txt"



def generate_a_name(gender=None):
  supported_genders = ["male", "female"]
  if gender not in supported_genders:
    gender = random.choice(supported_genders)

  if gender == "male":
    first_name_file = male_names_file
  else:  
    first_name_file = female_names_file


  with open(first_name_file) as fd:
    names = fd.read().split("\n")
    json.dumps(names)
    first_name = random.choice(names)
    fd.close()

  with open(last_names_file) as fd:
    names = fd.read().split("\n")
    last_name = random.choice(names)
    fd.close()

  return {
    "first_name": first_name,
    "last_name": last_name
  }


if __name__ == '__main__':
  with open("dat/names/generated_names.txt", "w") as fd:
    for i in range(0,100):
      name = generate_a_name(gender=None)
      name = "%s %s" % (name['first_name'], name['last_name'])
      print(name)
      fd.write(name + "\n")
