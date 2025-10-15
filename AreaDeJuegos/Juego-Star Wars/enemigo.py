# enemigo.py
import pygame
import random
from constantes import *

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y, speed=1.0, hp=1):
        super().__init__()
        try:
            im = pygame.image.load(ENEMY_IMG).convert_alpha()
            self.image = pygame.transform.scale(im, (48, 48))
        except Exception:
            self.image = pygame.Surface((40,40), pygame.SRCALPHA)
            pygame.draw.rect(self.image, (255,80,80), (0,0,40,40))
        self.rect = self.image.get_rect(center=(x, y))
        self.speed = speed
        self.hp = 1  # Siempre mueren de un disparo
        self.max_hp = 1

    def update(self, *args):
        self.rect.y += self.speed
        if self.rect.top > SCREEN_H:
            self.kill()  # Se elimina si sale de la pantalla

    def take_damage(self, amount):
        self.hp -= amount
        return self.hp <= 0

    def maybe_shoot(self):
        # 1 en 200 chance por frame
        return random.randint(0, 200) == 0
