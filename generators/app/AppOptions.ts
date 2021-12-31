import { Options } from "../Options";
export class AppOptions extends Options {
	localName: string;
	name: string;
	scopeName: string;
	["skip-install"]: boolean;
}