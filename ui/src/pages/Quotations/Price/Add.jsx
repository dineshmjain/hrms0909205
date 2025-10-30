import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'

const Add = () => {
  const navigate = useNavigate()
  
  return (
    <div className="flex flex-col gap-6 p-4 w-full min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <button
          onClick={() => navigate('/quotation/priceconfigure/list')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </button>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Price</h2>
            <p className="text-gray-600">This page is ready for implementation</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Add