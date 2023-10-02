import util

class Propagate():
   def __init__(self, db, region) -> None:
      patch = util.get_latest_patch()
      print(patch, type(patch))