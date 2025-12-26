# Godot Expert Skill

---
name: godot-expert
description: "Godot game development expert. PROACTIVELY use when working with Godot, GDScript, game projects. Triggers: godot, gdscript, .gd, .tscn, game, scene, node"
autoInvoke: true
priority: high
triggers:
  - "godot"
  - "gdscript"
  - "game"
  - ".gd"
  - ".tscn"
  - "scene"
  - "node"
  - "project.godot"
  - "CharacterBody"
  - "RigidBody"
  - "Area2D"
  - "Area3D"
---

**Version:** 1.6.0
**Type:** Skill (Auto-Invoke)
**Agent:** `game-developer`

---

## Overview

Comprehensive Godot game development patterns for Godot 4.x. Covers project structure, scene composition, GDScript best practices, physics, input handling, UI, animation, audio, performance optimization, multi-platform export (HTML5, Android, iOS, Desktop), and testing with GDUnit.

---

## 1. Project Structure

### Standard Layout

```
res://
├── project.godot           # Project configuration
├── export_presets.cfg      # Export templates
│
├── scenes/                 # .tscn files (organized by type)
│   ├── player/
│   │   ├── player.tscn
│   │   └── player_hud.tscn
│   ├── enemies/
│   │   ├── enemy_base.tscn
│   │   └── enemy_flying.tscn
│   ├── levels/
│   │   ├── level_01.tscn
│   │   └── level_02.tscn
│   └── ui/
│       ├── main_menu.tscn
│       ├── pause_menu.tscn
│       └── game_over.tscn
│
├── scripts/                # .gd files (mirrors scenes/ structure)
│   ├── player/
│   │   └── player.gd
│   ├── enemies/
│   │   ├── enemy_base.gd
│   │   └── enemy_flying.gd
│   ├── managers/
│   │   ├── game_manager.gd
│   │   └── audio_manager.gd
│   └── utils/
│       └── helpers.gd
│
├── assets/
│   ├── sprites/            # 2D graphics
│   │   ├── characters/
│   │   └── environment/
│   ├── models/             # 3D models
│   ├── audio/
│   │   ├── sfx/
│   │   └── music/
│   ├── fonts/
│   └── shaders/
│
├── autoload/               # Singleton scripts
│   ├── globals.gd
│   ├── events.gd
│   └── save_manager.gd
│
├── resources/              # .tres files
│   ├── themes/
│   └── data/
│
├── addons/                 # Plugins
│   └── gdunit4/            # Testing framework
│
└── test/                   # GDUnit tests
    ├── player/
    └── enemies/
```

### project.godot Configuration

```ini
[application]
config/name="My Game"
config/version="1.0.0"
run/main_scene="res://scenes/ui/main_menu.tscn"
config/features=PackedStringArray("4.3", "GL Compatibility")
config/icon="res://assets/icon.svg"

[autoload]
Globals="*res://autoload/globals.gd"
Events="*res://autoload/events.gd"
SaveManager="*res://autoload/save_manager.gd"
AudioManager="*res://autoload/audio_manager.gd"

[display]
window/size/viewport_width=1920
window/size/viewport_height=1080
window/stretch/mode="canvas_items"
window/stretch/aspect="expand"

[input]
move_left={...}
move_right={...}
jump={...}
attack={...}

[rendering]
renderer/rendering_method="gl_compatibility"
textures/vram_compression/import_etc2_astc=true
```

### Naming Conventions

```toon
naming[6]{type,pattern,example}:
  Scenes,snake_case.tscn,player_controller.tscn
  Scripts,snake_case.gd,player_controller.gd
  Classes,PascalCase,PlayerController
  Functions,snake_case,move_and_slide()
  Variables,snake_case,max_health
  Constants,SCREAMING_SNAKE,MAX_SPEED
```

---

## 2. Scenes & Nodes

### Scene Composition Patterns

```gdscript
# Composition over inheritance
# Player scene structure:
# Player (CharacterBody2D)
#   ├── CollisionShape2D
#   ├── Sprite2D
#   ├── AnimationPlayer
#   ├── StateMachine (Node)
#   │   ├── IdleState
#   │   ├── RunState
#   │   └── JumpState
#   ├── Hitbox (Area2D)
#   └── Hurtbox (Area2D)
```

### Scene Instancing

```gdscript
# Preload for frequently used scenes
const BulletScene := preload("res://scenes/projectiles/bullet.tscn")

func shoot() -> void:
    var bullet := BulletScene.instantiate() as Bullet
    bullet.global_position = $Muzzle.global_position
    bullet.direction = facing_direction
    get_tree().current_scene.add_child(bullet)
```

### Scene Inheritance

```gdscript
# Base enemy scene: enemy_base.tscn
# Inherited scene: enemy_flying.tscn (inherits enemy_base.tscn)

# enemy_base.gd
class_name EnemyBase
extends CharacterBody2D

@export var max_health: int = 100
@export var move_speed: float = 100.0

func take_damage(amount: int) -> void:
    max_health -= amount
    if max_health <= 0:
        die()

func die() -> void:
    queue_free()

# enemy_flying.gd (extends EnemyBase)
class_name EnemyFlying
extends EnemyBase

@export var flight_height: float = 50.0

func _physics_process(delta: float) -> void:
    # Flying-specific behavior
    velocity.y = sin(Time.get_ticks_msec() * 0.001) * flight_height
    move_and_slide()
```

### Node Groups

```gdscript
# Add to group in editor or code
add_to_group("enemies")
add_to_group("damageable")

# Find all nodes in group
func damage_all_enemies(amount: int) -> void:
    for enemy in get_tree().get_nodes_in_group("enemies"):
        if enemy.has_method("take_damage"):
            enemy.take_damage(amount)

# Call method on all group members
get_tree().call_group("enemies", "alert", player_position)
```

---

## 3. GDScript Patterns

### Type Hints (ALWAYS USE)

```gdscript
# Variables with types
var health: int = 100
var speed: float = 200.0
var player_name: String = "Hero"
var is_alive: bool = true
var items: Array[Item] = []
var stats: Dictionary = {}

# Typed arrays
var enemies: Array[Enemy] = []
var positions: Array[Vector2] = []

# Nullable types
var current_target: Node2D = null

# Function signatures
func calculate_damage(base: int, multiplier: float) -> int:
    return int(base * multiplier)

func get_player() -> Player:
    return get_tree().get_first_node_in_group("player") as Player
```

### Export Variables

```gdscript
# Basic exports
@export var max_health: int = 100
@export var player_name: String = "Hero"

# Range constraints
@export_range(0, 100, 1) var health: int = 100
@export_range(0.0, 10.0, 0.1) var speed: float = 5.0

# Enums
@export_enum("Warrior", "Mage", "Rogue") var player_class: String
enum CharacterState { IDLE, RUNNING, JUMPING, FALLING }
@export var state: CharacterState = CharacterState.IDLE

# Resources
@export var character_data: CharacterResource
@export var weapon_stats: WeaponStats

# File paths
@export_file("*.tscn") var next_level: String
@export_dir var save_directory: String

# Grouped exports
@export_group("Movement")
@export var walk_speed: float = 100.0
@export var run_speed: float = 200.0
@export var jump_force: float = 400.0

@export_group("Combat")
@export var attack_damage: int = 10
@export var attack_cooldown: float = 0.5

# Subgroups
@export_subgroup("Advanced")
@export var crit_chance: float = 0.1
```

### Signals

```gdscript
# Signal declarations
signal health_changed(new_health: int, max_health: int)
signal died
signal item_collected(item: Item)
signal level_completed(level_id: int, score: int)

# Emitting signals
func take_damage(amount: int) -> void:
    health -= amount
    health_changed.emit(health, max_health)
    if health <= 0:
        died.emit()

# Connecting signals (in code)
func _ready() -> void:
    # Method 1: Connect with Callable
    $Button.pressed.connect(_on_button_pressed)

    # Method 2: Connect with lambda
    $Timer.timeout.connect(func(): print("Timer done!"))

    # Method 3: Connect to another node's method
    player.health_changed.connect($HealthBar.update_display)

# Disconnect
func _exit_tree() -> void:
    if player.health_changed.is_connected($HealthBar.update_display):
        player.health_changed.disconnect($HealthBar.update_display)
```

### Onready Variables

```gdscript
# Cache node references at ready
@onready var sprite: Sprite2D = $Sprite2D
@onready var anim_player: AnimationPlayer = $AnimationPlayer
@onready var collision: CollisionShape2D = $CollisionShape2D
@onready var raycast: RayCast2D = $RayCast2D
@onready var health_bar: ProgressBar = $UI/HealthBar

# Typed onready with path
@onready var state_machine: StateMachine = $StateMachine as StateMachine
```

### Async/Await

```gdscript
# Wait for signal
func play_death_animation() -> void:
    $AnimationPlayer.play("death")
    await $AnimationPlayer.animation_finished
    queue_free()

# Wait for timer
func delayed_spawn() -> void:
    await get_tree().create_timer(2.0).timeout
    spawn_enemy()

# Wait for next frame
func next_frame_operation() -> void:
    await get_tree().process_frame
    # Now in next frame

# Custom async function
func load_level_async(level_path: String) -> void:
    $LoadingScreen.show()
    ResourceLoader.load_threaded_request(level_path)

    while ResourceLoader.load_threaded_get_status(level_path) == ResourceLoader.THREAD_LOAD_IN_PROGRESS:
        await get_tree().process_frame

    var level = ResourceLoader.load_threaded_get(level_path)
    get_tree().change_scene_to_packed(level)
```

### Custom Resources

```gdscript
# weapon_stats.gd
class_name WeaponStats
extends Resource

@export var name: String = "Sword"
@export var damage: int = 10
@export var attack_speed: float = 1.0
@export var range: float = 50.0
@export var icon: Texture2D

func get_dps() -> float:
    return damage * attack_speed

# Usage
@export var weapon: WeaponStats

func attack() -> void:
    deal_damage(weapon.damage)
```

### Singletons (Autoload)

```gdscript
# globals.gd - Project Settings > Autoload
extends Node

var score: int = 0
var high_score: int = 0
var current_level: int = 1

func reset_game() -> void:
    score = 0
    current_level = 1

# events.gd - Event bus pattern
extends Node

signal player_died
signal enemy_spawned(enemy: Enemy)
signal level_completed(level: int)
signal coin_collected(amount: int)

# Usage anywhere
Events.player_died.emit()
Events.coin_collected.connect(_on_coin_collected)
```

---

## 4. Physics & Collision

### CharacterBody2D Movement

```gdscript
extends CharacterBody2D

const SPEED := 300.0
const JUMP_VELOCITY := -400.0
const GRAVITY := 980.0

func _physics_process(delta: float) -> void:
    # Gravity
    if not is_on_floor():
        velocity.y += GRAVITY * delta

    # Jump
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = JUMP_VELOCITY

    # Horizontal movement
    var direction := Input.get_axis("move_left", "move_right")
    if direction:
        velocity.x = direction * SPEED
    else:
        velocity.x = move_toward(velocity.x, 0, SPEED)

    move_and_slide()
```

### CharacterBody3D Movement

```gdscript
extends CharacterBody3D

@export var speed := 5.0
@export var jump_velocity := 4.5
@export var mouse_sensitivity := 0.002

var gravity: float = ProjectSettings.get_setting("physics/3d/default_gravity")

func _physics_process(delta: float) -> void:
    if not is_on_floor():
        velocity.y -= gravity * delta

    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_velocity

    var input_dir := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
    var direction := (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()

    if direction:
        velocity.x = direction.x * speed
        velocity.z = direction.z * speed
    else:
        velocity.x = move_toward(velocity.x, 0, speed)
        velocity.z = move_toward(velocity.z, 0, speed)

    move_and_slide()

func _input(event: InputEvent) -> void:
    if event is InputEventMouseMotion:
        rotate_y(-event.relative.x * mouse_sensitivity)
        $Camera3D.rotate_x(-event.relative.y * mouse_sensitivity)
        $Camera3D.rotation.x = clamp($Camera3D.rotation.x, -PI/2, PI/2)
```

### Collision Layers & Masks

```gdscript
# Layer setup (Project Settings > Layer Names > 2D Physics):
# Layer 1: Player
# Layer 2: Enemies
# Layer 3: Projectiles
# Layer 4: Environment
# Layer 5: Pickups
# Layer 6: Triggers

# Set in code
collision_layer = 1  # What I am
collision_mask = 6   # What I collide with (binary: layers 2 and 3)

# Or use bit flags
func set_collision_layer_bit(layer: int, enabled: bool) -> void:
    if enabled:
        collision_layer |= (1 << layer)
    else:
        collision_layer &= ~(1 << layer)
```

### Area2D for Detection

```gdscript
# Hitbox/Hurtbox pattern
extends Area2D
class_name Hitbox

@export var damage: int = 10

func _ready() -> void:
    area_entered.connect(_on_area_entered)

func _on_area_entered(area: Area2D) -> void:
    if area is Hurtbox:
        area.take_hit(self)

# Hurtbox
extends Area2D
class_name Hurtbox

signal hit_received(hitbox: Hitbox)

func take_hit(hitbox: Hitbox) -> void:
    hit_received.emit(hitbox)
```

### RayCast for Detection

```gdscript
@onready var raycast: RayCast2D = $RayCast2D

func _physics_process(_delta: float) -> void:
    if raycast.is_colliding():
        var collider = raycast.get_collider()
        var collision_point = raycast.get_collision_point()
        var collision_normal = raycast.get_collision_normal()

        if collider.is_in_group("enemies"):
            target_enemy(collider)
```

---

## 5. Input Handling

### Input Actions (Project Settings)

```gdscript
# Define in Project Settings > Input Map
# Then use:
func _process(_delta: float) -> void:
    if Input.is_action_pressed("move_right"):
        move_right()

    if Input.is_action_just_pressed("jump"):
        jump()

    if Input.is_action_just_released("attack"):
        release_attack()

    # Axis input (-1 to 1)
    var horizontal := Input.get_axis("move_left", "move_right")
    var vertical := Input.get_axis("move_up", "move_down")
    var direction := Vector2(horizontal, vertical).normalized()
```

### Input Events

```gdscript
func _input(event: InputEvent) -> void:
    # Keyboard
    if event is InputEventKey:
        if event.pressed and event.keycode == KEY_ESCAPE:
            toggle_pause()

    # Mouse button
    if event is InputEventMouseButton:
        if event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
            shoot()

    # Mouse motion
    if event is InputEventMouseMotion:
        look_at_mouse(event.position)

    # Touch (mobile)
    if event is InputEventScreenTouch:
        if event.pressed:
            handle_touch(event.position)

func _unhandled_input(event: InputEvent) -> void:
    # Only receives input not handled by UI
    if event.is_action_pressed("pause"):
        toggle_pause()
        get_viewport().set_input_as_handled()
```

### Touch Input (Mobile)

```gdscript
# Virtual joystick
var touch_start: Vector2
var touch_current: Vector2
var touch_index: int = -1

func _input(event: InputEvent) -> void:
    if event is InputEventScreenTouch:
        if event.pressed and touch_index == -1:
            touch_index = event.index
            touch_start = event.position
            touch_current = event.position
        elif not event.pressed and event.index == touch_index:
            touch_index = -1

    if event is InputEventScreenDrag:
        if event.index == touch_index:
            touch_current = event.position

func get_touch_direction() -> Vector2:
    if touch_index == -1:
        return Vector2.ZERO
    return (touch_current - touch_start).normalized()
```

---

## 6. UI/Control Nodes

### UI Scene Structure

```
MainMenu (Control)
├── VBoxContainer
│   ├── Title (Label)
│   ├── PlayButton (Button)
│   ├── OptionsButton (Button)
│   └── QuitButton (Button)
└── OptionsPanel (Panel) [hidden]
    └── VBoxContainer
        ├── VolumeSlider (HSlider)
        └── BackButton (Button)
```

### Responsive UI

```gdscript
extends Control

func _ready() -> void:
    # Anchor to full screen
    set_anchors_preset(Control.PRESET_FULL_RECT)

    # Handle window resize
    get_tree().root.size_changed.connect(_on_window_resized)

func _on_window_resized() -> void:
    var viewport_size := get_viewport_rect().size
    # Adjust UI elements based on new size
```

### Theme System

```gdscript
# Create theme resource (.tres)
# Apply to root Control node

# Override in code
func highlight_button(button: Button) -> void:
    button.add_theme_color_override("font_color", Color.YELLOW)
    button.add_theme_font_size_override("font_size", 24)
```

### HUD Pattern

```gdscript
extends CanvasLayer

@onready var health_bar: ProgressBar = $HealthBar
@onready var score_label: Label = $ScoreLabel
@onready var ammo_label: Label = $AmmoLabel

func _ready() -> void:
    Events.health_changed.connect(update_health)
    Events.score_changed.connect(update_score)
    Events.ammo_changed.connect(update_ammo)

func update_health(current: int, maximum: int) -> void:
    health_bar.max_value = maximum
    health_bar.value = current

func update_score(score: int) -> void:
    score_label.text = "Score: %d" % score

func update_ammo(current: int, maximum: int) -> void:
    ammo_label.text = "%d / %d" % [current, maximum]
```

**See:** `references/ui-patterns.md` for complete UI patterns

---

## 7. Animation & Audio

### AnimationPlayer

```gdscript
@onready var anim: AnimationPlayer = $AnimationPlayer

func _ready() -> void:
    anim.animation_finished.connect(_on_animation_finished)

func play_attack() -> void:
    anim.play("attack")
    await anim.animation_finished
    return_to_idle()

func _on_animation_finished(anim_name: StringName) -> void:
    match anim_name:
        "death":
            queue_free()
        "attack":
            can_attack = true
```

### AnimationTree (State Machine)

```gdscript
@onready var anim_tree: AnimationTree = $AnimationTree
@onready var state_machine: AnimationNodeStateMachinePlayback = anim_tree.get("parameters/playback")

func _physics_process(_delta: float) -> void:
    anim_tree.set("parameters/blend_position", velocity.x)

    if is_on_floor():
        if velocity.x != 0:
            state_machine.travel("run")
        else:
            state_machine.travel("idle")
    else:
        state_machine.travel("jump")
```

### Tweens

```gdscript
# One-shot tween
func flash_white() -> void:
    var tween := create_tween()
    tween.tween_property($Sprite2D, "modulate", Color.WHITE, 0.1)
    tween.tween_property($Sprite2D, "modulate", Color(1, 1, 1, 1), 0.1)

# Chained animations
func bounce_in() -> void:
    var tween := create_tween()
    tween.set_ease(Tween.EASE_OUT)
    tween.set_trans(Tween.TRANS_ELASTIC)
    tween.tween_property(self, "scale", Vector2.ONE, 0.5).from(Vector2.ZERO)

# Parallel animations
func fade_and_move() -> void:
    var tween := create_tween()
    tween.set_parallel(true)
    tween.tween_property(self, "modulate:a", 0.0, 1.0)
    tween.tween_property(self, "position:y", position.y - 50, 1.0)
    tween.chain().tween_callback(queue_free)
```

### Audio

```gdscript
# AudioManager singleton
extends Node

var music_player: AudioStreamPlayer
var sfx_players: Array[AudioStreamPlayer] = []

func _ready() -> void:
    music_player = AudioStreamPlayer.new()
    add_child(music_player)

    for i in 8:
        var player := AudioStreamPlayer.new()
        add_child(player)
        sfx_players.append(player)

func play_music(stream: AudioStream, fade_in: float = 1.0) -> void:
    music_player.stream = stream
    music_player.volume_db = -80
    music_player.play()

    var tween := create_tween()
    tween.tween_property(music_player, "volume_db", 0, fade_in)

func play_sfx(stream: AudioStream) -> void:
    for player in sfx_players:
        if not player.playing:
            player.stream = stream
            player.play()
            return
    # All players busy, use first one
    sfx_players[0].stream = stream
    sfx_players[0].play()
```

---

## 8. Performance

### Object Pooling

```gdscript
class_name ObjectPool
extends Node

var _pool: Array[Node] = []
var _scene: PackedScene

func _init(scene: PackedScene, initial_size: int = 10) -> void:
    _scene = scene
    for i in initial_size:
        var instance := _scene.instantiate()
        instance.set_process(false)
        instance.hide()
        _pool.append(instance)

func get_object() -> Node:
    for obj in _pool:
        if not obj.visible:
            obj.show()
            obj.set_process(true)
            return obj

    # Pool exhausted, create new
    var new_obj := _scene.instantiate()
    _pool.append(new_obj)
    get_parent().add_child(new_obj)
    return new_obj

func return_object(obj: Node) -> void:
    obj.hide()
    obj.set_process(false)
```

### LOD (Level of Detail)

```gdscript
extends Node2D

@export var lod_distances: Array[float] = [100, 300, 600]
@export var lod_nodes: Array[Node2D]

var camera: Camera2D

func _process(_delta: float) -> void:
    if not camera:
        camera = get_viewport().get_camera_2d()
        return

    var distance := global_position.distance_to(camera.global_position)

    for i in lod_nodes.size():
        if i < lod_distances.size():
            lod_nodes[i].visible = distance < lod_distances[i]
        else:
            lod_nodes[i].visible = true
```

### Profiling

```gdscript
# Use built-in profiler: Debugger > Profiler

# Custom timing
func expensive_operation() -> void:
    var start := Time.get_ticks_usec()
    # ... operation ...
    var elapsed := Time.get_ticks_usec() - start
    print("Operation took: %d microseconds" % elapsed)

# Conditional processing
func _process(delta: float) -> void:
    if not is_visible_on_screen():
        return  # Skip processing for off-screen objects
```

---

## 9. Export Targets

### Export Overview

```toon
platforms[6]{name,format,requirements}:
  HTML5,.html+.wasm,WebGL 2.0 browser
  Android,.apk/.aab,Android SDK + JDK
  iOS,.ipa,Xcode + Apple Developer
  Windows,.exe,Windows SDK (optional)
  macOS,.app/.dmg,Xcode CLI tools
  Linux,Binary,None
```

### HTML5 Export

```gdscript
# Check if running in browser
if OS.has_feature("web"):
    # Disable features not supported in web
    fullscreen_button.disabled = true

# Handle browser focus
func _notification(what: int) -> void:
    if what == NOTIFICATION_WM_FOCUS_OUT:
        # Browser tab lost focus
        get_tree().paused = true
    elif what == NOTIFICATION_WM_FOCUS_IN:
        get_tree().paused = false
```

### Mobile Export

```gdscript
# Detect mobile platform
func _ready() -> void:
    if OS.has_feature("mobile"):
        setup_mobile_controls()
    else:
        setup_desktop_controls()

func setup_mobile_controls() -> void:
    $VirtualJoystick.show()
    $TouchButtons.show()

    # Adjust for notch/safe area
    var safe_area := DisplayServer.get_display_safe_area()
    $UI.offset_top = safe_area.position.y
```

**See:** `references/export-platforms.md` for complete export guide

---

## 10. Testing with GDUnit

### Test Structure

```gdscript
# test/player/test_player.gd
extends GdUnitTestSuite

var player: Player

func before_test() -> void:
    player = auto_free(preload("res://scenes/player/player.tscn").instantiate())
    add_child(player)

func test_initial_health() -> void:
    assert_int(player.health).is_equal(100)

func test_take_damage() -> void:
    player.take_damage(25)
    assert_int(player.health).is_equal(75)

func test_death_signal() -> void:
    var signal_collector := signal_collector(player, "died")
    player.take_damage(100)
    await assert_signal(signal_collector).is_emitted("died")
```

**See:** `references/testing-gdunit.md` for complete testing guide

---

## Quick Reference

### Common Patterns

```toon
patterns[8]{name,use_case}:
  State Machine,Complex entity behavior
  Object Pool,Frequent spawn/despawn
  Event Bus,Decoupled communication
  Resource,Shared data/configuration
  Autoload,Global managers
  Scene Inheritance,Enemy variants
  Composition,Modular abilities
  Command,Input/action replay
```

### File Extensions

```toon
extensions[6]{ext,purpose}:
  .gd,GDScript source
  .tscn,Scene (text format)
  .scn,Scene (binary format)
  .tres,Resource (text)
  .res,Resource (binary)
  .import,Import settings
```

---

## Related

| Resource | Location |
|----------|----------|
| Export Platforms | `references/export-platforms.md` |
| UI Patterns | `references/ui-patterns.md` |
| GDUnit Testing | `references/testing-gdunit.md` |
| Scene Composition Rule | `rules/godot-scene-composition.md` |
| GDScript Typing Rule | `rules/godot-gdscript-typing.md` |

---

**Version:** 1.6.0 | **Last Updated:** 2025-12-26
