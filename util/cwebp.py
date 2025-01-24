import os
""" 
Convert non-webp images in `route` path to webp images to `out` path
"""

route = './util/images'
out = './util/out'

def main():
   i = 10
   for file in os.listdir(route):
      champName = file.split('.')
      os.system(f'cwebp -q 70 {route}/{file} -o {out}/{i}.webp')
      i+=1

main()

   