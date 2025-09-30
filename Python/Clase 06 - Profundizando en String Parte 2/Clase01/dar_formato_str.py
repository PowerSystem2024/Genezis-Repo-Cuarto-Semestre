# dar formato a un string

nombre = "Marcos"
edad = 28
mensaje_con_formato = 'Mi nombre es %s y tengo %d años'%(nombre, edad)

persona = ('Roger', 'Federer', 900000000.00)
mensaje_con_formato = 'Hola %s %s . Tu sueldo es %.2f' # % persona
#print(mensaje_con_formato % persona)

nombre = 'Rafa'
edad = 36
sueldo = 3000000
#mensaje_con_formato = 'Nombre {}, edad {}, sueldo {:.2f}'.format(nombre, edad, sueldo)

#mensaje = 'Nombre {0}, edad {1}, sueldo {2:.2f}'.format(nombre, edad, sueldo)
#print(mensaje)

mensaje = 'Nombre {n}, edad {e}, sueldo {s:.2f}'.format(n=nombre, e=edad, s=sueldo)
#print(mensaje)

diccionario = {'nombre':'Ivan', 'edad':35, 'sueldo':8000.00}
mensaje = 'Nombre {dic[nombre]} Edad {dic[edad]} Sueldo {dic[sueldo]:.2f}'.format(dic=diccionario)
print(mensaje)