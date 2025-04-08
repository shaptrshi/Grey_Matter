import React from 'react'

const AdminRoute = ({children}) => {
  const token = localStorage.getItem("token")
  return token ? <Navigate to="/admin" replace/> : children
}

export default AdminRoute
