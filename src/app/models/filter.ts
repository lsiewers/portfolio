export interface Filter {
    type: string;
    openTab?: boolean;
    values: Array<string> | Array<{type: string, values: Array<string> }>;
}
