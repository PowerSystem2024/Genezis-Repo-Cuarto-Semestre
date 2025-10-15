# personaje.py
import pygame
from constantes import *

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        try:
            im = pygame.image.load(PLAYER_IMG).convert_alpha()
            self.image = pygame.transform.scale(im, (64, 64))
        except Exception:
            self.image = pygame.Surface((50,50), pygame.SRCALPHA)
            pygame.draw.polygon(self.image, (200,200,255), [(25,0), (0,50), (50,50)])
        self.rect = self.image.get_rect(midbottom=(SCREEN_W // 2, SCREEN_H - 20))
        self.speed = PLAYER_SPEED
        self.max_hp = PLAYER_HP
        self.hp = self.max_hp
        self.shoot_cooldown = 0

    def update(self, keys):
        # Permite control con flechas y WASD
        if (keys[pygame.K_LEFT] or keys[pygame.K_a]) and self.rect.left > 0:
            self.rect.x -= self.speed
        if (keys[pygame.K_RIGHT] or keys[pygame.K_d]) and self.rect.right < SCREEN_W:
            self.rect.x += self.speed
        if (keys[pygame.K_UP] or keys[pygame.K_w]) and self.rect.top > 0:
            self.rect.y -= self.speed
        if (keys[pygame.K_DOWN] or keys[pygame.K_s]) and self.rect.bottom < SCREEN_H:
            self.rect.y += self.speed
        if self.shoot_cooldown > 0:
            self.shoot_cooldown -= 1

    def can_shoot(self):
        return self.shoot_cooldown == 0

    def set_cooldown(self, frames):
        self.shoot_cooldown = frames

    def take_damage(self, amount):
        self.hp -= amount
        if self.hp < 0:
            self.hp = 0
        return self.hp == 0

    def heal_full(self):
        self.hp = self.max_hp

class Repair(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        try:
            im = pygame.image.load(os.path.join(ASSETS_DIR, 'ki.png')).convert_alpha()
            self.image = pygame.transform.scale(im, (32, 32))
        except Exception:
            self.image = pygame.Surface((32,32), pygame.SRCALPHA)
            pygame.draw.circle(self.image, (80,255,80), (16,16), 16)
            pygame.draw.line(self.image, (255,255,255), (8,16), (24,16), 2)
        self.rect = self.image.get_rect(center=(x, y))
        self.dy = 2
    def update(self):
        self.rect.y += self.dy
        if self.rect.top > SCREEN_H:
            self.kill()
