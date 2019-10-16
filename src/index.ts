
/*
 * Copyright © 2019. Licensed under MIT license.
 */

import R from 'ramda';

export default function hello() {
    return R.map(a => a.toUpperCase(), "Hello, World!".split(/()/)).filter(a => /[^o,]/i.test(a)).join('');
}
