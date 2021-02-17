import React, { useEffect, useState } from 'react'
import { Tooltip,Icon } from 'antd'
import Axios from 'axios'
import { set } from 'mongoose'

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislike, setDislike] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variable = {}
    
    if(props.video){
        variable = { videoId: props.videoId , userId: props.userId }
    } else {
        variable = { commentId: props.commentId, userId: props.userId }
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                if(response.data.success){
                    //좋아요 숫자정보
                    setLikes(response.data.likes.length)
                    //로그인한 유저가 이미 좋아요를 눌렀는지 정보
                    response.data.likes.map(like => {
                        if(like.userId === props.userId){
                            setLikeAction('liked')
                        }
                    })
                } else {
                    alert('좋아요 정보를 가져오지 못했습니다.')
                }
            })

            Axios.post('/api/like/getDislikes', variable)
            .then(response => {
                if(response.data.success){
                    //싫어요 숫자정보
                    setDislike(response.data.likes.length)
                    //로그인한 유저가 이미 싫어요를 눌렀는지 정보
                    response.data.likes.map(like => {
                        if(like.userId === props.userId){
                            setDislikeAction('disliked')
                        }
                    })
                } else {
                    alert('싫어요 정보를 가져오지 못했습니다.')
                }
            })

    }, [])

    const onLike = () => {
        
        if(LikeAction === null) {
            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if(response.data.success){
                        setLikes(Likes + 1)
                        setLikeAction('liked')
                        if(DislikeAction !== null){
                            setDislike(Dislike -1)
                            setDislikeAction(null)
                        }
                    } else {
                        alert('좋아요 누르기를 실패했습니다.')
                    }
                })
        } else {
            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if(response.data.success){
                        setLikes(Likes -1)
                        setLikeAction(null)

                    } else {
                        alert('좋아요 다시 누르기를 실패했습니다')
                    }
                })
        }

    }

    
    const onDislike = () => {
        //다시 눌러주는 경우
        if(DislikeAction !== null ){
            Axios.post('/api/like/unDislike', variable)
                .then(response => {
                    if(response.data.success){
                        setDislike(Dislike -1)
                        setDislikeAction(null)
                    } else {
                        alert('싫어요를 다시 누르지 못했습니다.')
                    }
                })

        } else {
            //첫번쨰로 누르는 경우
            Axios.post('/api/like/upDislike', variable)
                .then(response => {
                    if(response.data.success){
                        setDislike(Dislike + 1)
                        setDislikeAction('disliked')
                        if(LikeAction !== null){
                            setLikes(Likes -1)
                            setLikeAction(null)
                        }
                    } else {
                        alert('싫어요를 누르기를  실패했습니다.')
                    }
                })
        }
    }



    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked'? 'filled':'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
            <span style={{ paddingLeft:'8px', cursor:'auto'}}> {Likes} </span>
            </span>

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DislikeAction === 'disliked'? 'filled':'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
            <span style={{ paddingLeft:'8px', cursor:'auto' }}> {Dislike} </span>
            </span>
        </div>
    )
}

export default LikeDislikes
