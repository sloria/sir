
export function repoName(username, repo, lowercase=true) {
  username = username.trim();
  repo = repo.trim();
  if (lowercase) {
    username = username.toLowerCase();
    repo = repo.toLowerCase();
  }
  return `${username}/${repo}`;
}

export function getCompareURL(username, repo, base, head='HEAD') {
  return `https://github.com/${username}/${repo}/compare/${base}...${head}`
}

