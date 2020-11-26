export function replaceAll(source: string, search: string, value: string): string {
    return source.replace(new RegExp(search, 'g'), value);
}
