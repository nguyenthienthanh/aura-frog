#!/bin/bash

# CCPM Voice File Cleanup Script
# Purpose: Clean up old voice notification files
# Usage: bash scripts/cleanup-voice.sh [days]

set -e

AUDIO_DIR=".claude/logs/audio"
DAYS_OLD="${1:-7}"  # Default: clean files older than 7 days

echo "🧹 CCPM Voice File Cleanup"
echo "=========================="
echo ""

# Check if audio directory exists
if [ ! -d "$AUDIO_DIR" ]; then
  echo "ℹ️  No audio directory found: $AUDIO_DIR"
  echo "   Nothing to clean up."
  exit 0
fi

# Count total files
TOTAL_FILES=$(find "$AUDIO_DIR" -name "*.mp3" 2>/dev/null | wc -l | tr -d ' ')
echo "📊 Audio files statistics:"
echo "   Directory: $AUDIO_DIR"
echo "   Total files: $TOTAL_FILES"

if [ "$TOTAL_FILES" -eq 0 ]; then
  echo "   No audio files to clean up."
  exit 0
fi

# Calculate total size
TOTAL_SIZE=$(du -sh "$AUDIO_DIR" 2>/dev/null | cut -f1)
echo "   Total size: $TOTAL_SIZE"
echo ""

# Find old files
echo "🔍 Finding files older than $DAYS_OLD days..."
OLD_FILES=$(find "$AUDIO_DIR" -name "*.mp3" -type f -mtime +$DAYS_OLD 2>/dev/null)
OLD_COUNT=$(echo "$OLD_FILES" | grep -c "mp3" 2>/dev/null || echo "0")

if [ "$OLD_COUNT" -eq 0 ]; then
  echo "   No old files found."
  echo ""
  echo "✅ Cleanup complete!"
  exit 0
fi

echo "   Found $OLD_COUNT files older than $DAYS_OLD days"
echo ""

# Show files to be deleted
echo "📋 Files to be deleted:"
echo "$OLD_FILES" | while read -r file; do
  if [ -n "$file" ]; then
    SIZE=$(ls -lh "$file" 2>/dev/null | awk '{print $5}')
    MTIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$file" 2>/dev/null || stat -c "%y" "$file" 2>/dev/null | cut -d. -f1)
    echo "   - $(basename "$file") ($SIZE, modified: $MTIME)"
  fi
done
echo ""

# Ask for confirmation
read -p "Delete $OLD_COUNT old audio files? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Cleanup cancelled."
  exit 0
fi

# Delete old files
echo ""
echo "🗑️  Deleting old files..."
DELETED=0

echo "$OLD_FILES" | while read -r file; do
  if [ -n "$file" ] && [ -f "$file" ]; then
    rm -f "$file"
    echo "   ✅ Deleted: $(basename "$file")"
    DELETED=$((DELETED + 1))
  fi
done

# Show results
echo ""
REMAINING=$(find "$AUDIO_DIR" -name "*.mp3" 2>/dev/null | wc -l | tr -d ' ')
NEW_SIZE=$(du -sh "$AUDIO_DIR" 2>/dev/null | cut -f1)

echo "✅ Cleanup complete!"
echo ""
echo "📊 Results:"
echo "   Files deleted: $OLD_COUNT"
echo "   Files remaining: $REMAINING"
echo "   Current size: $NEW_SIZE"
echo ""

# Show age distribution of remaining files
if [ "$REMAINING" -gt 0 ]; then
  echo "📅 Age distribution of remaining files:"
  echo "   Last 24 hours: $(find "$AUDIO_DIR" -name "*.mp3" -type f -mtime -1 2>/dev/null | wc -l | tr -d ' ')"
  echo "   Last 7 days: $(find "$AUDIO_DIR" -name "*.mp3" -type f -mtime -7 2>/dev/null | wc -l | tr -d ' ')"
  echo "   Last 30 days: $(find "$AUDIO_DIR" -name "*.mp3" -type f -mtime -30 2>/dev/null | wc -l | tr -d ' ')"
fi
