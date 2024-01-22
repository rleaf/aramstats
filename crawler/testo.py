""" 
This file is just used to test code and is not used anywhere.
"""

x = '121'
y = '112'

print(''.join(sorted(x)))
print(''.join(sorted(y)))

if len(set(starting_levels)) < 3:
   # Abnormal leveling (112)
   one = list(filter(lambda x: str.count(x) == 1, starting_levels))[0]
else:
   # Normal leveling (123)
   pass