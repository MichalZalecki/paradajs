"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monads_1 = require("../lib/monads");
describe("Identity", () => {
    test("implements Functor", () => {
        const u = monads_1.Identity.of("foo");
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
        const v = monads_1.Identity.of(f);
        const u = monads_1.Identity.of(f);
        // 1. identity
        expect(v.ap(monads_1.Identity.of(f))).toEqual(v);
        // 2. homomorphism
        expect(monads_1.Identity.of(x).ap(monads_1.Identity.of(f))).toEqual(monads_1.Identity.of(f(x)));
        // 3. interchange
        expect(monads_1.Identity.of(y).ap(u)).toEqual(u.ap(monads_1.Identity.of(z => z(y))));
    });
    test("implements Monad", () => {
        const a = "foo";
        const f = str => str.length;
        const m = monads_1.Identity.of("foo");
        // 1. left identity
        expect(monads_1.Identity.of(a).chain(f)).toEqual(f(a));
        // 2. right identity
        expect(m.chain(monads_1.Identity.of)).toEqual(m);
    });
});
describe("CoIdentity", () => {
    test("implements Extend", () => {
        const w = monads_1.CoIdentity.of("foo");
        const f = m => m.map(n => n * n);
        const g = m => m.map(str => str.length);
        expect(w.extend(g).extend(f)).toEqual(w.extend(_w => f(_w.extend(g))));
    });
    test("implements Comonad", () => {
        const w = monads_1.CoIdentity.of(3);
        const f = m => m.map(n => n * n);
        expect(w.extend(_w => _w.extract(w))).toEqual(w);
        expect(w.extend(f).extract()).toEqual(f(w));
    });
});
describe("Either", () => {
    test("stores values as Right", () => {
        const m = monads_1.Right.of(100).map(x => x * x);
        expect.assertions(1);
        if (m instanceof monads_1.Right) {
            expect(m.value).toBe(10000);
        }
    });
    test("catches error and returns Left of that error", () => {
        const m = monads_1.Right.of(100).map(x => x.toUpperCase());
        expect(m).toBeInstanceOf(monads_1.Left);
    });
});
describe("Maybe", () => {
    test("stores values as Just", () => {
        const m = monads_1.Just.of(100).map(x => x * x);
        expect.assertions(1);
        if (m instanceof monads_1.Just) {
            expect(m.value).toBe(10000);
        }
    });
    test("catches error and returns Nothing", () => {
        const m = monads_1.Just.of(100).map(x => x.toUpperCase());
        expect(m).toBeInstanceOf(monads_1.Nothing);
    });
});
describe("IO", () => {
    test("implements Setoid", () => {
        const effect = jest.fn();
        const a = monads_1.IO.of(effect, "arg1", "arg2");
        const b = monads_1.IO.of(effect, "arg1", "arg2");
        const c = monads_1.IO.of(effect, "arg1", "arg2");
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
        const a = monads_1.IO.of(effect, "arg1", "arg2");
        expect(effect).not.toBeCalled();
        a.run();
        expect(effect).toBeCalledWith("arg1", "arg2");
    });
});
describe("List", () => {
    test("stores iterable and provides lazy evaludation", () => {
        const f = jest.fn().mockImplementation(x => x * 2);
        const m = monads_1.List.of([1, 2, 3]).map(f);
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
        for (let elem of monads_1.List.of([1, 2, 3])) {
            elems.push(elem);
        }
        expect(elems).toEqual([1, 2, 3]);
    });
});
