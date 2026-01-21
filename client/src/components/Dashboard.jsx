import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Dashboard.css'

function Dashboard({ setIsAuthenticated }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    // 获取用户信息
    axios.get('/api/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data.valid) {
          setUser(res.data.user)
        } else {
          handleLogout()
        }
      })
      .catch(() => {
        handleLogout()
      })
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="welcome-section">
          <h1>欢迎, {user.username}!</h1>
          <p className="user-email">{user.email}</p>
        </div>
        
        <div className="info-section">
          <div className="info-item">
            <span className="info-label">用户ID:</span>
            <span className="info-value">{user.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">用户名:</span>
            <span className="info-value">{user.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">邮箱:</span>
            <span className="info-value">{user.email}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          退出登录
        </button>
      </div>
    </div>
  )
}

export default Dashboard
