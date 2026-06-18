#!/usr/bin/env python3
"""Populate apple URL fields in episodes-data.js using iTunes API data."""

import json, re, urllib.request

EPISODES_JS = '/Users/ijhammer/byndthecode/episodes-data.js'
ITUNES_URL  = 'https://itunes.apple.com/lookup?id=1673598418&media=podcast&entity=podcastEpisode&limit=200&country=il'

def fetch_apple_eps():
    with urllib.request.urlopen(ITUNES_URL) as r:
        data = json.loads(r.read())
    return [e for e in data['results'] if e.get('wrapperType') == 'podcastEpisode']

def load_js(path):
    with open(path, encoding='utf-8') as f:
        return f.read()

# Extract E## or CS## prefix from Apple episode title
def extract_label(title):
    m = re.match(r'^(E\d+|CS\d+)\s*[:–—]', title)
    if m:
        return m.group(1)
    return None

def normalize(s):
    return re.sub(r'[^a-z0-9 ]', '', s.lower())

def apply_updates(js_src, updates):
    """updates: list of (audio_id_or_None, old_apple, new_apple, epLabel)"""
    lines = js_src.split('\n')
    applied = []

    for ep_label, new_url in updates:
        # Find the block: look for epLabel line then apple line
        i = 0
        while i < len(lines):
            # Find epLabel match
            if f'epLabel: `{ep_label}`' in lines[i]:
                # Search forward for apple: `#` within next 15 lines
                for j in range(i, min(i+15, len(lines))):
                    if "apple: `#`" in lines[j]:
                        lines[j] = lines[j].replace("apple: `#`", f"apple: `{new_url}`")
                        applied.append(ep_label)
                        break
                break
            i += 1

    return '\n'.join(lines), applied

def main():
    print("Fetching iTunes API...")
    apple_eps = fetch_apple_eps()
    print(f"  Got {len(apple_eps)} Apple episodes")

    js_src = load_js(EPISODES_JS)

    # Build a map: epLabel -> apple URL from iTunes data
    label_to_url = {}
    # Also build: normalized_title_words -> apple URL for fallback
    title_to_url = {}

    for ep in apple_eps:
        title = ep.get('trackName', '')
        url   = ep.get('trackViewUrl', '')
        if not url:
            continue

        label = extract_label(title)
        if label:
            label_to_url[label] = (title, url)
        else:
            title_to_url[normalize(title)] = (title, url)

    print(f"\n  Label-matched Apple eps: {len(label_to_url)}")
    print(f"  Title-only Apple eps: {len(title_to_url)}")

    # Extract all epLabels from JS
    ep_labels = re.findall(r'epLabel: `([^`]+)`', js_src)
    # Extract all apple values
    ep_apples = re.findall(r'apple: `([^`]*)`', js_src)
    # Extract all guests
    ep_guests = re.findall(r'guest: `([^`]+)`', js_src)
    # Extract all titles
    ep_titles = re.findall(r'title: `([^`]+)`', js_src)

    assert len(ep_labels) == len(ep_apples) == len(ep_guests), \
        f"Count mismatch: {len(ep_labels)} labels, {len(ep_apples)} apples, {len(ep_guests)} guests"

    print(f"\n  Episodes in JS: {len(ep_labels)}")
    already_set = sum(1 for a in ep_apples if a != '#')
    print(f"  Already have apple URL: {already_set}")
    print(f"  Need to populate: {sum(1 for a in ep_apples if a == '#')}")

    # Build updates list
    updates = []  # (epLabel, new_url)
    unmatched_apple = []

    # Strategy 1: match by E##/CS## label
    for label, (a_title, url) in sorted(label_to_url.items()):
        matched = False
        for i, ep_label in enumerate(ep_labels):
            if ep_label == label and ep_apples[i] == '#':
                updates.append((label, url))
                ep_apples[i] = url  # mark as used
                matched = True
                print(f"  LABEL MATCH: {label} → {a_title[:50]}")
                break
        if not matched:
            print(f"  NO JS MATCH for label {label}: {a_title[:50]}")

    # Strategy 2: match remaining Apple eps by guest/title words
    for a_norm, (a_title, url) in title_to_url.items():
        matched = False
        best_score = 0
        best_idx   = -1

        a_words = set(a_norm.split())

        for i, ep_label in enumerate(ep_labels):
            if ep_apples[i] != '#':
                continue

            g_norm = normalize(ep_guests[i] if i < len(ep_guests) else '')
            t_norm = normalize(ep_titles[i] if i < len(ep_titles) else '')

            combined = set((g_norm + ' ' + t_norm).split())
            common = a_words & combined
            # Require at least 3 meaningful words
            meaningful = {w for w in common if len(w) > 3}
            score = len(meaningful)

            if score > best_score:
                best_score = score
                best_idx   = i

        if best_score >= 3 and best_idx >= 0:
            ep_label = ep_labels[best_idx]
            g = ep_guests[best_idx] if best_idx < len(ep_guests) else '?'
            print(f"  TITLE MATCH (score={best_score}): {a_title[:45]} → {ep_label} ({g})")
            updates.append((ep_label, url))
            ep_apples[best_idx] = url
            matched = True

        if not matched:
            unmatched_apple.append(a_title)

    print(f"\n  Will update: {len(updates)} episodes")
    if unmatched_apple:
        print(f"\n  UNMATCHED Apple episodes (not applied):")
        for t in unmatched_apple:
            print(f"    {t[:70]}")

    if not updates:
        print("\nNothing to update.")
        return

    new_js, applied = apply_updates(js_src, updates)

    # Sanity: count should stay the same
    new_count = len(re.findall(r'epLabel:', new_js))
    assert new_count == len(ep_labels), f"Episode count changed! {len(ep_labels)} → {new_count}"

    new_apple_set = sum(1 for a in re.findall(r'apple: `([^`]*)`', new_js) if a != '#')
    print(f"\n  Applied {len(applied)} updates. Apple URLs set: {already_set} → {new_apple_set}")

    if len(applied) < len(updates):
        missing = set(l for l,_ in updates) - set(applied)
        print(f"  WARNING: Some labels not applied: {missing}")

    with open(EPISODES_JS, 'w', encoding='utf-8') as f:
        f.write(new_js)
    print(f"\nSaved to {EPISODES_JS}")

if __name__ == '__main__':
    main()
