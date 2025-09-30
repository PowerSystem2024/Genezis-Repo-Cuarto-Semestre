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

        def mover(self,dx,dy):
            self.shape.x += dx
            self.shape.y += dy

        def lanzar_laser(self):
            laser = Laser(self.shape.centerx, self.shape.top)
            self.lasers.append(laser)

        def recibir_dano(self):
            self.energia -= 10
            if self.energia <= 0:
                self.energia = 0
                return False
            return True

        def dibujar(self, screen):
            screen.blit(self.image, self.shape.topleft)
            for laser in self.lasers:
                laser.dibujar(screen)
                laser.mover()

            # dibujar la barra de energia
            pygame.draw.rect(screen, (255, 0, 0), (10, 10, 100, 10))  # barra de fondo
            pygame.draw.rect(screen, (0, 255, 0), (10, 10, self.energia, 10))

        class Enemigo:
            def __init__(self, x, y):
                self.image = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'enemigo1.png'))
                self.image = pygame.transform.scale(self.image, (80, 80))
                self.rect = self.image.get_rect(topleft=(x, y))

            def mover(self):
                screen.blit(self.image, self.rect.topleft)

        class Laser:
            def __init__(self, x, y):
                self.image = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'laser.png'))
                self.rect = self.image.get_rect(center=(x, y))

            def mover(self):
                self.rect = self.image.get_rect(center=(x, y))

            def dibujar(self, screen):
                screen.blit(self.image, self.rect.topleft)

        class Explosion:
            def __init__(self, x, y):
                self.images = [pygame.image.load(os.path.join(ASSETS_PATH, 'images', f'regularExplosion0{i:2}.png')) for
                               i in range(9)]
                self.index = 0  # indice de la animacion
                self.image = self.images[self.index]
                self.rect = self.image.get_rect(center=(x, y))
                self.frame_rate = 0  # contador de los frames de la animacion
                self.max_frames = 20  # frames por imagen

            def actualizar(self):
                # actualizar la animacion
                self.frame_rate += 1
                if self.frame_rate >= len(self.images):
                    return False # restorna en false por que aca termina la animacion
                self.image = self.images[self.index]
                return True

        def dibujar(self, screen):
            screen.blit(self.image, self.shape.topleft)
