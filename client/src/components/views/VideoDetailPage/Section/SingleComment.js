import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd'
import Axios from 'axios'
import { useSelector } from 'react-redux'

function SingleComment(props) {

    const user = useSelector(state => state.user)
    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")
    const onClickOpenReply = () =>{
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (event) =>{
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        //redux hook을 이용해서 userId를 가져온다.
        const variables = {//writer는 현재 로그인해서 글쓰는 유저 postId는 비디오 Id 
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.result)
                    //리플창 초기화하고 닫기.
                    setCommentValue("")
                    setOpenReply(false)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('코멘트를 남기지 못했습니다. 로그인 여부를 확인하세요.')
                }
            })
     }

    const actions= [
        <span onClick={ onClickOpenReply } key="comment-basic-reply-to">Reply to</span>
    ]


    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} />}
                content={props.comment.content}
            />
            { OpenReply &&
            <form style={{ display:'flex'}} onSubmit={ onSubmit }>
                <textarea
                    style={{ width: '100%', borderRadius: '5px'}}
                    onChange={ onHandleChange }
                    value={ CommentValue }
                    placeholder="코멘트를 작성해주세요"
                />
                <br />
                <button style={{ width: '20%', height: '52px'}} onClick={ onSubmit }>Submit</button>
            </form>
            }
            
        </div>
    )
}

export default SingleComment
