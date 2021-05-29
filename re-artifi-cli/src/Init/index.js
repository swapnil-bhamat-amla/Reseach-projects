import chalk from 'chalk';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

async function installGlobal() {
  await execa('npm', ['install', '-g', 'lerna', 'create-react-app']);
  return;
}

async function cloneRepo(options) {
  const result = await execa('git', [
    'clone',
    'http://172.16.100.120/artifi-react/artifi-components.git',
    '--recurse-submodules'
  ]);
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
  return;
}

async function boostrapLerna() {
  try {
    await execa('lerna', ['bootstrap']);
  } catch (e) {
    return Promise.reject(new Error('Failed to bootstrap lerna package.'));
  }
  return;
}

export async function Init(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd()
  };

  console.log(chalk.blue('Artifi Initialization Started'));
  console.log(
    chalk.yellow('Cloning from - http://172.16.100.120/artifi-react/artifi-components.git')
  );

  const tasks = new Listr([
    {
      title: 'Installing global dependencies.',
      task: () => installGlobal()
    },
    {
      title: 'Cloning Artifi React Components Project.',
      task: () => cloneRepo(options)
    },
    {
      title: 'Changing working directory.',
      task: () => process.chdir('artifi-components')
    },
    {
      title: 'Install dependencies',
      task: () =>
        projectInstall({
          cwd: process.cwd()
        }),
      skip: () =>
        !options.runInstall
          ? 'Pass --install (-i) to automatically install dependencies'
          : undefined
    },
    {
      title: 'Bootstrap Lerna Packages.',
      task: () => boostrapLerna()
    }
  ]);

  await tasks.run();
  // process.chdir("artifi-components"); // for testing
  console.log(chalk.blue('Artifi Initialized Completed.'));

  (async () => {
    const { stdout } = await execa('lerna', ['list']);
    console.log('...');
    console.log(chalk.yellow('List of packages.'));
    console.log(chalk.blue(stdout));
    console.log('...');
  })();
}
