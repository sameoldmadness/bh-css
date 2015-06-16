BH-CSS
======

Define CSS within [BH](https://github.com/bem/bh) templates:

```js
var bh = new BH();

bh.match('block', function (ctx) {
    ctx.content({
        elem: 'elem',
        mods: { foo: 'bar' }
    });
}, {
    'color': 'red'
});
```

Styles are injected into the page in lazy manner.
