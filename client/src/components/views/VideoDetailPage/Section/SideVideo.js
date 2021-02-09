import Axios from 'axios'
import React,{ useEffect, useState} from 'react'

function SideVideo() {

    const [sideVideos, setsideVideos] = useState([])

    useEffect(() => {
        
        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success){
                console.log(response)
                setsideVideos(response.data.videos)
            } else {
                alert('비디오 로드에 실패했습니다.')
            }
        })

    }, [])
    //들어있는 동영상 개수 만큼 map을 만들어서 그 컴포넌트를 여러번 불러올 것이다.
    const renderSideVideo = sideVideos.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));
        //key를 index로 주지 않으면 component에 구별이 없어서 오류난다.
        return <div key={index} style={{  display:'flex', marginBottom:'1rem', padding:'0 2rem'}}>
            <div style={{ width:'40%', marginRight:'1rem'}}>
                <a href={`/video/${video._id}`}>
                    <img style={{ width:'100%' , height:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt={'thumbnail'} />
                </a>
            </div>

            <div style={{ width:'50%'}}>
                <a href={`/video/${video._id}`} style={{ color:'gray' }}>
                    <span style={{ fontSize:'1rem', color:'black'}}> {video.title}</span><br />
                    <span>{video.writer.name}</span><br />
                    <span>{video.views} views </span><br />
                    <span>{minutes} : {seconds} </span>
                </a>
            </div>
        </div>

    })


    return (
        //하나의 카드 템플릿 이것을 map안의 갯수만큼 랜더링한다.
        <React.Fragment>
            <div style={{marginTop:'3rem'}}>
            {renderSideVideo}
            </div>
        </React.Fragment>


        
    )
}

export default SideVideo
