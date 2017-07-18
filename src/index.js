module.exports = tokenator;

function tokenator(options) {
    var regexp = options.match || /(\s+|\W|\w+)/igm;
    var target = options.target || '';
    var tokens = options.tokens || [];
    var execHandle = options.execHandle || newLine;
    var executor = options.exec || /(\r|\n)/igm;
    var lines = executor.exec(target);
    var memo = options.memo || '';
    return lines ? reduce(lines, operateOnLine, memo) : operateOnLine(memo, target, 0);

    function operateOnLine(memo, item, index) {
        var im = item.match(regexp);
        var lineindex = index;
        var result = reduce(im, function (memo, item, index) {
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
        var line = lines && lines[index];
        return line ? execHandle(result, line, index) : result;
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