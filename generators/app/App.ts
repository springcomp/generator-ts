import * as _ from "lodash";
import * as Generator from "yeoman-generator";
const extend = require('deep-extend');
import validatePackageName = require('validate-npm-package-name');

import { AppAnswers } from "./AppAnswers";
import { AppOptions } from "./AppOptions";
import { Utils } from "../utils/Utils";

export class App extends Generator {

  options: AppOptions = new AppOptions();
  answers: AppAnswers = new AppAnswers();

  public constructor(args: string[], opts: AppOptions) {
    super(args, opts);

    this.option('travis', { type: Boolean, description: "Include travis config", default: true });
    this.option('boilerplate', { type: Boolean, description: "Include boilerplate files", default: true });
    this.option('cli', { type: Boolean, description: "Add a CLI", default: false });
    this.option('coveralls', { type: Boolean, description: "Include coveralls config", });
    this.option('editorconfig', { type: Boolean, description: "Include editorconfig config", default: true });
    this.option('license', { type: Boolean, description: "Include license config", default: true });
    this.option('name', { type: String, description: "Project name", });
    this.option('githubaccount', { type: String, description: "GitHub username or organization", });
    this.option('repositoryName', { type: String, description: "Name of the GitHub repository", });
    this.option('projectRoot', { type: String, description: "Relative path to the project code root", default: "lib" });
    this.option('readme', { type: String, description: "Content to insert in the README.md file", });
  }

  public initializing() {

    if (this.options.name) {
      const packageNameValidity = validatePackageName(this.options.name);
      if (!packageNameValidity.validForNewPackages) {
        this.emit(
          'error',
          new Error(
            _.get(packageNameValidity, 'errors.0') ||
            'The name option is not a valid npm package name.'
          ));
      }
    }
  }

  public async prompting() {

    if (this.options.name === undefined || this.options.name === '') {
      const result = await Utils.askForProjectName();
      this.options.name = result.name;
    }

    const projectName = this.options.name;
    const repositoryName = this.options.repositoryName;
    const moduleName = Utils.makeModuleName(projectName, repositoryName);

    Object.assign(this.options, moduleName);
  }

  public async default() {

    const options = {
      travis: this.options.travis,
      boilerplate: this.options.boilerplate,
      cli: this.options.cli,
      coveralls: this.options.coveralls,
      editorconfig: this.options.editorconfig,
      license: this.options.license,
      name: this.options.name,
      githubAccount: this.options.githubAccount,
      repositoryName: this.options.repositoryName,
      projectRoot: this.options.projectRoot,
      readme: this.options.readme,
      skipInstall: this.options["skip-install"],
    }

    this.log(options);

    this.composeWith(require.resolve('generator-node/generators/app'), this.options);
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
