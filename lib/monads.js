"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepEqual = require("deep-equal");
function chain(fn) {
    return fn(this.value);
}
exports.chain = chain;
function ap(m) {
    return m.map(x => x(this.value));
}
exports.ap = ap;
class Identity {
    constructor(value) {
        this.value = value;
        this.chain = chain;
        this.ap = ap;
    }
    static of(value) {
        return new Identity(value);
    }
    map(fn) {
        return Identity.of(fn(this.value));
    }
}
exports.Identity = Identity;
class CoIdentity {
    constructor(value) {
        this.value = value;
        this.chain = chain;
        this.ap = ap;
    }
    static of(value) {
        return new CoIdentity(value);
    }
    map(fn) {
        return CoIdentity.of(fn(this.value));
    }
    extend(fn) {
        return CoIdentity.of(fn(this));
    }
    extract() {
        return this.value;
    }
}
exports.CoIdentity = CoIdentity;
class Left {
    constructor(value) {
        this.value = value;
    }
    static of(value) {
        return new Left(value);
    }
    chain(_fn) {
        return this;
    }
    ap(_fn) {
        return this;
    }
    map(_fn) {
        return this;
    }
}
exports.Left = Left;
class Right {
    constructor(value) {
        this.value = value;
    }
    static of(value) {
        return new Right(value);
    }
    chain(fn) {
        try {
            return chain.call(this, fn);
        }
        catch (err) {
            return Left.of(err);
        }
    }
    ap(m) {
        try {
            return ap.call(this, m);
        }
        catch (err) {
            return Left.of(err);
        }
    }
    map(fn) {
        try {
            return Right.of(fn(this.value));
        }
        catch (err) {
            return Left.of(err);
        }
    }
}
exports.Right = Right;
class Nothing {
    chain(_fn) {
        return this;
    }
    ap(_fn) {
        return this;
    }
    map(_fn) {
        return this;
    }
}
exports.Nothing = Nothing;
class Just {
    constructor(value) {
        this.value = value;
    }
    static of(value) {
        return new Just(value);
    }
    chain(fn) {
        try {
            return chain.call(this, fn);
        }
        catch (err) {
            return new Nothing();
        }
    }
    ap(m) {
        try {
            return ap.call(this, m);
        }
        catch (err) {
            return new Nothing();
        }
    }
    map(fn) {
        try {
            return Just.of(fn(this.value));
        }
        catch (err) {
            return new Nothing();
        }
    }
}
exports.Just = Just;
class IO {
    constructor(value, ...args) {
        this.value = value;
        this.chain = chain;
        this.ap = ap;
        this.args = args;
    }
    static of(value, ...args) {
        return new IO(value, ...args);
    }
    map(fn) {
        return IO.of(fn(this.value));
    }
    run() {
        this.value(...this.args);
    }
    equals(m) {
        return deepEqual(this, m);
    }
}
exports.IO = IO;
// TODO: Continuation (Promise)
function* lazyMap(iterable, fn) {
    for (let elem of iterable) {
        yield fn(elem);
    }
}
class List {
    constructor(value) {
        this.value = value;
        this.chain = chain;
    }
    static of(value) {
        return new List(value);
    }
    // TODO: ap() implementation?
    map(fn) {
        return List.of(lazyMap(this.value, fn));
    }
    *[Symbol.iterator]() {
        yield* this.value;
    }
}
exports.List = List;
