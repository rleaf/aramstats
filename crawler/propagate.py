from util import *

class Propagate():
   def __init__(self, db, region) -> None:
      print('toaders')
      patch = get_latest_patch()
      print(patch, 'weee')
      w = db.summoners.find_one({ "name": 'Night Owl'})
      # print(w)