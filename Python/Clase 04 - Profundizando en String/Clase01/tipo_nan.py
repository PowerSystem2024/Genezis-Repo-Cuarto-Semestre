import math
from decimal import Decimal

# NaN (Not a Number)

a = float('NaN')
print(f'a: {a}')

#Modulo math
a = float('123')
print(f'Es de tipo NaN? {math.isnan(a)}')

#Modulo decimal
a = Decimal('NaN')
print(f'Es de tipo NaN? {math.isnan(a)}')