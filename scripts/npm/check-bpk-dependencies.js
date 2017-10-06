/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2017 Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 /* eslint-disable no-console */

const { execSync } = require('child_process');

const updatedFiles = [];

const checkBpkDependencies = (packageFile) => {
  const command = `ncu '/^(react-native-)?bpk-.*$/' -a -u --packageFile ${packageFile}`;
  const result = execSync(command).toString();
  if (!result.includes('All dependencies match the latest')) {
    console.log(`Outdated bpk package dependencies in ${packageFile}! 😱`);
    console.log('');
    updatedFiles.push(packageFile);
  }
};

const installNcu = () => {
  try {
    execSync('npm list -g npm-check-updates');
  } catch (e) {
    console.log('NCU not installed 😱 Installing now! 🙉 ');
    console.log('Installing NCU now! 🙉 ');
    execSync('npm install -g npm-check-updates');
    console.log('');
  }
};

console.log('Checking dependencies on bpk packages');
console.log('');

installNcu();

const packageFiles = execSync('find . -name package.json | grep -v node_modules').toString().split('\n');
packageFiles.forEach((pf) => {
  if (pf !== '') {
    console.log(`checking file ${pf}`);
    checkBpkDependencies(pf);
  }
});

if (updatedFiles.length === 0) {
  console.log('All good.  👍');
} else {
  console.log('');
  console.log('Updated the following files 🙈');
  updatedFiles.forEach((fileName) => { console.log(` - ${fileName}`); });
}
console.log('');
