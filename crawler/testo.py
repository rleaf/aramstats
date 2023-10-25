# x = '123224212141133433'


# x = '123222121113333'
# level_order = ''
# skill_count = (x.count('1'), x.count('2'), x.count('3'))
# skills = {
#    'q': skill_count[0],
#    'w': skill_count[1],
#    'e': skill_count[2]
# }

# for i, g in enumerate(skill_count):
#    for u, y in enumerate(skill_count):
#       if i == u: continue
#       if g == y: print(g, y, 'these two match')

# y = sorted(x, key=lambda a: x.count(a))
# print(''.join(y))

x = [
   '1232242123431'
   # '123114121',
   # '1231141212422',
   # '1232242121411',
   # '3212241111422',
   # '12311412124223',
   # '12321411124223',
   # '12322412124113',
   # '12322421214113',
   # '123114121242233',
   # '123224212141133',
   # '123224232141113',
   # '132224212141133',
   # '231114121242233',
   # '1231141212422334',
   # '1232242111412334',
   # '1232242121411333',
   # '1232242121411334',
   # '12311412124223343',
   # '12321422214113343',
   # '12322421214113343',
   # '21322422114131433',
   # '113214131343322422',
   # '123114121242233433',
   # '123124111243223433',
   # '123124222141133433',
   # '123214122142133433',
   # '123224212141133433',
   # '132224212141133433',
   # '213114121242233433',
   # '231114121242233433'
]

for ye in x:
   ye = ye.replace('4', '')[3:]
   level_order = ''

   ql, wl, el = ye.count('1'), ye.count('2'), ye.count('3')
   skills = {
      '1': ye.count('1'),
      '2': ye.count('2'),
      '3': ye.count('3')
   }

   table = {
      '1': 'q',
      '2': 'w',
      '3': 'e'
   }

   _singles = [x for x in skills if skills[x] == 1]
   _zeros = [table[x] for x in skills if skills[x] == 0]

   qwe = [0, 0, 0]
   singles = ''
   zeros = ''.join(_zeros)
   for i in ye:
      qwe[int(i) - 1] += 1
      if i in _singles:
         singles += table[i]
         continue
      
      if qwe[int(i) - 1] == skills[i] and table[i] not in level_order: level_order += table[i]
   
   print(ye)
   print(level_order + singles + zeros)