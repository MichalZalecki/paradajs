import * as deepEqual from "deep-equal";

export function chain(fn) {
  return fn(this.value);
}

export function ap(m) {
  return m.map(x => x(this.value))
}

export class Identity {
  static of(value) {
    return new Identity(value);
  }

  constructor(public value) {}

  chain = chain;
  ap = ap;

  map(fn) {
    return Identity.of(fn(this.value));
  }
}

export class CoIdentity {
  static of(value) {
    return new CoIdentity(value);
  }

  constructor(public value) { }

  chain = chain;
  ap = ap;

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

export class Left {
  static of(value) {
    return new Left(value);
  }

  constructor(public value) {}

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

export class Right {
  static of(value) {
    return new Right(value);
  }

  constructor(public value) {}

  chain(fn) {
    try {
      return chain.call(this, fn);
    } catch (err) {
      return Left.of(err);
    }
  }

  ap(m) {
    try {
      return ap.call(this, m);
    } catch (err) {
      return Left.of(err);
    }
  }

  map(fn) {
    try {
      return Right.of(fn(this.value));
    } catch (err) {
      return Left.of(err);
    }
  }
}

export type Either = Left | Right;

export class Nothing {
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

export class Just {
  static of(value) {
    return new Just(value);
  }

  constructor(public value) { }

  chain(fn) {
    try {
      return chain.call(this, fn);
    } catch (err) {
      return new Nothing();
    }
  }

  ap(m) {
    try {
      return ap.call(this, m);
    } catch (err) {
      return new Nothing();
    }
  }

  map(fn) {
    try {
      return Just.of(fn(this.value));
    } catch (err) {
      return new Nothing();
    }
  }
}

export type Maybe = Nothing | Just;

export class IO {
  static of(value, ...args) {
    return new IO(value, ...args);
  }

  args: any[];

  constructor(public value, ...args) {
    this.args = args;
  }

  chain = chain;
  ap = ap;

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

// TODO: Continuation (Promise)

function* lazyMap(iterable, fn) {
  for (let elem of iterable) {
    yield fn(elem);
  }
}

export class List {
  static of(value) {
    return new List(value);
  }

  constructor(public value) {}

  chain = chain;
  // TODO: ap() implementation?

  map(fn) {
    return List.of(lazyMap(this.value, fn));
  }

  *[Symbol.iterator]() {
    yield* this.value;
  }
}
