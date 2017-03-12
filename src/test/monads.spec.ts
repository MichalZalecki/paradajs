import {
  Identity,
  CoIdentity,
  Either,
  Left,
  Right,
  Maybe,
  Just,
  Nothing,
  IO,
  List,
} from "../lib/monads";

describe("Identity", () => {
  test("implements Functor", () => {
    const u = Identity.of("foo");
    const g = str => str.length;
    const f = n => n * n;

    // 1. identity
    expect(u.map(a => a)).toEqual(u);

    // 2. composition
    expect(u.map(x => f(g(x)))).toEqual(u.map(g).map(f));
  });

  test("implements Applicative", () => {
    const f = a => a;
    const x = a => a;
    const y = a => a;
    const v = Identity.of(f);
    const u = Identity.of(f);

    // 1. identity
    expect(v.ap(Identity.of(f))).toEqual(v);

    // 2. homomorphism
    expect(Identity.of(x).ap(Identity.of(f))).toEqual(Identity.of(f(x)));

    // 3. interchange
    expect(Identity.of(y).ap(u)).toEqual(u.ap(Identity.of(z => z(y))));
  });

  test("implements Monad", () => {
    const a = "foo";
    const f = str => str.length;
    const m = Identity.of("foo");

    // 1. left identity
    expect(Identity.of(a).chain(f)).toEqual(f(a));

    // 2. right identity
    expect(m.chain(Identity.of)).toEqual(m);
  });
});

describe("CoIdentity", () => {
  test("implements Extend", () => {
    const w = CoIdentity.of("foo");
    const f = m => m.map(n => n * n);
    const g = m => m.map(str => str.length);

    expect(w.extend(g).extend(f)).toEqual(w.extend(_w => f(_w.extend(g))));
  });

  test("implements Comonad", () => {
    const w = CoIdentity.of(3);
    const f = m => m.map(n => n * n);

    expect(w.extend(_w => _w.extract(w))).toEqual(w);
    expect(w.extend(f).extract()).toEqual(f(w));
  });
});

describe("Either", () => {
  test("stores values as Right", () => {
    const m: Either = Right.of(100).map(x => x * x);

    expect.assertions(1);

    if (m instanceof Right) {
      expect(m.value).toBe(10000);
    }
  });

  test("catches error and returns Left of that error", () => {
    const m: Either = Right.of(100).map(x => x.toUpperCase());

    expect(m).toBeInstanceOf(Left);
  });
});

describe("Maybe", () => {
  test("stores values as Just", () => {
    const m: Maybe = Just.of(100).map(x => x * x);

    expect.assertions(1);

    if (m instanceof Just) {
      expect(m.value).toBe(10000);
    }
  });

  test("catches error and returns Nothing", () => {
    const m: Maybe = Just.of(100).map(x => x.toUpperCase());

    expect(m).toBeInstanceOf(Nothing);
  });
});

describe("IO", () => {
  test("implements Setoid", () => {
    const effect = jest.fn();
    const a = IO.of(effect, "arg1", "arg2");
    const b = IO.of(effect, "arg1", "arg2");
    const c = IO.of(effect, "arg1", "arg2");

    // 1. reflexivity
    expect(a.equals(a)).toBe(true);

    // 2. symmetry
    expect(a.equals(b)).toEqual(b.equals(a));

    // 3. transitivity
    expect(a.equals(b)).toEqual(b.equals(c));
    expect(a.equals(c)).toBe(true);
  });

  test("stores effect and provide run to execute it", () => {
    const effect = jest.fn();
    const a = IO.of(effect, "arg1", "arg2");

    expect(effect).not.toBeCalled();
    a.run();
    expect(effect).toBeCalledWith("arg1", "arg2");
  });
});

describe("List", () => {
  test("stores iterable and provides lazy evaludation", () => {
    const f = jest.fn().mockImplementation(x => x * 2);
    const m = List.of([1, 2, 3]).map(f);

    const iterator = m[Symbol.iterator]();

    expect(f).not.toBeCalled();
    expect(iterator.next().value).toBe(2);
    expect(f).toBeCalledWith(1);
    expect(iterator.next().value).toBe(4);
    expect(f).toBeCalledWith(2);
    expect(iterator.next().value).toBe(6);
    expect(f).toBeCalledWith(3);
  });

  test("implements Iterable", () => {
    const elems = [];
    for (let elem of List.of([1, 2, 3])) {
      elems.push(elem);
    }
    expect(elems).toEqual([1, 2, 3]);
  });
});
