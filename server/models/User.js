const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10 // 10자리 salt를 이용해서 비밀번호를 암호화 한다
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    }, 
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image : String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')){
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) next(err);
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword,  cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this
    //jsonwebtoken을 이용해서 토큰을 생성하기.
    // user._id + secretToken = token 
    // token <- secretToken = user._id
    var token = jwt.sign(user._id.toJSON(), 'secretToken') 
    user.token = token
    user.save()
        .then(()=>{
            cb(null, user)
        })
        .catch((err)=> {
            return cb(err)
        })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;
    // 토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은다음에 
        // 클라이언트에서 가져온 토큰과 DB에서 가져온 토큰이 일치하는지 확인한다.
        user.findOne({"_id": decoded, "token" : token})
            .then(user => {
                cb(null, user)
            }) 
            .catch((err)=> {
                return cb(err)
            })
             
    })
    
}

const User = mongoose.model('User', userSchema)
module.exports = { User }