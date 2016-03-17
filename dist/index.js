'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    let root = arguments.length <= 0 || arguments[0] === undefined ? '.' : arguments[0];
    let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    root = (0, _path.normalize)((0, _path.resolve)(root));
    options.routes = clone(options.routes || []);

    options = Object.assign({
        routes: null,
        index: '/index'
    }, options);

    for (let route of options.routes) {
        route.url = (0, _pathToRegexp2.default)(route.url);
    }

    _mkdirp2.default.sync(root);

    return function* (next) {
        if (this.path === '/mock') {
            this.body = yield _coFs2.default.readFile((0, _path.join)(__dirname, 'mock.html'));
            return;
        }

        if (this.path === '/mock-data') {
            return;
        }

        yield next;

        for (let route of options.routes) {
            let matched;

            if (this.path === '/') {
                break;
            }

            if (!(matched = route.url.exec(this.path))) {
                continue;
            }

            this.path = route.controller;
        }

        let path = (0, _path.join)(root, (this.path === '/' ? options.index : this.path) + '.js');

        try {
            if ((yield _coFs2.default.stat(path)).isFile()) {
                this.body = yield _interopRequireDefault(require(path)).default;
            }
        } catch (err) {
            if (~['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].indexOf(err.code)) {
                return;
            }
        }
    };
};

var _coFs = require('co-fs');

var _coFs2 = _interopRequireDefault2(_coFs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault2(_mkdirp);

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault2(_pathToRegexp);

var _path = require('path');

function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}