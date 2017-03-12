export declare function chain(fn: any): any;
export declare function ap(m: any): any;
export declare class Identity {
    value: any;
    static of(value: any): Identity;
    constructor(value: any);
    chain: typeof chain;
    ap: typeof ap;
    map(fn: any): Identity;
}
export declare class CoIdentity {
    value: any;
    static of(value: any): CoIdentity;
    constructor(value: any);
    chain: typeof chain;
    ap: typeof ap;
    map(fn: any): CoIdentity;
    extend(fn: any): CoIdentity;
    extract(): any;
}
export declare class Left {
    value: any;
    static of(value: any): Left;
    constructor(value: any);
    chain(_fn: any): this;
    ap(_fn: any): this;
    map(_fn: any): this;
}
export declare class Right {
    value: any;
    static of(value: any): Right;
    constructor(value: any);
    chain(fn: any): any;
    ap(m: any): any;
    map(fn: any): any;
}
export declare type Either = Left | Right;
export declare class Nothing {
    chain(_fn: any): this;
    ap(_fn: any): this;
    map(_fn: any): this;
}
export declare class Just {
    value: any;
    static of(value: any): Just;
    constructor(value: any);
    chain(fn: any): any;
    ap(m: any): any;
    map(fn: any): Nothing | Just;
}
export declare type Maybe = Nothing | Just;
export declare class IO {
    value: any;
    static of(value: any, ...args: any[]): IO;
    args: any[];
    constructor(value: any, ...args: any[]);
    chain: typeof chain;
    ap: typeof ap;
    map(fn: any): IO;
    run(): void;
    equals(m: any): any;
}
export declare class List {
    value: any;
    static of(value: any): List;
    constructor(value: any);
    chain: typeof chain;
    map(fn: any): List;
    [Symbol.iterator](): IterableIterator<any>;
}
