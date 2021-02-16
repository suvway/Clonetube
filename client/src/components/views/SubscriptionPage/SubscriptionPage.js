import React,{ useEffect, useState } from 'react'
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd'
import Axios from 'axios'
import moment from 'moment'
const { Title } = Typography
const { Meta } = Card

function SubscriptionPage() {
    const [Video, setVideo] = useState([])//배열로 넘어오는 video들을 배열에 넣어줌

    //useEffect -> dom이 업데이트 될 때 실행되는 것
    useEffect(() => {
        //로그인 한 대상의 아이디를 가지고 동영상을 검색해서 구독한 채널의 동영상을 보여준다.
        const subscriptionVariable = {
            userFrom: localStorage.getItem('userId')
        }
        //변수를 보내기 때문에 post방식으로 보내야한다.
        Axios.post('/api/video/getSubscriptionVideos', subscriptionVariable)
        .then(response => {
            if(response.data.success){
                console.log(response)
                setVideo(response.data.videos)
            } else {
                alert('비디오 로드에 실패했습니다.')
            }
        })


    }, [])//[]인풋부분이  비어있으면 한번만 실행 인풋 부분이 괄호도 없으면 계속 실행된다.

    const renderCards = Video.map((video,index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={8} xs={24} key={index}>
                    {/* 주소를 이렇게 적는 이유는 App.js에 router에 등록한 주소를 불러오는 거임. 밑에 thumnail은 서버 루트폴더에서 이미지 불러오기 때문에 주소가 저런것이다. */}
                    <a href={`/video/${video._id}`}>
                        <div style={{ position: 'relative' }}>
                            <img style={{ width: '100%' }} src={ `http://localhost:5000/${video.thumbnail}` } alt="thumbnail" />
                            <div className="duration">
                                <span>{minutes} : {seconds}</span>
                            </div>
                        </div>
                    </a>
                    <br />
                    <Meta 
                       avatar={
                           <Avatar src={video.writer.image} />
                       }
                       title={video.title}
                        description=""
                    />
                    <span>{video.writer.name} </span><br />
                    <span style={{ marginLeft: '3rem' }}>{video.views} views</span> - <span>{moment(video.createdAt).format('MMM Do YY')}</span>
                    {/* createdAt은 video 모델 만들 때 체크한 timestamp moment함수로 포멧가공해서 보여준다. */}
                </Col>

    })


    return (
       <div style={{ width: '85%', margin: '3rem auto'}}>
           <Title level={2}> Recommended </Title>
           <hr />
           <Row gutter={[32, 16]}>
                {/* 반응형 웹임 24가 max사이즈 col의 사이즈를 지정하는건데 창의 크키가 최대일때는 col하나가 6 즉 24/6=4개의 col이 보이고 */}
                {/* 중간사이즈 일때는 24/8=3 3개가 보이고 제일 작을 때는 하나만 보이게 된다. */}
                
                {renderCards}
                


           </Row>
       </div>
    )
}

export default SubscriptionPage
