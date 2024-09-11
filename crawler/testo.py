"""
Looking at numerical stability for the Welford mean.
https://www.johndcook.com/blog/standard_deviation/
"""

"""
Okay try three. Compute batch variance using sum of squares, then compute stream using welford's.
"""

import random
import statistics

n = 500
arr = [[random.randint(0, 100) for _ in range(n)] for __ in range(5)]
arr_flat = [x for o in arr for x in o]
i = 0
batch_var = []

# Sum of squares arguments
x_squared = 0
x_count = 0
sos_value = 0

# Arguments for Welford parameters
old_mean = 0
curr_mean = 0
old_var = 0
curr_var = 0

def welford_mean(m, x, k): 
   return m + (x - m) / k

def welford_variance(x, m, m_old, v_old):
   return v_old + (x - m_old) * (x - m)

def sum_of_squares(x_squared, x_count, i):
   # return (( i*x_squared ) - ( x_count**2 ))
   return (( x_squared ) - (( x_count**2 ) / i)) / (i - 1)

for o in arr:
   for x in o:
      i+=1
      
      if i == 1:
         curr_mean = x
      else:
         old_mean = curr_mean
         curr_mean = welford_mean(old_mean, x, i)

      old_var = curr_var
      curr_var = welford_variance(x, curr_mean, old_mean, old_var)

      x_squared += x ** 2
      x_count += x
      sos_value += (x - statistics.mean(arr_flat)) ** 2

      if i > 1:
         batch_var.append(curr_var / (i - 1))

print('batch variance: ', statistics.variance(batch_var))

print('        Mean: ', statistics.mean(arr_flat))
print('Welford Mean: ', curr_mean)

print('        Variance: ', statistics.variance(arr_flat))
print('Classic Variance: ', sos_value / (i - 1))
print('Welford Variance: ', curr_var / (i - 1))
print('    SoS Variance: ', sum_of_squares(x_squared, x_count, i))
# print('    SoS Variance: ', sum_of_squares(x_squared, x_count, i) / (i - 1))

