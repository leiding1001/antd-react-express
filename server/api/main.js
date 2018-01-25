/**
 * 中间件 - API主入口 
 */
import Express from 'express';

import {
  responseClient
} from '../util'

const router = Express.Router();
/**
 * 模块中间件 - truck and trace 入口
 */
router.use('/truck-trace', require('./truck-trace'));

module.exports = router;