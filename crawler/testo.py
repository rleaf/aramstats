import os
import multiprocessing as mp
from multiprocessing import Pool
import time
import pprint
# from pymongo import MongoClient
# from dotenv import load_dotenv

# start = time.perf_counter()
# load_dotenv()
# pp = pprint.PrettyPrinter(indent=4)

def do_something(x):
   return sum(x)
   # q = 0
   # for o in x:
   #    q += o
   # return q

if __name__ == "__main__":
   # db = MongoClient(os.environ['DB_CONNECTION_STRING'])['aramstats']
   # coll = db['NA1_puuids']

   # for puuid in coll.find(limit=10):
   #    print(puuid)

   data = [[x, x+4] for x in range(10)]
   print(data)
   with Pool() as p:
      result = p.map(do_something, data)
   print(result)

      
   # finish = time.perf_counter()

   # print(f'Finished in {round(finish-start, 2)} second(s)')

   # def partition_batch(list):
   #    # partitioned_batch = [batch[i*5 : i*5+5] for i in range(0, len(batch) //  5)] same thing
   #    batch = []
   #    for i in range(0, len(list) //  5):
   #       batch.append(list[i*5 : i*5+5])
   #    return batch

   # # PARTITION_SIZE = 5 # Number of puuids in a partition
   # PARTITIONS = 4 # How many partitions in a batch
   # BATCH_SIZE = 20 # Number of puuids in a batch 

   # def get_batches():
   #    partition = []
   #    for i, puuid in enumerate(coll.find(skip=1156640)):
   #       if i % BATCH_SIZE == 0 and i > 0:
   #          yield partition
   #          del partition[:]
   #       partition.append(puuid)
   #    yield partition





   # for batch in get_batches():
   #    if (BATCH_SIZE % PARTITIONS) != 0:
   #       raise ValueError('Batch size must be divisible by partitions')
         
   #    chunk = len(batch) // PARTITIONS
   #    partitioned_batch = [batch[i : i+len(batch) // PARTITIONS] for i in range(0, len(batch), len(batch) // PARTITIONS)]
   #    # with Pool() as p:
   #    #    bin = p.map(do_something, partitioned_batch)
   #    #    # coll.bulk_write(bin)
   #    #    print(bin)
   #    pp.pprint(partitioned_batch)
   #    time.sleep(3)

   # batch = []
   # for partition in get_batches(5):
   #    batch.append(partition)
   #    if len(batch) == BATCH_SIZE:
   #       pp.pprint(batch)
   #       batch = []
   #       time.sleep(3)
   






   # pp.pprint(batch)
   # with Pool() as p:
   #    bin = p.map(do_something, batch)
   #    # coll.bulk_write(bin)
   #    print(bin)
   # print('toads')

   # def batch_partitions():
   #    for i, partition in enumerate(create_partitions()):
   #       batch = []
   #       if i % 5 == 0 and i > 0:
   #          yield batch
   #       batch.append(partition)
   #       print('@@@@@@ PARTITION', partition)
   #       time.sleep(1)
   # print('toads')