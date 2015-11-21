
export function repoName(username, repo) {
  return `${username.trim().toLowerCase()}/${repo.trim().toLowerCase()}`;
}

export function getCompareURL(username, repo, base, head='HEAD') {
  return `https://github.com/${username}/${repo}/compare/${base}...${head}`
}

