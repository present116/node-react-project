const { User } = require('../models/User')

let auth = (req, res, next) => {
    // 인증처리 하는 곳

    // 클라이언트에서 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth

    // 토큰을 복호화한 후 유저를 찾는다.
    User.findByToken(token, function (err, user) {
        if (err) throw err;

        if (!user) {
            return res.json({ isAuth: false, error: true })
        }

        req.token = token
        req.user = user
        next()
    })

}

module.exports = { auth }