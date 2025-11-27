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

**1. Approval Gates (Stop Hook) - Context-Aware! 🎯**
- Triggers when Claude stops for approval
- **Intelligently reads conversation context**
- Auto-plays on macOS (afplay)
- Happens at every phase completion

**Example Messages:**
- Generic: "Hey, I need your input to continue."
- Phase 2: "Hey, Phase 2 - Design deliverables ready for review"
- Phase 5a: "Hey, Phase 5a approval needed"
- Tests: "Hey, All tests passed - review needed"
- Code Review: "Hey, Code review complete - approval needed"

**How It Works:**
- Reads the conversation transcript
- Extracts phase information and context
- Summarizes key points (under 15 words)
- Plays natural, context-aware message

**2. Critical Errors (Notification Hook)**
- Triggers on errors, failures, critical issues
- Plays audio: "Heads up, something went wrong. Check the error when you can."
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

### Approval Gate Flow (Context-Aware)

```
Workflow Phase Completes
  ↓
Claude shows approval gate
  ↓
Claude stops (waits for user input)
  ↓
Stop hook triggers automatically
  ↓
hooks/stop-voice-notify.sh is executed
  ↓
Read conversation transcript (JSON)
  ↓
Extract context:
  - Phase number (Phase 2, Phase 5a, etc.)
  - Deliverables type (design, tests, code review)
  - Status (passed, failed, complete)
  ↓
Summarize to under 15 words
  ↓
Call scripts/voice-notify.sh with context
  ↓
ElevenLabs API generates audio
  ↓
Audio saved to .claude/logs/audio/approval-gate_*.mp3
  ↓
Auto-plays (macOS: afplay)
  ↓
User hears: "Hey, Phase 2 - Design deliverables ready for review"
  ↓
Audio file deleted after playback
```

### Context Extraction Examples

**Transcript contains:** `"Phase 2: Design - Technical Architecture..."`
**Voiceover says:** "Hey, Phase 2 - Design deliverables ready for review"

**Transcript contains:** `"All tests pass. ✅ Ready for review"`
**Voiceover says:** "Hey, All tests passed - review needed"

**Transcript contains:** `"Code review complete. Please approve to continue."`
**Voiceover says:** "Hey, Code review complete - approval needed"

**No specific context found:**
**Voiceover says:** "Hey, I need your input to continue."

### Script: stop-voice-notify.sh (NEW!)

**Location:** `hooks/stop-voice-notify.sh`

**Purpose:** Context-aware hook that extracts approval context from conversation

**How It Works:**
1. Reads conversation transcript JSON from stdin
2. Extracts last assistant message
3. Parses phase information, deliverables, status
4. Summarizes to under 15 words
5. Calls `voice-notify.sh` with context

**Context Patterns Detected:**
- Phase numbers: `Phase 2`, `Phase 5a`, etc.
- Deliverables: `design`, `test plan`, `requirements`
- Test status: `tests pass`, `tests fail`
- Code review: `code review complete`

**Automatic Invocation:** Called by Stop hook in `hooks.json`

---

### Script: voice-notify.sh

**Location:** `scripts/voice-notify.sh`

**Usage:**
```bash
bash scripts/voice-notify.sh "Context message" "notification-type"
```

**Notification Types:**
- `approval-gate` - For approval gates
- `error` - For errors and failures
- `warning` - For warnings
- `completion` - For successful completions
- `general` - Generic notifications

**Examples:**
```bash
# Approval notification (generic)
bash scripts/voice-notify.sh "" "approval-gate"
# → "Hey, I need your input to continue."

# Approval with context (from stop-voice-notify.sh)
bash scripts/voice-notify.sh "Phase 2 approval needed" "approval-gate"
# → "Hey, Phase 2 approval needed"

bash scripts/voice-notify.sh "Design deliverables ready for review" "approval-gate"
# → "Hey, Design deliverables ready for review"

# Error notification
bash scripts/voice-notify.sh "" "error"
# → "Heads up, something went wrong. Check the error when you can."

# Warning notification
bash scripts/voice-notify.sh "" "warning"
# → "Just a heads up, you might want to check this."

# Completion notification
bash scripts/voice-notify.sh "" "completion"
# → "All done! Task completed successfully."
```

**Note:**
- For `approval-gate` type: Context message is prefixed with "Hey, " automatically
- For other types: Fixed messages are used (context ignored)
- Keep context under 15 words for natural speech

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

Edit `scripts/voice-notify.sh` case statement to change the natural messages:

```bash
case "$NOTIFICATION_TYPE" in
  "approval-gate")
    FULL_MESSAGE="Hey, I need your input to continue."
    ;;
  "error")
    FULL_MESSAGE="Heads up, something went wrong. Check the error when you can."
    ;;
  "custom-type")
    FULL_MESSAGE="Your custom message here."
    ;;
esac
```

**Tips for natural voiceover:**
- Keep it short (under 10 words)
- Use conversational language ("Hey" not "Attention please")
- Be friendly and casual
- Avoid robotic phrases like "Your approval is required"

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

**Voice files are automatically deleted after playback!**

### How It Works

**Immediate Deletion (macOS):**
- Audio plays synchronously (afplay waits for completion)
- File is deleted immediately after playback
- Zero disk usage
- No manual cleanup needed

**Example output:**
```
🔊 Generating voiceover...
✅ Voiceover generated
🔊 Playing notification...
🗑️  Audio file deleted after playback
```

**Non-macOS Platforms:**
- Files are saved to `.claude/logs/audio/`
- User needs to manually play and delete
- Use cleanup script for batch deletion

### Manual Cleanup (Non-macOS or Troubleshooting)

**If you need to clean up manually:**
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
   Total files: 5
   Total size: 150K

🔍 Finding files older than 7 days...
   Found 5 files

Delete 5 old audio files? (y/N) y

✅ Cleanup complete!
```

### Storage Impact

**macOS (Automatic deletion):**
- ✅ Zero disk usage
- ✅ Files deleted immediately after playback
- ✅ No manual maintenance

**Non-macOS:**
- Files accumulate in `.claude/logs/audio/`
- Use cleanup script periodically
- Each file ≈ 30KB

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
