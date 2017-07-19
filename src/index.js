module.exports = tokenator;

function tokenator(options) {
    var regexp = options.match || /(\s+|\W|\w+)/igm;
    var target = options.target || '';
    var tokens = options.tokens || [];
    var execHandle = options.newBlock || newLine;
    var block = options.block || /(\r|\n)/igm;
    var lines = target.split(block);
    var memo = options.memo || '';
    return reduce(lines, operateOnLine, memo);

    function operateOnLine(memo, item, index, lines) {
        var lineindex, line, result = memo;
        if (item) {
            lineindex = index;
            result = reduce(item.match(regexp), function (memo, item, index) {
                var matched, m = memo,
                    token = find(tokens, function (token) {
                        var match = token.match || /./igm;
                        if (match) {
                            matched = item.match(match);
                            return matched;
                        }
                    });
                if (token && token.handle) {
                    m = token.handle(memo, item, index, toArray(matched), lineindex);
                }
                return m;
            }, memo);
        }
        line = lines.length - 1 !== index && lines[index];
        return line !== false ? execHandle(result, line, index) : result;
    }
}

function newLine(memo) {
    return memo.concat('\n');
}

function toArray(target) {
    return Array.isArray(target) ? target : (isNil(target) ? [] : (typeof target.length === 'number' ? (target.length === 1 ? [target[0]] : Array.apply(null, target)) : [target]));
}

function reduce(list, fn, memo) {
    var m = memo;
    forEachEnd(list || [], function (item, index, list) {
        var result = fn(m, item, index, list);
        if (!isNil(result)) {
            m = result;
        }
    });
    return m;
}

function find(list, fn) {
    var result = forEachEnd(list, fn);
    return isNil(result) ? result : list[result];
}

function forEachEnd(list, fn) {
    for (var i = 0; i < list.length; i++) {
        if (fn(list[i], i, list)) {
            return i;
        }
    }
}

function isNil(a) {
    return a === null || a === undefined;
}