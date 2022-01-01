import * as _ from "lodash";
import * as Generator from "yeoman-generator";

import askName = require("inquirer-npm-name");
const extend = require('deep-extend');
import inquirer = require("inquirer");
import path = require("path");

import { AppAnswers } from "./AppAnswers";
import { AppOptions } from "./AppOptions";
import { Utils } from "../utils/Utils";

export class App extends Generator {

  options: AppOptions = new AppOptions();
  answers: AppAnswers = new AppAnswers();

  public constructor(args: string[], opts: AppOptions) {
    super(args, opts);

    this.option('skip-install', { type: Boolean, description: "Do not automatically install dependencies", });
  }

  public async prompting() {

    const result = await askName(
      {
        name: 'name',
        message: 'Project name',
        default: Utils.makeGeneratorName(path.basename(process.cwd())),
        filter: Utils.makeGeneratorName,
        validate: str => {
          return str.length > 'generator-'.length;
        }
      },
      inquirer
    );

    this.options.name = result.name;
    Object.assign(this.options, Utils.parseScopedName(result.name));
  }

  public async default() {
    this.composeWith(require.resolve('generator-node/generators/app'), {
      boilerplate: false,
      name: this.options.name,
      projectRoot: 'generators',
      skipInstall: this.options["skip-install"],
    });
  }

  public async writing() {

    // add tsconfig.json

    const tsConfig = this.fs.read(this.templatePath('tsconfig.json'), {});
    this.fs.write(this.destinationPath('tsconfig.json'), tsConfig);

    // install TypeScript as a dev dependency

    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    extend(pkg, {
      devDependencies: {
        'typescript': '^4.5.4',
      }
    });

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }
}
