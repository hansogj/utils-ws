# abonnement-js

[![npm version](https://img.shields.io/npm/v/@hansogj/abonnement-js)](https://www.npmjs.com/package/@hansogj/abonnement-js)
[![known vulnerabilities](https://snyk.io/test/npm/@hansogj/abonnement-js/badge.svg)](https://snyk.io/test/npm/@hansogj/abonnement-js)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@hansogj/abonnement-js)](https://bundlephobia.com/package/@hansogj/abonnement-js)

lightweight, naive, event susbscription

## Simple excample

```typescript
import {
  Abonnement,
  JoinedAbonnement,
  AlleAbonnementer,
} from "../src/abonnement";


let stringAbonnement: Abonnement<String> =  new Abonnement<String>("start value")
stringAbonnement.abonner(e => console.log("current value is " + e);
stringAbonnement.varsle("updated value")

```

Inspect the [test](src/abonnement.spec.ts)-file for usage

## Develop

`npm ci & npm build` to build this pack

## Breaking v4.0.0

Moving target lib from "_lib_" to "_dist_"
