import React, { useEffect } from 'react';
import axios from 'axios'

function LandingPage() {

    useEffect(()=>{
        axios.get('/api/hello')
        .then(response=> console.log(response.data))
    }, [])

    const onClickHandler = () => {
        axios.get(`/api/users/logout`)
            .then(res =>{
                if(res.data.success){
                    alert("로그아웃 성공!")
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

export default LandingPage;