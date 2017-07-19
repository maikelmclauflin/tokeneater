var b = require('batterie');
var tokeneater = require('.');
b.describe('tokeneater', function () {
    b.expect(tokeneater).toBeFunction();
    b.expect(tokeneater).toThrow();
    b.it('needs a target at least', function (t) {
        t.expect(tokeneater({
            target: ''
        })).toBeEmptyString();
    });
    b.it('can slice up the string any number of ways', function (t) {
        var result = tokeneater({
            match: /(.)/igm,
            target: 'name',
            tokens: [{
                match: /[aeiou]/igm,
                handle: function (memo, item) {
                    return memo + item;
                }
            }]
        });
        t.expect(result).toBe('ae');
    });
    var list = ['My', ' ', 'name', ' ', 'is', ' ', 'henry', '.'];
    b.it('matches whole words and groups of white space by default', function (t) {
        var result = tokeneater({
            target: list.join(''),
            tokens: [{
                handle: function (memo, item, index) {
                    t.expect(item).toEqual(list[index]);
                    return memo + item.split('').reverse().join('');
                }
            }]
        });
        t.expect(result).toBe('yM eman si yrneh.');
    }, list.length + 1);
    b.it('iterates over blocks', function (t) {
        var result = tokeneater({
            block: /,/igm,
            target: 'dog, cat, bear, elephant, ..., giraffe',
            newBlock: function (memo) {
                return memo;
            },
            tokens: [{
                handle: function (memo, item) {
                    return memo + item;
                }
            }]
        });
        t.expect(result).toBe('dog cat bear elephant ... giraffe');
    });
    // b.it('handles lines by replacing them', function () {
    //     //
    // });
});