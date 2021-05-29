import chalk from "chalk";
import execa from "execa";
import Listr from "listr";
import inquirer from "inquirer";
import os from 'os';
import fs from 'fs';
import fsx from 'fs-extra';
import { getRollupConfiguration, getTsConfig } from './config-json';

var tempDir = os.tmpdir();
var workingDir = process.cwd();

async function initCreateReactApp(options) {

    //change to temp dir
    process.chdir(tempDir);

    if (fsx.existsSync(options.componentName)){
        fsx.removeSync(tempDir+'/'+options.componentName); 
    }

    const result = await execa("create-react-app", [
        options.componentName,
        "--typescript",
        "--use-npm"
    ]);
    if (result.failed) {
        return Promise.reject(new Error("Failed to initialize git"));
    }
    process.chdir(options.componentName);
    return;
}

async function configGITOrigin(options) {
    const result = await execa("git", [
        "remote",
        "add",
        "origin",
        options.gitOrigin
    ]);
    if (result.failed) {
        return Promise.reject(new Error("Failed to initialize git"));
    }
    return;
}

async function installDependencies(options) {
    const result = await execa("npm", [
        "install",
        "--save",
        "redux",
        "@types/redux",
        "react-redux",
        "@types/react-redux",
        "redux-dynamic-modules",
    ]);
    if (result.failed) {
        return Promise.reject(new Error("Failed to initialize git"));
    }
    return;
}

async function bundleConfigurations(options) {
    const result = await execa("npm", [
        "install",
        "--save-dev",
        "rollup",
        "rollup-plugin-node-resolve",
        "rollup-plugin-typescript2",
        "rollup-plugin-replace",
        "rollup-plugin-commonjs",
        "rollup-plugin-uglify",
        "rollup-plugin-postcss"
    ]);

    if (result.failed) {
        return Promise.reject(new Error("Failed to initialize git"));
    }

    fs.writeFile(process.cwd()+"/rollup.config.js", getRollupConfiguration(options), function(err) {
        if(err) {
            return console.log(err);
        }
    });

    fs.writeFile(process.cwd()+"/tsconfig.rollup.json", getTsConfig(), function(err) {
        if(err) {
            return console.log(err);
        }
    }); 

    return;
}

async function saveChangesANDAddSubModule(options) {
    const result = await execa("git", [
        "add",
        "."
    ]);
    const result1 = await execa("git", [
        "commit",
        "-m",
        "re-artifi init commit"
    ]);
    const result2 = await execa("git", [
        "push",
        "-u",
        "origin",
        "master"
    ]);

    process.chdir(workingDir);
    const result3 = await execa("git", [
        "submodule",
        "add",
        options.gitOrigin
    ]);

    process.chdir(options.componentName);

    const result4 = await execa("npm", [
        "install"
    ]);
    
    return;
}

async function promptForMissingOptions(options) {

    if (options.skipPrompts) {
        return {
            ...options
        };
    }

    const questions = [];

    if (!options.name) {
        questions.push({
            type: "input",
            name: "componentName",
            message: "Please enter your component name. eg. text-component (not allowed caps letter & spaces)"
        });
    }

    if (!options.origin) {
        questions.push({
            type: "input",
            name: "origin",
            message: "Please paste GIT origin URL of component."
        });
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        componentName: options.componentName || answers.componentName,
        gitOrigin: options.origin || answers.origin
    };
}


export async function newComponent(options){

    options = await promptForMissingOptions(options);

    const tasks = new Listr([
        {
            title: "Init Create React App.",
            task: () => initCreateReactApp(options)
        },
        {
            title: "Configuring GIT Remote Origin URL.",
            task: () => configGITOrigin(options)
        },
        {
            title: "Installing Dependencies.",
            task: () => installDependencies(options)
        },
        {
            title: "Setup & Configuration of build process & bundlling.",
            task: () => bundleConfigurations(options)
        },
        {
            title: "Saving changes to GIT.",
            task: () => saveChangesANDAddSubModule(options)
        }
    ]);

    await tasks.run();
    console.log(
        chalk.green(
            "New component initialized successfully."
        )
    );
    console.log(
        chalk.blue(
            "component name - " + options.componentName
        )
    );
    console.log(
        chalk.blue(
            "component GIT Origin - " + options.gitOrigin
        )
    );
}

