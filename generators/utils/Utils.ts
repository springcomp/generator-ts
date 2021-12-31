import * as _ from "lodash";

export class ParseResult {
  scopeName: string;
  localName: string;
}

export class Utils {

  public static parseScopedName(name: string): ParseResult {
    const nameFragments = name.split('/');
    const parseResult: ParseResult = {
      scopeName: '',
      localName: name
    };

    if (nameFragments.length > 1) {
      parseResult.scopeName = nameFragments[0];
      parseResult.localName = nameFragments[1];
    }

    return parseResult;
  }

  public static makeGeneratorName(name: string): string {
    const parsedName = Utils.parseScopedName(name);
    name = parsedName.localName;
    name = _.kebabCase(name);
    name = name.indexOf('generator-') === 0 ? name : 'generator-' + name;
    return parsedName.scopeName ? `${parsedName.scopeName}/${name}` : name;
  }
}