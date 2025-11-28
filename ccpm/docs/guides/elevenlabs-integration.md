# ElevenLabs AI Integration Guide

**Version:** 1.0.0
**Last Updated:** 2025-11-26
**Purpose:** Setup and use ElevenLabs AI voice generation in CCPM workflows

---

## 🎯 Overview

This guide will help you integrate ElevenLabs AI text-to-speech capabilities into your CCPM workflow system for documentation narration, voice notifications, and accessibility features.

---

## 📋 Prerequisites

### Required
- ElevenLabs account (free or paid)
- API key from ElevenLabs
- CCPM Team Agents System installed
- Project context configured

### Optional
- Confluence access (for uploading audio)
- Slack webhook (for voice notifications)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get ElevenLabs API Key

1. Go to [ElevenLabs](https://elevenlabs.io)
2. Sign up or log in
3. Navigate to **Settings** → **API Keys**
4. Click **Create API Key**
5. Copy the key (keep it secure!)

**Free Tier Includes:**
- 10,000 characters/month
- 3 custom voices
- Multilingual support

**Pricing (as of 2025):**
- Free: $0/month (10K characters)
- Starter: $5/month (30K characters)
- Creator: $11/month (100K characters)
- Pro: $99/month (500K characters)

### Step 2: Configure Environment Variable

Add to your `.env` or `.envrc`:

```bash
# .env
ELEVENLABS_API_KEY="your_api_key_here"
```

Or for `direnv` users:

```bash
# .envrc
export ELEVENLABS_API_KEY="your_api_key_here"

# Apply changes
direnv allow .
```

**Verify:**
```bash
echo $ELEVENLABS_API_KEY
# Should print your API key
```

### Step 3: Enable in Project Context

Edit `.claude/project-contexts/[your-project]/project-config.yaml`:

```yaml
project:
  name: "your-project-name"
  # ... other settings

integrations:
  # ... other integrations (jira, confluence, slack)

  elevenlabs:
    enabled: true
    api_key: ${ELEVENLABS_API_KEY}

    # Voice settings
    voice:
      default_voice_id: "21m00Tcm4TlvDq8ikWAM"  # Rachel
      model: "eleven_multilingual_v2"
      stability: 0.5
      similarity_boost: 0.75

    # Features
    features:
      documentation_narration: true  # ✅ Enable audio docs
      workflow_notifications: false  # Optional
      approval_prompts: false        # Optional

    # Output
    output:
      format: "mp3_44100_128"
      directory: ".claude/logs/audio/"
```

### Step 4: Test Voice Generation

```bash
# In Claude Code conversation:
voice:test
```

**Expected Output:**
```
🎙️ Testing Voice Generation

Sample Text: "Hello! This is a test of the ElevenLabs voice generation..."

Generating audio...
✅ Success!

Generated: .claude/logs/audio/voice_test_2025-11-26.mp3
Duration: 8 seconds
Size: 128 KB

Voice quality: ⭐⭐⭐⭐⭐
```

**✅ If successful, you're ready to use voice features!**

---

## 🎙️ Using Voice Features

### 1. Documentation Narration (Primary Use)

After Phase 8 (Documentation) completes, you'll see:

```
🎙️  VOICE NARRATION AVAILABLE (Optional)

Generate audio narration for documentation?
Options:
  "narrate all" → Generate audio for all documents
  "narrate summary" → Only implementation summary
  "skip narration" → No audio generation
```

**Type:** `narrate all`

**Result:**
```
🎙️ Generating Audio Narration...

[1/3] IMPLEMENTATION_SUMMARY.md
      Converting 1,245 words → ~8 min audio
      ✅ Generated: implementation_summary.mp3 (3.2 MB)

[2/3] DEPLOYMENT_GUIDE.md
      Converting 823 words → ~5 min audio
      ✅ Generated: deployment_guide.mp3 (2.1 MB)

[3/3] CHANGELOG.md
      Converting 342 words → ~2 min audio
      ✅ Generated: changelog.mp3 (1.1 MB)

✅ All audio files generated!

📁 Location: .claude/logs/audio/workflow-123/
Total duration: ~15 minutes
Total size: 6.4 MB

🔗 Play audio:
open .claude/logs/audio/workflow-123/implementation_summary.mp3
```

### 2. Manual Voice Generation

**Narrate text directly:**
```
voice:narrate "The implementation is complete. All tests are passing."
```

**Narrate from file:**
```
voice:narrate:file README.md
```

**With voice customization:**
```
voice:narrate "Important announcement [whispers] classified information" --voice="Antoni"
```

**Multilingual:**
```
voice:narrate "Hola equipo, el proyecto está completo" --language="es"
```

### 3. Voice Settings Management

**View current settings:**
```
voice:settings
```

**List available voices:**
```
voice:voices
```

**Change default voice:**
```
voice:settings:edit
```

---

## 🎨 Voice Customization

### Available Voices

**Pre-made Voices (Most Popular):**

1. **Rachel** (21m00Tcm4TlvDq8ikWAM) - ⭐ Default
   - Female, American accent
   - Calm, clear, professional
   - Best for: Documentation, tutorials

2. **Antoni** (ErXwobaYiN019PkySvjV)
   - Male, American accent
   - Well-rounded, versatile
   - Best for: General narration

3. **Bella** (EXAVITQu4vr4xnSDxMaL)
   - Female, American accent
   - Soft, gentle, soothing
   - Best for: Friendly communication

4. **Josh** (TxGEqnHWrfWFTfGW9XjX)
   - Male, American accent
   - Deep, authoritative
   - Best for: Serious announcements

5. **Elli** (MF3mGyEYCl7XYWbV9V6O)
   - Female, American accent
   - Energetic, youthful
   - Best for: Engaging content

**To change voice:**

Edit `project-config.yaml`:
```yaml
elevenlabs:
  voice:
    default_voice_id: "ErXwobaYiN019PkySvjV"  # Antoni
```

### Voice Parameters

**Stability** (0-1):
- `0.0` - Very expressive, more variation
- `0.5` - Balanced (recommended)
- `1.0` - Very stable, consistent

**Similarity Boost** (0-1):
- `0.0` - Less like original voice
- `0.75` - Balanced (recommended)
- `1.0` - Very similar to original

**Style** (0-1):
- `0` - No style exaggeration
- `1` - Maximum style exaggeration

**Example Configuration:**
```yaml
elevenlabs:
  voice:
    default_voice_id: "21m00Tcm4TlvDq8ikWAM"
    stability: 0.6       # Slightly more stable
    similarity_boost: 0.8  # More similar to original
    style: 0.2           # Slight style emphasis
```

### Emotional Tags

Add emotion to narration with inline tags:

```
voice:narrate "The tests are passing [laughs]. However, we found an issue [sighs].
Let me explain [whispers] the workaround."
```

**Available Tags:**
- `[laughs]` - Light laughter
- `[sighs]` - Exhale/disappointment
- `[whispers]` - Quiet, soft tone
- `[clears throat]` - Throat clearing
- `[gasps]` - Surprise
- `[coughs]` - Brief cough

---

## 🌍 Multilingual Support

### Supported Languages (70+)

**Major Languages:**
- English (US, UK, Australian, Indian, Irish, Scottish, Canadian)
- Spanish (Spain, Mexico, Argentina, Chile, Colombia)
- French (France, Canadian)
- German
- Italian
- Portuguese (Brazil, Portugal)
- Japanese, Korean, Chinese (Mandarin)
- Arabic, Hindi, Russian
- Dutch, Polish, Turkish, Swedish, Danish
- Thai, Vietnamese, Indonesian, Filipino

**Auto-detection:**
```
voice:narrate "Bonjour, comment allez-vous?"
# Automatically detects French
```

**Explicit language:**
```
voice:narrate "こんにちは世界" --language="ja"
```

**Same voice, different language:**
```
voice:narrate "Hola mundo" --voice="Rachel" --language="es"
# Rachel speaks Spanish naturally
```

### Multi-Region Team Use Cases

**Scenario:** Your team has developers in PH, MY, ID, HK

**Solution:** Generate docs in local languages

```yaml
# project-config.yaml
elevenlabs:
  multilingual:
    enabled: true
    target_languages:
      - "en"  # English (primary)
      - "fil" # Filipino (PH)
      - "ms"  # Malay (MY)
      - "id"  # Indonesian (ID)
      - "zh"  # Chinese (HK)
```

**Usage:**
```
narrate all --multilingual

# Generates audio in all 5 languages:
implementation_summary_en.mp3
implementation_summary_fil.mp3
implementation_summary_ms.mp3
implementation_summary_id.mp3
implementation_summary_zh.mp3
```

---

## 📂 Output Management

### File Naming

Default pattern:
```
logs/audio/{workflow-id}/{document-name}.mp3
```

**Examples:**
```
logs/audio/workflow-user-auth-20251126/
├── implementation_summary.mp3
├── deployment_guide.mp3
└── changelog.mp3
```

### Custom Naming

Edit `project-config.yaml`:
```yaml
elevenlabs:
  output:
    naming: "{workflow-id}_{phase}_{timestamp}.mp3"
    # Results in: workflow-user-auth_phase-8_20251126-143022.mp3
```

**Variables:**
- `{workflow-id}` - Current workflow ID
- `{phase}` - Phase number
- `{timestamp}` - ISO timestamp
- `{document-name}` - Source document name

### Audio Formats

**Available Formats:**

| Format | Sample Rate | Bitrate | Quality | File Size |
|--------|-------------|---------|---------|-----------|
| `mp3_44100_128` | 44.1 kHz | 128 kbps | High | ~1 MB/10 min |
| `mp3_44100_192` | 44.1 kHz | 192 kbps | Very High | ~1.5 MB/10 min |
| `mp3_22050_32` | 22.05 kHz | 32 kbps | Low | ~250 KB/10 min |
| `pcm_16000` | 16 kHz | PCM | Phone | ~2 MB/10 min |
| `pcm_22050` | 22.05 kHz | PCM | Standard | ~2.5 MB/10 min |
| `pcm_24000` | 24 kHz | PCM | High | ~3 MB/10 min |

**Recommendation:**
- **Default:** `mp3_44100_128` (best quality/size balance)
- **High Quality:** `mp3_44100_192` (larger files)
- **Bandwidth Limited:** `mp3_22050_32` (smaller files)

---

## 🔒 Security & Privacy

### Best Practices

**✅ DO:**
- Store API keys in environment variables
- Review text before narration
- Sanitize sensitive data from docs
- Use `.gitignore` for audio files
- Follow company data policies

**❌ DON'T:**
- Commit API keys to Git
- Narrate secrets, passwords, API keys
- Upload audio with sensitive data
- Share audio outside authorized team

### Privacy Check (Automatic)

CCPM automatically scans for sensitive data:

```
⚠️ PRIVACY CHECK

About to narrate:
- IMPLEMENTATION_SUMMARY.md (1,245 words)

Sensitive data detected:
- ⚠️ Internal API endpoints: https://internal.api.example.com
- ⚠️ Database schema: user_credentials table
- ⚠️ Environment variables: AWS_SECRET_KEY

Options:
  "proceed" → Generate audio as-is
  "sanitize" → Remove sensitive details first
  "cancel" → Skip narration

Recommendation: sanitize
```

### Compliance

**GDPR/Data Privacy:**
- ElevenLabs processes text via API (not stored permanently)
- Audio generated on demand (not cached server-side)
- No personal data stored on ElevenLabs servers
- Audio files stored locally only

**Enterprise Requirements:**
- Use self-hosted ElevenLabs (Enterprise plan)
- Or use on-premise TTS alternative
- Review ElevenLabs privacy policy: https://elevenlabs.io/privacy

---

## 📊 Usage Tracking & Limits

### Character Quota

ElevenLabs charges by character count (not audio duration).

**Check quota:**
```
voice:settings
```

**Output:**
```
API Status:
  ✅ API Key: Configured
  ✅ Connection: OK
  📊 Character Quota: 85,432 / 100,000 remaining (85%)

This Month:
  Used: 14,568 characters
  Remaining: 85,432 characters
  Resets: 2025-12-01
```

### Estimating Usage

**Text-to-Character Ratio:**
- ~5 characters per word (average)
- 1,000 words ≈ 5,000 characters

**Examples:**
- 1,000-word doc → ~5,000 characters
- 2,000-word doc → ~10,000 characters

**Free tier (10K characters/month):**
- ~2,000 words total
- ~2 medium docs per month

**Starter tier (30K characters/month):**
- ~6,000 words total
- ~6 medium docs per month

### Cost Optimization

**Tips to reduce usage:**

1. **Narrate selectively:**
   ```
   # Instead of "narrate all"
   narrate summary  # Only implementation summary
   ```

2. **Summarize long docs:**
   ```
   # Instead of full 2,000-word doc:
   voice:narrate "Executive summary: Implementation complete. 5 components created..."
   ```

3. **Use for onboarding only:**
   ```
   elevenlabs:
     features:
       documentation_narration: false  # Disable by default

   # Enable manually when needed:
   voice:narrate:file ONBOARDING.md
   ```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: "API key not found"

**Cause:** Environment variable not set

**Solution:**
```bash
# Check if set
echo $ELEVENLABS_API_KEY

# If empty, add to .env
export ELEVENLABS_API_KEY="your_key_here"

# Reload environment
source .env  # or direnv allow .
```

#### Issue: "Quota exceeded"

**Cause:** Monthly character limit reached

**Solution:**
1. Check quota: `voice:settings`
2. Wait for monthly reset
3. Upgrade plan: https://elevenlabs.io/pricing
4. Use text summarization to reduce characters

#### Issue: "Voice sounds robotic"

**Cause:** Low stability/similarity settings

**Solution:**
Adjust in `project-config.yaml`:
```yaml
elevenlabs:
  voice:
    stability: 0.6        # Increase from 0.5
    similarity_boost: 0.85  # Increase from 0.75
```

#### Issue: "Audio file too large"

**Cause:** High bitrate format

**Solution:**
Use compressed format:
```yaml
elevenlabs:
  output:
    format: "mp3_22050_32"  # Lower bitrate
```

#### Issue: "Wrong language detected"

**Cause:** Auto-detection failed

**Solution:**
Specify language explicitly:
```
voice:narrate "Mixed text here" --language="en"
```

---

## 🎯 Advanced Use Cases

### 1. Podcast-Style Documentation

Generate conversational summaries:

```
voice:narrate "Hey team! Let me walk you through this implementation [clears throat].
We started with a 686-line component [sighs], which was way too complex.
Now, we've broken it down into 5 focused components [laughs]. Much better, right?
Let's go through each one..."

--voice="Elli"  # Energetic, engaging voice
```

### 2. Multi-Voice Dialogue

Create conversations (requires multiple calls):

```
# Developer voice
voice:narrate "The implementation is complete." --voice="Antoni" --output="dev.mp3"

# QA voice
voice:narrate "Great! Did all tests pass?" --voice="Rachel" --output="qa.mp3"

# Developer voice
voice:narrate "Yes! 88% coverage achieved." --voice="Antoni" --output="dev2.mp3"

# Combine manually or via audio editor
```

### 3. Accessibility Compliance

Generate audio for all documentation:

```yaml
elevenlabs:
  accessibility:
    enabled: true
    auto_narrate: true  # Auto-generate for all docs
    formats:
      - "mp3_44100_128"  # Standard
      - "mp3_22050_32"   # Low bandwidth
```

### 4. Onboarding Automation

Create voice guides for new team members:

```
# Step 1: Generate onboarding guide
document guide "Getting Started with CCPM"

# Step 2: Narrate
voice:narrate:file GETTING_STARTED.md --voice="Rachel"

# Step 3: Upload to team drive
# (Manual or via automation)
```

---

## 📚 Reference

### API Documentation
- [ElevenLabs API Docs](https://elevenlabs.io/docs)
- [Voice Settings Guide](https://elevenlabs.io/docs/speech-synthesis/voice-settings)
- [Supported Languages](https://elevenlabs.io/languages)

### CCPM Documentation
- [voice-operations Agent](./../../agents/voice-operations.md)
- [Phase 8 Workflow](./../../commands/workflow/phase-8.md)
- [Voiceover Notifications](../VOICEOVER_NOTIFICATIONS.md)

### Support
- ElevenLabs Support: https://elevenlabs.io/support
- CCPM Issues: https://github.com/anthropics/claude-code/issues

---

## ✅ Setup Checklist

Complete this checklist to ensure proper integration:

- [ ] ElevenLabs account created
- [ ] API key obtained
- [ ] `ELEVENLABS_API_KEY` environment variable set
- [ ] `project-config.yaml` updated with ElevenLabs settings
- [ ] `.claude/logs/audio/` directory created (auto-created)
- [ ] Test narration generated successfully: `voice:test`
- [ ] Voice settings configured: `voice:settings`
- [ ] Available voices reviewed: `voice:voices`
- [ ] Privacy/security policy reviewed
- [ ] Team notified about audio feature availability

---

## 🎉 Quick Reference Card

**Essential Commands:**
```bash
# Test voice generation
voice:test

# Narrate text
voice:narrate "Your text here"

# Narrate from file
voice:narrate:file README.md

# Check settings
voice:settings

# List voices
voice:voices

# Generate audio for docs (Phase 8)
narrate all
narrate summary
skip narration
```

**Configuration File:**
`.claude/project-contexts/[project]/project-config.yaml`

**Audio Output:**
`.claude/logs/audio/{workflow-id}/`

**API Key:**
`ELEVENLABS_API_KEY` environment variable

---

**Last Updated:** 2025-11-26
**Version:** 1.0.0
**Status:** ✅ Production Ready
