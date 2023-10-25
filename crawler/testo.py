""" 
This file is just used to test code and is not used anywhere.
"""

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
   '111112222333'
   '131213131313232222'   
   '1232242112143213341',
   '1232242212141113343',
   '1232242212143113341',
   '1232243212142113341',
   '2131241111242223343',
   '2312242212143113344',
   '3122242212143113344',
   '3212242212143113341',
   '3212242212144113341',
   '12311411212432233423',
   '12311411213433323422',
   '12312422221431133443',
   '12312422221431133413',
   '12322422112431133413',
   '12322422121411133433',
   '12322422121431133413',
   '12322422121431133443',
   '12322422121433113413',
   '21322422121431133413',
   '31222422121431133413',
   '123114112124222334433',
   '123114212124322334433',
   '123114212124422334333',
   '123114213134433224322',
   '123114312124122334233',
   '123114412124122334233',
   '123114412124222334333',
   '123114412124333334222',
   '123124222214331134133',
   '123124222214411334133',
   '123224221124111334333',
   '123224221124411334333',
   '123224221213431134133',
   '123224221214111334433',
   '123224221214111334333',
   '123224221214311334133',
   '123224221214311334433',
   '123224221214313134133',
   '123224221214331134433',
   '123224221214331134133',
   '123224221214411334333',
   '123224221214411334133',
   '132114212124322334133',
   '132114312124422334133',
   '132224221214311334133',
   '213224221214333113344',
   '231224221214311334133',
   '232124221214311334133',
   '312114222224311334133',
   '312214222214111334333',
   '312224221214311334433',
   '321224221214111334433',
   '1232242212143311334433',
   '1232242221214111334433',
   '2312242211243311334133',
   '12322422221214111334333',
   '123214222222214111334333',
   '123224222222221214111133343',
   '123224221214311334111111111111133',
   '123114212124333333333333333333322334433',
]

for ye in x:
   ye = ye.replace('4', '')
   level_order = ''

   ql, wl, el = 0, 0, 0
   for v in ye:
      if v == '1': ql +=1
      if v == '2': wl +=1
      if v == '3': el +=1
   
   skills = {
      '1': ql,
      '2': wl,
      '3': el
   }

   table = {
      '1': 'q',
      '2': 'w',
      '3': 'e'
   }

   count = [ [] for _ in range(max(ql, wl, el) + 1) ]
   for s in skills: count[-skills[s]-1].append(s)

   """ 
   Cause I'm gonna forget by tomorrow.
   1. iterate through count list, which stores values by frequency in spell string where most occuring (5 levels) is the zeroth list and the least occuring (0 levels) is the fifth list.

   2. If there are multiple spells with same frequency (level 18 champ has all 3 spells leveled 5 times), then iter through that and find the spell that has the earliest last occurence and append, by earliest last occurence first, to the level_order string.

   3. If there is only one spell in a count sub-list, add to string. 
   """
   for i, arr in enumerate(count):
      if len(arr) > 1:
         if i == max(ql, wl, el):
            for v in arr: level_order += table[v]
            continue
         o = {v: len(ye) - 1 - ye[::-1].index(v) for v in arr}
         s = sorted(o, key=lambda x: o[x])
         for u in s: level_order += table[u]
      elif len(arr) == 1:
         level_order += table[arr[0]]
   print(ye)
   print(max(ql, wl, el))
   print(count)
   print(level_order)
   # _singles = [x for x in skills if skills[x] == 1]
   # _zeros = [table[x] for x in skills if skills[x] == 0]

   # qwe = [0, 0, 0]
   # singles = ''
   # zeros = ''.join(_zeros)
   # for i in ye:
   #    qwe[int(i) - 1] += 1
   #    if i in _singles:
   #       singles += table[i]
   #       continue
      
   #    if qwe[int(i) - 1] == skills[i] and table[i] not in level_order: level_order += table[i]
   
   
   # print(level_order + singles + zeros)