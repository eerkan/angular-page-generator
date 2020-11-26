import * as process from 'process';
import * as fs from 'fs';
import * as _ from 'lodash';
import { ComponentHtml } from './templates/component/ComponentHtmlTemplate';
import { ComponentScss } from './templates/component/ComponentScssTemplate';
import { ComponentTs } from './templates/component/ComponentTsTemplate';
import { ModuleHtml } from './templates/module/ModuleHtmlTemplate';
import { ModuleScss } from './templates/module/ModuleScssTemplate';
import { ModuleTs } from './templates/module/ModuleTsTemplate';
import { ModuleRouting } from './templates/module/ModuleRoutingTemplate';
import { ModuleModule } from './templates/module/ModuleModule';
import { Import } from './templates/import/ImportTemplate';
import { DefaultChildComponent } from './templates/child/DefaultChildComponentTemplate';
import { ChildComponent } from './templates/child/ChildComponentTemplate';
import { ChildModule } from './templates/child/ChildModuleTemplate';

function clearFolder(): void {
    fs.rmdirSync(pagesPath, { recursive: true });
    fs.mkdirSync(pagesPath);
}

function nameToClassName(routeName: string): string {
    return _.upperFirst(_.camelCase(routeName));
}

function onFileWrited(err: any): void {
    if (err)
        console.error(err);
}

function childrenForComponent(components: string[]): any {
    let _components = ``;
    let childrenImport = ``;
    let children = ``;
    let componentsImport = ``;

    components.map(component => {
        const componentClass = nameToClassName(component);
        _components += `${componentClass}Component, `;

        const fromComponent = `./components/${component}/${component}.component`;
        const importComponent = `${componentClass}Component`;

        const childImport = Import(importComponent, fromComponent);

        childrenImport += childImport;
        componentsImport += childImport;

        const child = ChildComponent(component, componentClass);

        children += child;
    });

    return { components: _components, childrenImport, children, componentsImport };
}

function childrenForModule(modules: string[]): any {
    let childrenImport = ``;
    let children = ``;

    modules.map(__module => {
        const moduleClass = nameToClassName(__module);

        const fromModule = `./${__module}/${__module}-routing.module`;
        const importModule = `${moduleClass}RoutingModule`;

        const childImport = Import(importModule, fromModule);

        childrenImport += childImport;

        const child = ChildModule(__module, moduleClass);

        children += child;
    });

    return { children, childrenImport };
}

function generateComponent(path: string, name: string, prefix: string = ``): void {
    console.log(`Generating ${name} component...`);
    const className = nameToClassName(name);

    const componentPath = `${path}\\${name}`;
    const componentBasePath = `${componentPath}\\${name}.component`;
    const htmlPath = `${componentBasePath}.html`;
    const scssPath = `${componentBasePath}.scss`;
    const tsPath = `${componentBasePath}.ts`;

    fs.mkdirSync(componentPath);

    const html = ComponentHtml(name);
    const scss = ComponentScss();
    const ts = ComponentTs(name, className, prefix);

    fs.writeFile(htmlPath, html, onFileWrited);
    fs.writeFile(scssPath, scss, onFileWrited);
    fs.writeFile(tsPath, ts, onFileWrited);
}

function generateModule(path: string, name: string, prefix: string = ``, components: string[] = [], modules: string[] = []): void {
    console.log(`Generating ${name} module...`);
    const className = nameToClassName(name);

    const moduleBasePath = `${path}\\${name}`;
    const htmlPath = `${moduleBasePath}\\${name}.component.html`;
    const scssPath = `${moduleBasePath}\\${name}.component.scss`;
    const tsPath = `${moduleBasePath}\\${name}.component.ts`;
    const modulePath = `${moduleBasePath}\\${name}.module.ts`;
    const routingPath = `${moduleBasePath}\\${name}-routing.module.ts`;
    const componentsBasePath = `${moduleBasePath}\\components`;

    fs.mkdirSync(moduleBasePath);

    let childrenImport = ``;
    let children = ``;
    let componentsImport = ``;
    let _components = ``;

    if (components.length > 0) {
        fs.mkdirSync(componentsBasePath);

        const defaultComponent = components[0];
        const defaultChildComponent = DefaultChildComponent(defaultComponent);

        children += defaultChildComponent;

        components.map(component => {
            generateComponent(componentsBasePath, component, prefix);
        });

        const componentChildrenParts = childrenForComponent(components);

        _components += componentChildrenParts.components;
        childrenImport += componentChildrenParts.childrenImport;
        children += componentChildrenParts.children;
        componentsImport += componentChildrenParts.componentsImport;
    }

    if (modules.length > 0) {
        const moduleChildrenParts = childrenForModule(modules);

        childrenImport += moduleChildrenParts.childrenImport;
        children += moduleChildrenParts.children;
    }

    const html = ModuleHtml();
    const scss = ModuleScss();
    const ts = ModuleTs(name, className, prefix);
    const _module = ModuleModule(name, className, _components, componentsImport);
    const routing = ModuleRouting(name, className, children, childrenImport);

    fs.writeFile(htmlPath, html, onFileWrited);
    fs.writeFile(scssPath, scss, onFileWrited);
    fs.writeFile(tsPath, ts, onFileWrited);
    fs.writeFile(modulePath, _module, onFileWrited);
    fs.writeFile(routingPath, routing, onFileWrited);
}

function getJSONFile(file: string): any {
    const fileContent = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    return JSON.parse(fileContent);
}

function getSubPagesOrComponents(subPages: any): any {
    let components = [];
    let pages = [];
    if (subPages instanceof Array)
        components = [...subPages];
    else {
        for (let page in subPages)
            pages.push(page);
    }
    return { components, pages };
}

function generatePages(pages: any, prefix: string, relativePath: string): void {
    const sub = getSubPagesOrComponents(pages);
    if (sub.pages.length > 0) {
        sub.pages.map(page => {
            const subPages = pages[page];
            const newRelativePath = `${relativePath}\\${page}`;
            const subSub = getSubPagesOrComponents(subPages);
            const modules = subSub.pages;
            const components = subSub.components;

            generateModule(relativePath, page, prefix, components, modules);

            generatePages(subPages, prefix, newRelativePath);
        });
    }
}

function generatePagesRouting(pages: any, pagesPath: string): void {
    console.log(`Generating pages router`);

    const sub = getSubPagesOrComponents(pages);
    if (sub.pages.length > 0) {
        const name = `pages`;
        const className = nameToClassName(name);

        const routingPath = `${pagesPath}\\${name}-routing.module.ts`;

        const subPagesChildrenParts = childrenForModule(sub.pages);

        const childrenImport = subPagesChildrenParts.childrenImport;
        const children = subPagesChildrenParts.children;

        const routing = ModuleRouting(name, className, children, childrenImport);

        fs.writeFile(routingPath, routing, onFileWrited);
    }
}

const rootPath = process.cwd();
const pagesPath = `${rootPath}\\pages`;

const pagesFile = getJSONFile(`pages.json`);

const prefix = pagesFile.prefix;
const pages = pagesFile.pages;

clearFolder();

generatePages(pages, prefix, pagesPath);
generatePagesRouting(pages, pagesPath);