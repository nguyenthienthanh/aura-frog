# Game UI Patterns Reference

**Version:** 1.6.0
**Skill:** godot-expert

---

## UI Node Hierarchy

### Main Menu

```
MainMenu (Control) [PRESET_FULL_RECT]
├── Background (TextureRect)
├── VBoxContainer [centered]
│   ├── Logo (TextureRect)
│   ├── PlayButton (Button)
│   ├── OptionsButton (Button)
│   ├── CreditsButton (Button)
│   └── QuitButton (Button)
├── OptionsPanel (PanelContainer) [hidden]
│   └── VBoxContainer
│       ├── Label "Options"
│       ├── HBoxContainer
│       │   ├── Label "Music"
│       │   └── HSlider
│       ├── HBoxContainer
│       │   ├── Label "SFX"
│       │   └── HSlider
│       └── BackButton (Button)
└── CreditsPanel (PanelContainer) [hidden]
```

```gdscript
extends Control

@onready var main_buttons: VBoxContainer = $VBoxContainer
@onready var options_panel: PanelContainer = $OptionsPanel
@onready var credits_panel: PanelContainer = $CreditsPanel

func _ready() -> void:
    $VBoxContainer/PlayButton.pressed.connect(_on_play)
    $VBoxContainer/OptionsButton.pressed.connect(_on_options)
    $VBoxContainer/QuitButton.pressed.connect(_on_quit)

func _on_play() -> void:
    get_tree().change_scene_to_file("res://scenes/levels/level_01.tscn")

func _on_options() -> void:
    main_buttons.hide()
    options_panel.show()

func _on_quit() -> void:
    get_tree().quit()
```

---

## HUD (Heads-Up Display)

### Structure

```
HUD (CanvasLayer)
├── MarginContainer [PRESET_FULL_RECT]
│   ├── TopBar (HBoxContainer)
│   │   ├── HealthBar (TextureProgressBar)
│   │   ├── Spacer (Control) [expand]
│   │   └── ScoreLabel (Label)
│   ├── Spacer (Control) [expand]
│   └── BottomBar (HBoxContainer)
│       ├── AmmoCounter (HBoxContainer)
│       │   ├── AmmoIcon (TextureRect)
│       │   └── AmmoLabel (Label)
│       ├── Spacer (Control) [expand]
│       └── WeaponSlots (HBoxContainer)
└── DamageOverlay (ColorRect) [hidden]
```

```gdscript
extends CanvasLayer

@onready var health_bar: TextureProgressBar = %HealthBar
@onready var score_label: Label = %ScoreLabel
@onready var ammo_label: Label = %AmmoLabel
@onready var damage_overlay: ColorRect = %DamageOverlay

func _ready() -> void:
    Events.health_changed.connect(update_health)
    Events.score_changed.connect(update_score)
    Events.ammo_changed.connect(update_ammo)
    Events.player_damaged.connect(flash_damage)

func update_health(current: int, maximum: int) -> void:
    var tween := create_tween()
    tween.tween_property(health_bar, "value", float(current) / maximum * 100, 0.2)

func update_score(score: int) -> void:
    score_label.text = "%06d" % score
    # Pop animation
    var tween := create_tween()
    tween.tween_property(score_label, "scale", Vector2(1.2, 1.2), 0.1)
    tween.tween_property(score_label, "scale", Vector2.ONE, 0.1)

func update_ammo(current: int, max_ammo: int) -> void:
    ammo_label.text = "%d / %d" % [current, max_ammo]

func flash_damage() -> void:
    damage_overlay.modulate.a = 0.5
    damage_overlay.show()
    var tween := create_tween()
    tween.tween_property(damage_overlay, "modulate:a", 0.0, 0.3)
    tween.tween_callback(damage_overlay.hide)
```

---

## Pause Menu

```gdscript
extends CanvasLayer

@onready var pause_panel: Control = $PausePanel

var is_paused: bool = false

func _ready() -> void:
    pause_panel.hide()
    process_mode = Node.PROCESS_MODE_ALWAYS

func _input(event: InputEvent) -> void:
    if event.is_action_pressed("pause"):
        toggle_pause()

func toggle_pause() -> void:
    is_paused = !is_paused
    get_tree().paused = is_paused
    pause_panel.visible = is_paused

    if is_paused:
        Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
    else:
        Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)

func _on_resume_pressed() -> void:
    toggle_pause()

func _on_options_pressed() -> void:
    $OptionsPanel.show()

func _on_quit_pressed() -> void:
    get_tree().paused = false
    get_tree().change_scene_to_file("res://scenes/ui/main_menu.tscn")
```

---

## Dialog System

```gdscript
extends CanvasLayer
class_name DialogBox

signal dialog_finished

@onready var panel: PanelContainer = $Panel
@onready var name_label: Label = $Panel/VBox/NameLabel
@onready var text_label: RichTextLabel = $Panel/VBox/TextLabel
@onready var continue_indicator: Control = $Panel/ContinueIndicator

var dialog_lines: Array[Dictionary] = []
var current_line: int = 0
var is_typing: bool = false
var chars_per_second: float = 30.0

func show_dialog(lines: Array[Dictionary]) -> void:
    dialog_lines = lines
    current_line = 0
    panel.show()
    display_line()

func display_line() -> void:
    if current_line >= dialog_lines.size():
        close_dialog()
        return

    var line := dialog_lines[current_line]
    name_label.text = line.get("name", "")
    text_label.text = line.get("text", "")
    text_label.visible_ratio = 0.0
    continue_indicator.hide()

    is_typing = true
    var duration := text_label.text.length() / chars_per_second
    var tween := create_tween()
    tween.tween_property(text_label, "visible_ratio", 1.0, duration)
    tween.tween_callback(func():
        is_typing = false
        continue_indicator.show()
    )

func _input(event: InputEvent) -> void:
    if not panel.visible:
        return

    if event.is_action_pressed("ui_accept"):
        if is_typing:
            # Skip to end of line
            text_label.visible_ratio = 1.0
            is_typing = false
            continue_indicator.show()
        else:
            # Next line
            current_line += 1
            display_line()

func close_dialog() -> void:
    panel.hide()
    dialog_finished.emit()

# Usage:
# var dialog := [
#     {"name": "NPC", "text": "Hello, traveler!"},
#     {"name": "NPC", "text": "Welcome to our village."},
# ]
# $DialogBox.show_dialog(dialog)
```

---

## Inventory UI

```gdscript
extends Control
class_name InventoryUI

signal item_selected(item: Item)
signal item_used(item: Item)

@export var slot_scene: PackedScene
@export var columns: int = 5

@onready var grid: GridContainer = $Panel/GridContainer

var slots: Array[InventorySlot] = []

func _ready() -> void:
    grid.columns = columns

func setup(inventory: Inventory) -> void:
    # Clear existing slots
    for slot in slots:
        slot.queue_free()
    slots.clear()

    # Create slots
    for i in inventory.max_slots:
        var slot := slot_scene.instantiate() as InventorySlot
        grid.add_child(slot)
        slots.append(slot)
        slot.slot_clicked.connect(_on_slot_clicked.bind(i))

    # Populate with items
    for i in inventory.items.size():
        if inventory.items[i]:
            slots[i].set_item(inventory.items[i])

func _on_slot_clicked(index: int) -> void:
    var item := slots[index].item
    if item:
        item_selected.emit(item)

# InventorySlot.gd
extends Button
class_name InventorySlot

signal slot_clicked

var item: Item = null

@onready var icon: TextureRect = $Icon
@onready var count_label: Label = $CountLabel

func set_item(new_item: Item) -> void:
    item = new_item
    if item:
        icon.texture = item.icon
        count_label.text = str(item.stack_count) if item.stack_count > 1 else ""
        count_label.visible = item.stack_count > 1
    else:
        clear()

func clear() -> void:
    item = null
    icon.texture = null
    count_label.hide()

func _pressed() -> void:
    slot_clicked.emit()
```

---

## Touch Controls

### Virtual Joystick

```gdscript
extends Control
class_name VirtualJoystick

signal joystick_input(direction: Vector2)

@export var deadzone: float = 0.2
@export var clamp_zone: float = 75.0

@onready var base: TextureRect = $Base
@onready var stick: TextureRect = $Stick

var is_pressed: bool = false
var touch_index: int = -1

func _input(event: InputEvent) -> void:
    if event is InputEventScreenTouch:
        if event.pressed and is_point_inside(event.position):
            is_pressed = true
            touch_index = event.index
            update_stick(event.position)
        elif not event.pressed and event.index == touch_index:
            reset()

    if event is InputEventScreenDrag:
        if event.index == touch_index:
            update_stick(event.position)

func is_point_inside(point: Vector2) -> bool:
    return base.get_global_rect().has_point(point)

func update_stick(touch_pos: Vector2) -> void:
    var center := base.global_position + base.size / 2
    var direction := touch_pos - center
    var distance := direction.length()

    if distance > clamp_zone:
        direction = direction.normalized() * clamp_zone

    stick.global_position = center + direction - stick.size / 2

    # Emit normalized direction
    var normalized := direction / clamp_zone
    if normalized.length() < deadzone:
        normalized = Vector2.ZERO
    joystick_input.emit(normalized)

func reset() -> void:
    is_pressed = false
    touch_index = -1
    stick.position = base.size / 2 - stick.size / 2
    joystick_input.emit(Vector2.ZERO)
```

### Touch Button

```gdscript
extends TextureButton
class_name TouchActionButton

@export var action_name: String = "jump"

func _ready() -> void:
    button_down.connect(_on_button_down)
    button_up.connect(_on_button_up)

func _on_button_down() -> void:
    Input.action_press(action_name)

func _on_button_up() -> void:
    Input.action_release(action_name)
```

---

## Transitions

```gdscript
extends CanvasLayer
class_name TransitionManager

@onready var color_rect: ColorRect = $ColorRect
@onready var anim_player: AnimationPlayer = $AnimationPlayer

func fade_to_black(duration: float = 0.5) -> void:
    color_rect.show()
    var tween := create_tween()
    tween.tween_property(color_rect, "modulate:a", 1.0, duration)
    await tween.finished

func fade_from_black(duration: float = 0.5) -> void:
    var tween := create_tween()
    tween.tween_property(color_rect, "modulate:a", 0.0, duration)
    await tween.finished
    color_rect.hide()

func transition_to_scene(scene_path: String) -> void:
    await fade_to_black()
    get_tree().change_scene_to_file(scene_path)
    await fade_from_black()

# Circle wipe transition
func circle_wipe_out(duration: float = 0.5) -> void:
    anim_player.play("circle_wipe_out")
    await anim_player.animation_finished

func circle_wipe_in(duration: float = 0.5) -> void:
    anim_player.play("circle_wipe_in")
    await anim_player.animation_finished
```

---

## Responsive Layout

```gdscript
extends Control

func _ready() -> void:
    get_tree().root.size_changed.connect(_on_viewport_resized)
    _on_viewport_resized()

func _on_viewport_resized() -> void:
    var viewport_size := get_viewport_rect().size
    var aspect := viewport_size.x / viewport_size.y

    if aspect < 1.0:
        # Portrait - mobile
        apply_portrait_layout()
    elif aspect < 1.5:
        # Square-ish - tablet
        apply_tablet_layout()
    else:
        # Landscape - desktop
        apply_desktop_layout()

func apply_portrait_layout() -> void:
    $Sidebar.hide()
    $MainContent.set_anchors_preset(Control.PRESET_FULL_RECT)

func apply_tablet_layout() -> void:
    $Sidebar.show()
    $Sidebar.custom_minimum_size.x = 200

func apply_desktop_layout() -> void:
    $Sidebar.show()
    $Sidebar.custom_minimum_size.x = 300
```

---

## UI Animation Patterns

```gdscript
# Bounce in
func bounce_in(node: Control) -> void:
    node.scale = Vector2.ZERO
    node.show()
    var tween := create_tween()
    tween.set_ease(Tween.EASE_OUT)
    tween.set_trans(Tween.TRANS_ELASTIC)
    tween.tween_property(node, "scale", Vector2.ONE, 0.5)

# Slide in from right
func slide_in_right(node: Control) -> void:
    var target_pos := node.position
    node.position.x = get_viewport_rect().size.x
    node.show()
    var tween := create_tween()
    tween.set_ease(Tween.EASE_OUT)
    tween.set_trans(Tween.TRANS_BACK)
    tween.tween_property(node, "position", target_pos, 0.3)

# Shake (for errors)
func shake(node: Control, intensity: float = 10.0) -> void:
    var original_pos := node.position
    var tween := create_tween()
    for i in 5:
        tween.tween_property(node, "position", original_pos + Vector2(randf_range(-intensity, intensity), 0), 0.05)
    tween.tween_property(node, "position", original_pos, 0.05)

# Pulse
func pulse(node: Control) -> void:
    var tween := create_tween()
    tween.set_loops()
    tween.tween_property(node, "scale", Vector2(1.1, 1.1), 0.5)
    tween.tween_property(node, "scale", Vector2.ONE, 0.5)
```

---

**Version:** 1.6.0 | **Last Updated:** 2025-12-26
