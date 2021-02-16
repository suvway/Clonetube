import React,{ useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    
    //useEffect의 아래 []을 비워두면 dom이 load될 때 한번만 실행되는데 대댓글이 달릴 때 commentNumber가 달라져야 하기때문에 실행이 되어야한다.
    //그러므로 []에 props.commentLists라는 조건을 줘서 저것이 달라질 때마다 useEffect가 실행되는 조건을 줘야한다.
    useEffect(() => {
        
        let commentNumber = 0;

        props.commentLists.map((comment) =>{
            if(comment.responseTo === props.parentCommentId){
                commentNumber ++
            }
        })

        setChildCommentNumber(commentNumber)
    }, [props.commentLists])

    //모든 댓글 리스트인 videoDetailPage의 comments state를 comment를 통해 받아와서 map으로 돌리고 조건을 줘서 원댓글에 맞는 대댓글을 랜더링해준다.
    const renderReplyComment = (parentCommentId) => 
        props.commentLists.map((comment, index) => (
            <React.Fragment>
                {
                    comment.responseTo === parentCommentId &&
                    <div style={{ width:'80%', marginLeft:'40px'}}>
                        <SingleComment refreshFunction={props.refreshFunction} key={index} comment={comment} postId={ props.videoId } />
                        <ReplyComment refreshFunction={props.refreshFunction} commentLists={props.commentLists} postId={props.videoId} parentCommentId={comment._id} key={index+"i"} />
                    </div>
                }
            </React.Fragment>
        ))
    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }
    
    return (


        <div>
            {ChildCommentNumber > 0 &&
                <p style={{ fontSize:'14px', margin:'0', color:'gray'}} onClick={onHandleChange}>
                View {ChildCommentNumber} more comment(s)
                </p>
            }
            

            {/* 부모에서 replyComment를 생성할 때 comment를 받아온 것에서 원 댓글의 id를 받아서 넘긴다. */}
            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }

        </div>
    )
}

export default ReplyComment
