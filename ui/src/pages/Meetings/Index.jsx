import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Add from './Add'
import List from './List'
import Edit from './Edit'

const Index = () => {
    return (
        <Routes>
                <Route path="/*" element={<Navigate to="list" replace={true} />} />
            <Route element={<Add />} path='add' />
            <Route element={<List />} path='list' />
            <Route element={<Edit />} path='edit' />
        </Routes>
    )
}

export default Index