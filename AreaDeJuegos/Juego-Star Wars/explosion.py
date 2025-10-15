# explosion.py
import pygame
import random
import os

IMG_DIR = 'assets'

class Explosion(pygame.sprite.Sprite):
    def __init__(self, center, size=50, duration=20):
        super().__init__()
        self.size = size
        self.duration = duration
        self.frame = 0
        self.last_update = pygame.time.get_ticks()
        self.frame_rate = 50 # ms
        # Usar imagen PNG personalizada de explosion
        im_path = os.path.join(IMG_DIR, 'explosion.png')
        if os.path.exists(im_path):
            im = pygame.image.load(im_path).convert_alpha()
            self.image = pygame.transform.scale(im, (size, size))
            self.is_custom = True
        else:
            self.image = pygame.Surface((size, size), pygame.SRCALPHA)
            self.is_custom = False
            self.image.fill((0,0,0,0))
            for _ in range(10):
                r = size // 2
                x = random.randint(-r, r)
                y = random.randint(-r, r)
                col = random.choice([(255,255,0), (255,150,0), (200,200,200)])
                pygame.draw.circle(self.image, col, (r+x, r+y), random.randint(1,3))
        self.rect = self.image.get_rect(center=center)

    def update(self, *args):
        now = pygame.time.get_ticks()
        if now - self.last_update > self.frame_rate:
            self.last_update = now
            self.frame += 1
            if self.frame >= self.duration:
                self.kill()
            # Si no hay imagen personalizada, animar partículas
            elif not getattr(self, 'is_custom', False):
                self.image.fill((0,0,0,0)) # clear
                for _ in range(10):
                    r = self.size // 2
                    x = random.randint(-r, r)
                    y = random.randint(-r, r)
                    col = random.choice([(255,255,0), (255,150,0), (200,200,200)])
                    pygame.draw.circle(self.image, col, (r+x, r+y), random.randint(1,3))
