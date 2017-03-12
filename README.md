# Parada.js

[![Build Status](https://travis-ci.org/MichalZalecki/paradajs.svg?branch=master)](https://travis-ci.org/MichalZalecki/paradajs)

Monads implementation targeting compliance with [Fantasy Land Specification](https://github.com/fantasyland/fantasy-land#monad).

Much more liberal approach to types makes this implementation much easier to use in real world JS/TS projects than its more idiomatic [predecessor](https://github.com/MichalZalecki/monadsjs).

## Instalation

```
npm install paradajs
```

## Monads

* `Identity`
* `CoIdentity`
* `Either` of type `Left` or `Right` ([live example](https://www.webpackbin.com/bins/-Kf1HimzVy2_-uxmK2rS))
* `Maybe` of type `Just` or `Nothing` ([live example](https://www.webpackbin.com/bins/-Kf1KXQh89LH6eWqz5z9))
* `IO` ([live example](https://www.webpackbin.com/bins/-Kf1IJitZHM9GbvdkafH))
* `List` ([live example](https://www.webpackbin.com/bins/-Kf1KtUNSk5yv0cvGTCa))

See `src/test` to learn more about each monad.
