import React, { useState } from 'react'
import { useDispatch} from 'react-redux'
import { registerUser } from '../../../_actions/user_action';

function RegisterPage() {

  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }
  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }
  
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();
    
    if(Password !== ConfirmPassword){
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다.")
    }

    let body = {
      email: Email,
      name : Name,
      password: Password
    }
    
    dispatch(registerUser(body))
      .then(res => {
        if(res.payload.success){
          alert("회원가입 성공")
          //props.history.push('/')
        }
      })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
    
      <form sytle={{display: 'flex', flexDirection  : 'column'}}
        onSubmit={onSubmitHandler}>

        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler}></input>
        
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler}></input>

        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler}></input>

        <label>Confirm Password</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}></input>
        
        <br/>
        <button>Sign UP</button>
      </form>
    </div>
  )
}

export default RegisterPage
