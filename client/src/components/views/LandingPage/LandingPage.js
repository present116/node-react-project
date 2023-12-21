import React, { useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import Auth from '../../../hoc/auth'

function LandingPage() {
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get('/api/hello')
        .then(response=> console.log(response.data))
    }, [])

    const onClickHandler = () => {
        axios.get(`/api/users/logout`)
            .then(res =>{
                if(res.data.success){
                    alert("로그아웃 성공!")
                    navigate("/login")
                }else{
                    alert("Logout Error!")
                }
            })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>Logout</button>
        </div>
    )
}

export default Auth(LandingPage, false);