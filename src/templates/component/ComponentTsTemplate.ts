import { replaceAll } from "../../helpers/string-helper";

export const ComponentTsTemplate: string = `import { Component, OnInit } from '@angular/core';

@Component({
  selector: '__PREFIX__-__NAME__',
  templateUrl: './__NAME__.component.html',
  styleUrls: ['./__NAME__.component.scss']
})
export class __CLASS__Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}`;
export function ComponentTs(name: string, className: string, prefix: string): string {
  let componentTs = ComponentTsTemplate;
  componentTs = replaceAll(componentTs, `__NAME__`, name);
  componentTs = replaceAll(componentTs, `__CLASS__`, className);
  componentTs = replaceAll(componentTs, `__PREFIX__`, prefix);
  return componentTs;
}