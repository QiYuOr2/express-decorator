import { parse } from 'url';

// 请求方法
const GetMethod = 'GET';
const PostMethod = 'POST';
const PutMethod = 'PUT';
const DeleteMethod = 'DELETE';

/**
 * 创建请求回调
 * @param {Object} target 目标类
 * @param {Object} routes 路由对象
 */
function callback(target, routes) {
  return (req, res, next) => {
    const method = req.method || 'GET';
    const path = req.path || parse(req.url).pathname;
    if (routes[method]) {
      for (const { matcher, middleware, fn } of routes[method]) {
        const params = matcher(path);
        if (params) {
          req.params = params;
          let idx = 0;
          next = () => {
            if (idx === middleware.length) {
              Reflect.apply(fn, target, [req, res]);
            } else {
              middleware[idx++](req, res, next);
            }
          };
          next();
          return;
        }
      }
    }
    if (typeof next === 'function') {
      next();
    }
  };
}

/**
 * 创建控制器
 * @param {Object} target 目标类
 */
function ControllerFactory(target) {
  return () => {
    const t = new target();
    const routes = {};
    for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
      routes[method] = [];
    }
    for (const route of t._routes) {
      let method = [route.method];

      for (let key of method) {
        key = key.toUpperCase();
        if (!routes[key]) {
          throw new Error(`${key} method is not allowed`);
        }
        routes[key].push(route);
      }
    }
    return callback(target, routes);
  };
}

/**
 * 设置控制器
 * @param {Object} constructor 类构造函数
 */
export function Controller(constructor) {
  return ControllerFactory(constructor);
}

/**
 * 创建请求函数
 * @param {String} path 请求URL
 * @param {String} method 请求方法
 */
function RouteFactory(path, method, ...middleware) {
  return (target, key, descriptor) => {
    const rootUrl = target.constructor.$rootUrl || ''; // 获取根路由
    let matcher; // 匹配URL函数
    const subPath = []; // 存储各集路由
    const params = []; // params参数

    // 解析url
    path = rootUrl + path;
    for (let sub of path.split('/')) {
      if (sub[0] === ':') {
        params.push(sub.slice(1));
        sub = '([^/]*)';
      }
      subPath.push(sub);
    }

    // 解析params
    if (params.length) {
      // 创建含params的正则规则
      const re = new RegExp(`^${subPath.join('/')}$`);
      matcher = (url) => {
        const matches = re.exec(url);
        if (matches) {
          const final_params = {};
          for (let i = 0, len = params.length; i < len; ++i) {
            final_params[params[i]] = matches[i + 1];
          }
          return final_params;
        }
        return null;
      };
    } else {
      matcher = (url) => (url === path ? {} : null);
    }

    // 挂载route
    target._routes = target._routes || [];
    target._routes.push({
      fn: descriptor.value,
      matcher,
      method,
      middleware,
    });
  };
}

/**
 * GET请求
 * @param {String} path URL
 */
export function Get(path) {
  return RouteFactory(path, GetMethod);
}

/**
 * POST请求
 * @param {String} path URL
 */
export function Post(path) {
  return RouteFactory(path, PostMethod);
}

/**
 * PUT请求
 * @param {String} path URL
 */
export function Put(path) {
  return RouteFactory(path, PutMethod);
}

/**
 * DELETE请求
 * @param {String} path URL
 */
export function Delete(path) {
  return RouteFactory(path, DeleteMethod);
}

/**
 * 设置跟路由
 * @param {String} rootPath 跟路由
 */
export function RootUrl(rootPath) {
  return (target, key, descriptor) => {
    target.constructor.$rootUrl = rootPath;
  };
}
