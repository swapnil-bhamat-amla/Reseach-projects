import arg from "arg";
import inquirer from "inquirer";
import figlet from 'figlet';
import { Init } from "./Init";
import chalk from 'chalk';
import { newComponent } from './component/new-component';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            "--git": Boolean,
            "--yes": Boolean,
            "--install": Boolean,
            "-g": "--git",
            "-y": "--yes",
            "-i": "--install"
        },
        {
            argv: rawArgs.slice(2)
        }
    );
    return {
        skipPrompts: args["--yes"] || false,
        git: args["--git"] || false,
        template: args._[0],
        runInstall: args["--install"] || true
    };
}

async function promptForMissingOptions(options) {
    const defaultTemplate = "Initialize";
    if (options.skipPrompts) {
        return {
            ...options,
            template: options.template || defaultTemplate
        };
    }

    const questions = [];
    if (!options.template) {
        console.log(chalk.bold.green(figlet.textSync("A r t i f i - C L I")));
        questions.push({
            type: "list",
            name: "template",
            message: "Please choose your operation",
            choices: ["Initialize", "Create new component"],
            default: defaultTemplate
        });
    }

    // if (!options.git) {
    //     questions.push({
    //         type: "confirm",
    //         name: "git",
    //         message: "Initialize a git repository?",
    //         default: false
    //     });
    // }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git
    };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    
    switch (options.template) {
        case "Initialize":
        case "init":
        case "Init":
            Init(options);
            break;
        case "Create new component":
            newComponent(options);
            break;
    }
}
