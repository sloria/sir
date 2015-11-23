
export function repoName(username, repo, lowercase = true) {
  let cleanUsername = username.trim();
  let cleanRepo = repo.trim();
  if (lowercase) {
    cleanUsername = username.toLowerCase();
    cleanRepo = repo.toLowerCase();
  }
  return `${cleanUsername}/${cleanRepo}`;
}

export function getCompareURL(username, repo, base, head = 'HEAD') {
  return `https://github.com/${username}/${repo}/compare/${base}...${head}`;
}

export function validateRepoName(text) {
  return /.+\/.+/.test(text);
}
