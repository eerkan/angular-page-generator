import { replaceAll } from "../../helpers/string-helper";

export const DefaultChildComponentTemplate: string = `{
    path: "",
    redirectTo: "__CHILD_NAME__",
    pathMatch: "full"
},
`;
export function DefaultChildComponent(childName: string): string {
    let defaultChildComponent = DefaultChildComponentTemplate;
    defaultChildComponent = replaceAll(defaultChildComponent, `__CHILD_NAME__`, childName);
    return defaultChildComponent;
}