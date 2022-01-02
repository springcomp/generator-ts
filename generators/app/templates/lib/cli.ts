import meow, { AnyFlag, Options } from "meow";

const helpMessage: string = `
	Usage
	  $ foo <input>

	Options
	  --rainbow, -r  Include a rainbow

	Examples
	  $ foo unicorns --rainbow
	  🌈 unicorns 🌈
`;

const options: Options<{ [key: string]: AnyFlag }> = {
	importMeta: import.meta,
	flags: {
		rainbow: {
			type: 'boolean',
			alias: 'r'
		}
	}
};

const cli = meow(helpMessage, options);

//{
//	input: ['unicorns'],
//	flags: {rainbow: true},
//	...
//}
