import fs from "fs";
import semver from "semver"
import {execSync} from "child_process"
// Value to set for the environment variable
const myValue = 'Hello from JS script';

// Write the variable to the GITHUB_ENV file
fs.appendFileSync(process.env.GITHUB_ENV, `MY_VARIABLE=${myValue}\n`);

// Function to get the last two git tags
function getLastTwoTags() {
  try {
    const tags = execSync("git tag --sort=-creatordate | grep -E '^v([0-9]+\\.[0-9]+\\.[0-9]+)$' | head -n 2")
      .toString()
      .trim()
      .split('\n');
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
  console.log('Not enough tags to compare.');
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