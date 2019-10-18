/**
 * @module SampleCode Foobar is the Baz
 */
/**
 * This is a text description. Module comments have to be at the very start of the file.
 *
 * It has two paragraphs and a
 * @preferred
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
export default function hello() {
    return R.map(a => a.toUpperCase(), "Hello, World!".split(/()/)).filter(a => /[^o,]/i.test(a)).join('');
}
