import { replaceAll } from "../../helpers/string-helper";

export const ComponentHtmlTemplate: string = `<p>__NAME__ works!</p>`;
export function ComponentHtml(name: string): string {
    let componentHtml = ComponentHtmlTemplate;
    componentHtml = replaceAll(componentHtml, `__NAME__`, name);
    return componentHtml;
}