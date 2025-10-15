import pygame
import sys
import random
import os
from constantes import *
from personaje import Player
from enemigo import Enemy
from explosion import Explosion

pygame.init()
screen = pygame.display.set_mode((SCREEN_W, SCREEN_H), pygame.FULLSCREEN)
pygame.display.set_caption("Star Wars Shooter - TUP (Enhanced)")
clock = pygame.time.Clock()
font = pygame.font.SysFont(None, 28)

def load_backgrounds():
    bgs = []
    assets_bg = [f for f in os.listdir(IMG_DIR) if f.lower().endswith('.webp')]
    assets_bg.sort()
    if not assets_bg:
        for path in BACKGROUNDS:
            try:
                img = pygame.image.load(path).convert()
                bgs.append(pygame.transform.scale(img, (SCREEN_W, SCREEN_H)))
            except Exception:
                surf = pygame.Surface((SCREEN_W, SCREEN_H))
                surf.fill((5,5,20))
                for i in range(160):
                    x = random.randrange(0, SCREEN_W)
                    y = random.randrange(0, SCREEN_H)
                    pygame.draw.circle(surf, (200,200,255), (x,y), random.choice([1,1,2]))
                bgs.append(surf)
    else:
        for fname in assets_bg:
            fpath = os.path.join(IMG_DIR, fname)
            try:
                img = pygame.image.load(fpath).convert()
                bgs.append(pygame.transform.scale(img, (SCREEN_W, SCREEN_H)))
            except Exception:
                surf = pygame.Surface((SCREEN_W, SCREEN_H))
                surf.fill((5,5,20))
                for i in range(160):
                    x = random.randrange(0, SCREEN_W)
                    y = random.randrange(0, SCREEN_H)
                    pygame.draw.circle(surf, (200,200,255), (x,y), random.choice([1,1,2]))
                bgs.append(surf)
    return bgs

backgrounds = load_backgrounds()
bg_index = 0

def load_start_image():
    try:
        im = pygame.image.load(START_IMG).convert_alpha()
        return pygame.transform.scale(im, (400,180))
    except Exception:
        surf = pygame.Surface((400,180), pygame.SRCALPHA)
        pygame.draw.rect(surf, (10,10,30), (0,0,400,180))
        pygame.draw.rect(surf, (255,255,255), (6,6,388,168), 2)
        f = pygame.font.SysFont(None, 40)
        txt = f.render("STAR WARS SHOOTER", True, (200,200,255))
        surf.blit(txt, (40,60))
        return surf

start_image = load_start_image()

def load_sound(path):
    try:
        return pygame.mixer.Sound(path)
    except Exception:
        return None

laser_snd = load_sound(LASER_SOUND)
expl_snd = load_sound(EXPLOSION_SOUND)
try:
    if os.path.exists(MUSIC):
        pygame.mixer.music.load(MUSIC)
        pygame.mixer.music.set_volume(0.5)
        pygame.mixer.music.play(-1)
except Exception:
    pass

player_group = pygame.sprite.GroupSingle()
player = Player()
player_group.add(player)

player_bullets = pygame.sprite.Group()
enemy_bullets = pygame.sprite.Group()
enemies = pygame.sprite.Group()
explosions = pygame.sprite.Group()
repairs = pygame.sprite.Group()

REPAIR_SPAWN_INTERVAL = 600
repair_spawn_timer = 0
REPAIR_AMOUNT = 40

class Bullet(pygame.sprite.Sprite):
    def __init__(self, pos, dy=-8, owner="player", damage=1):
        super().__init__()
        self.owner = owner
        self.damage = damage
        try:
            im = pygame.image.load(os.path.join(IMG_DIR, 'bullet.png')).convert_alpha()
            self.image = pygame.transform.scale(im, (12, 24))
        except Exception:
            self.image = pygame.Surface((6,14), pygame.SRCALPHA)
            col = (180,255,180) if owner=="player" else (255,120,120)
            pygame.draw.rect(self.image, col, (0,0,6,14))
        self.rect = self.image.get_rect(center=pos)
        self.dy = dy

    def update(self, *args):
        self.rect.y += self.dy
        if self.rect.bottom < 0 or self.rect.top > SCREEN_H:
            self.kill()

class Repair(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        try:
            im = pygame.image.load(os.path.join(IMG_DIR, 'HealItem.png')).convert_alpha()
            self.image = pygame.transform.scale(im, (28, 28))
        except Exception:
            self.image = pygame.Surface((24, 24), pygame.SRCALPHA)
            pygame.draw.circle(self.image, (100, 255, 100), (12, 12), 12)
        self.rect = self.image.get_rect(center=(x, y))
        self.dy = 2

    def update(self, *args):
        self.rect.y += self.dy
        if self.rect.top > SCREEN_H:
            self.kill()

score = 0
lives = 3
level = 1
game_over = False
show_start = True
level_cooldown = 0  
enemy_spawn_timer = 0
ENEMY_SPAWN_INTERVAL = 45  
MAX_ENEMIES = 10  

def draw_text(surf, text, pos, color=(255,255,255)):
    img = font.render(text, True, color)
    surf.blit(img, pos)

def draw_hp_bar(surf, x, y, w, h, current, maximum):
    pygame.draw.rect(surf, (220,220,220), (x-2,y-2,w+4,h+4))
    pygame.draw.rect(surf, (40,40,40), (x,y,w,h))
    ratio = max(0, current)/maximum
    inner_w = int(w*ratio)
    col = (int(255*(1-ratio)), int(255*ratio), 80)
    pygame.draw.rect(surf, col, (x,y,inner_w,h))

# ---- FUNCION DEL MENU DE PAUSA ----
def mostrar_menu_pausa(pantalla, fuente):
    pausado = True
    while pausado:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_RETURN:  # Reanudar
                    pausado = False
                elif event.key == pygame.K_q:  # Volver al inicio
                    return "menu_principal"

        # Fondo semitransparente sobre el juego
        overlay = pygame.Surface((SCREEN_W, SCREEN_H))
        overlay.set_alpha(180)
        overlay.fill((0, 0, 0))
        pantalla.blit(overlay, (0, 0))

        texto_pausa = fuente.render("PAUSA", True, (255, 255, 255))
        texto_continuar = fuente.render("ENTER - Reanudar", True, (200, 200, 200))
        texto_salir = fuente.render("Q - Volver al menú principal", True, (200, 200, 200))
        pantalla.blit(texto_pausa, (SCREEN_W//2 - texto_pausa.get_width()//2, 250))
        pantalla.blit(texto_continuar, (SCREEN_W//2 - texto_continuar.get_width()//2, 330))
        pantalla.blit(texto_salir, (SCREEN_W//2 - texto_salir.get_width()//2, 370))

        pygame.display.flip()
        pygame.time.Clock().tick(15)
    return None
# -----------------------------------

# main loop
while True:
    dt = clock.tick(FPS)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.KEYDOWN:
            if show_start and event.key == pygame.K_RETURN:
                show_start = False
            if game_over and event.key == pygame.K_r:
                enemies.empty()
                player_bullets.empty()
                enemy_bullets.empty()
                explosions.empty()
                repairs.empty()
                player.heal_full()
                player.rect.midbottom = (SCREEN_W//2, SCREEN_H-20)
                score = 0
                lives = 3
                level = 1
                bg_index = 0
                game_over = False

            # ---- NUEVO: menú pausa con ESC ----
            if not show_start and not game_over and event.key == pygame.K_ESCAPE:
                resultado = mostrar_menu_pausa(screen, font)
                if resultado == "menu_principal":
                    show_start = True
                    enemies.empty()
                    player_bullets.empty()
                    enemy_bullets.empty()
                    explosions.empty()
                    repairs.empty()
                    player.heal_full()
                    player.rect.midbottom = (SCREEN_W//2, SCREEN_H-20)
                    score = 0
                    lives = 3
                    level = 1
                    bg_index = 0
                    game_over = False
                    continue
            # -----------------------------------

    keys = pygame.key.get_pressed()

    if show_start:
        screen.fill((0,0,0))
        try:
            im = pygame.image.load(START_IMG).convert_alpha()
            im = pygame.transform.scale(im, (SCREEN_W, SCREEN_H))
            screen.blit(im, (0,0))
        except Exception:
            pass
        overlay = pygame.Surface((SCREEN_W, 220), pygame.SRCALPHA)
        overlay.fill((10, 10, 30, 180))
        screen.blit(overlay, (0, SCREEN_H//2 - 110))
        title_font = pygame.font.SysFont(None, 64)
        title = title_font.render("STAR WARS SHOOTER", True, (200,200,255))
        screen.blit(title, (SCREEN_W//2 - title.get_width()//2, SCREEN_H//2 - 90))
        draw_text(screen, "Presiona ENTER para iniciar", (SCREEN_W//2 - 140, SCREEN_H//2 - 30))
        draw_text(screen, "Controles: WASD o flechas para mover, SPACE disparar", (SCREEN_W//2 - 200, SCREEN_H//2 + 10))
        draw_text(screen, "Recoge los kits para reparar la nave", (SCREEN_W//2 - 170, SCREEN_H//2 + 50))
        draw_text(screen, "Y destruye las naves enemigas", (SCREEN_W//2 - 170, SCREEN_H//2 + 90))
        pygame.display.flip()
        continue

    if not game_over:
        player_group.update(keys)

        if keys[pygame.K_SPACE] and player.can_shoot():
            b = Bullet(player.rect.midtop, dy=-12, owner="player", damage=1)
            player_bullets.add(b)
            player.set_cooldown(10)
            if laser_snd:
                laser_snd.play()

        enemies.update()
        for e in enemies.sprites():
            if e.maybe_shoot():
                b = Bullet(e.rect.midbottom, dy=6, owner="enemy", damage=10)
                enemy_bullets.add(b)

        player_bullets.update()
        enemy_bullets.update()
        explosions.update()

        enemy_spawn_timer += 1
        if enemy_spawn_timer >= ENEMY_SPAWN_INTERVAL and len(enemies) < MAX_ENEMIES:
            x = random.randint(40, SCREEN_W-40)
            y = random.randint(-60, -20)
            e = Enemy(x, y, speed=random.uniform(1.5, 3.5), hp=1+level//3)
            if not any(e.rect.colliderect(other.rect) for other in enemies):
                enemies.add(e)
            enemy_spawn_timer = 0

        repair_spawn_timer += 1
        if repair_spawn_timer >= REPAIR_SPAWN_INTERVAL:
            rx = random.randint(40, SCREEN_W-40)
            ry = random.randint(-60, -20)
            repair = Repair(rx, ry)
            repairs.add(repair)
            repair_spawn_timer = 0

        repairs.update()

        hits_repair = pygame.sprite.spritecollide(player, repairs, True)
        for r in hits_repair:
            player.hp = min(player.max_hp, player.hp + REPAIR_AMOUNT)

        hits = pygame.sprite.groupcollide(enemies, player_bullets, False, True)
        for enemy_obj, bullets in hits.items():
            killed = False
            for b in bullets:
                if enemy_obj.take_damage(b.damage):
                    killed = True
            if killed:
                score += 100
                expl = Explosion(enemy_obj.rect.center, size=48, duration=20)
                explosions.add(expl)
                if expl_snd:
                    expl_snd.play()
                enemy_obj.kill()

        hits_player = pygame.sprite.spritecollide(player, enemy_bullets, True)
        for b in hits_player:
            player.take_damage(b.damage)
            expl = Explosion(player.rect.center, size=64, duration=25)
            explosions.add(expl)
            if expl_snd:
                expl_snd.play()
            if player.hp <= 0:
                lives -= 1
                player.heal_full()
                player.rect.midbottom = (SCREEN_W//2, SCREEN_H-20)
                if lives <= 0:
                    game_over = True

        for e in enemies.sprites():
            if e.rect.bottom >= SCREEN_H:
                e.kill()

        level_up_this_frame = False
        if score >= 1000 and any(e for e in explosions):
            level += 1
            score -= 1000
            bg_index = (bg_index + 1) % len(backgrounds)
            level_up_this_frame = True
        if level_up_this_frame:
            explosions.empty()

        if level_cooldown > 0:
            level_cooldown -= 1

    screen.blit(backgrounds[bg_index], (0,0))
    enemies.draw(screen)
    player_group.draw(screen)
    player_bullets.draw(screen)
    enemy_bullets.draw(screen)
    explosions.draw(screen)
    repairs.draw(screen)

    draw_text(screen, f"Puntaje: {score}", (12,10))
    draw_text(screen, f"Nivel: {level}", (12,36))
    draw_text(screen, f"Vidas: {lives}", (SCREEN_W - 110, 10))
    draw_hp_bar(screen, SCREEN_W - 260, 40, 220, 18, player.hp, player.max_hp)

    if game_over:
        draw_text(screen, "GAME OVER - presiona R para reiniciar", (SCREEN_W//2 - 200, SCREEN_H//2))

    pygame.display.flip()

