from multiprocessing import Pool, Manager

# ONE = {
#    'a': 1,
#    'b': 2,
#    'c': {
#       'd': 3,
#       'e': 4
#    }
# }

def f(x, cache):
   cache[x]['c']['d'] += 10
   # print('o', o)
   print(cache[x]['a'])

def init_fn(one):
   global ONE
   ONE = one

# f(4)
# print(d)
if __name__ == '__main__':
   m = Manager()
   obj = {
      'a': m.Value('i', 0),
      'b': 2,
      'c': m.dict({ 'd': 3, 'e': 4 }),
      'd': m.dict({ 'd': 400, 'e': 400 })
   }
   # obj = m.dict({
   #    'a': 1,
   #    'b': 2,
   #    'c': { 'd': 3, 'e': 4 },
   #    'd': { 'd': 400, 'e': 400 },
   # })

   # cache = m.dict({ c : obj for c in range(10) })
   cache = { c : obj for c in range(10) }

   # with Pool(initializer=init_fn, initargs=(obj,)) as p:
   with Pool() as p:
      p.starmap(f, [(i, cache) for i in range(4)])

   # print('final value', obj['c'], obj['d'])
   # print('final', cache[0]['c'], cache[9]['c'])
   print('final', cache[0]['c']['d'], cache[9]['c']['d'])