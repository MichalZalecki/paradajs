# Parada.js

Monads implementation targeting compliance with [Fantasy Land Specification](https://github.com/fantasyland/fantasy-land#monad).

Much more liberal approach to types makes this implementation much easier to use in real world JS/TS projects than its more idiomatic [predecessor](https://github.com/MichalZalecki/monadsjs).

## Instalation

```
npm install paradajs
```

## Monads

* `Identity`
* `CoIdentity`
* `Either` of type `Left` or `Right`
* `Maybe` of type `Just` or `Nothing`
* `IO`
* `List`

## Examples

See `src/test` to learn more about each monad.
