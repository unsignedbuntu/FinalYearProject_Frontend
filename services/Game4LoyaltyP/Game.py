import pgzrun
import random
from pygame import Rect

# Ekran boyutları ve oyun zemin seviyesi
WIDTH = 800
HEIGHT = 400
GROUND_LEVEL = HEIGHT - 30

# Oyun değişkenleri
player = Actor("charmoved1")
player.pos = (100, GROUND_LEVEL)

monsters = []
collectibles = []
score = 0
game_over = False
background_music_enabled = True
player_velocity_y = 0
is_jumping = False

frame_counter = 0
frame_delay = 15

# Sesler
collect_sound = sounds.load("collect.mp3")
background_music_track = sounds.load("background.mp3")
game_over_sound = sounds.load("gameover.mp3")
game_over_sound_timer = 0
game_over_sound_played = False


# Müzik açma/kapatma fonksiyonu
def toggle_music():
    global background_music_enabled
    background_music_enabled = not background_music_enabled
    if background_music_enabled:
        background_music_track.play()
    else:
        background_music_track.stop()


# Canavar oluşturma fonksiyonu
def spawn_monsters():
    if len(monsters) < 3:
        if not monsters or monsters[-1].x < WIDTH - 300:
            monster = Actor("monstermoved1")
            monster.pos = (random.randint(WIDTH, WIDTH + 200), GROUND_LEVEL - 40)
            monster.velocity_y = 0
            monster.is_jumping = False
            monsters.append(monster)


# Canavar güncelleme fonksiyonu
def update_monsters():
    for monster in monsters:
        monster.x -= 5
        if monster.x < 0:
            monsters.remove(monster)

        # Animasyon
        if frame_counter % 15 == 0:
            if monster.image == "monstermoved1":
                monster.image = "monstermoved2"
            else:
                monster.image = "monstermoved1"


# Toplanabilir nesne oluşturma fonksiyonu
def spawn_collectibles():
    if len(collectibles) < 3:
        if not collectibles or collectibles[-1].x < WIDTH - 300:
            collectible = Rect(
                (random.randint(WIDTH, WIDTH + 200), random.randint(GROUND_LEVEL - 60, GROUND_LEVEL - 30)),
                (30, 30)
            )
            collectibles.append(collectible)


# Toplanabilir nesne güncelleme fonksiyonu
def update_collectibles():
    for collectible in collectibles:
        collectible.x -= 5
        if collectible.x < 0:
            collectibles.remove(collectible)


# Oyuncu hitbox'ını hesaplama fonksiyonu
def get_player_hitbox():
    padding_x = 3
    padding_y = 35

    return Rect(
        player.x - player.width // 2 + padding_x // 2,
        player.y - player.height // 2 + padding_y // 2,
        player.width - padding_x,
        player.height - padding_y
    )


# Çarpışma kontrolü fonksiyonu
def check_collisions():
    global game_over, score
    player_hitbox = get_player_hitbox()

    # Canavar çarpışması
    for monster in monsters:
        monster_hitbox = Rect(
            monster.x - monster.width // 2 + 20,
            monster.y - monster.height // 2 + 20,
            monster.width - 40,
            monster.height - 20
        )
        if player_hitbox.colliderect(monster_hitbox):
            game_over = True

    # Toplanabilir nesne çarpışması
    for collectible in collectibles[:]:
        if player_hitbox.colliderect(collectible):
            collectibles.remove(collectible)
            score += 10
            collect_sound.play()


# Oyunu sıfırlama fonksiyonu
def reset_game():
    global score, game_over, monsters, collectibles, player_velocity_y, is_jumping
    score = 0
    game_over = False
    monsters = []
    collectibles = []
    player.topleft = (100, GROUND_LEVEL - 40)
    player_velocity_y = 0
    is_jumping = False



# Güncelleme fonksiyonu
def update():
    global player_velocity_y, is_jumping, frame_counter, game_over_sound_timer, game_over_sound_played

    if not game_over:
        game_over_sound_played = False

        # Yerçekimi etkisi
        player_velocity_y += 0.5
        player.y += player_velocity_y

        # Oyuncu zeminle temas ettiğinde
        if player.y >= GROUND_LEVEL - player.height // 2 + 10:
            player.y = GROUND_LEVEL - player.height // 2 + 10
            player_velocity_y = 0
            is_jumping = False

        # Zıplama kontrolü
        if keyboard.up and not is_jumping:
            player_velocity_y = -15
            is_jumping = True

        # Animasyon
        frame_counter += 1
        if frame_counter >= 10:
            frame_counter = 0
            if is_jumping:
                player.image = "charjump"
            else:
                player.image = "charmoved1" if player.image == "charmoved2" else "charmoved2"

        # Oyun nesnelerini güncelle
        spawn_monsters()
        spawn_collectibles()
        update_monsters()
        update_collectibles()
        check_collisions()

    # Game over ses kontrolü
    if game_over_sound_timer > 0:
        game_over_sound_timer += 1
        if game_over_sound_timer > 180:
            game_over_sound.stop()
            game_over_sound_timer = 0


# Çizim fonksiyonu
def draw():
    global game_over_sound_played
    screen.clear()
    screen.blit("background", (0, 0))
    player.draw()

    # Canavarların çizimi
    for monster in monsters:
        monster.draw()

    # Toplanabilir nesnelerin çizimi
    for collectible in collectibles:
        screen.draw.filled_rect(collectible, "yellow")

    # Skor ve game over mesajı
    screen.draw.text(f"Score: {score}", (10, 10), fontsize=30, color="white")
    if game_over:
        background_music_track.stop()
        if not game_over_sound_played:
            game_over_sound.play()
        game_over_sound_played = True
        screen.draw.text(
            f"Game Over! Score: {score} \nPress Enter to Restart",
            center=(WIDTH // 2, HEIGHT // 2),
            fontsize=40,
            color="red"
        )


# Klavye kontrolü
def on_key_down(key):
    if key == keys.RETURN and game_over:
        game_over_sound.stop()
        background_music_track.play()
        reset_game()
    if key == keys.M:
        toggle_music()


# Arka plan müziğini başlat
background_music_track.play()

pgzrun.go()
