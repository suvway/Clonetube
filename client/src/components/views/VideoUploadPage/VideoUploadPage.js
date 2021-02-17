import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon} from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';


const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
]

const CategoryOptions = [
    { value: 0, label: "Film & Animation"},
    { value: 1, label: "Autos & Vehicles "},
    { value: 2, label: "Music"},
    { value: 3, label: "Pets & Animals"}
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user);//redux에 State store에서 user state에서 정보를 가져오는 것이다. useSelector를 통해 정보를 가져올 수 있음
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTiltleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }
    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])
        //axios를 통해서 file을 보낼 때 header에 type 을 지정해줘야지 오류가 안난다. 
        //console.log(files) files 파라미터에는 올리는 파일 정보가 담겨있다 files[0] 즉 어레이로 받는 이유는 파일이 여러개 일 경우를 처리하기위해 배열에 담김
        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success) {
                    console.log(response)

                    //비디오 업로드 후 axios를 한번 더 날린다.
                    let variable = {
                        url:response.data.url,
                        fileName: response.data.fileName
                    }

                    setFilePath(response.data.url)

                    Axios.post('/api/video/thumbnail', variable)
                    .then(response =>{
                        if(response.data.success){
                            console.log(response)
                            
                            setThumbnailPath(response.data.url)
                            setDuration(response.data.fileDuration)

                        } else {
                            alert('썸네일 생성에 실패했습니다.')
                        }
                    })

                } else {
                    alert('비디오 업로드에 실패했습니다.')
                }
            })
    }
    const onSubmit = (e) =>{
        e.preventDefault();

        const variables = {
            writer: user.userData._id,//redux state stroe에 있는 user state에서 _id를 가져온다. useSelector로
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }

        Axios.post('/api/video/uploadVideo', variables)
        .then(response => {
            if(response.data.success){
                
                message.success('성공적으로 업로드 했습니다.')//성공시 message 출력
                
                setTimeout(() => {//타임아웃 3초 주는 기능
                    props.history.push('/')//props 기능을 이용해서 메인으로 push
                }, 3000);
            } else {
                alert('비디오 업로드에 실패했습니다.')
            }
        })
    }

    


    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{ textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <form onSubmit={ onSubmit }>
                <div style={{ display:'flex', justifyContent:'space-between'}}>
                    {/* Drop zone */}
                    
                    <Dropzone
                    onDrop={ onDrop }//drop시 function
                    multiple={false}//한번에 여러개 보낼지 maxsize=file maxsize
                    maxSize={100000000}>
                    {({ getRootProps, getInputProps }) => (
                        <div style={{ width: '300px', height: '240px', border:'1px solid lightgray', display:'flex',
                        alignItems:'center', justifyContent:'center'}} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize:'3rem'}} />
                        </div>
                    )}
                    </Dropzone>
                    {/* Thumnail */}
                        
                    {ThumbnailPath && 
                    <div>
                    <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                    </div>
                    }
                </div>
            <br />
            <br />
            <label>Title</label>
            <Input
                onChange={ onTiltleChange }
                value={ VideoTitle }
            />
            <br />
            <br />
            <label>Description</label>
            <TextArea
                onChange={ onDescriptionChange }
                value={ Description }
            />
            <br />
            <br />
            <select onChange={ onPrivateChange }>  {/* 상수를 위에 선언하고, map옵션을 이용해서 값을 뿌려준다. */}
                {PrivateOptions.map((item, index) =>(
                    <option key={index} value={item.value}>{item.label}</option>
                ))} 
            </select>
                
            <br />
            <br />
            <select onChange={ onCategoryChange }>
                {CategoryOptions.map((item, index) =>(
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>

            <br />
            <br />
            <Button type="primary" size="large" onClick={ onSubmit }>
                Submit
            </Button>

            </form>

        </div>
    )
}

export default VideoUploadPage
