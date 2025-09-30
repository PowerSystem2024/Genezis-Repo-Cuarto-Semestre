#Tipo float

a = 3.0
print(f'a: {a:.2f}')

# Constructor de tipo float -> puede recibir enteros y string

a = float(10) # Le paso un tipo entero
a = float('10') # Le paso un tipo string
print(f'a: {a:.2f}')

# Notación exponencial (valores positivos o negativos)
a = 3e5
print(f'a: {a:.2f}')

a = 3e-5
print(f'a: {a:.5f}')

# Cualquier calculo que incluye un float, todo cambia a float

a = 4.0 + 5
print(a)
print(type(a))