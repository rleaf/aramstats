import os
""" 
Convert non-webp images in `route` path to webp images to `out` path
"""

route = './images'
out = './src/assets/challenge_icons'

def main():
   for file in os.listdir(route):
      champName = file.split('.')
      os.system(f'cwebp -q 70 {route}/{file} -o {out}/{champName[0]}.webp')

main()

   