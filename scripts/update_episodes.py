#!/usr/bin/env python3
"""
Regenerates episodes-data.js from the podcast RSS feed + YouTube channel RSS.
- Preserves existing guest names and metadata for known episodes (matched by audio URL)
- Only runs guest extraction on genuinely new episodes
- Matches new episodes to YouTube videos via YouTube's public channel feed (no API key)
Run from the repo root: python3 scripts/update_episodes.py
"""
import re, os, sys, glob, urllib.request, xml.etree.ElementTree as ET, html as html_mod
from email.utils import parsedate_to_datetime

RSS_URL    = 'https://anchor.fm/s/dbb6ced0/podcast/rss'
YT_HANDLE  = '@byndthecode'
APPLE_SHOW = 'https://podcasts.apple.com/il/podcast/beyond-the-code/id1673598418'
OUTPUT     = 'episodes-data.js'

# ── LOAD EXISTING DATA ───────────────────────────────────────────────────────
def load_existing():
    """Parse current episodes-data.js, keyed by audio URL."""
    try:
        with open(OUTPUT) as f:
            content = f.read()
    except FileNotFoundError:
        return {}

    result = {}
    for block in re.findall(r'\{[^{}]+\}', content, re.DOTALL):
        def get(field, default=''):
            m = re.search(rf'{field}:\s*`([^`]*)`', block)
            return m.group(1) if m else default

        audio = get('audio')
        if not audio:
            continue
        result[audio] = {
            'guest':   get('guest'),
            'epLabel': get('epLabel'),
            'title':   get('title'),
            'youtube': get('youtube', '#'),
            'thumb':   get('thumb'),
        }
    print(f'  Loaded {len(result)} existing episodes', file=sys.stderr)
    return result

# ── YOUTUBE CHANNEL FEED (no API key needed) ─────────────────────────────────
def fetch_youtube_videos():
    """
    Fetches the YouTube channel's public Atom feed.
    Returns dict of {lowercased_title: video_url} for the latest ~15 videos.
    """
    try:
        # Step 1: get channel ID from channel page
        req = urllib.request.Request(
            f'https://www.youtube.com/{YT_HANDLE}',
            headers={'User-Agent': 'Mozilla/5.0 (compatible)'}
        )
        with urllib.request.urlopen(req, timeout=15) as r:
            html = r.read().decode('utf-8', errors='replace')

        m = (
            re.search(r'channel_id=(UC[^"&]{10,})', html) or
            re.search(r'"channelId"\s*:\s*"(UC[^"]{10,})"', html) or
            re.search(r'"externalId"\s*:\s*"(UC[^"]{10,})"', html)
        )
        if not m:
            print('  Warning: could not find YouTube channel ID', file=sys.stderr)
            return {}
        channel_id = m.group(1)
        print(f'  YouTube channel ID: {channel_id}', file=sys.stderr)

        # Step 2: fetch channel Atom feed (free, no API key)
        feed_url = f'https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}'
        with urllib.request.urlopen(feed_url, timeout=15) as r:
            xml_data = r.read()

        root = ET.fromstring(xml_data)
        ns_atom = 'http://www.w3.org/2005/Atom'

        videos = {}
        for entry in root.findall(f'{{{ns_atom}}}entry'):
            title_el = entry.find(f'{{{ns_atom}}}title')
            link_el  = entry.find(f'{{{ns_atom}}}link')
            if title_el is not None and link_el is not None:
                title = (title_el.text or '').strip()
                url   = link_el.get('href', '#')
                if url != '#':
                    videos[title.lower()] = url

        print(f'  Fetched {len(videos)} YouTube videos', file=sys.stderr)
        return videos

    except Exception as e:
        print(f'  Warning: YouTube fetch failed: {e}', file=sys.stderr)
        return {}

def match_youtube(ep_title, ep_guest, yt_videos):
    """Score-based match of an episode to a YouTube video."""
    if not yt_videos:
        return '#'

    ep_lower    = ep_title.lower()
    guest_lower = ep_guest.lower()
    best_url    = '#'
    best_score  = 0

    for yt_title, url in yt_videos.items():
        score = 0
        # Guest name words in YouTube title (high weight)
        if guest_lower and len(guest_lower) > 3:
            for word in guest_lower.split():
                if len(word) > 3 and word in yt_title:
                    score += 4
        # Meaningful title words overlap
        ep_words = set(re.findall(r'\b\w{5,}\b', ep_lower))
        yt_words = set(re.findall(r'\b\w{5,}\b', yt_title))
        score += len(ep_words & yt_words)

        if score > best_score and score >= 4:
            best_score = score
            best_url   = url

    return best_url

# ── GUEST EXTRACTION (for new episodes only) ─────────────────────────────────
def extract_guest(raw_title):
    """
    Best-effort guest name extraction from episode title.
    Handles patterns like:
      "E99: Guest Name on Topic"
      "CS5: Title — Guest Name Explains..."
      "Guest Name on Bitcoin and Law"
    """
    # Strip episode prefix (E99:, CS5:, #BB26:)
    clean = re.sub(r'^(?:#?(?:BB|CS|E)\d+)[:\s\-]+', '', raw_title, flags=re.I).strip()

    # "Name & Name (Company) —" or "Name and Name —" at start of title
    m = re.match(
        r'^([A-Z][a-z]+\s+(?:&|and)\s+[A-Z][a-z]+)(?:\s+\([^)]+\))?\s*[—\-]',
        clean
    )
    if m:
        return m.group(1).strip()

    # "Name on/about/discusses/explains/reveals/joins..."
    m = re.search(
        r'^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s+'
        r'(?:on|about|discusses|explains|reveals|joins|shares|breaks|walks)',
        clean
    )
    if m:
        return m.group(1).strip()

    # "...Title: Name on..." or "...— Name on..."
    m = re.search(
        r'[:\-–]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s+'
        r'(?:on|about|discusses|explains|reveals)',
        clean
    )
    if m:
        return m.group(1).strip()

    # "...Name is/was/has..."
    m = re.search(
        r'([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:is|was|has|will)\b',
        clean
    )
    if m:
        return m.group(1).strip()

    # First two capitalised words as fallback
    words = re.findall(r'[A-Z][a-z]{1,}', clean)
    if len(words) >= 2:
        return f'{words[0]} {words[1]}'

    return 'Guest'

# ── THUMBNAIL LOOKUP ─────────────────────────────────────────────────────────
def find_thumb(ep_label, fallback_url):
    """Return local asset path for E-prefixed episodes; fallback otherwise."""
    if ep_label and re.match(r'^E\d+$', ep_label, re.I):
        num = re.search(r'\d+', ep_label).group()
        matches = sorted(
            glob.glob(f'assets/E{num}*.jpg') +
            glob.glob(f'assets/E{num}*.png')
        )
        if matches:
            return matches[0]
    return fallback_url

# ── RSS PARSING ───────────────────────────────────────────────────────────────
def parse_rss():
    print('  Fetching RSS...', file=sys.stderr)
    with urllib.request.urlopen(RSS_URL, timeout=30) as r:
        xml_data = r.read()

    root    = ET.fromstring(xml_data)
    channel = root.find('channel')
    ITUNES  = 'http://www.itunes.com/dtds/podcast-1.0.dtd'
    CONTENT = 'http://purl.org/rss/1.0/modules/content/'

    # Channel-level artwork fallback
    ch_image = channel.find(f'{{{ITUNES}}}image')
    default_thumb = ch_image.get('href', '') if ch_image is not None else ''

    items = []
    for item in channel.findall('item'):
        title_el = item.find('title')
        raw_title = (title_el.text or '').strip()

        # GUID (unique episode identifier)
        guid_el = item.find('guid')
        guid = (guid_el.text or '').strip() if guid_el is not None else ''

        # Spotify episode URL: guid is usually the podcasters.spotify.com URL
        spotify_ep = guid if 'spotify' in guid or 'anchor' in guid else '#'
        # Normalise old anchor.fm guids
        if spotify_ep.startswith('https://anchor.fm/byndthecode/'):
            spotify_ep = spotify_ep.replace(
                'https://anchor.fm/byndthecode/',
                'https://podcasters.spotify.com/pod/show/byndthecode/'
            )

        # Pub date
        pub_el = item.find('pubDate')
        pub_str = (pub_el.text or '').strip() if pub_el is not None else ''
        try:
            pub_dt   = parsedate_to_datetime(pub_str)
            date_fmt = pub_dt.strftime('%B %d, %Y')
            date_ts  = pub_dt.timestamp()
        except Exception:
            date_fmt = ''
            date_ts  = 0

        # Description (strip HTML)
        desc_el = (
            item.find(f'{{{CONTENT}}}encoded') or
            item.find('description')
        )
        desc_raw = (desc_el.text or '') if desc_el is not None else ''
        desc = re.sub(r'<[^>]+>', '', desc_raw).strip()
        desc = html_mod.unescape(desc)
        desc = re.sub(r'\s{2,}', ' ', desc)

        # Audio URL
        enc = item.find('enclosure')
        audio = enc.get('url', '') if enc is not None else ''

        # Thumbnail
        it_img = item.find(f'{{{ITUNES}}}image')
        thumb_url = it_img.get('href', default_thumb) if it_img is not None else default_thumb

        # Episode label prefix (E86, CS2, BB25, #BB25)
        lm = re.match(r'^((?:#?BB|CS|E)\d+)[:\s]', raw_title, re.I)
        ep_label_raw = lm.group(1).upper() if lm else ''
        ep_label = ep_label_raw.lstrip('#')  # normalise #BB → BB

        items.append({
            'raw_title':  raw_title,
            'guid':       guid,
            'spotify_ep': spotify_ep,
            'date_fmt':   date_fmt,
            'date_ts':    date_ts,
            'desc':       desc,
            'audio':      audio,
            'thumb_url':  thumb_url,
            'ep_label':   ep_label,
        })

    # Sort oldest → newest to assign sequential IDs
    items.sort(key=lambda x: x['date_ts'])
    print(f'  Parsed {len(items)} RSS items', file=sys.stderr)
    return items

# ── JS ESCAPING ───────────────────────────────────────────────────────────────
def esc(s):
    return str(s).replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

# ── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    print('Beyond the Code — episode updater', file=sys.stderr)

    existing  = load_existing()
    yt_videos = fetch_youtube_videos()
    rss_items = parse_rss()

    episodes = []
    new_count = 0

    for i, item in enumerate(rss_items):
        seq_id = i + 1
        audio  = item['audio']
        known  = existing.get(audio, {})

        is_new = not bool(known)
        if is_new:
            new_count += 1

        # Guest name
        guest = known.get('guest') or extract_guest(item['raw_title'])

        # Episode label
        ep_label = known.get('epLabel') or item['ep_label'] or f'E{seq_id}'

        # Title (strip prefix from raw title)
        title = item['raw_title']
        if item['ep_label']:
            title = re.sub(
                r'^#?' + re.escape(item['ep_label']) + r'[:\s\-]+',
                '', title, flags=re.I
            ).strip()

        # Thumbnail
        if known.get('thumb'):
            thumb = known['thumb']
        else:
            thumb = find_thumb(ep_label, item['thumb_url'])

        # YouTube
        existing_yt = known.get('youtube', '#')
        if existing_yt and existing_yt != '#':
            youtube = existing_yt
        else:
            youtube = match_youtube(title, guest, yt_videos)

        episodes.append({
            'id':      seq_id,
            'epLabel': ep_label,
            'guest':   guest,
            'title':   title,
            'date':    item['date_fmt'],
            'desc':    item['desc'],
            'thumb':   thumb,
            'audio':   audio,
            'spotify': item['spotify_ep'] or '#',
            'apple':   '#',
            'youtube': youtube,
        })

    # Output newest first
    episodes.sort(key=lambda e: e['id'], reverse=True)

    lines = ['const EPISODES = [']
    for ep in episodes:
        lines += [
            '  {',
            f"    id: {ep['id']},",
            f"    epLabel: `{esc(ep['epLabel'])}`,",
            f"    guest: `{esc(ep['guest'])}`,",
            f"    title: `{esc(ep['title'])}`,",
            f"    date: `{esc(ep['date'])}`,",
            f"    desc: `{esc(ep['desc'])}`,",
            f"    thumb: `{esc(ep['thumb'])}`,",
            f"    audio: `{esc(ep['audio'])}`,",
            f"    spotify: `{esc(ep['spotify'])}`,",
            f"    apple: `{esc(ep['apple'])}`,",
            f"    youtube: `{esc(ep['youtube'])}`,",
            '  },',
        ]
    lines.append('];')

    output = '\n'.join(lines) + '\n'

    with open(OUTPUT, 'w') as f:
        f.write(output)

    print(f'  Done. {len(episodes)} episodes written ({new_count} new). → {OUTPUT}', file=sys.stderr)

if __name__ == '__main__':
    main()
