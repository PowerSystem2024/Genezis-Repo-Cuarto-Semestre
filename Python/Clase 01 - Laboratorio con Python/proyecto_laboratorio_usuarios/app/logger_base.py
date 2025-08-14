# logger_base.py
# ----------------
# Configuración centralizada de logging para toda la app.
# Usamos un logger 'laboratorio_usuarios' con formato claro de tiempo, nivel y ubicación.

import logging

logger = logging.getLogger("laboratorio_usuarios")

# Evitamos duplicar handlers si este módulo se importa más de una vez
if not logger.handlers:
    logger.setLevel(logging.INFO)  # Cambia a DEBUG si querés más detalle

    # Salida a consola (StreamHandler)
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)

    # Formato del mensaje
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-7s | %(name)s | %(filename)s:%(lineno)d | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    console_handler.setFormatter(formatter)

    logger.addHandler(console_handler)

# Con este import en otros módulos:
# from logger_base import logger
# ya tenés el logger listo para usar: logger.info(...), logger.error(...), etc.
