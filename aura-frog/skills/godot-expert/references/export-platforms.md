# Export Platforms Reference

**Version:** 1.6.0
**Skill:** godot-expert

---

## Platform Overview

| Platform | Output | Distribution | Requirements |
|----------|--------|--------------|--------------|
| HTML5 | `.html` + `.wasm` | itch.io, self-host | WebGL 2.0 browser |
| Android | `.apk` / `.aab` | Google Play, APK | Android SDK, JDK |
| iOS | `.ipa` | App Store | Xcode, Apple Developer |
| Windows | `.exe` | Steam, itch.io | Optional: Windows SDK |
| macOS | `.app` / `.dmg` | Steam, App Store | Xcode CLI tools |
| Linux | Binary | Steam, itch.io | None |

---

## HTML5 Export

### Setup

1. Download HTML5 export template from Godot
2. **Export Settings:**
   - VRAM Texture Compression: Enable ETC2/ASTC
   - Thread Support: Disable for better compatibility

### Configuration

```ini
# export_presets.cfg
[preset.0]
name="HTML5"
platform="Web"
runnable=true

[preset.0.options]
html/export_icon=true
html/custom_html_shell=""
html/head_include=""
html/canvas_resize_policy=2
html/experimental_virtual_keyboard=false
vram_texture_compression/for_desktop=false
vram_texture_compression/for_mobile=true
```

### HTML5-Specific Code

```gdscript
extends Node

func _ready() -> void:
    if OS.has_feature("web"):
        configure_for_web()

func configure_for_web() -> void:
    # Disable unsupported features
    $FullscreenButton.disabled = true

    # Adjust audio (Web Audio API limitations)
    AudioServer.set_bus_volume_db(0, -6)

    # Handle browser visibility
    get_tree().root.focus_entered.connect(_on_focus)
    get_tree().root.focus_exited.connect(_on_unfocus)

func _on_unfocus() -> void:
    get_tree().paused = true

func _on_focus() -> void:
    get_tree().paused = false

# Progressive loading for web
func load_level_web(path: String) -> void:
    $LoadingScreen.show()
    ResourceLoader.load_threaded_request(path)

    while true:
        var progress := []
        var status := ResourceLoader.load_threaded_get_status(path, progress)

        if status == ResourceLoader.THREAD_LOAD_LOADED:
            break
        elif status == ResourceLoader.THREAD_LOAD_FAILED:
            push_error("Failed to load: " + path)
            return

        $LoadingScreen.set_progress(progress[0] * 100)
        await get_tree().process_frame

    var scene := ResourceLoader.load_threaded_get(path)
    get_tree().change_scene_to_packed(scene)
```

### Hosting Requirements

```toon
hosting[4]{requirement,reason}:
  HTTPS,Required for SharedArrayBuffer (threads)
  COOP/COEP headers,Cross-origin isolation
  .wasm MIME type,application/wasm
  Gzip compression,Reduce download size
```

**Headers for Apache (.htaccess):**
```apache
<IfModule mod_headers.c>
    Header set Cross-Origin-Opener-Policy "same-origin"
    Header set Cross-Origin-Embedder-Policy "require-corp"
</IfModule>

AddType application/wasm .wasm
```

**Headers for nginx:**
```nginx
add_header Cross-Origin-Opener-Policy same-origin;
add_header Cross-Origin-Embedder-Policy require-corp;

types {
    application/wasm wasm;
}
```

---

## Android Export

### Setup Requirements

1. **Android SDK** (via Android Studio or command line)
2. **JDK 17** (OpenJDK recommended)
3. **Debug keystore** (auto-generated) or release keystore

### Configuration

```ini
# Editor Settings
export/android/android_sdk_path = "/path/to/android/sdk"
export/android/java_sdk_path = "/path/to/jdk-17"
export/android/debug_keystore = "~/.android/debug.keystore"

# export_presets.cfg
[preset.1]
name="Android"
platform="Android"

[preset.1.options]
package/unique_name="com.yourcompany.yourgame"
package/name="Your Game"
version/code=1
version/name="1.0.0"
screen/immersive_mode=true
screen/support_small=true
screen/support_normal=true
screen/support_large=true
screen/support_xlarge=true
architectures/armeabi-v7a=true
architectures/arm64-v8a=true
architectures/x86=false
architectures/x86_64=false
```

### Android-Specific Code

```gdscript
extends Node

func _ready() -> void:
    if OS.has_feature("android"):
        configure_for_android()

func configure_for_android() -> void:
    # Handle back button
    get_tree().set_auto_accept_quit(false)

    # Request permissions
    if not OS.has_feature("FEATURE_CAMERA"):
        OS.request_permissions()

func _notification(what: int) -> void:
    if what == NOTIFICATION_WM_GO_BACK_REQUEST:
        # Android back button pressed
        if can_go_back():
            go_back()
        else:
            show_quit_dialog()

# Safe area for notch/cutout
func _ready() -> void:
    var safe_area := DisplayServer.get_display_safe_area()
    $UI.offset_top = safe_area.position.y
    $UI.offset_left = safe_area.position.x

# Vibration feedback
func vibrate_short() -> void:
    if OS.has_feature("android"):
        Input.vibrate_handheld(50)

func vibrate_long() -> void:
    if OS.has_feature("android"):
        Input.vibrate_handheld(200)
```

### Google Play Requirements

```toon
requirements[5]{item,details}:
  Target API,API 34+ (Android 14)
  64-bit,arm64-v8a required
  App Bundle,.aab format for Play Store
  Signing,Release keystore required
  Privacy Policy,Required for all apps
```

### Release Build

```bash
# Generate release keystore
keytool -genkey -v -keystore release.keystore -alias my_key -keyalg RSA -keysize 2048 -validity 10000

# In Godot export settings:
# Keystore/Release: /path/to/release.keystore
# Keystore/Release User: my_key
# Keystore/Release Password: your_password
```

---

## iOS Export

### Setup Requirements

1. **macOS** with Xcode installed
2. **Apple Developer Account** ($99/year)
3. **Provisioning profiles** and certificates

### Configuration

```ini
# export_presets.cfg
[preset.2]
name="iOS"
platform="iOS"

[preset.2.options]
application/bundle_identifier="com.yourcompany.yourgame"
application/signature=""
application/short_version="1.0"
application/version="1"
application/min_ios_version="12.0"
capabilities/push_notifications=false
capabilities/game_center=false
```

### iOS-Specific Code

```gdscript
extends Node

func _ready() -> void:
    if OS.has_feature("ios"):
        configure_for_ios()

func configure_for_ios() -> void:
    # Handle safe area (notch, home indicator)
    apply_safe_area()

    # Request App Tracking Transparency (iOS 14.5+)
    # Required for IDFA access
    request_tracking_authorization()

func apply_safe_area() -> void:
    var safe_area := DisplayServer.get_display_safe_area()
    var screen_size := DisplayServer.screen_get_size()

    $UI.offset_top = safe_area.position.y
    $UI.offset_bottom = -(screen_size.y - safe_area.size.y - safe_area.position.y)
    $UI.offset_left = safe_area.position.x
    $UI.offset_right = -(screen_size.x - safe_area.size.x - safe_area.position.x)

# Haptic feedback (iOS)
func haptic_light() -> void:
    if OS.has_feature("ios"):
        Input.vibrate_handheld(10)

func haptic_medium() -> void:
    if OS.has_feature("ios"):
        Input.vibrate_handheld(50)
```

### App Store Requirements

```toon
requirements[6]{item,details}:
  Screenshots,Multiple device sizes required
  App Preview,Optional video trailer
  Privacy Labels,Data collection disclosure
  In-App Purchases,Managed through App Store Connect
  Age Rating,Questionnaire required
  Review Guidelines,No external payment links
```

### Export Workflow

```bash
# 1. Export from Godot (produces Xcode project)
# 2. Open in Xcode
open path/to/export/GameName.xcodeproj

# 3. Configure signing in Xcode
# 4. Archive and upload to App Store Connect
```

---

## Desktop Export

### Windows

```ini
[preset.3.options]
binary_format/embed_pck=true
application/icon="res://icon.ico"
application/console_wrapper=false
application/product_name="Your Game"
application/company_name="Your Company"
application/file_version="1.0.0.0"
application/product_version="1.0.0.0"
```

```gdscript
# Windows-specific
if OS.has_feature("windows"):
    # Set window position
    DisplayServer.window_set_position(Vector2i(100, 100))

    # Borderless fullscreen
    DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
```

### macOS

```ini
[preset.4.options]
binary_format/embed_pck=true
application/bundle_identifier="com.yourcompany.yourgame"
application/icon="res://icon.icns"
application/short_version="1.0"
application/version="1.0.0"
codesign/enable=true
codesign/identity=""
notarization/enable=false
```

### Linux

```ini
[preset.5.options]
binary_format/embed_pck=true
binary_format/64_bits=true
```

---

## Cross-Platform Patterns

### Platform Detection

```gdscript
func get_platform() -> String:
    if OS.has_feature("web"):
        return "web"
    elif OS.has_feature("android"):
        return "android"
    elif OS.has_feature("ios"):
        return "ios"
    elif OS.has_feature("windows"):
        return "windows"
    elif OS.has_feature("macos"):
        return "macos"
    elif OS.has_feature("linux"):
        return "linux"
    return "unknown"

func is_mobile() -> bool:
    return OS.has_feature("mobile")

func is_desktop() -> bool:
    return OS.has_feature("pc")

func is_touch_screen() -> bool:
    return DisplayServer.is_touchscreen_available()
```

### Responsive Controls

```gdscript
extends Node

@onready var virtual_joystick: Control = $VirtualJoystick
@onready var touch_buttons: Control = $TouchButtons

func _ready() -> void:
    if is_mobile() or is_touch_screen():
        enable_touch_controls()
    else:
        enable_keyboard_controls()

func enable_touch_controls() -> void:
    virtual_joystick.show()
    touch_buttons.show()

func enable_keyboard_controls() -> void:
    virtual_joystick.hide()
    touch_buttons.hide()
```

### Save Data Location

```gdscript
func get_save_path() -> String:
    # Returns appropriate path per platform:
    # Windows: %APPDATA%/godot/app_userdata/GameName/
    # macOS: ~/Library/Application Support/Godot/app_userdata/GameName/
    # Linux: ~/.local/share/godot/app_userdata/GameName/
    # Android: /data/data/com.company.game/files/
    # iOS: Documents folder
    # Web: IndexedDB
    return "user://save_data.json"
```

---

## Export Checklist

```toon
checklist[8]{item,platform}:
  Set unique bundle ID,All
  Configure app icon,All
  Enable VRAM compression,Mobile + Web
  Test touch controls,Mobile + Web
  Handle safe areas,Mobile
  Configure permissions,Mobile
  Set up signing,Mobile + macOS
  Test on device,All
```

---

**Version:** 1.6.0 | **Last Updated:** 2025-12-26
