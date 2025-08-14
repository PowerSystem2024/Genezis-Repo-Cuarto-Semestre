# usuario_dao.py
# --------------
# Implementa las operaciones CRUD contra la tabla 'usuario'.
# Siempre maneja excepciones y devuelve resultados seguros.

from logger_base import logger
from cursor_del_pool import CursorDelPool
from usuario import Usuario


class UsuarioDao:
    # Consultas parametrizadas (evitan SQL Injection)
    SELECCIONAR = "SELECT id_usuario, username, password FROM usuario ORDER BY id_usuario;"
    INSERTAR = "INSERT INTO usuario (username, password) VALUES (%s, %s) RETURNING id_usuario;"
    ACTUALIZAR = "UPDATE usuario SET username = %s, password = %s WHERE id_usuario = %s;"
    ELIMINAR = "DELETE FROM usuario WHERE id_usuario = %s;"

    @classmethod
    def seleccionar(cls):
        """
        Devuelve una lista de objetos Usuario.
        Si algo falla, devuelve lista vacía.
        """
        try:
            with CursorDelPool() as cursor:
                if cursor is None:
                    logger.error("No se pudo obtener cursor para SELECCIONAR")
                    return []
                cursor.execute(cls.SELECCIONAR)
                registros = cursor.fetchall()  # lista de tuplas
                usuarios = [Usuario(id_usuario=r[0], username=r[1], password=r[2]) for r in registros]
                logger.info(f"Usuarios recuperados: {len(usuarios)}")
                return usuarios
        except Exception as e:
            logger.error(f"Error al seleccionar usuarios: {e}")
            return []

    @classmethod
    def insertar(cls, usuario: Usuario):
        """
        Inserta un usuario y devuelve el id generado.
        Si falla, devuelve None.
        """
        try:
            with CursorDelPool() as cursor:
                if cursor is None:
                    logger.error("No se pudo obtener cursor para INSERTAR")
                    return None
                cursor.execute(cls.INSERTAR, (usuario.username, usuario.password))
                id_generado = cursor.fetchone()[0]  # Recuperamos el id creado por RETURNING
                logger.info(f"Usuario insertado con id {id_generado}")
                return id_generado
        except Exception as e:
            logger.error(f"Error al insertar usuario: {e}")
            return None

    @classmethod
    def actualizar(cls, usuario: Usuario):
        """
        Actualiza un usuario por id. Devuelve cantidad de filas afectadas.
        Si falla, devuelve 0.
        """
        try:
            with CursorDelPool() as cursor:
                if cursor is None:
                    logger.error("No se pudo obtener cursor para ACTUALIZAR")
                    return 0
                cursor.execute(cls.ACTUALIZAR, (usuario.username, usuario.password, usuario.id_usuario))
                filas = cursor.rowcount
                logger.info(f"Usuario actualizado, filas afectadas: {filas}")
                return filas
        except Exception as e:
            logger.error(f"Error al actualizar usuario: {e}")
            return 0

    @classmethod
    def eliminar(cls, usuario: Usuario):
        """
        Elimina un usuario por id. Devuelve cantidad de filas afectadas.
        Si falla, devuelve 0.
        """
        try:
            with CursorDelPool() as cursor:
                if cursor is None:
                    logger.error("No se pudo obtener cursor para ELIMINAR")
                    return 0
                cursor.execute(cls.ELIMINAR, (usuario.id_usuario,))
                filas = cursor.rowcount
                logger.info(f"Usuario eliminado, filas afectadas: {filas}")
                return filas
        except Exception as e:
            logger.error(f"Error al eliminar usuario: {e}")
            return 0
