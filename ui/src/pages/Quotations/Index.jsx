import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Add from './Add'
import List from './List'
import Edit from './Edit'
import PriceIndex from './Price/Index'

const QuotationIndex = () => {
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

const Index = () => {
    return (
        <Routes>
            {/* Redirect root to quotation list */}
            <Route path="/" element={<Navigate to="/list" replace />} />
            
            {/* Quotation routes */}
            <Route path="/*" element={<QuotationIndex />} />
            
            {/* Price configuration route */}
            <Route path="/priceconfigure/*" element={<PriceIndex />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/quotation/list" replace />} />
        </Routes>
    )
}

export default Index