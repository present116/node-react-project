// 백엔드 시작점
const express = require('express')
const app = express();
const port = 8081
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {})
  .then((() => console.log('MongoDB connected...')))
  .catch(err => console.log('MongoDB not connected!'))

// application/x-www-form-urlencoded 데이트럴 분석해서 가져올 수 있다.
app.use(bodyParser.urlencoded({ extended: true }))
// application/json 데이터를 분석해서 가져올 수 있다.
app.use(bodyParser.json())
app.use(cookieParser())


app.get('/', (req, res) => res.send("Hello World!"))

app.post('/api/users/register', async (req, res) => {

  // 회원가입할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body) // body-Parser로 인해 req.body로 가져올 수 있다.//mongoDB 메서드, user모델에 저장

  await user.save()
    .then(() => {
      res.status(200).json({
        success: true
      })
    })
    .catch((err) => {
      res.json({ success: false, err })
    })
})

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 DB에서 있는지 찾는다.
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 이메일이 없습니다."
        })
      }
      // 요청된 이메일이 DB에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

        // 비밀번호까지 맞닫면 토큰을 생성하기.
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err)

          // 토큰을 쿠키, localstorage 등에 저장할 수 있는데, 우리는 쿠키에 저장한다
          res.cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id })
        })
      })
    })
    .catch((err) => {
      return res.status(400).send(err);
    })
})

app.post('/api/users/auth', auth, (req, res)=> {

  // 여기까지 미들웨어가 통과했다는 얘기는 Authentication이 True라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false: true, // Role ==0 -> 일반유저, 이외는 관리자
    isAuth : true,
    email : req.user.email,
    name: req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image: req.user.image

  })
})

app.get('/api/users/logout',auth, (req, res)=> {
  User.findOneAndUpdate({_id: req.user._id}, {token: ""})
    .then(user=>{
      res.status(200).send({
        success: true
      })
    })
    .catch(err=>{
      return res.json({success: false, err})
    })
})

app.get("/api/hello", (req, res) => {
  res.send("hello!!!!!!")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))