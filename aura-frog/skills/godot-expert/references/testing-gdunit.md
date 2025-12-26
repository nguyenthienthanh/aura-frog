# GDUnit Testing Reference

**Version:** 1.6.0
**Skill:** godot-expert

---

## Overview

GDUnit4 is the primary testing framework for Godot 4.x. It provides unit testing, scene testing, mocking, and assertions.

---

## Setup

### Installation

1. **Via AssetLib:**
   - AssetLib > Search "GDUnit4" > Download > Install

2. **Via Git:**
   ```bash
   cd addons
   git clone https://github.com/MikeSchulze/gdUnit4.git gdunit4
   ```

3. **Enable Plugin:**
   - Project > Project Settings > Plugins > Enable "GDUnit4"

### Project Structure

```
project/
├── addons/
│   └── gdunit4/          # GDUnit plugin
├── test/                  # All tests here
│   ├── player/
│   │   └── test_player.gd
│   ├── enemies/
│   │   └── test_enemy.gd
│   └── utils/
│       └── test_helpers.gd
└── ...
```

---

## Basic Test Structure

```gdscript
# test/player/test_player.gd
extends GdUnitTestSuite

# Called before each test
func before_test() -> void:
    pass

# Called after each test
func after_test() -> void:
    pass

# Called once before all tests in suite
func before() -> void:
    pass

# Called once after all tests in suite
func after() -> void:
    pass

# Test methods must start with "test_"
func test_example() -> void:
    assert_bool(true).is_true()
```

---

## Assertions

### Boolean

```gdscript
func test_boolean_assertions() -> void:
    assert_bool(true).is_true()
    assert_bool(false).is_false()
    assert_bool(1 == 1).is_true()
```

### Numbers

```gdscript
func test_number_assertions() -> void:
    assert_int(42).is_equal(42)
    assert_int(10).is_greater(5)
    assert_int(5).is_less(10)
    assert_int(7).is_between(5, 10)
    assert_int(10).is_in([5, 10, 15])

    assert_float(3.14).is_equal_approx(3.14159, 0.01)
    assert_float(5.0).is_greater(4.0)
```

### Strings

```gdscript
func test_string_assertions() -> void:
    assert_str("hello").is_equal("hello")
    assert_str("hello world").contains("world")
    assert_str("hello").starts_with("he")
    assert_str("hello").ends_with("lo")
    assert_str("hello").has_length(5)
    assert_str("").is_empty()
    assert_str("hello").is_not_empty()
```

### Arrays

```gdscript
func test_array_assertions() -> void:
    var arr := [1, 2, 3]

    assert_array(arr).has_size(3)
    assert_array(arr).contains([1, 2])
    assert_array(arr).contains_exactly([1, 2, 3])
    assert_array(arr).not_contains([4, 5])
    assert_array([]).is_empty()
```

### Dictionaries

```gdscript
func test_dict_assertions() -> void:
    var dict := {"name": "Player", "health": 100}

    assert_dict(dict).contains_keys(["name", "health"])
    assert_dict(dict).contains_key_value("name", "Player")
    assert_dict({}).is_empty()
```

### Objects

```gdscript
func test_object_assertions() -> void:
    var player := Player.new()

    assert_object(player).is_not_null()
    assert_object(player).is_instanceof(Player)
    assert_object(null).is_null()
```

### Vectors

```gdscript
func test_vector_assertions() -> void:
    var v := Vector2(3, 4)

    assert_vector(v).is_equal(Vector2(3, 4))
    assert_vector(v).is_equal_approx(Vector2(3.01, 4.01), 0.1)
    assert_vector(Vector2.ZERO).is_equal(Vector2.ZERO)
```

---

## Scene Testing

### Testing Instanced Scenes

```gdscript
extends GdUnitTestSuite

var player: Player

func before_test() -> void:
    # auto_free ensures cleanup after test
    player = auto_free(preload("res://scenes/player/player.tscn").instantiate())
    add_child(player)

func test_player_initial_state() -> void:
    assert_int(player.health).is_equal(100)
    assert_bool(player.is_alive).is_true()

func test_player_movement() -> void:
    player.velocity = Vector2(100, 0)
    # Simulate physics frame
    await await_idle_frame()
    # Check position changed
    assert_vector(player.position).is_not_equal(Vector2.ZERO)
```

### Testing Node Hierarchy

```gdscript
func test_scene_structure() -> void:
    var scene := auto_free(preload("res://scenes/player/player.tscn").instantiate())

    # Verify nodes exist
    assert_object(scene.get_node_or_null("Sprite2D")).is_not_null()
    assert_object(scene.get_node_or_null("CollisionShape2D")).is_not_null()
    assert_object(scene.get_node_or_null("AnimationPlayer")).is_not_null()
```

---

## Signal Testing

### Basic Signal Assertion

```gdscript
func test_signal_emitted() -> void:
    var player := auto_free(Player.new())

    # Create signal collector
    var collector := signal_collector(player, "died")

    # Trigger the signal
    player.health = 0
    player.check_death()

    # Assert signal was emitted
    await assert_signal(collector).is_emitted("died")
```

### Signal with Arguments

```gdscript
func test_signal_with_args() -> void:
    var player := auto_free(Player.new())
    var collector := signal_collector(player, "health_changed")

    player.take_damage(25)

    # Assert signal emitted with specific args
    await assert_signal(collector).is_emitted("health_changed", [75, 100])
```

### Signal Not Emitted

```gdscript
func test_signal_not_emitted() -> void:
    var player := auto_free(Player.new())
    var collector := signal_collector(player, "died")

    player.take_damage(10)  # Not enough to die

    await assert_signal(collector).is_not_emitted("died")
```

---

## Mocking

### Mock Objects

```gdscript
func test_with_mock() -> void:
    # Create mock of Enemy class
    var enemy_mock := mock(Enemy) as Enemy

    # Define mock behavior
    do_return(50).on(enemy_mock).get_damage()

    # Use mock
    var damage := enemy_mock.get_damage()
    assert_int(damage).is_equal(50)

    # Verify method was called
    verify(enemy_mock).get_damage()
```

### Spy Objects

```gdscript
func test_with_spy() -> void:
    var player := auto_free(Player.new())
    var player_spy := spy(player)

    player_spy.take_damage(25)

    # Verify method was called with args
    verify(player_spy).take_damage(25)

    # Verify call count
    verify(player_spy, 1).take_damage(any_int())
```

---

## Async Testing

### Await Frame

```gdscript
func test_async_behavior() -> void:
    var player := auto_free(Player.new())
    add_child(player)

    player.start_jump()

    # Wait for physics frames
    await await_idle_frame()
    await await_idle_frame()

    assert_bool(player.is_jumping).is_true()
```

### Await Timer

```gdscript
func test_timed_behavior() -> void:
    var bomb := auto_free(Bomb.new())
    add_child(bomb)

    bomb.start_countdown()

    # Wait for explosion (2 seconds)
    await await_millis(2100)

    assert_bool(bomb.has_exploded).is_true()
```

### Await Signal with Timeout

```gdscript
func test_signal_with_timeout() -> void:
    var player := auto_free(Player.new())
    var collector := signal_collector(player, "animation_finished")

    player.play_attack()

    # Wait for signal with 5 second timeout
    await assert_signal(collector).wait_until(5000).is_emitted("animation_finished")
```

---

## Parameterized Tests

```gdscript
func test_damage_calculation(
    base_damage: int,
    multiplier: float,
    expected: int,
    test_parameters := [
        [10, 1.0, 10],
        [10, 1.5, 15],
        [10, 2.0, 20],
        [25, 1.0, 25],
        [25, 2.0, 50],
    ]
) -> void:
    var result := calculate_damage(base_damage, multiplier)
    assert_int(result).is_equal(expected)

func calculate_damage(base: int, mult: float) -> int:
    return int(base * mult)
```

---

## Test Organization

### Test Categories

```gdscript
# Use @gdunit_test annotation for categorization
@gdunit_test("unit")
func test_unit_logic() -> void:
    pass

@gdunit_test("integration")
func test_scene_integration() -> void:
    pass

@gdunit_test("slow")
func test_performance() -> void:
    pass
```

### Skip Tests

```gdscript
# Skip test conditionally
func test_mobile_only() -> void:
    if not OS.has_feature("mobile"):
        skip("This test requires mobile platform")
        return
    # ... test code
```

---

## Running Tests

### From Editor

1. **GDUnit Panel:** Bottom panel > GDUnit
2. **Run All:** Click "Run All Tests"
3. **Run Single:** Right-click test method > Run

### From Command Line

```bash
# Run all tests
godot --headless -s addons/gdunit4/bin/GdUnitCmdTool.gd --add test/

# Run specific test file
godot --headless -s addons/gdunit4/bin/GdUnitCmdTool.gd --add test/player/test_player.gd

# Run with verbose output
godot --headless -s addons/gdunit4/bin/GdUnitCmdTool.gd --add test/ -v
```

### CI/CD Integration

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: barichello/godot-ci:4.2

    steps:
      - uses: actions/checkout@v4

      - name: Run tests
        run: |
          godot --headless -s addons/gdunit4/bin/GdUnitCmdTool.gd \
            --add test/ \
            --report-directory reports/

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: reports/
```

---

## Best Practices

### Test Naming

```gdscript
# Good: Descriptive names
func test_player_dies_when_health_reaches_zero() -> void:
func test_enemy_attacks_when_player_in_range() -> void:
func test_score_increases_on_coin_collection() -> void:

# Bad: Vague names
func test_player() -> void:
func test_health() -> void:
func test_1() -> void:
```

### Arrange-Act-Assert

```gdscript
func test_player_takes_damage() -> void:
    # Arrange
    var player := auto_free(Player.new())
    player.health = 100

    # Act
    player.take_damage(25)

    # Assert
    assert_int(player.health).is_equal(75)
```

### Isolation

```gdscript
# Each test should be independent
func before_test() -> void:
    # Fresh instance for each test
    player = auto_free(Player.new())
    player.reset()

func test_one() -> void:
    player.health = 50  # Doesn't affect test_two

func test_two() -> void:
    assert_int(player.health).is_equal(100)  # Starts fresh
```

---

## Common Patterns

### Testing Resource Loading

```gdscript
func test_weapon_resource() -> void:
    var weapon := load("res://resources/weapons/sword.tres") as WeaponStats

    assert_object(weapon).is_not_null()
    assert_str(weapon.name).is_equal("Sword")
    assert_int(weapon.damage).is_greater(0)
```

### Testing Autoload/Singletons

```gdscript
func test_game_manager() -> void:
    # Access autoload
    var gm := get_tree().root.get_node("GameManager")

    gm.reset_game()
    assert_int(gm.score).is_equal(0)
    assert_int(gm.level).is_equal(1)
```

### Testing Input

```gdscript
func test_player_responds_to_input() -> void:
    var player := auto_free(Player.new())
    add_child(player)

    # Simulate input
    Input.action_press("move_right")
    await await_idle_frame()

    assert_float(player.velocity.x).is_greater(0)

    Input.action_release("move_right")
```

---

**Version:** 1.6.0 | **Last Updated:** 2025-12-26
