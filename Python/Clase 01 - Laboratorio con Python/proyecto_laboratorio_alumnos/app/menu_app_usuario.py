# menu_app_usuario.py
# -------------------
# Menú interactivo por consola para CRUD de usuarios.
# Todos los puntos de entrada capturan excepciones para que la app no se detenga.

from logger_base import logger
from usuario_dao import UsuarioDao
from usuario import Usuario


def mostrar_menu():
    print("\n=== Laboratorio de Usuarios ===")
    print("1) Listar usuarios")
    print("2) Agregar usuario")
    print("3) Actualizar usuario")
    print("4) Eliminar usuario")
    print("5) Salir")


def opcion_listar():
    try:
        usuarios = UsuarioDao.seleccionar()
        if not usuarios:
            print("No hay usuarios o no se pudo consultar.")
            return
        print("\n-- Lista de usuarios --")
        for u in usuarios:
            print(f"ID: {u.id_usuario} | Username: {u.username} | Password: {u.password}")
    except Exception as e:
        logger.error(f"Error en opción Listar: {e}")
        print("Ocurrió un error al listar. Revisá los logs.")


def opcion_agregar():
    try:
        username = input("Ingrese username: ").strip()
        password = input("Ingrese password: ").strip()
        if not username or not password:
            print("Username y password son obligatorios.")
            return
        nuevo = Usuario(username=username, password=password)
        id_gen = UsuarioDao.insertar(nuevo)
        if id_gen is None:
            print("No se pudo insertar el usuario. Revisá los logs.")
        else:
            print(f"Usuario insertado con ID: {id_gen}")
    except Exception as e:
        logger.error(f"Error en opción Agregar: {e}")
        print("Ocurrió un error al agregar. Revisá los logs.")


def opcion_actualizar():
    try:
        id_txt = input("Ingrese ID del usuario a actualizar: ").strip()
        if not id_txt.isdigit():
            print("El ID debe ser numérico.")
            return
        id_usuario = int(id_txt)
        username = input("Nuevo username: ").strip()
        password = input("Nueva password: ").strip()
        if not username or not password:
            print("Username y password son obligatorios.")
            return
        u = Usuario(id_usuario=id_usuario, username=username, password=password)
        filas = UsuarioDao.actualizar(u)
        if filas == 0:
            print("No se actualizó ningún registro. Verificá el ID.")
        else:
            print("Usuario actualizado correctamente.")
    except Exception as e:
        logger.error(f"Error en opción Actualizar: {e}")
        print("Ocurrió un error al actualizar. Revisá los logs.")


def opcion_eliminar():
    try:
        id_txt = input("Ingrese ID del usuario a eliminar: ").strip()
        if not id_txt.isdigit():
            print("El ID debe ser numérico.")
            return
        id_usuario = int(id_txt)
        confirmar = input(f"¿Confirmás eliminar el usuario {id_usuario}? (s/n): ").strip().lower()
        if confirmar != "s":
            print("Operación cancelada.")
            return
        u = Usuario(id_usuario=id_usuario)
        filas = UsuarioDao.eliminar(u)
        if filas == 0:
            print("No se eliminó ningún registro. Verificá el ID.")
        else:
            print("Usuario eliminado correctamente.")
    except Exception as e:
        logger.error(f"Error en opción Eliminar: {e}")
        print("Ocurrió un error al eliminar. Revisá los logs.")


def main():
    while True:
        mostrar_menu()
        opcion = input("Elegí una opción (1-5): ").strip()
        if opcion == "1":
            opcion_listar()
        elif opcion == "2":
            opcion_agregar()
        elif opcion == "3":
            opcion_actualizar()
        elif opcion == "4":
            opcion_eliminar()
        elif opcion == "5":
            print("¡Hasta luego!")
            break
        else:
            print("Opción inválida. Intentá nuevamente.")


if __name__ == "__main__":
    # Punto de entrada del programa.
    # Si hay errores de conexión, las funciones internas lo van a loggear y el menú seguirá operativo.
    main()
