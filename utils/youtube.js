function extractYouTubeId(url) {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;

  const match = url.match(regex);

  return match ? match[1] : null;
}

function extractPlaylistId(url) {
  const match = url.match(/[?&]list=([^&]+)/);

  return match ? match[1] : null;
}

function isValidYouTubeUrl(url) {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  );
}

module.exports = {
  extractYouTubeId,
  extractPlaylistId,
  isValidYouTubeUrl
};