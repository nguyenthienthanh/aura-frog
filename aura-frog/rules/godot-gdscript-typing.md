# GDScript Typing Rules

**Category:** Code Quality
**Priority:** High
**Enforcement:** Code Review
**Version:** 1.6.0
**Agent:** game-developer

---

## Purpose

Enforce type hints and static typing in GDScript for better performance, editor support, and code reliability.

---

## Core Rule

**ALWAYS use type hints** for variables, parameters, and return types.

---

## Variable Declarations

### Always Type Variables

```gdscript
# ✅ Good: Typed variables
var health: int = 100
var speed: float = 200.0
var player_name: String = "Hero"
var is_alive: bool = true
var position: Vector2 = Vector2.ZERO
var items: Array[Item] = []
var stats: Dictionary = {}

# ❌ Bad: Untyped variables
var health = 100
var speed = 200.0
var player_name = "Hero"
```

### Typed Arrays

```gdscript
# ✅ Good: Typed arrays
var enemies: Array[Enemy] = []
var positions: Array[Vector2] = []
var scores: Array[int] = []

# ❌ Bad: Untyped arrays
var enemies = []
var positions = []
```

### Constants

```gdscript
# ✅ Good: Typed constants
const MAX_HEALTH: int = 100
const GRAVITY: float = 980.0
const PLAYER_NAME: String = "Hero"

# Also acceptable (type inferred from value)
const MAX_SPEED := 500.0
```

---

## Function Signatures

### Always Type Parameters and Returns

```gdscript
# ✅ Good: Fully typed function
func calculate_damage(base: int, multiplier: float, is_critical: bool) -> int:
    var damage := base * multiplier
    if is_critical:
        damage *= 2.0
    return int(damage)

# ✅ Good: Void return (no return value)
func die() -> void:
    queue_free()

# ❌ Bad: Untyped function
func calculate_damage(base, multiplier, is_critical):
    return base * multiplier
```

### Nullable Returns

```gdscript
# ✅ Good: Can return null
func get_player() -> Player:
    var player = get_tree().get_first_node_in_group("player")
    return player as Player  # Returns null if not Player

# ✅ Good: Optional pattern
func find_enemy(id: int) -> Enemy:
    for enemy in enemies:
        if enemy.id == id:
            return enemy
    return null
```

---

## Class Variables

### Export Variables

```gdscript
# ✅ Good: Typed exports
@export var max_health: int = 100
@export var move_speed: float = 200.0
@export var player_name: String = ""

# ✅ Good: Range-constrained
@export_range(0, 100, 1) var health: int = 100
@export_range(0.0, 10.0, 0.1) var speed_multiplier: float = 1.0
```

### Onready Variables

```gdscript
# ✅ Good: Typed onready
@onready var sprite: Sprite2D = $Sprite2D
@onready var anim_player: AnimationPlayer = $AnimationPlayer
@onready var collision: CollisionShape2D = $CollisionShape2D

# ✅ Good: With cast
@onready var state_machine: StateMachine = $StateMachine as StateMachine

# ❌ Bad: Untyped onready
@onready var sprite = $Sprite2D
```

---

## Signal Parameters

### Typed Signals

```gdscript
# ✅ Good: Typed signals
signal health_changed(current: int, max_health: int)
signal item_collected(item: Item)
signal level_completed(level_id: int, score: int)
signal player_died

# ❌ Bad: Untyped signals
signal health_changed(current, max_health)
signal item_collected(item)
```

---

## Type Inference

### When := Is Acceptable

```gdscript
# ✅ Good: Type is obvious from right side
var player := Player.new()
var scene := preload("res://scenes/player.tscn")
var timer := Timer.new()
var result := calculate_score()  # If function has return type

# ❌ Bad: Type not obvious
var value := get_something()  # What type is this?
```

### When to Be Explicit

```gdscript
# ✅ Good: Explicit when type matters
var count: int = 0  # Not float
var position: Vector2 = Vector2.ZERO  # Not Vector3
var nodes: Array[Node2D] = []  # Specific array type

# ✅ Good: Explicit for numbers
var health: int = 100  # Not 100.0
var speed: float = 200.0  # Not 200
```

---

## Common Patterns

### Null Checks

```gdscript
# ✅ Good: Safe null handling
func attack_target() -> void:
    if target == null:
        return
    target.take_damage(damage)

# ✅ Good: Using is_instance_valid
func update_target() -> void:
    if not is_instance_valid(target):
        target = null
        return
```

### Type Casting

```gdscript
# ✅ Good: Safe casting
func _on_area_entered(area: Area2D) -> void:
    var enemy := area as Enemy
    if enemy:
        enemy.take_damage(10)

# ✅ Good: Type check
func process_node(node: Node) -> void:
    if node is Enemy:
        (node as Enemy).alert()
```

---

## Anti-Patterns

```toon
antipattern[5]{bad,good,reason}:
  var x = 10,"var x: int = 10","Missing type hint"
  func foo(a b),"func foo(a: int, b: int) -> int","Untyped parameters"
  @onready var n = $Node,"@onready var n: Node = $Node","Untyped onready"
  signal died(p),"signal died(player: Player)","Untyped signal param"
  Array[Variant],"Array[Enemy]","Use specific types"
```

---

## Performance Benefits

```toon
benefits[4]{feature,benefit}:
  Static typing,"Faster execution (up to 10x)"
  Type hints,"Better editor autocomplete"
  Return types,"Catch errors at write time"
  Typed arrays,"Memory efficiency + safety"
```

---

## Quick Reference

| Element | Syntax |
|---------|--------|
| Variable | `var name: Type = value` |
| Constant | `const NAME: Type = value` |
| Function | `func name(param: Type) -> ReturnType:` |
| Array | `var items: Array[Type] = []` |
| Export | `@export var name: Type = default` |
| Onready | `@onready var name: Type = $Path` |
| Signal | `signal name(param: Type)` |

---

**Applied in:** All phases with GDScript
**Related:** `skills/godot-expert/SKILL.md`

---

**Version:** 1.6.0 | **Last Updated:** 2025-12-26
