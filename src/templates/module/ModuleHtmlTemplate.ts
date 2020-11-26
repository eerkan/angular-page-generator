import { replaceAll } from "../../helpers/string-helper";

export const ModuleHtmlTemplate: string = `<router-outlet></router-outlet>`;
export function ModuleHtml(): string {
    let moduleHtml = ModuleHtmlTemplate;
    return moduleHtml;
}