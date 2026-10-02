const VIDEO_ID_PATTERNS = [
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
];

/** Extracts an 11-character YouTube video ID from watch/short/embed URL formats. */
export function parseYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim();

  for (const pattern of VIDEO_ID_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/** youtube-nocookie.com embed URL for the privacy-friendlier iframe embed. */
export function buildYoutubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
}

/** Standard thumbnail URL used for the click-to-play facade. */
export function buildYoutubeThumbnailUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
