import { replaceAll } from "../../helpers/string-helper";

export const ModuleModuleTemplate: string = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { __CLASS__Component } from './__NAME__.component';
import { __CLASS__RoutingModule } from './__NAME__-routing.module';
__COMPONENTS_IMPORT__

const COMPONENTS = [
  __CLASS__Component,
  __COMPONENTS__
];

const MODULES = [
  CommonModule,
  __CLASS__RoutingModule,
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...COMPONENTS
  ]
})
export class __CLASS__Module { }`;
export function ModuleModule(name: string, className: string, components: string, componentsImport: string): string {
  let moduleModule = ModuleModuleTemplate;
  moduleModule = replaceAll(moduleModule, `__NAME__`, name);
  moduleModule = replaceAll(moduleModule, `__CLASS__`, className);
  moduleModule = replaceAll(moduleModule, `__COMPONENTS__`, components);
  moduleModule = replaceAll(moduleModule, `__COMPONENTS_IMPORT__`, componentsImport);
  return moduleModule;
}