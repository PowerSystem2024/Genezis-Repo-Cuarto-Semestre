# conexion.py
# -----------
# Crea y administra un Pool de conexiones a PostgreSQL.
# Importante: ante errores, NO abortamos la ejecución; registramos el error y devolvemos valores seguros.

from psycopg2 import pool
from logger_base import logger


class Conexion:
    # >>> Ajustá estos valores a tu entorno <<<
    DATABASE = "laboratorio_usuarios"
    USERNAME = "lab_user"          # o tu usuario de postgres
    PASSWORD = "lab_password"      # tu contraseña
    DB_PORT = "5432"
    HOST = "localhost"

    # Tamaño del pool
    MIN_CON = 1
    MAX_CON = 5

    # Referencia al pool (singleton a nivel de clase)
    _pool = None

    @classmethod
    def obtenerPool(cls):
        """
        Crea el pool la primera vez que se llama.
        Si falla, loggea el error y deja _pool en None.
        """
        if cls._pool is None:
            try:
                cls._pool = pool.SimpleConnectionPool(
                    cls.MIN_CON,
                    cls.MAX_CON,
                    host=cls.HOST,
                    user=cls.USERNAME,
                    password=cls.PASSWORD,
                    port=cls.DB_PORT,
                    database=cls.DATABASE,
                )
                logger.info("Pool de conexiones creado exitosamente")
            except Exception as e:
                logger.error(f"Error al crear el pool de conexiones: {e}")
                cls._pool = None
        return cls._pool

    @classmethod
    def obtenerConexion(cls):
        """
        Obtiene una conexión del pool. Si no hay pool o falla, devuelve None.
        """
        try:
            pool_obj = cls.obtenerPool()
            if pool_obj is None:
                logger.error("No se pudo obtener conexión: el pool no está disponible")
                return None
            return pool_obj.getconn()
        except Exception as e:
            logger.error(f"Error al obtener conexión: {e}")
            return None

    @classmethod
    def liberarConexion(cls, conexion):
        """
        Devuelve la conexión al pool. Si falla, loggea el error y continúa.
        """
        try:
            if conexion is None:
                return
            pool_obj = cls.obtenerPool()
            if pool_obj:
                pool_obj.putconn(conexion)
        except Exception as e:
            logger.error(f"Error al liberar conexión: {e}")

    @classmethod
    def cerrarConexiones(cls):
        """
        Cierra todas las conexiones del pool. Seguro frente a errores.
        """
        try:
            pool_obj = cls.obtenerPool()
            if pool_obj:
                pool_obj.closeall()
                logger.info("Conexiones del pool cerradas")
        except Exception as e:
            logger.error(f"Error al cerrar conexiones: {e}")
