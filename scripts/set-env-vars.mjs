import fs from "fs";

// Value to set for the environment variable
const myValue = 'Hello from JS script';

// Write the variable to the GITHUB_ENV file
fs.appendFileSync(process.env.GITHUB_ENV, `MY_VARIABLE=${myValue}\n`);