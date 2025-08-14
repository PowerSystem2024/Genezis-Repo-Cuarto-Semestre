# cursor_del_pool.py
# ------------------
# Implementa un manejador de contexto para trabajar con "with".
# Abre conexión y cursor, y asegura commit/rollback y liberación de recursos.

from logger_base import logger
from conexion import Conexion


class CursorDelPool:
    def __init__(self):
        # Guardamos referencias para usarlas en __exit__
        self.conn = None
        self.cursor = None

    def __enter__(self):
        """
        Intenta obtener conexión y cursor.
        Si algo sale mal, devuelve None para que el llamador lo maneje.
        """
        try:
            self.conn = Conexion.obtenerConexion()
            if self.conn is None:
                logger.error("No se pudo abrir conexión (conn es None)")
                return None
            self.cursor = self.conn.cursor()
            return self.cursor
        except Exception as e:
            logger.error(f"Error al abrir cursor: {e}")
            # Importante: devolvemos None para no romper el 'with'
            return None

    def __exit__(self, tipo_excepcion, valor_excepcion, detalle):
        """
        Si hubo excepción dentro del bloque with → rollback.
        Si no, commit.
        Siempre cerramos cursor y liberamos la conexión.
        """
        try:
            if self.conn:
                if tipo_excepcion:
                    # Hubo un error en el bloque with
                    self.conn.rollback()
                    logger.error(f"Transacción revertida por error: {valor_excepcion}")
                else:
                    # Todo OK
                    self.conn.commit()
                # Cerrar cursor si existe
                if self.cursor:
                    self.cursor.close()
                # Devolver conexión al pool
                Conexion.liberarConexion(self.conn)
        except Exception as e:
            logger.error(f"Error al cerrar cursor/conexión: {e}")
        # Al retornar False, cualquier excepción original seguiría propagándose.
        # Aquí no retornamos nada (equivale a None) para no alterar el comportamiento estándar.
