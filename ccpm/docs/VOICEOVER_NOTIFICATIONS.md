# Voiceover Notifications System

**Version:** 5.1.0
**Purpose:** Automatic voice notifications for approval gates and critical events
**Last Updated:** 2025-11-27

---

## 🎯 Overview

CCPM now includes **automatic voiceover notifications** that alert you when your action is required during workflows. Never miss an approval gate again!

---

## ✨ Features

### Automatic Notifications

**1. Approval Gates (Stop Hook)**
- Triggers when Claude stops for approval
- Plays audio: "Attention please. Your attention is needed. Your approval is required to continue."
- Auto-plays on macOS (afplay)
- Happens at every phase completion

**2. Critical Errors (Notification Hook)**
- Triggers on errors, failures, critical issues
- Plays audio: "Alert. [error message]. Please review the error and provide guidance."
- Helps catch problems immediately

---

## 🔧 Setup

### Prerequisites

**Required:**
- ElevenLabs API account (free tier available)
- API key from https://elevenlabs.io/app/settings/api-keys

**Optional:**
- macOS for auto-play (uses afplay)
- Linux: install `mpg123` or similar
- Windows: install audio player

### Quick Setup

**1. Get ElevenLabs API Key:**
```bash
# Sign up at https://elevenlabs.io
# Navigate to Settings → API Keys
# Copy your API key
```

**2. Add to Environment:**
```bash
# Add to .envrc (recommended) or .env
export ELEVENLABS_API_KEY="your_api_key_here"

# Optional: Choose voice
export ELEVENLABS_VOICE_ID="21m00Tcm4TlvDq8ikWAM"  # Rachel (default)
```

**3. Reload Environment:**
```bash
# If using .envrc with direnv
direnv allow

# Or source manually
source .envrc
```

**That's it!** Voiceover notifications will now work automatically.

---

## 🎙️ How It Works

### Approval Gate Flow

```
Workflow Phase Completes
  ↓
Claude shows approval gate
  ↓
Claude stops (waits for user input)
  ↓
Stop hook triggers automatically
  ↓
bash scripts/voice-notify.sh is executed
  ↓
ElevenLabs API generates audio
  ↓
Audio saved to .claude/logs/audio/approval-gate_*.mp3
  ↓
Auto-plays (macOS: afplay)
  ↓
User hears "Your attention is needed"
```

### Script: voice-notify.sh

**Location:** `scripts/voice-notify.sh`

**Usage:**
```bash
bash scripts/voice-notify.sh "Message" "notification-type"
```

**Notification Types:**
- `approval-gate` - For approval gates
- `error` - For errors and failures
- `warning` - For warnings
- `completion` - For successful completions
- `general` - Generic notifications

**Examples:**
```bash
# Approval notification
bash scripts/voice-notify.sh "Phase complete" "approval-gate"
# → "Attention please. Phase complete. Your approval is required to continue."

# Error notification
bash scripts/voice-notify.sh "Build failed" "error"
# → "Alert. Build failed. Please review the error and provide guidance."

# Completion notification
bash scripts/voice-notify.sh "All tests passing" "completion"
# → "Great news. All tests passing. The task has been completed successfully."
```

---

## 🎨 Customization

### Change Voice

**Available Voices:**
```bash
# Rachel (default) - Calm, professional
export ELEVENLABS_VOICE_ID="21m00Tcm4TlvDq8ikWAM"

# Bella - Warm, friendly
export ELEVENLABS_VOICE_ID="EXAVITQu4vr4xnSDxMaL"

# Antoni - Deep, authoritative
export ELEVENLABS_VOICE_ID="ErXwobaYiN019PkySvjV"

# Elli - Energetic, youthful
export ELEVENLABS_VOICE_ID="MF3mGyEYCl7XYWbV9V6O"

# Josh - Clear, articulate
export ELEVENLABS_VOICE_ID="TxGEqnHWrfWFTfGW9XjX"
```

**Browse more voices:** https://elevenlabs.io/voice-library

### Adjust Voice Settings

Edit `scripts/voice-notify.sh` to customize:

```json
{
  "voice_settings": {
    "stability": 0.5,           // 0-1 (higher = more consistent)
    "similarity_boost": 0.75,   // 0-1 (higher = closer to original)
    "style": 0.0,               // 0-1 (exaggeration level)
    "use_speaker_boost": true   // Enhance clarity
  }
}
```

### Custom Messages

Edit `scripts/voice-notify.sh` case statement:

```bash
case "$NOTIFICATION_TYPE" in
  "approval-gate")
    FULL_MESSAGE="Attention please. $MESSAGE. Your approval is required to continue."
    ;;
  "custom-type")
    FULL_MESSAGE="Your custom prefix. $MESSAGE. Your custom suffix."
    ;;
esac
```

---

## 🔕 Disable Voiceover

### Temporarily Disable

```bash
# Remove or comment out API key
# export ELEVENLABS_API_KEY=""

# Script will gracefully skip if no API key
```

### Permanently Disable

**Option 1: Remove hooks**

Edit `hooks/hooks.json`, remove Stop and Notification hooks:
```json
{
  "hooks": {
    // Remove "Stop" and "Notification" sections
  }
}
```

**Option 2: Disable in script**

Add to top of `scripts/voice-notify.sh`:
```bash
exit 0  # Always skip voiceover
```

---

## 🎵 Audio Output

### File Location

```
.claude/logs/audio/
├── approval-gate_20251127_143022.mp3
├── approval-gate_20251127_143145.mp3
├── error_20251127_143230.mp3
└── completion_20251127_143401.mp3
```

### File Naming

Pattern: `{type}_{timestamp}.mp3`
- `type`: approval-gate, error, warning, completion, general
- `timestamp`: YYYYMMDD_HHMMSS

### Audio Format

- **Format:** MP3
- **Sample Rate:** 44.1 kHz
- **Bitrate:** 128 kbps
- **Channels:** Mono
- **Size:** ~20-50KB per notification (3-5 seconds)
- **Model:** eleven_turbo_v2_5 (free tier compatible)

---

## 🧹 Automatic Cleanup

**Voice files are automatically cleaned up to save disk space!**

### How It Works

**SessionEnd Hook (Automatic):**
- Runs when you close Claude Code session
- Finds audio files older than 7 days
- Deletes them automatically
- Silent operation (no prompts)
- Shows message if files were deleted

**Why 7 Days:**
- Recent files useful for debugging
- Prevents disk space buildup
- Typical workflow cycle

### Manual Cleanup

**Interactive cleanup (with confirmation):**
```bash
cd ~/.claude/plugins/marketplaces/ethan-ccpm/ccpm
bash scripts/cleanup-voice.sh
```

**Example output:**
```
🧹 CCPM Voice File Cleanup
==========================

📊 Audio files statistics:
   Directory: .claude/logs/audio
   Total files: 45
   Total size: 1.2M

🔍 Finding files older than 7 days...
   Found 28 files

Delete 28 old audio files? (y/N) y

✅ Cleanup complete!
   Files deleted: 28
   Files remaining: 17
   Current size: 680K
```

**Custom age threshold:**
```bash
# Clean files older than 3 days
bash scripts/cleanup-voice.sh 3

# Clean files older than 30 days
bash scripts/cleanup-voice.sh 30
```

### Storage Impact

**Typical usage:**
- 1 workflow ≈ 3-5 voice files (one per approval gate)
- Each file ≈ 30KB
- 10 workflows ≈ 1.5MB
- 100 workflows ≈ 15MB

**With auto-cleanup (7 days):**
- Maximum ~10-20 workflows worth of audio files
- ~3-6MB maximum
- Minimal disk usage
- No manual maintenance needed

### Disable Automatic Cleanup

If you want to keep all audio files:

1. Edit `~/.claude/plugins/marketplaces/ethan-ccpm/ccpm/hooks/hooks.json`
2. Remove the SessionEnd cleanup hook (line with "Clean up old voice files")
3. Files will be kept indefinitely

---

## 🛠️ Troubleshooting

### Issue: No audio plays

**Check:**
1. API key set correctly: `echo $ELEVENLABS_API_KEY`
2. Script executable: `chmod +x scripts/voice-notify.sh`
3. ElevenLabs credits available: Check dashboard
4. Audio file created: `ls -la .claude/logs/audio/`

**macOS:** Verify afplay works: `afplay /System/Library/Sounds/Glass.aiff`

### Issue: "API key not configured"

```bash
# Verify environment variable
echo $ELEVENLABS_API_KEY

# If empty, add to .envrc
echo 'export ELEVENLABS_API_KEY="your_key"' >> .envrc
direnv allow
```

### Issue: Script fails but workflow continues

**Expected behavior!** Voice notifications are non-blocking:
- Script uses `|| true` to never fail workflows
- If ElevenLabs unavailable, workflow continues silently
- Check `.claude/logs/audio/` for error logs

### Issue: Audio doesn't auto-play

**Platform-specific:**

**macOS:**
```bash
# Test afplay
afplay .claude/logs/audio/approval-gate_*.mp3
```

**Linux:**
```bash
# Install audio player
sudo apt-get install mpg123

# Edit voice-notify.sh, replace afplay with:
mpg123 "$OUTPUT_FILE" &
```

**Windows:**
```bash
# Edit voice-notify.sh, replace afplay with:
start "$OUTPUT_FILE" &
```

---

## 💡 Use Cases

### 1. Multi-tasking Development
- Start workflow
- Work on other tasks
- Hear notification when approval needed
- Return to approve

### 2. Accessibility
- Vision-impaired developers
- Audio-first workflow
- Hands-free development

### 3. Long-running Workflows
- Phase 1-4 planning takes time
- Get notified when ready for Phase 5 (implementation)
- No need to watch screen constantly

### 4. Team Notifications
- Pair programming
- One person codes, other reviews
- Audio alerts both people

---

## 📊 API Usage & Cost

### ElevenLabs Free Tier
- **10,000 characters/month** free
- Each notification ≈ 50 characters
- ≈ **200 notifications/month** free

### Paid Plans
- **Starter:** $5/month - 30,000 characters
- **Creator:** $22/month - 100,000 characters
- **Professional:** $99/month - 500,000 characters

### Cost Per Notification
- Average notification: 50 characters
- Starter plan: $0.17 per 1,000 notifications
- Very cost-effective for team use

**Learn more:** https://elevenlabs.io/pricing

---

## 🔗 Related Documentation

- **Voice Operations Agent:** `agents/voice-operations.md`
- **Hooks System:** `hooks/README.md`
- **Integration Setup:** `docs/INTEGRATION_SETUP_GUIDE.md`
- **Approval Gates:** `docs/APPROVAL_GATES.md`

---

## 🚀 Future Enhancements

**Planned Features:**
- Custom messages per phase
- Different voices per notification type
- Volume control
- Notification preferences (which events to voice)
- Multi-language support
- Voice command responses ("Approved" → Voice: "Proceeding to next phase")

---

**Version:** 5.1.0
**Last Updated:** 2025-11-27
**Status:** Active feature - Works out of the box with ElevenLabs API key
