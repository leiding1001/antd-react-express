/**
 * 模块中间件 - truck and track 入口
 */
import Express from 'express';

const router = Express.Router();
/**
 * 功能中间件 - User
 */
router.use('/user', require('./user'));

module.exports = router;