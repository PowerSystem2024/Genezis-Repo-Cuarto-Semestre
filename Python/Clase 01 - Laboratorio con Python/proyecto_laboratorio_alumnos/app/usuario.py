# usuario.py
# ----------
# Clase de dominio que representa a un Usuario.
# Mantiene id, username y password. __str__ para depurar/imprimir.

class Usuario:
    def __init__(self, id_usuario=None, username=None, password=None):
        self.id_usuario = id_usuario
        self.username = username
        self.password = password

    def __str__(self):
        # Útil para logs y debug
        return f"Usuario(id={self.id_usuario}, username='{self.username}', password='{self.password}')"
