"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Controller = Controller;
exports.Get = Get;
exports.Post = Post;
exports.Put = Put;
exports.Delete = Delete;
exports.RootUrl = RootUrl;

var _url = require("url");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// 请求方法
var GetMethod = 'GET';
var PostMethod = 'POST';
var PutMethod = 'PUT';
var DeleteMethod = 'DELETE';
/**
 * 创建请求回调
 * @param {Object} target 目标类
 * @param {Object} routes 路由对象
 */

function callback(target, routes) {
  return function (req, res) {
    var method = req.method || 'GET';
    var path = req.path || (0, _url.parse)(req.url).pathname;

    if (routes[method]) {
      var _iterator = _createForOfIteratorHelper(routes[method]),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _step.value,
              matcher = _step$value.matcher,
              fn = _step$value.fn;
          var params = matcher(path);

          if (params) {
            req.params = params;
            Reflect.apply(fn, target, [req, res]);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  };
}
/**
 * 创建控制器
 * @param {Object} target 目标类
 */


function ControllerFactory(target) {
  return function () {
    var t = new target();
    var routes = {};

    for (var _i = 0, _arr = ['GET', 'POST', 'PUT', 'DELETE']; _i < _arr.length; _i++) {
      var method = _arr[_i];
      routes[method] = [];
    }

    var _iterator2 = _createForOfIteratorHelper(t._routes),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var route = _step2.value;
        var _method = [route.method];

        for (var _i2 = 0, _method2 = _method; _i2 < _method2.length; _i2++) {
          var key = _method2[_i2];
          key = key.toUpperCase();

          if (!routes[key]) {
            throw new Error("".concat(key, " method is not allowed"));
          }

          routes[key].push(route);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return callback(target, routes);
  };
}
/**
 * 设置控制器
 * @param {Object} constructor 类构造函数
 */


function Controller(constructor) {
  return ControllerFactory(constructor);
}
/**
 * 创建请求函数
 * @param {String} path 请求URL
 * @param {String} method 请求方法
 */


function RouteFactory(path, method) {
  return function (target, key, descriptor) {
    var rootUrl = target.constructor.$rootUrl || ''; // 获取根路由

    var matcher; // 匹配URL函数

    var subPath = []; // 存储各集路由

    var params = []; // params参数
    // 解析url

    path = rootUrl + path;

    var _iterator3 = _createForOfIteratorHelper(path.split('/')),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var sub = _step3.value;

        if (sub[0] === ':') {
          params.push(sub.slice(1));
          sub = '([^/]*)';
        }

        subPath.push(sub);
      } // 解析params

    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    if (params.length) {
      // 创建含params的正则规则
      var re = new RegExp("^".concat(subPath.join('/'), "$"));

      matcher = function matcher(url) {
        var matches = re.exec(url);

        if (matches) {
          var final_params = {};

          for (var i = 0, len = params.length; i < len; ++i) {
            final_params[params[i]] = matches[i + 1];
          }

          return final_params;
        }

        return null;
      };
    } else {
      matcher = function matcher(url) {
        return url === path ? {} : null;
      };
    } // 挂载route


    target._routes = target._routes || [];

    target._routes.push({
      fn: descriptor.value,
      matcher: matcher,
      method: method
    });
  };
}
/**
 * GET请求
 * @param {String} path URL
 */


function Get(path) {
  return RouteFactory(path, GetMethod);
}
/**
 * POST请求
 * @param {String} path URL
 */


function Post(path) {
  return RouteFactory(path, PostMethod);
}
/**
 * PUT请求
 * @param {String} path URL
 */


function Put(path) {
  return RouteFactory(path, PutMethod);
}
/**
 * DELETE请求
 * @param {String} path URL
 */


function Delete(path) {
  return RouteFactory(path, DeleteMethod);
}
/**
 * 设置跟路由
 * @param {String} rootPath 跟路由
 */


function RootUrl(rootPath) {
  return function (target, key, descriptor) {
    target.constructor.$rootUrl = rootPath;
  };
}