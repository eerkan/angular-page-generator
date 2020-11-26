import { replaceAll } from "../../helpers/string-helper";

export const ImportTemplate: string = `import { __IMPORT__ } from '__FROM__';
`;
export function Import(__import: string, from: string): string {
    let _import = ImportTemplate;
    _import = replaceAll(_import, `__IMPORT__`, __import);
    _import = replaceAll(_import, `__FROM__`, from);
    return _import;
}