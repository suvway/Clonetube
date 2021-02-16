import Axios from 'axios'
import React,{ useEffect,useState } from 'react'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        
        let variable = { userTo: props.userTo }
        
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then( response => {
                if(response.data.success){
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })
            //userTo는 동영상 올린사람 userFrom 은 로그인 한사람 
            //로그인 할 때 localStorage에 로그인한 사람의 Id를 저장하기 떄문에 가져와서 쓸 수 있다.

            let subscribedVriable = { userTo: props.userTo, userFrom : localStorage.getItem('userId') }
        Axios.post('/api/subscribe/subscribed',subscribedVriable )
            .then( response => {
                if(response.data.success){
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('정보를 받아오지 못했습니다.')
                }
            })
    }, [])

    const onSubscribe = () => {

        let subscribedVriable = {
            userTo: props.userTo,
            userFrom: props.userFrom,

        }

        //이미 구독중이라면
        if(Subscribed){
            Axios.post('/api/subscribe/unSubscribe', subscribedVriable)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber -1)
                    setSubscribed(!Subscribed)
                } else {
                    alert('구독 취소하는데 실패했습니다.')
                }
            })
        //구독중이 아니라면
        } else {
            Axios.post('/api/subscribe/Subscribe', subscribedVriable)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber +1)
                    setSubscribed(!Subscribed)
                } else {
                    alert('구독하는데 실패했습니다.')
                }

            })
        }
    }

    return (
        <div>
            <button 
                style={{ backgroundColor: `${Subscribed ? '#AAAAAA': '#CC0000'}`,borderRadius: '4px',
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize:'1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
