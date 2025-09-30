#Bool contiene los valores True y False
#Los tipos numericos, es false para el 0, y true para los demás valores

valor = 0
resultado = bool(valor)
print(f'valor: {valor}, Resultado: {resultado}')

valor = 0.1
resultado = bool(valor)
print(f'valor: {valor}, Resultado: {resultado}')

#Tipo String -> False '', True demás valores
valor = ''
resultado = bool(valor)
print(f'valor: {valor}, Resultado: {resultado}')

valor = 'Hola'
resultado = bool(valor)
print(f'valor: {valor}, Resultado: {resultado}')

#Tipo colecciones -> false para colecciones vacías
#Tipo colecciones -> True para los demás

valor = []
resultado = bool(valor)
print(f'valor: {valor}, Resultado: {resultado}')

valor = [2,3,4]
resultado = bool(valor)
print(f'valor: {valor}, Resultado: {resultado}')

# Tupla
valor = ()
resultado = bool(valor)
print(f'valor: {valor}, Resultado: {resultado}')

valor = (5,)
resultado = bool(valor)
print(f'valor: {valor}, Resultado: {resultado}')

# Diccionario

valor = {}
resultado = bool(valor)
print(f'valor: {valor}, Resultado: {resultado}')

valor = {'Nombre': 'Juan'}
resultado = bool(valor)
print(f'valor: {valor}, Resultado: {resultado}')

#Sentencias de control con bool

if '':
    print('Regresa verdadero')
else:
    print('Regresa falso')

#ciclos
variable = 3
while variable:
    print('Regresa verdadero')
    break
else:
    ('Regresa falso')


