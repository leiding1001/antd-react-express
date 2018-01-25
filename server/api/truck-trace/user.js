import Express from 'express';
const router = Express.Router();
import {
  responseClient
} from '../../util';

//用户验证
router.get('/userInfo', function (req, res) {
  if (req.session.userInfo) {
    responseClient(res, 200, 0, '', req.session.userInfo);
  } else {
    responseClient(res, 200, 1, '请重新登录', req.session.userInfo);
  }
});

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;