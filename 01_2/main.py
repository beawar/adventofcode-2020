import numpy as np

f = open("input.txt", "r")
entries = np.array([int(x) for x in f], dtype='i')

i1 = 0
for n1 in entries:
    i2 = i1 + 1
    while i2 < len(entries):
        n2 = entries[i2]
        if n1 + n2 == 2020:
            arr1 = [n1, n2]
            print('Res 1: ')
            print(arr1)
            print('Multiplication 1: ')
            print(n1*n2)
        i3 = int(i2 + 1)
        entriesFor3 = entries[i3:]
        filter_arr2 = entriesFor3 + n1 + n2 == 2020
        arr2 = entriesFor3[filter_arr2]
        if len(arr2) > 0:
            print('Res 2: ')
            print(np.concatenate(([n1, n2], arr2)))
            print('Multiplication 2: ')
            print([n1*n2*n3 for n3 in arr2])
        i2 += 1
    i1 += 1