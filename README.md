# @tuzilow/express-decorator

some simple ES7 decorators for express

## Get Started

Install using yarn

```bash
yarn add @tuzilow/express-decorator
```

Or using npm

```bash
npm install @tuzilow/express-decorator
```

Example usage

```js
import express from 'express';
import { Controller, Get, RootUrl } from '@tuzilow/express-decorator';

const Server = express();

@Controller
class App {
  @RootUrl('/user') url() {}

  @Get('/')
  home(req, res) {
    res.json({
      title: 'hello world',
    });
  }

  @Get('/getOne')
  getOne(req, res) {
    const { id } = req.query;
    res.json({
      title: 'hello world',
      id,
    });
  }

  @Get('/list/:id')
  list(req, res) {
    const { id } = req.params;
    res.json({
      title: 'hello world',
      id,
    });
  }
}

Server.use(new App());

Server.listen(3000, () => {
  console.info('running in http://localhost:3000');
});
```

## API

| Decorator              | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| @Controller            | Class that is marked with this decorator is created a router |
| @RootUrl(path: string) | Set root path                                                |
| @Get(path: string)     | http get method                                              |
| @Post(path: string)    | http post method                                             |
| @Put(path: string)     | http put method                                              |
| @Delete(path: string)  | http delete method                                           |
