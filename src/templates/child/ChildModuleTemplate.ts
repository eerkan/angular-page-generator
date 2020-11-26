import { replaceAll } from "../../helpers/string-helper";

export const ChildModuleTemplate: string = `{
    path: "__CHILD_NAME__",
    loadChildren: () =>
        import("./__CHILD_NAME__/__CHILD_NAME__.module").then(
            m => m.__CHILD_CLASS__Module
        )
},
`;
export function ChildModule(childName: string, childClass: string): string {
    let childModule = ChildModuleTemplate;
    childModule = replaceAll(childModule, `__CHILD_NAME__`, childName);
    childModule = replaceAll(childModule, `__CHILD_CLASS__`, childClass);
    return childModule;
}