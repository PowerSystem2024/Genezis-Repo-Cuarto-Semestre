# constantes.py
import os

# --- Screen ---
SCREEN_W = 800
SCREEN_H = 600
FPS = 60

# --- Paths ---
ASSETS_DIR = os.path.join(os.path.dirname(__file__), 'assets')
IMG_DIR = ASSETS_DIR
SND_DIR = ASSETS_DIR

# --- Imagenes ---
BACKGROUNDS = [
    os.path.join(IMG_DIR, 'background_1.jpg'),
    os.path.join(IMG_DIR, 'background_2.jpg'),
    os.path.join(IMG_DIR, 'background_3.jpg'),
]
START_IMG = os.path.join(IMG_DIR, 'start.png')
PLAYER_IMG = os.path.join(IMG_DIR, 'player.png')
ENEMY_IMG = os.path.join(IMG_DIR, 'enemy.png')
BULLET_IMG = os.path.join(IMG_DIR, 'bullet.png')

# --- Sonidos ---
LASER_SOUND = os.path.join(SND_DIR, 'laserdis.mp3')
EXPLOSION_SOUND = os.path.join(SND_DIR, 'explosion.mp3')
MUSIC = os.path.join(SND_DIR, 'Imperial March - Kenobi.mp3')

# --- Player Settings ---
PLAYER_SPEED = 5
PLAYER_HP = 100
PLAYER_SHOOT_COOLDOWN = 20 # frames
