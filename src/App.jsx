import {Routes, Route, useParams, useLocation, Navigate, useNavigate} from 'react-router-dom';
import { Card } from 'antd'
import { useEffect, useState } from 'react';
import './App.css';
import { PageLayout } from './compontents/Layout/Layout';


function App() {

  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    getPosts()
    getUsers()
  }, [])

  const getPosts = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json())
    .then(res => setPosts(res))
  }

  const getUsers = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
    .then(res1 => res1.json())
    .then(res1 => setUsers(res1))
  }

  const user = {
    name: 'Ivan',
    age: '28',
    role: 'admin'
  }
  const isAdmin = (element) => ( user.role == 'admin' ? element : <Navigate to='/error/' />)
  
  return (
      <Routes>
        <Route path='/*' element={isAdmin(<PageLayout />)}>
          <Route index element={<HomeComponent posts={posts} users={users}/>} />
          <Route path='info' element={<InfoPage />} />
          <Route path='user' element={<>user</>} />
          <Route path='post/:postId/' element={<PostInfo posts={posts} users={users}/>} />
          <Route path='*' />
        </Route>

        <Route path='/auth/'>
          <Route index element={<HomeComponent posts={posts} users={users}/>} />
          <Route path='login' element={<InfoPage />} />
          <Route path='resetpassword' element={<>user</>} />
        </Route>

        <Route path='/error/' element={<PageLayout />}>
          <Route index element={<>У вас нет роли администратора</>} />
          <Route path='login' element={<InfoPage />} />
          <Route path='resetpassword' element={<>user</>} />
        </Route>
      </Routes>
  );
}

export default App;

const HomeComponent = ({posts, users}) => {

  const params = useParams()
  const location = useLocation()
  console.log("🚀 ~ HomeComponent ~ location:", location)

  console.log("🚀 ~ HomeComponent ~ params:", params)
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '64em',
      margin: '0 auto',
      marginTop: '20px',
    }}>
      {posts.map((post) => <PostComponent postData={post} userData={users} />)}
    </div>
  )
}

const PostComponent = ({ postData, userData }) => {
  const navigate = useNavigate()
  var user = userData.find((item) => item.id == postData.userId)
  var link = `/post/${postData.id}`
  return (
    <div>
      <Card 
        hoverable
        style={{
          border: '1px solid #333',
          padding: '12px',
          borderRadius: '8px',
        }}
        title={`${user.username} - ${postData.title}`}
        onClick={() => navigate(link)}
      > {postData.body} </Card>
    </div>
  )
}

const CommComponent = ({ commData }) => {
  return (
    <div>
      <Card 
        hoverable
        title={commData.name}
        extra={`email: ${commData.email}`}
      > {commData.body} </Card>
    </div>
  )
}

const InfoPage = () => {
  const location = useLocation()
  console.log("🚀 ~ InfoPage ~ location:", location)
  return (
    <>
      info:
    </>
  )
}

const PostInfo = ({posts, users}) => {
  const params1 = useParams()
  let post = posts.find((item) => item.id == params1.postId)
  let user = users.find((item) => item.id == post.userId)

  const [comm, setComm] = useState([])

  useEffect(() => {
    getComm()
  }, [])

  const getComm = () => {
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${params1.postId}`)
    .then(res3 => res3.json())
    .then(res3 => setComm(res3))
  }

  console.log("🚀 ~ PostInfoPage ~ params:", params1)
  return (
    <div>
      <p style={{
        width: '64em',
        margin: '0 auto',
        marginTop: '20px',
        }}>
      </p>
      <Card 
        style={{
          border: '1px solid #333',
          padding: '12px',
          borderRadius: '8px',
          width: '64em',
          margin: '0 auto',
          marginTop: '5px',
        }}
        title={`${user.username}: ${post.title}`}
      > {post.body} </Card>
      <p style={{
        width: '64em',
        margin: '0 auto',
        marginTop: '20px',
        }}>
        <h2>Информация об авторе:</h2>
        <h4>Имя: {user.name}</h4>
        <h4>Никнейм: {user.username}</h4>
        <h4>E-mail: {user.email}</h4>
        <h4>Адрес и Zip-код: {user.address.city} - {user.address.street} - {user.address.suite}; {user.address.zipcode}</h4>
        <h4>Геолокация: {user.address.geo.lat}, {user.address.geo.lng}</h4>
        <h4>Номер телефона: {user.phone}</h4>
        <h4>Веб-сайт: {user.website}</h4>
        <h4>Информация о компании: {user.company.name}; "{user.company.catchPhrase}"; {user.company.bs}</h4>
        <h2>Комментарии:</h2>
      </p>
      <p style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '64em',
        margin: '0 auto',
        marginTop: '20px',
      }}>
      {comm.map((comm) => <CommComponent commData={comm} />)}
      </p>
    </div>
    )
}