declare type GetMethod = 'GET';
declare type PostMethod = 'POST';
declare type PutMethod = 'PUT';
declare type DeleteMethod = 'DELETE';
declare type RequestMethod = GetMethod | PostMethod | PutMethod | DeleteMethod;

declare interface IRouteProps {
  fn: Function;
  matcher: (url: string) => Object | null;
  method: RequestMethod;
}
declare interface IRoutesProps {
  GET?: IRouteProps[];
  POST?: IRouteProps[];
  PUT?: IRouteProps[];
  DELETE?: IRouteProps[];
}

declare type callback = (target: Object, routes: IRoutesProps) => void;

declare type ControllerFactory = (target: Object) => callback;

export function Controller(constructor: Object): ControllerFactory;

declare type RouteFactory = (
  path: string,
  method: RequestMethod
) => MethodDecorator;

export function Get(path: string): RouteFactory;
export function Post(path: string): RouteFactory;
export function Put(path: string): RouteFactory;
export function Delete(path: string): RouteFactory;

export function RootUrl(rootPath: string): MethodDecorator;
