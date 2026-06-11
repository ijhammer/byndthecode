#!/usr/bin/env python3
"""
Regenerates episodes-data.js from podcast RSS + YouTube Data API.
- Preserves existing guest names for known episodes (matched by audio URL)
- Fetches full YouTube video history via API (not limited to 15)
- Creates entries for YouTube-only videos (no RSS episode)
- Manual overrides: scripts/youtube_overrides.json

Run from repo root: python3 scripts/update_episodes.py
Requires env var: YOUTUBE_API_KEY
"""
import re, os, sys, glob, json, urllib.request, urllib.parse
import xml.etree.ElementTree as ET
import html as html_mod
from email.utils import parsedate_to_datetime
from datetime import datetime, timezone

RSS_URL    = 'https://anchor.fm/s/dbb6ced0/podcast/rss'
YT_HANDLE  = 'byndthecode'          # without @
YT_API     = 'https://www.googleapis.com/youtube/v3'
APPLE_SHOW = 'https://podcasts.apple.com/il/podcast/beyond-the-code/id1673598418'
OUTPUT     = 'episodes-data.js'

# ── LOAD EXISTING DATA (keyed by audio URL or youtube URL for YT-only) ────────
def load_existing():
    try:
        with open(OUTPUT) as f:
            content = f.read()
    except FileNotFoundError:
        return {}, {}

    rss_known = {}   # audio_url → fields
    yt_known  = {}   # youtube_url → fields (for YouTube-only episodes)

    for block in re.findall(r'\{[^{}]+\}', content, re.DOTALL):
        def get(field, default=''):
            m = re.search(rf'{field}:\s*`([^`]*)`', block)
            return m.group(1) if m else default

        audio   = get('audio')
        youtube = get('youtube', '#')

        fields = {
            'id':      int(re.search(r'\bid:\s*(\d+)', block).group(1))
                       if re.search(r'\bid:\s*(\d+)', block) else 0,
            'guest':   get('guest'),
            'epLabel': get('epLabel'),
            'title':   get('title'),
            'youtube': youtube,
            'thumb':   get('thumb'),
            'desc':    get('desc'),
            'date':    get('date'),
        }

        if audio and audio != '#':
            rss_known[audio] = fields
        elif youtube and youtube != '#':
            yt_known[youtube] = fields

    print(f'  Loaded {len(rss_known)} RSS + {len(yt_known)} YouTube-only existing episodes',
          file=sys.stderr)
    return rss_known, yt_known

# ── YOUTUBE DATA API ─────────────────────────────────────────────────────────
def fetch_youtube_videos(api_key):
    """
    Fetches ALL channel videos via YouTube Data API v3.
    Uses ~3 API units per run (well within 10,000/day free limit).
    Returns list of video dicts sorted oldest→newest.
    """
    try:
        # Get uploads playlist ID
        url = (f'{YT_API}/channels?part=contentDetails'
               f'&forHandle={YT_HANDLE}&key={api_key}')
        with urllib.request.urlopen(url, timeout=15) as r:
            data = json.loads(r.read())
        uploads_id = data['items'][0]['contentDetails']['relatedPlaylists']['uploads']
        print(f'  YouTube uploads playlist: {uploads_id}', file=sys.stderr)

        # Paginate through all videos
        videos = []
        page_token = None
        while True:
            params = urllib.parse.urlencode({
                'part': 'snippet',
                'playlistId': uploads_id,
                'maxResults': 50,
                'key': api_key,
                **(({'pageToken': page_token}) if page_token else {}),
            })
            with urllib.request.urlopen(f'{YT_API}/playlistItems?{params}', timeout=15) as r:
                data = json.loads(r.read())

            for item in data.get('items', []):
                s = item['snippet']
                vid_id = s['resourceId']['videoId']
                pub_str = s.get('publishedAt', '')
                try:
                    pub_dt   = datetime.fromisoformat(pub_str.replace('Z', '+00:00'))
                    date_fmt = pub_dt.strftime('%B %d, %Y')
                    date_ts  = pub_dt.timestamp()
                except Exception:
                    date_fmt = ''
                    date_ts  = 0

                desc = re.sub(r'\s{2,}', ' ', s.get('description', '').strip())

                videos.append({
                    'video_id': vid_id,
                    'title':    s.get('title', '').strip(),
                    'desc':     desc,
                    'date_fmt': date_fmt,
                    'date_ts':  date_ts,
                    'url':      f'https://www.youtube.com/watch?v={vid_id}',
                    'thumb':    f'https://img.youtube.com/vi/{vid_id}/maxresdefault.jpg',
                })

            page_token = data.get('nextPageToken')
            if not page_token:
                break

        videos.sort(key=lambda v: v['date_ts'])
        print(f'  Fetched {len(videos)} YouTube videos via API', file=sys.stderr)
        return videos

    except Exception as e:
        print(f'  Warning: YouTube API failed: {e}', file=sys.stderr)
        return []

def match_youtube(ep_title, ep_guest, yt_videos):
    """Score-based match of an RSS episode to a YouTube video."""
    if not yt_videos:
        return '#', None

    ep_lower    = ep_title.lower()
    guest_lower = ep_guest.lower()
    best_url    = '#'
    best_vid    = None
    best_score  = 0

    for vid in yt_videos:
        yt_lower = vid['title'].lower()
        score = 0
        # Guest name words (high weight)
        if guest_lower and len(guest_lower) > 3:
            for word in guest_lower.split():
                if len(word) > 3 and word in yt_lower:
                    score += 4
        # Meaningful title word overlap
        ep_words = set(re.findall(r'\b\w{5,}\b', ep_lower))
        yt_words = set(re.findall(r'\b\w{5,}\b', yt_lower))
        score += len(ep_words & yt_words)

        if score > best_score and score >= 4:
            best_score = score
            best_url   = vid['url']
            best_vid   = vid

    return best_url, best_vid

# ── GUEST EXTRACTION ──────────────────────────────────────────────────────────
def extract_guest(raw_title):
    clean = re.sub(r'^(?:#?(?:BB|CS|E)\d+)[:\s\-]+', '', raw_title, flags=re.I).strip()

    # "Name & Name (Company) —"
    m = re.match(
        r'^([A-Z][a-z]+\s+(?:&|and)\s+[A-Z][a-z]+)(?:\s+\([^)]+\))?\s*[—\-]', clean)
    if m: return m.group(1).strip()

    # "Name on/about/discusses/..."
    m = re.search(
        r'^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s+'
        r'(?:on|about|discusses|explains|reveals|joins|shares|breaks|walks)', clean)
    if m: return m.group(1).strip()

    # "Title: Name on..." or "Title — Name on..."
    m = re.search(
        r'[:\-–]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s+'
        r'(?:on|about|discusses|explains|reveals)', clean)
    if m: return m.group(1).strip()

    # "Name is/was/has..."
    m = re.search(r'([A-Z][a-z]+\s+[A-Z][a-z]+)\s+(?:is|was|has|will)\b', clean)
    if m: return m.group(1).strip()

    # Pipe separator: "Title | Guest Name"
    m = re.search(r'\|\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s*$', clean)
    if m: return m.group(1).strip()

    words = re.findall(r'[A-Z][a-z]{1,}', clean)
    if len(words) >= 2:
        return f'{words[0]} {words[1]}'
    return 'Guest'

# ── THUMBNAIL LOOKUP ──────────────────────────────────────────────────────────
def find_thumb(ep_label, fallback_url):
    if ep_label and re.match(r'^E\d+$', ep_label, re.I):
        num = re.search(r'\d+', ep_label).group()
        matches = sorted(
            glob.glob(f'assets/E{num}*.jpg') + glob.glob(f'assets/E{num}*.png'))
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

    ch_image      = channel.find(f'{{{ITUNES}}}image')
    default_thumb = ch_image.get('href', '') if ch_image is not None else ''

    items = []
    for item in channel.findall('item'):
        raw_title = (item.findtext('title') or '').strip()

        # RSS <link> contains the Spotify Podcasters episode URL (e.g. podcasters.spotify.com/pod/show/.../episodes/...)
        # <guid> is a plain UUID and is useless for deep-linking
        rss_link   = (item.findtext('link') or '').strip()
        spotify_ep = rss_link if ('podcasters.spotify.com' in rss_link or 'anchor.fm' in rss_link) else '#'

        pub_str = (item.findtext('pubDate') or '').strip()
        try:
            pub_dt   = parsedate_to_datetime(pub_str)
            date_fmt = pub_dt.strftime('%B %d, %Y')
            date_ts  = pub_dt.timestamp()
        except Exception:
            date_fmt = ''
            date_ts  = 0

        desc_el  = item.find(f'{{{CONTENT}}}encoded') or item.find('description')
        desc_raw = (desc_el.text or '') if desc_el is not None else ''
        desc     = re.sub(r'\s{2,}', ' ', html_mod.unescape(re.sub(r'<[^>]+>', '', desc_raw)).strip())

        enc       = item.find('enclosure')
        audio     = enc.get('url', '') if enc is not None else ''
        it_img    = item.find(f'{{{ITUNES}}}image')
        thumb_url = it_img.get('href', default_thumb) if it_img is not None else default_thumb

        lm       = re.match(r'^((?:#?BB|CS|E)\d+)[:\s]', raw_title, re.I)
        ep_label = lm.group(1).upper().lstrip('#') if lm else ''

        items.append({
            'raw_title':  raw_title,
            'spotify_ep': spotify_ep,
            'date_fmt':   date_fmt,
            'date_ts':    date_ts,
            'desc':       desc,
            'audio':      audio,
            'thumb_url':  thumb_url,
            'ep_label':   ep_label,
        })

    items.sort(key=lambda x: x['date_ts'])
    print(f'  Parsed {len(items)} RSS items', file=sys.stderr)
    return items

# ── YOUTUBE OVERRIDES ────────────────────────────────────────────────────────
def load_yt_overrides():
    try:
        with open('scripts/youtube_overrides.json') as f:
            data = json.load(f)
        return {int(k): v for k, v in data.items() if k != '_comment'}
    except FileNotFoundError:
        return {}

# ── JS ESCAPING ───────────────────────────────────────────────────────────────
def esc(s):
    return str(s).replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

def ep_js(ep):
    lines = ['  {']
    for k in ('id', 'epLabel', 'guest', 'title', 'date', 'desc',
              'thumb', 'audio', 'spotify', 'apple', 'youtube'):
        v = ep[k]
        if k == 'id':
            lines.append(f'    id: {v},')
        else:
            lines.append(f'    {k}: `{esc(v)}`,')
    lines.append('  },')
    return lines

# ── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    print('Beyond the Code — episode updater', file=sys.stderr)

    api_key = os.environ.get('YOUTUBE_API_KEY', '')
    if not api_key:
        print('  Warning: YOUTUBE_API_KEY not set — skipping YouTube', file=sys.stderr)

    rss_known, yt_known = load_existing()
    yt_override         = load_yt_overrides()
    yt_videos           = fetch_youtube_videos(api_key) if api_key else []
    rss_items           = parse_rss()

    # ── Step 1: build RSS episodes ──
    episodes   = []
    matched_yt = set()   # YouTube URLs already claimed by an RSS episode

    for i, item in enumerate(rss_items):
        seq_id = i + 1
        audio  = item['audio']
        known  = rss_known.get(audio, {})

        guest    = known.get('guest') or extract_guest(item['raw_title'])
        ep_label = known.get('epLabel') or item['ep_label'] or f'E{seq_id}'

        title = item['raw_title']
        if item['ep_label']:
            title = re.sub(
                r'^#?' + re.escape(item['ep_label']) + r'[:\s\-]+',
                '', title, flags=re.I).strip()

        # YouTube link: override > existing > auto-match
        if seq_id in yt_override:
            youtube  = yt_override[seq_id]
            yt_thumb = f'https://img.youtube.com/vi/{re.search(r"v=([^&]+)", youtube).group(1)}/maxresdefault.jpg' \
                       if re.search(r'v=([^&]+)', youtube) else None
        elif known.get('youtube', '#') != '#':
            youtube  = known['youtube']
            yt_thumb = None
        else:
            youtube, yt_vid = match_youtube(title, guest, yt_videos)
            yt_thumb = yt_vid['thumb'] if yt_vid else None

        if youtube != '#':
            matched_yt.add(youtube)

        # Thumbnail: local asset > YouTube 16:9 > RSS square
        if known.get('thumb') and not known['thumb'].startswith('https://d3t3ozftmdmh3i'):
            thumb = known['thumb']
        else:
            thumb = find_thumb(ep_label, item['thumb_url'])
            if thumb == item['thumb_url'] and yt_thumb:
                thumb = yt_thumb

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
            '_ts':     item['date_ts'],
        })

    # ── Step 2: YouTube-only episodes (not matched to any RSS item) ──
    yt_only_new = 0

    # When no API key, fall back to preserving all existing YouTube-only entries from yt_known
    yt_sources = yt_videos if yt_videos else [
        {
            'url':      url,
            'video_id': url.split('v=')[-1],
            'title':    f.get('title', ''),
            'desc':     f.get('desc', ''),
            'date_fmt': f.get('date', ''),
            'date_ts':  0,
            'thumb':    f.get('thumb', ''),
        }
        for url, f in yt_known.items()
    ]

    for vid in yt_sources:
        if vid['url'] in matched_yt:
            continue   # already linked to an RSS episode

        # Check if we already have this as a YouTube-only episode
        known = yt_known.get(vid['url'], {})

        guest = known.get('guest') or extract_guest(vid['title'])
        title = known.get('title') or vid['title']
        desc  = known.get('desc')  or vid['desc']

        if not known:
            yt_only_new += 1

        episodes.append({
            'id':      None,          # assigned after sorting
            'epLabel': known.get('epLabel') or extract_guest(vid['title']),
            'guest':   guest,
            'title':   title,
            'date':    known.get('date') or vid['date_fmt'],
            'desc':    desc,
            'thumb':   known.get('thumb') or vid['thumb'],
            'audio':   '#',
            'spotify': '#',
            'apple':   '#',
            'youtube': vid['url'],
            '_ts':     known.get('date_ts', vid.get('date_ts', 0)),
        })

    # ── Step 3: sort all by date, reassign IDs ──
    episodes.sort(key=lambda e: e['_ts'])
    for i, ep in enumerate(episodes):
        ep['id'] = i + 1
    for ep in episodes:
        del ep['_ts']

    rss_count    = sum(1 for e in episodes if e['audio'] != '#')
    yt_only_count = sum(1 for e in episodes if e['audio'] == '#')
    print(f'  Done. {len(episodes)} total episodes '
          f'({rss_count} RSS, {yt_only_count} YouTube-only, '
          f'{yt_only_new} newly discovered). → {OUTPUT}', file=sys.stderr)

    # ── Write output ──
    episodes.sort(key=lambda e: e['id'], reverse=True)
    lines = ['const EPISODES = [']
    for ep in episodes:
        lines += ep_js(ep)
    lines.append('];')

    with open(OUTPUT, 'w') as f:
        f.write('\n'.join(lines) + '\n')

if __name__ == '__main__':
    main()
