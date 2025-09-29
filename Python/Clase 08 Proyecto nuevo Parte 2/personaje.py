import pygame
import os # Prooporciona funcionalidades para interecatuar con el sistema
from constantes import ASSETS_PATH

class Personaje:
    def __init__(self, x, y):
        # Construye la ruta a la imagen del personaje
        self.image = pygame.image.load(os.path.join(ASSETS_PATH, 'images', "personaje1.png"))
        self.image = pygame.transform.scale(self.image, (95, 95))
        self.shape = self.image.get_rect(center = (x, y))
        self.lasers = []
        self.energia = 100 # barra de energia