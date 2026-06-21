#!/usr/bin/env node
'use strict';
const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const ROOT   = path.join(__dirname, '..');
const EP_DIR = path.join(ROOT, 'ep');

// Load EPISODES
const episodesCode = fs.readFileSync(path.join(ROOT, 'episodes-data.js'), 'utf8')
  .replace(/const EPISODES/, 'var EPISODES');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(episodesCode, ctx);
const EPISODES = ctx.EPISODES;

// Extract CSS from episode.html
const episodeHtml = fs.readFileSync(path.join(ROOT, 'episode.html'), 'utf8');
const cssMatch    = episodeHtml.match(/<style>([\s\S]*?)<\/style>/);
const CSS         = cssMatch ? cssMatch[1].trim() : '';

// Escape helpers
const ea = s => String(s ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const et = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const descMeta = s => ea(String(s ?? '').replace(/\s+/g,' ').trim().substring(0,155));
const descBody = s => et(String(s ?? '')).replace(/\n\n+/g,'</p>\n    <p class="ep-description">').replace(/\n/g,'<br>');

function fmtLabel(ep) {
  if (!ep.epLabel) return 'Episode ' + ep.id;
  return ep.epLabel
    .replace(/^E(\d+)$/,  'Episode $1')
    .replace(/^CS(\d+)$/, 'Consensus Special $1');
}

function buildPage(ep) {
  const guest   = ea(ep.guest);
  const title   = ea(ep.title || ep.guest);
  const thumb   = ea(ep.thumb || '');
  const meta    = descMeta(ep.desc);
  const body    = descBody(ep.desc);
  const label   = ea(fmtLabel(ep));
  const numLine = (ep.date ? ea(ep.date) + ' · ' : '') + label;
  const epUrl   = 'https://www.beyondthecode.fm/ep/' + ep.id + '.html';

  const jsonldObj = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: ep.title || ep.guest,
    description: String(ep.desc ?? '').replace(/\s+/g,' ').trim().substring(0,500),
    url: epUrl,
    image: ep.thumb,
    datePublished: ep.date,
    episodeNumber: ep.epLabel,
    partOfSeries: { '@type':'PodcastSeries', name:'Beyond the Code', url:'https://www.beyondthecode.fm' },
    author:    { '@type':'Person',       name:'Yitzy Hammer' },
    publisher: { '@type':'Organization', name:'Beyond the Code', url:'https://www.beyondthecode.fm' }
  };
  if (ep.audio) jsonldObj.associatedMedia = { '@type':'AudioObject', contentUrl: ep.audio };
  const jsonld = JSON.stringify(jsonldObj).replace(/<\/script>/gi, '<\\/script>');

  const TFX = "onerror=\"if(!this.src.includes('hqdefault'))this.src=this.src.replace('maxresdefault','hqdefault')\" onload=\"if(this.naturalWidth&&this.naturalWidth<300&&!this.src.includes('hqdefault'))this.src=this.src.replace('maxresdefault','hqdefault')\"";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${guest} — Beyond the Code</title>
<link rel="icon" type="image/png" href="/assets/favicon.png">
<meta name="description" content="${meta}">
<meta property="og:title" content="${guest} — Beyond the Code">
<meta property="og:description" content="${meta}">
<meta property="og:image" content="${thumb}">
<meta property="og:url" content="${epUrl}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${guest} — Beyond the Code">
<meta name="twitter:description" content="${meta}">
<meta name="twitter:image" content="${thumb}">
<meta name="twitter:site" content="@byndthecode">
<link rel="canonical" href="${epUrl}">
<link rel="alternate" type="application/rss+xml" title="Beyond the Code Podcast" href="https://anchor.fm/s/dbb6ced0/podcast/rss">
<script type="application/ld+json">${jsonld}<\/script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
${CSS}
</style>
</head>
<body>
<div id="cursor-dot"></div>
<div id="cursor-ring"></div>
<nav>
  <a href="/" class="nav-logo"><img src="/assets/btc logo.png" alt="Beyond the Code"></a>
  <button class="nav-toggle" id="nav-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
  <ul class="nav-links" id="nav-links">
    <li><a href="/episodes.html">Episodes</a></li>
    <li><a href="/#subscribe">Subscribe</a></li>
    <li><a href="/#about">About</a></li>
  </ul>
</nav>

<div class="ep-hero">
  <div class="ep-hero-bg"><img src="${thumb}" alt="${guest}" ${TFX}></div>
  <div class="ep-hero-overlay"></div>
  <div class="ep-hero-content">
    <p class="ep-breadcrumb"><a href="/episodes.html">← All Episodes</a></p>
    <p class="ep-hero-num">${numLine}</p>
    <h1 class="ep-hero-title">${title}</h1>
  </div>
</div>

<div class="ep-body">
  <div class="ep-main">
    <div class="ep-listen-bar">
      <a href="#" id="btn-apple" class="listen-btn apple">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 4.8c2 0 3.6 1.6 3.6 3.6S14 12 12 12s-3.6-1.6-3.6-3.6S10 4.8 12 4.8zM12 21.6c-3 0-5.7-1.5-7.3-3.8.4-2.4 5.5-3.7 7.3-3.7s6.9 1.3 7.3 3.7c-1.6 2.3-4.3 3.8-7.3 3.8z"/></svg>
        Apple Podcasts
      </a>
      <a href="#" id="btn-spotify" class="listen-btn spotify">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
        Spotify
      </a>
      <a href="#" id="btn-youtube" class="listen-btn youtube">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
        YouTube
      </a>
    </div>
    <p class="ep-section-heading">About This Episode</p>
    <p class="ep-description">${body}</p>
  </div>
  <div class="ep-sidebar">
    <div class="guest-card">
      <p class="guest-card-label">Guest</p>
      <h2 class="guest-name">${guest}</h2>
    </div>
    <div class="share-card">
      <p class="share-card-label">Listen On</p>
      <div class="share-links">
        <a href="#" id="share-apple" class="share-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 4.8c2 0 3.6 1.6 3.6 3.6S14 12 12 12s-3.6-1.6-3.6-3.6S10 4.8 12 4.8zM12 21.6c-3 0-5.7-1.5-7.3-3.8.4-2.4 5.5-3.7 7.3-3.7s6.9 1.3 7.3 3.7c-1.6 2.3-4.3 3.8-7.3 3.8z"/></svg>
          Apple Podcasts
        </a>
        <a href="#" id="share-spotify" class="share-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          Spotify
        </a>
        <a href="#" id="share-youtube" class="share-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
          YouTube
        </a>
      </div>
    </div>
  </div>
</div>

<div class="ep-related">
  <h2 class="ep-related-title">More Episodes</h2>
  <div class="related-grid" id="related-grid"></div>
</div>

<footer>
  <a href="/" class="footer-logo"><img src="/assets/btc logo.png" alt="Beyond the Code"></a>
  <ul class="footer-links">
    <li><a href="/episodes.html">Episodes</a></li>
    <li><a href="/#subscribe">Subscribe</a></li>
    <li><a href="/#about">About</a></li>
    <li><a href="https://podcasts.apple.com/il/podcast/beyond-the-code/id1673598418" target="_blank" rel="noopener">Apple Podcasts</a></li>
    <li><a href="https://open.spotify.com/show/7x77TlOnI7BSz4fnIkhvVs" target="_blank" rel="noopener">Spotify</a></li>
    <li><a href="https://www.youtube.com/@byndthecode" target="_blank" rel="noopener">YouTube</a></li>
    <li><a href="https://x.com/byndthecode" target="_blank" rel="noopener">X / Twitter</a></li>
  </ul>
  <p class="footer-copy">&copy; 2025 Beyond the Code. All rights reserved.</p>
</footer>

<script src="/episodes-data.js"><\/script>
<script>
var dot=document.getElementById('cursor-dot'),ring=document.getElementById('cursor-ring');
var mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
(function tick(){dot.style.left=mx+'px';dot.style.top=my+'px';rx+=(mx-rx)*0.14;ry+=(my-ry)*0.14;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick);})();
(function(){
  var t=document.getElementById('nav-toggle'),l=document.getElementById('nav-links');
  if(!t) return;
  t.addEventListener('click',function(){t.classList.toggle('active');l.classList.toggle('open');});
  l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){t.classList.remove('active');l.classList.remove('open');});});
})();
(function(){
  var EP_ID=${ep.id};
  var ep=EPISODES.find(function(e){return e.id===EP_ID;});
  if(!ep) return;
  var APPLE='https://podcasts.apple.com/il/podcast/beyond-the-code/id1673598418';
  var SPOTIFY='https://open.spotify.com/show/7x77TlOnI7BSz4fnIkhvVs';
  var YOUTUBE='https://www.youtube.com/@byndthecode';
  var a=(ep.apple&&ep.apple!=='#')?ep.apple:APPLE;
  var s=(ep.spotify&&ep.spotify!=='#')?ep.spotify:SPOTIFY;
  var y=(ep.youtube&&ep.youtube!=='#')?ep.youtube:YOUTUBE;
  ['btn-apple','share-apple'].forEach(function(id){var el=document.getElementById(id);el.href=a;el.target='_blank';el.rel='noopener';});
  ['btn-spotify','share-spotify'].forEach(function(id){var el=document.getElementById(id);el.href=s;el.target='_blank';el.rel='noopener';});
  ['btn-youtube','share-youtube'].forEach(function(id){var el=document.getElementById(id);el.href=y;el.target='_blank';el.rel='noopener';});
  var others=EPISODES.filter(function(e){return e.id!==EP_ID;});
  var related=others.sort(function(){return Math.random()-0.5;}).slice(0,3);
  var grid=document.getElementById('related-grid');
  related.forEach(function(r){
    var rl=r.epLabel?r.epLabel.replace(/^E(\\d+)$/,'Episode $1').replace(/^CS(\\d+)$/,'CS $1'):'Ep '+r.id;
    grid.innerHTML+='<a href="/ep/'+r.id+'.html" class="related-card"><div class="related-card-thumb"><img src="'+r.thumb+'" alt="'+r.guest.replace(/"/g,'&quot;')+'" loading="lazy"></div><p class="related-ep-num">'+rl+'</p><p class="related-ep-title">'+r.guest+' — '+r.title.substring(0,60)+'</p><\/a>';
  });
})();
<\/script>
</body>
</html>`;
}

function buildSitemap() {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url><loc>https://www.beyondthecode.fm/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>',
    '  <url><loc>https://www.beyondthecode.fm/episodes.html</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>',
    ...EPISODES.map(ep =>
      '  <url><loc>https://www.beyondthecode.fm/ep/' + ep.id + '.html</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>'
    ),
    '</urlset>'
  ];
  return lines.join('\n') + '\n';
}

// Run
if (!fs.existsSync(EP_DIR)) fs.mkdirSync(EP_DIR);
EPISODES.forEach(ep => {
  fs.writeFileSync(path.join(EP_DIR, ep.id + '.html'), buildPage(ep), 'utf8');
});
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(), 'utf8');
console.log('Generated ' + EPISODES.length + ' pages in ep/ and updated sitemap.xml');
