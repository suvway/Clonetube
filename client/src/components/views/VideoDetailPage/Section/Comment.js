import Axios from 'axios'
import React,{ useState } from 'react'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'

function Comment(props) {

    //videoId는 주소에 있는 파라미터를 가져온다. video페이지를 만들 때 경로에 parameter로 videoId를 줘서 가능하다.
    //const videoId = props.match.params.videoId <-에러난다.
    //이 방법이 아니면 props를 이용해서 <comment videoId={videoId}> 이런식으로 넘겨서 받는 방법도 있다.
    const videoId = props.videoId
    //redux의 state store에 저장되어 있는 user state의 정보를 가져온다.
    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("")

    const handleClick = (event) => {

        setCommentValue(event.currentTarget.value)
    }
    const onSubmit = (event) => {
        event.preventDefault();
        //redux hook을 이용해서 userId를 가져온다.
        const variables = {//writer는 현재 로그인해서 글쓰는 유저 postId는 비디오 Id 
            content: CommentValue,
            writer: user.userData._id,
            postId: videoId
        }
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.result)
                    setCommentValue("")
                    //update function에 저장결과 전송
                    props.refreshFunction(response.data.result)
                } else {
                    alert('코멘트를 남기지 못했습니다. 로그인 여부를 확인하세요.')
                }
            })

    }

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />
            
            {/* Comment List */}


            {/* 리액트는 html이 아니라 jsx를 사용하는데 div나 react.Fragment로 감싸줘야한다.*/}
            {props.commentLists && props.commentLists.map((comment, index) =>(
                (!comment.responseTo &&
                    <React.Fragment key={index+"f"}>
                        <SingleComment refreshFunction={props.refreshFunction} key={index} comment={comment} postId={ videoId } />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={ videoId } commentLists={props.commentLists} key={index+"i"} />
                    </React.Fragment>    
                )
                
            ))}
           
           
           
            {/* Root Comment Form */}



            <form style={{ display:'flex'}} onSubmit={ onSubmit }>
                <textarea
                    style={{ width: '100%', borderRadius: '5px'}}
                    onChange={ handleClick }
                    value={ CommentValue }
                    placeholder="코멘트를 작성해주세요"
                />
                <br />
                <button style={{ width: '20%', height: '52px'}} onClick={ onSubmit }>Submit</button>
            </form>
        </div>
    )
}

export default Comment
