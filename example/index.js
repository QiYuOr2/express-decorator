import express from 'express';
import { Controller, Get, Post, RootUrl } from '../lib';

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

  @Post('/create')
  create(req, res) {
    res.json({
      code: 0,
      message: 'post',
    });
  }
}

Server.use(new App());

Server.listen(3000, () => {
  console.info('running in http://localhost:3000');
});
