import { replaceAll } from "../../helpers/string-helper";

export const ModuleRoutingTemplate: string = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { __CLASS__Component } from './__NAME__.component';
__CHILDREN_IMPORT__

const routes: Routes = [
    {
        path: "",
        component: __CLASS__Component,
        children: [
            __CHILDREN__
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class __CLASS__RoutingModule { }`;
export function ModuleRouting(name: string, className: string, children: string, childrenImport: string): string {
    let moduleRouting = ModuleRoutingTemplate;
    moduleRouting = replaceAll(moduleRouting, `__NAME__`, name);
    moduleRouting = replaceAll(moduleRouting, `__CLASS__`, className);
    moduleRouting = replaceAll(moduleRouting, `__CHILDREN__`, children);
    moduleRouting = replaceAll(moduleRouting, `__CHILDREN_IMPORT__`, childrenImport);
    return moduleRouting;
}