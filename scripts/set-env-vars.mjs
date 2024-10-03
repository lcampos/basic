import fs from "fs";
import semver from "semver"
import {execSync} from "child_process"

// Function to get the last two git tags
function getLastTwoTags() {
  try {
    // make sure we're always getting the latest tags
    execSync("git fetch --tags")

    const currentTag = execSync("git tag --sort=-creatordate | grep -E '^v([0-9]+\.[0-9]+\.[0-9]+)$' | sed -n '1p' | sed 's/^v//'")
      .toString()
      .trim();
    const previousTag = execSync("git tag --sort=-creatordate | grep -E '^v([0-9]+\.[0-9]+\.[0-9]+)$' | sed -n '2p' | sed 's/^v//'")
      .toString()
      .trim();
    
    const tags = [];
    tags.push(currentTag)
    tags.push(previousTag)
    return tags;
  } catch (error) {
    console.error('Error getting tags:', error);
    process.exit(1);
  }
}

// Function to determine if the release is major, minor, or patch
function determineReleaseType(previousTag, currentTag) {
  const diffType = semver.diff(semver.clean(previousTag), semver.clean(currentTag));

  return diffType || 'unknown';
}

// Main logic
const tags = getLastTwoTags();

if (tags.length < 2) {
  console.log('Not enough tags to compare.', tags);
  process.exit(1);
}

const [currentTag, previousTag] = tags;

// Determine the release type (major, minor, or patch)
const releaseType = determineReleaseType(previousTag, currentTag);

console.log(`Previous Tag: ${previousTag}`);
console.log(`Current Tag: ${currentTag}`);
console.log(`Release Type: ${releaseType}`);

// Set environment variable in GitHub Actions
fs.appendFileSync(process.env.GITHUB_ENV, `RELEASE_TYPE=${releaseType}\n`);