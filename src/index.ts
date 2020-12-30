/*
 * @module NpmRollupTemplate
 * Copyright 2020 by Bob Kerns. Licensed under MIT license.
 *
 * Github: https://github.com/BobKerns/npm-typescript-rollup-template
 */

/**
 * Load the full system with a single import.
 * @packageDocumentation
 * @preferred
 * @module Index
 */

import R from 'ramda';

/**
 * [Typedoc](https://typedoc.org/guides/doccomments/) is supported. It supports:
 *
 * * [MarkDown](https://marked.js.org/)
 * * [PlantUML](http://plantuml.com/) \
 *    UML requires that [GraphViz](https://graphviz.gitlab.io/) be installed. \
 *    <uml>
 *     A: field -> B
 *    </uml>
 * * [Mermaid](https://mermaidjs.github.io/)
 * @mermaid Mermaid diagrams
 * graph TD
 *   A-->B;
 *   B-->C;
 */
export function hello() {
    return R.map(a => a.toUpperCase(), "Hello, World!".split(/()/)).filter(a => /[^o,]/i.test(a)).join('');
}
