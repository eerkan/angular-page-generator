import { replaceAll } from "../../helpers/string-helper";

export const ChildComponentTemplate: string = `{
    path: "__CHILD_NAME__",
    component: __CHILD_CLASS__Component
},
`;
export function ChildComponent(childName: string, childClass: string): string {
    let childComponent = ChildComponentTemplate;
    childComponent = replaceAll(childComponent, `__CHILD_NAME__`, childName);
    childComponent = replaceAll(childComponent, `__CHILD_CLASS__`, childClass);
    return childComponent;
}