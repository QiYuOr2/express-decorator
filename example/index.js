import express from 'express';
import { Controller, Get, Post, RootUrl } from '../lib';

const Server = express();

@Controller
class User {
  @RootUrl('/user') url() {}

  @Get('/')
  home(req, res) {
    res.json({
      title: 'hello User',
    });
  }
}

@Controller
class Room {
  @RootUrl('/room') url() {}

  @Get('/')
  home(req, res) {
    res.json({
      title: 'hello room',
    });
  }
}

Server.use(new User());
Server.use(new Room());

Server.listen(3000, () => {
  console.info('running in http://localhost:3000');
});
