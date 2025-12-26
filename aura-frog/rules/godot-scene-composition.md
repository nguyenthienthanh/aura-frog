# Godot Scene Composition

**Category:** Architecture
**Priority:** High
**Enforcement:** Code Review
**Version:** 1.6.0
**Agent:** game-developer

---

## Purpose

Define when to use scenes vs nodes, and how to compose complex game entities in Godot.

---

## Core Principle

**Composition over Inheritance** - Build complex entities by combining simple, reusable scenes.

---

## When to Use Scenes

### Create a Scene When:

```toon
use_scene[5]{scenario,reason}:
  Reusable entity,"Enemy, Bullet, Pickup, UI Panel"
  Complex hierarchy,"3+ nested nodes"
  Editor configuration,"Needs visual editing"
  Instance variations,"Multiple copies in game"
  Cross-scene usage,"Used in multiple levels"
```

### Example: Player Scene

```
player.tscn
├── Player (CharacterBody2D)
│   ├── Sprite2D
│   ├── CollisionShape2D
│   ├── AnimationPlayer
│   ├── Hitbox (Area2D)
│   │   └── CollisionShape2D
│   ├── Hurtbox (Area2D)
│   │   └── CollisionShape2D
│   └── StateMachine (Node)
│       ├── IdleState
│       ├── RunState
│       └── JumpState
```

---

## When to Use Nodes

### Keep as Nodes When:

```toon
use_node[4]{scenario,reason}:
  Simple addition,"Timer, AudioStreamPlayer"
  One-off element,"Single use in scene"
  No configuration needed,"Default settings work"
  Dynamic creation,"Created purely in code"
```

### Example: Simple Node Addition

```gdscript
# ✅ Good: Simple node added in code
func add_timer() -> void:
    var timer := Timer.new()
    timer.wait_time = 2.0
    timer.one_shot = true
    timer.timeout.connect(_on_timer_timeout)
    add_child(timer)
    timer.start()
```

---

## Scene Inheritance

### When to Inherit:

```toon
inherit[3]{scenario,example}:
  Shared base behavior,"EnemyBase → EnemyFlying, EnemyWalking"
  Common properties,"Pickup → HealthPickup, AmmoPickup"
  Variations,"Button → PrimaryButton, SecondaryButton"
```

### Example: Enemy Hierarchy

```
enemy_base.tscn (Base scene)
├── EnemyBase (CharacterBody2D)
│   ├── Sprite2D
│   ├── CollisionShape2D
│   └── Hurtbox (Area2D)

enemy_flying.tscn (Inherits enemy_base.tscn)
├── EnemyFlying (extends EnemyBase)
│   └── + WingSprite2D (added node)

enemy_walker.tscn (Inherits enemy_base.tscn)
├── EnemyWalker (extends EnemyBase)
│   └── + FootstepAudio (added node)
```

---

## Composition Patterns

### Component Pattern

```gdscript
# Separate concerns into component scenes
player.tscn
├── Player (CharacterBody2D)
│   ├── HealthComponent (scene instance)
│   ├── MovementComponent (scene instance)
│   ├── CombatComponent (scene instance)
│   └── InventoryComponent (scene instance)

# health_component.gd
class_name HealthComponent
extends Node

signal health_changed(current: int, max: int)
signal died

@export var max_health: int = 100
var current_health: int

func take_damage(amount: int) -> void:
    current_health = max(0, current_health - amount)
    health_changed.emit(current_health, max_health)
    if current_health == 0:
        died.emit()
```

### State Machine Pattern

```gdscript
# state_machine.gd
class_name StateMachine
extends Node

@export var initial_state: State

var current_state: State
var states: Dictionary = {}

func _ready() -> void:
    for child in get_children():
        if child is State:
            states[child.name.to_lower()] = child
            child.state_machine = self

    if initial_state:
        current_state = initial_state
        current_state.enter()

func transition_to(state_name: String) -> void:
    if current_state:
        current_state.exit()
    current_state = states.get(state_name.to_lower())
    if current_state:
        current_state.enter()
```

---

## Anti-Patterns

### Avoid These:

```toon
antipattern[4]{bad,good,reason}:
  God scene,"Component scenes","Single scene doing everything"
  Deep inheritance,"Composition","More than 2 levels deep"
  Node soup,"Organized hierarchy","Flat structure with 20+ nodes"
  Script-only entities,"Scene files","No visual representation"
```

### Example: God Scene (Bad)

```
# ❌ Bad: One scene with everything
game.tscn
├── Game (Node2D)
│   ├── Player
│   ├── Enemy1, Enemy2, Enemy3...
│   ├── Bullet1, Bullet2...
│   ├── UI elements...
│   └── 50+ more nodes...
```

### Example: Organized (Good)

```
# ✅ Good: Scene instances
level_01.tscn
├── Level (Node2D)
│   ├── Environment (TileMap)
│   ├── Entities (Node2D)
│   │   ├── player.tscn (instance)
│   │   └── EnemySpawner
│   ├── Collectibles (Node2D)
│   └── UI (CanvasLayer)
│       └── hud.tscn (instance)
```

---

## Directory Structure

```toon
structure[6]{folder,contents}:
  scenes/player/,"player.tscn, player_hud.tscn"
  scenes/enemies/,"enemy_base.tscn, enemy_*.tscn"
  scenes/projectiles/,"bullet.tscn, rocket.tscn"
  scenes/pickups/,"health.tscn, ammo.tscn"
  scenes/ui/,"main_menu.tscn, pause_menu.tscn, hud.tscn"
  scenes/levels/,"level_01.tscn, level_02.tscn"
```

---

## Quick Reference

| Question | Answer |
|----------|--------|
| Reused in multiple places? | → Scene |
| Needs editor configuration? | → Scene |
| Has 3+ child nodes? | → Scene |
| Complex behavior? | → Scene |
| Simple, one-off addition? | → Node |
| Created dynamically once? | → Node |

---

**Applied in:** Phase 2 (Design), Phase 5b (Implementation)
**Related:** `skills/godot-expert/SKILL.md`

---

**Version:** 1.6.0 | **Last Updated:** 2025-12-26
