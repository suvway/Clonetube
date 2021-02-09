import React,{ useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'
import SideVideo from './Section/SideVideo'
import Subscribe from './Section/Subscribe'

//밖에서 만든 SideVideo, Subscribe Component import


function VideoDetailPage(props) {
    //주소에서 가져온 video._id를 넣어서 useEffect로 video를 가져온다.
    const videoId = props.match.params.videoId //주소에 있는 param을 받아오는 방법
    const variable = { videoId: videoId}

    const [VideoDetail, setVideoDetail] = useState([])//array로 받아야한다. 배열로 온다.

    useEffect(() => {
        
        Axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success){
                setVideoDetail(response.data.videoDetail)
            } else {
                alert('비디오 정보를 가져오는 것을 실패하였습니다.')
            }
        })

    }, [])

    if(VideoDetail.writer){

    return (
        // gutter는 양쪽 여백을 뜻한다. <Row gutter={[horizen,vertical]}
        <Row gutter={[16,16]}>
            {/* col을 이렇게 줌으로써 큰 화면일 때는 6으로 리스트를 뿌려주고 작을 때는 그냥 동영상만 보여준다. 전체 Row는 24 */}
            <Col lg={18} xs={24}>
                
                <div style={{ width:'100%', padding:' 3rem 4rem'}}>
                {/* Video player */}
                    <video style={{ width:'100%',height:'32rem'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
                    {/* subscriber 버튼이 들어가야하는데, 기능이 많아서 페이지가 길어짐으로 SideVideo처럼 component를 만들어서 import해서 쓴다.  */}
                    {/* actions를 받을 때 배열로 받기 때문에 subscribe component를 배열로 감싸서 받아야 보인다. */}
                    {/* props 방식으로 userTo를 넘겨준다. */}
                    <List.Item  
                        actions={[<Subscribe userTo={VideoDetail.writer._id} />]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={VideoDetail.writer.image} />}
                            title={VideoDetail.writer.name}
                            description={VideoDetail.description}
                            />
                            {/* avatar는 icon을 표현해주는 부분. */}
                    </List.Item>

                    {/* comment */}

                </div>

            </Col>
            <Col lg={6} xs={24}>
                {/* Component를 따로 만든다. section/sideVideo */}
                <SideVideo />
            </Col>


        </Row>
    ) 
    } else {
        return (
        <div>Loading</div>
        )
    }
}

export default VideoDetailPage  