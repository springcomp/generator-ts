import { Options } from "../Options";
export class AppOptions extends Options {
	localName: string;
	scopeName: string;

	["skip-install"]: boolean;

	travis: boolean = true;
	boilerplate: boolean = true;
	cli: boolean = false;
	coveralls: boolean;
	editorconfig: boolean = true;
	license: boolean = true;
	name: string;
	githubAccount: string;
	repositoryName: string;
	projectRoot: string = "lib";
	readme: string;
}