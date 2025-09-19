import React from 'react'
import Add from './Add'
import List from './List'
import Edit from './Edit'
import { Navigate, Route, Routes } from 'react-router-dom'

const Index = () => {
    return (
        <Routes>
            <Route path="" element={<Navigate to="list" replace />} />
            <Route path="add" element={<Add />} />
            <Route path="list" element={<List />} />
            <Route path="edit" element={<Edit />} />
            <Route path="*" element={<Navigate to="list" replace />} />
        </Routes>
    )
}


export default Index