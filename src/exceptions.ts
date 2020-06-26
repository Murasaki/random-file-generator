export class GenerateArgumentException extends Error {
    constructor(argumentName: string, value: any) {
        super(`Argument '${argumentName}' is not a valid value. Value: '${value}'`);
    }
}