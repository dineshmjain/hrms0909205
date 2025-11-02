// // import React, { useState } from 'react';
// // import { Plus, Trash2, MapPin, Upload, Clock, AlertCircle } from 'lucide-react';

// // const CheckpointCreator = () => {
// //   const [currentStep, setCurrentStep] = useState(1);
// //   const [checkpoint, setCheckpoint] = useState({
// //     clientId: '690048f2b23f0fa4b1b8e873',
// //     clientBranchId: '690048f2b23f0fa4b1b8e876',
// //     name: '',
// //     description: '',
// //     address: {
// //       RoomNo: '',
// //       FloorNo: '',
// //       BuildingNo: '',
// //       BuildingName: '',
// //       Area: ''
// //     },
// //     geoLocation: {
// //       city: '',
// //       district: '',
// //       state: '',
// //       country: 'India',
// //       pincode: '',
// //       address: ''
// //     },
// //     geoJson: {
// //       type: 'Point',
// //       coordinates: [0, 0]
// //     },
// //     attachments: {
// //       image: [],
// //       audio: [],
// //       video: [],
// //       documents: []
// //     },
// //     tasks: []
// //   });

// //   const [currentTask, setCurrentTask] = useState({
// //     name: '',
// //     taskType: 'regular',
// //     description: '',
// //     startTime: '',
// //     graceIn: '',
// //     graceOut: '',
// //     enableAudioVideo: false,
// //     address: {
// //       RoomNo: '',
// //       FloorNo: '',
// //       BuildingNo: '',
// //       BuildingName: '',
// //       Area: ''
// //     },
// //     geoLocation: {
// //       city: '',
// //       district: '',
// //       state: '',
// //       country: 'India',
// //       pincode: '',
// //       address: ''
// //     },
// //     geoJson: {
// //       type: 'Point',
// //       coordinates: [0, 0]
// //     },
// //     attachments: {
// //       image: [],
// //       audio: [],
// //       video: [],
// //       documents: []
// //     }
// //   });

// //   const handleCheckpointChange = (field, value) => {
// //     setCheckpoint(prev => ({ ...prev, [field]: value }));
// //   };

// //   const handleNestedChange = (parent, field, value) => {
// //     setCheckpoint(prev => ({
// //       ...prev,
// //       [parent]: { ...prev[parent], [field]: value }
// //     }));
// //   };

// //   const handleTaskChange = (field, value) => {
// //     setCurrentTask(prev => ({ ...prev, [field]: value }));
// //   };

// //   const handleTaskNestedChange = (parent, field, value) => {
// //     setCurrentTask(prev => ({
// //       ...prev,
// //       [parent]: { ...prev[parent], [field]: value }
// //     }));
// //   };

// //   const addTask = () => {
// //     if (currentTask.name && currentTask.startTime) {
// //       setCheckpoint(prev => ({
// //         ...prev,
// //         tasks: [...prev.tasks, { ...currentTask }]
// //       }));
// //       setCurrentTask({
// //         name: '',
// //         taskType: 'regular',
// //         description: '',
// //         startTime: '',
// //         graceIn: '',
// //         graceOut: '',
// //         enableAudioVideo: false,
// //         address: { RoomNo: '', FloorNo: '', BuildingNo: '', BuildingName: '', Area: '' },
// //         geoLocation: { city: '', district: '', state: '', country: 'India', pincode: '', address: '' },
// //         geoJson: { type: 'Point', coordinates: [0, 0] },
// //         attachments: { image: [], audio: [], video: [], documents: [] }
// //       });
// //     }
// //   };

// //   const removeTask = (index) => {
// //     setCheckpoint(prev => ({
// //       ...prev,
// //       tasks: prev.tasks.filter((_, i) => i !== index)
// //     }));
// //   };

// //   const copyCheckpointAddress = () => {
// //     setCurrentTask(prev => ({
// //       ...prev,
// //       address: { ...checkpoint.address },
// //       geoLocation: { ...checkpoint.geoLocation },
// //       geoJson: { ...checkpoint.geoJson }
// //     }));
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       const response = await fetch('api-{{ep_local}}/checkpoint/create', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(checkpoint)
// //       });
      
// //       if (response.ok) {
// //         alert('Checkpoint created successfully!');
// //         console.log('Created checkpoint:', checkpoint);
// //       } else {
// //         alert('Failed to create checkpoint');
// //       }
// //     } catch (error) {
// //       console.error('Error:', error);
// //       alert('Error creating checkpoint');
// //     }
// //   };

// //   const steps = ['Basic Info', 'Location', 'Attachments', 'Tasks'];

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
// //       <div className="max-w-5xl mx-auto">
// //         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
// //           {/* Header */}
// //           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
// //             <h1 className="text-3xl font-bold">Create Checkpoint</h1>
// //             <p className="text-blue-100 mt-2">Set up security checkpoints and manage tasks</p>
// //           </div>

// //           {/* Progress Steps */}
// //           <div className="flex justify-between p-6 bg-gray-50 border-b">
// //             {steps.map((step, index) => (
// //               <div key={index} className="flex items-center flex-1">
// //                 <div className="flex items-center w-full">
// //                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
// //                     currentStep > index + 1 ? 'bg-green-500 text-white' :
// //                     currentStep === index + 1 ? 'bg-blue-600 text-white' :
// //                     'bg-gray-300 text-gray-600'
// //                   }`}>
// //                     {currentStep > index + 1 ? '✓' : index + 1}
// //                   </div>
// //                   <span className={`ml-3 font-medium ${currentStep === index + 1 ? 'text-blue-600' : 'text-gray-600'}`}>
// //                     {step}
// //                   </span>
// //                 </div>
// //                 {index < steps.length - 1 && (
// //                   <div className={`h-1 flex-1 mx-4 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
// //                 )}
// //               </div>
// //             ))}
// //           </div>

// //           {/* Form Content */}
// //           <div className="p-8">
// //             {currentStep === 1 && (
// //               <div className="space-y-6">
// //                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
                
// //                 <div>
// //                   <label className="block text-sm font-semibold text-gray-700 mb-2">Checkpoint Name *</label>
// //                   <input
// //                     type="text"
// //                     value={checkpoint.name}
// //                     onChange={(e) => handleCheckpointChange('name', e.target.value)}
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     placeholder="e.g., Main Gate Security"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
// //                   <textarea
// //                     value={checkpoint.description}
// //                     onChange={(e) => handleCheckpointChange('description', e.target.value)}
// //                     rows="4"
// //                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     placeholder="Describe the checkpoint purpose and location"
// //                   />
// //                 </div>
// //               </div>
// //             )}

// //             {currentStep === 2 && (
// //               <div className="space-y-6">
// //                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Location Details</h2>
                
// //                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
// //                   <MapPin className="text-blue-600 mt-1" size={20} />
// //                   <div className="text-sm text-blue-800">
// //                     <p className="font-semibold">Address Information</p>
// //                     <p>Provide detailed address for the checkpoint location</p>
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-sm font-semibold text-gray-700 mb-2">Room No</label>
// //                     <input
// //                       type="text"
// //                       value={checkpoint.address.RoomNo}
// //                       onChange={(e) => handleNestedChange('address', 'RoomNo', e.target.value)}
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-semibold text-gray-700 mb-2">Floor No</label>
// //                     <input
// //                       type="text"
// //                       value={checkpoint.address.FloorNo}
// //                       onChange={(e) => handleNestedChange('address', 'FloorNo', e.target.value)}
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-semibold text-gray-700 mb-2">Building No</label>
// //                     <input
// //                       type="text"
// //                       value={checkpoint.address.BuildingNo}
// //                       onChange={(e) => handleNestedChange('address', 'BuildingNo', e.target.value)}
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                     />
// //                   </div>
// //                   <div>
// //                     <label className="block text-sm font-semibold text-gray-700 mb-2">Building Name</label>
// //                     <input
// //                       type="text"
// //                       value={checkpoint.address.BuildingName}
// //                       onChange={(e) => handleNestedChange('address', 'BuildingName', e.target.value)}
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                     />
// //                   </div>
// //                   <div className="col-span-2">
// //                     <label className="block text-sm font-semibold text-gray-700 mb-2">Area</label>
// //                     <input
// //                       type="text"
// //                       value={checkpoint.address.Area}
// //                       onChange={(e) => handleNestedChange('address', 'Area', e.target.value)}
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="border-t pt-6 mt-6">
// //                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Location</h3>
// //                   <div className="grid grid-cols-2 gap-4">
// //                     <div>
// //                       <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
// //                       <input
// //                         type="text"
// //                         value={checkpoint.geoLocation.city}
// //                         onChange={(e) => handleNestedChange('geoLocation', 'city', e.target.value)}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
// //                       <input
// //                         type="text"
// //                         value={checkpoint.geoLocation.district}
// //                         onChange={(e) => handleNestedChange('geoLocation', 'district', e.target.value)}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
// //                       <input
// //                         type="text"
// //                         value={checkpoint.geoLocation.state}
// //                         onChange={(e) => handleNestedChange('geoLocation', 'state', e.target.value)}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
// //                       <input
// //                         type="text"
// //                         value={checkpoint.geoLocation.pincode}
// //                         onChange={(e) => handleNestedChange('geoLocation', 'pincode', e.target.value)}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                       />
// //                     </div>
// //                     <div className="col-span-2">
// //                       <label className="block text-sm font-semibold text-gray-700 mb-2">Full Address</label>
// //                       <input
// //                         type="text"
// //                         value={checkpoint.geoLocation.address}
// //                         onChange={(e) => handleNestedChange('geoLocation', 'address', e.target.value)}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
// //                       <input
// //                         type="number"
// //                         step="any"
// //                         value={checkpoint.geoJson.coordinates[1]}
// //                         onChange={(e) => handleNestedChange('geoJson', 'coordinates', [checkpoint.geoJson.coordinates[0], parseFloat(e.target.value)])}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                       />
// //                     </div>
// //                     <div>
// //                       <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
// //                       <input
// //                         type="number"
// //                         step="any"
// //                         value={checkpoint.geoJson.coordinates[0]}
// //                         onChange={(e) => handleNestedChange('geoJson', 'coordinates', [parseFloat(e.target.value), checkpoint.geoJson.coordinates[1]])}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {currentStep === 3 && (
// //               <div className="space-y-6">
// //                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Attachments</h2>
                
// //                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
// //                   <AlertCircle className="text-yellow-600 mt-1" size={20} />
// //                   <div className="text-sm text-yellow-800">
// //                     <p className="font-semibold">File Upload Placeholder</p>
// //                     <p>In production, integrate with your file upload service. File paths will be stored in the checkpoint data.</p>
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-6">
// //                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
// //                     <Upload className="mx-auto text-gray-400 mb-3" size={40} />
// //                     <p className="text-sm font-semibold text-gray-700">Upload Images</p>
// //                     <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
// //                   </div>
// //                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
// //                     <Upload className="mx-auto text-gray-400 mb-3" size={40} />
// //                     <p className="text-sm font-semibold text-gray-700">Upload Audio</p>
// //                     <p className="text-xs text-gray-500 mt-1">MP3, WAV (Max 10MB)</p>
// //                   </div>
// //                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
// //                     <Upload className="mx-auto text-gray-400 mb-3" size={40} />
// //                     <p className="text-sm font-semibold text-gray-700">Upload Video</p>
// //                     <p className="text-xs text-gray-500 mt-1">MP4, AVI (Max 50MB)</p>
// //                   </div>
// //                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
// //                     <Upload className="mx-auto text-gray-400 mb-3" size={40} />
// //                     <p className="text-sm font-semibold text-gray-700">Upload Documents</p>
// //                     <p className="text-xs text-gray-500 mt-1">PDF, DOC (Max 20MB)</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {currentStep === 4 && (
// //               <div className="space-y-6">
// //                 <div className="flex justify-between items-center mb-6">
// //                   <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
// //                   <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
// //                     {checkpoint.tasks.length} Task{checkpoint.tasks.length !== 1 ? 's' : ''}
// //                   </span>
// //                 </div>

// //                 {/* Task List */}
// //                 {checkpoint.tasks.length > 0 && (
// //                   <div className="space-y-3 mb-6">
// //                     {checkpoint.tasks.map((task, index) => (
// //                       <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-start">
// //                         <div className="flex-1">
// //                           <div className="flex items-center gap-3 mb-2">
// //                             <Clock className="text-blue-600" size={18} />
// //                             <h3 className="font-semibold text-gray-800">{task.name}</h3>
// //                             <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{task.taskType}</span>
// //                           </div>
// //                           <p className="text-sm text-gray-600 mb-2">{task.description}</p>
// //                           <p className="text-xs text-gray-500">Start: {task.startTime} | Grace In: {task.graceIn} | Grace Out: {task.graceOut}</p>
// //                         </div>
// //                         <button
// //                           onClick={() => removeTask(index)}
// //                           className="text-red-500 hover:text-red-700 p-2"
// //                         >
// //                           <Trash2 size={18} />
// //                         </button>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {/* Add New Task Form */}
// //                 <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
// //                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h3>
                  
// //                   <div className="space-y-4">
// //                     <div className="grid grid-cols-2 gap-4">
// //                       <div>
// //                         <label className="block text-sm font-semibold text-gray-700 mb-2">Task Name *</label>
// //                         <input
// //                           type="text"
// //                           value={currentTask.name}
// //                           onChange={(e) => handleTaskChange('name', e.target.value)}
// //                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                           placeholder="e.g., Gate Opening Check"
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-sm font-semibold text-gray-700 mb-2">Task Type</label>
// //                         <select
// //                           value={currentTask.taskType}
// //                           onChange={(e) => handleTaskChange('taskType', e.target.value)}
// //                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                         >
// //                           <option value="regular">Regular</option>
// //                           <option value="urgent">Urgent</option>
// //                           <option value="periodic">Periodic</option>
// //                         </select>
// //                       </div>
// //                     </div>

// //                     <div>
// //                       <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
// //                       <textarea
// //                         value={currentTask.description}
// //                         onChange={(e) => handleTaskChange('description', e.target.value)}
// //                         rows="2"
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                       />
// //                     </div>

// //                     <div className="grid grid-cols-3 gap-4">
// //                       <div>
// //                         <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
// //                         <input
// //                           type="time"
// //                           value={currentTask.startTime}
// //                           onChange={(e) => handleTaskChange('startTime', e.target.value)}
// //                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-sm font-semibold text-gray-700 mb-2">Grace In</label>
// //                         <input
// //                           type="time"
// //                           value={currentTask.graceIn}
// //                           onChange={(e) => handleTaskChange('graceIn', e.target.value)}
// //                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-sm font-semibold text-gray-700 mb-2">Grace Out</label>
// //                         <input
// //                           type="time"
// //                           value={currentTask.graceOut}
// //                           onChange={(e) => handleTaskChange('graceOut', e.target.value)}
// //                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
// //                         />
// //                       </div>
// //                     </div>

// //                     <div className="flex items-center gap-2">
// //                       <input
// //                         type="checkbox"
// //                         id="enableAudioVideo"
// //                         checked={currentTask.enableAudioVideo}
// //                         onChange={(e) => handleTaskChange('enableAudioVideo', e.target.checked)}
// //                         className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// //                       />
// //                       <label htmlFor="enableAudioVideo" className="text-sm font-medium text-gray-700">
// //                         Enable Audio/Video Recording
// //                       </label>
// //                     </div>

// //                     <button
// //                       onClick={copyCheckpointAddress}
// //                       className="text-sm text-blue-600 hover:text-blue-800 font-medium"
// //                     >
// //                       📍 Copy address from checkpoint
// //                     </button>

// //                     <button
// //                       onClick={addTask}
// //                       disabled={!currentTask.name || !currentTask.startTime}
// //                       className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
// //                     >
// //                       <Plus size={20} />
// //                       Add Task to Checkpoint
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           {/* Navigation */}
// //           <div className="bg-gray-50 px-8 py-4 flex justify-between border-t">
// //             <button
// //               onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
// //               disabled={currentStep === 1}
// //               className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               Previous
// //             </button>
            
// //             {currentStep < 4 ? (
// //               <button
// //                 onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
// //                 className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
// //               >
// //                 Next Step
// //               </button>
// //             ) : (
// //               <button
// //                 onClick={handleSubmit}
// //                 disabled={!checkpoint.name || checkpoint.tasks.length === 0}
// //                 className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
// //               >
// //                 Create Checkpoint
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         {/* Debug Panel */}
// //         <div className="mt-6 bg-white rounded-lg shadow p-4">
// //           <details>
// //             <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
// //               View JSON Output (for debugging)
// //             </summary>
// //             <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
// //               {JSON.stringify(checkpoint, null, 2)}
// //             </pre>
// //           </details>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CheckpointCreator;


// import React, { useState, useEffect } from 'react';
// import { MapPin, Upload, Clock, Plus, Trash2, Edit2, Building, CheckCircle, X, Loader2, AlertCircle } from 'lucide-react';
// import CitySearchWithTimezone from "../../components/Input/CitySearchWithTimezone"

// // Simple Input Component
// const Input = ({ label, name, value, onChange, type = "text", placeholder, error, required, ...props }) => (
//   <div className="mb-4">
//     <label className="block text-sm font-semibold text-gray-700 mb-2">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//       {...props}
//     />
//     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//   </div>
// );

// // Simple Textarea Component
// const Textarea = ({ label, name, value, onChange, placeholder, error, required, rows = 3 }) => (
//   <div className="mb-4">
//     <label className="block text-sm font-semibold text-gray-700 mb-2">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <textarea
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       rows={rows}
//       className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
//     />
//     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//   </div>
// );

// // Simple Select Component
// const Select = ({ label, name, value, onChange, options, error, required }) => (
//   <div className="mb-4">
//     <label className="block text-sm font-semibold text-gray-700 mb-2">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//     >
//       <option value="">Select {label}</option>
//       {options.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//   </div>
// );

// // Simple Toast Component
// const Toast = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
//   return (
//     <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50`}>
//       {type === 'success' && <CheckCircle className="w-5 h-5" />}
//       {type === 'error' && <AlertCircle className="w-5 h-5" />}
//       <span>{message}</span>
//       <button onClick={onClose} className="ml-2">
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// // Checkpoint Form Fields Component
// const CheckpointFormFields = ({ values, errors, handleChange, clientList, branchList, addressTypes,setErrors }) => {
//         const [locationSearch, setLocationSearch] = useState();
//         const [location, setLocation] = useState({
        
//             });
//     const [locationSearchText, setLocationSearchText] = useState(

//     );
//     // const [errors,setErrors]=useState()
//     // console.log(location,'deps')
//         useEffect(() => {
//             if (location) {
//                 setFieldValue('city', location?.city)
//                 setFieldValue('state', location?.state)
//                 setFieldValue('pincode', location?.pincode)
//                 setFieldValue('registeredAddress', location?.address)
//                 setFieldValue('latitude', location?.lat)
//                 setFieldValue('longitude', location?.lng)
//             }
//         }, [location])
//   return (
//     <div>
//       {/* Section 1: Checkpoint Details */}
//       <div className="bg-white p-6 mb-4 rounded-lg shadow">
//         <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
//           <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//             <Building className="w-5 h-5 text-blue-600" />
//           </div>
//           <h3 className="text-lg font-bold text-gray-800">Checkpoint Details</h3>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Input
//             name="name"
//             label="Checkpoint Name"
//             value={values.name}
//             onChange={handleChange}
//             placeholder="e.g., Main Gate Security"
//             error={errors.name}
//             required
//           />
          
//           <Select
//             name="clientId"
//             label="Select Client"
//             value={values.clientId}
//             onChange={handleChange}
//             options={clientList}
//             error={errors.clientId}
//             required
//           />

//           <Select
//             name="clientBranchId"
//             label="Select Branch"
//             value={values.clientBranchId}
//             onChange={handleChange}
//             options={branchList}
//             error={errors.clientBranchId}
//             required
//           />

//           <div className="col-span-full">
//             <Textarea
//               name="description"
//               label="Description"
//               value={values.description}
//               onChange={handleChange}
//               placeholder="Describe the checkpoint purpose and location"
//               error={errors.description}
//               required
//             />
//           </div>
//         </div>
//       </div>

//       {/* Section 2: Location Details */}
//       <div className="bg-white p-6 mb-4 rounded-lg shadow">
//         <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
//           <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
//             <MapPin className="w-5 h-5 text-green-600" />
//           </div>
//           <h3 className="text-lg font-bold text-gray-800">Location Details</h3>
//         </div>

//         <div className="grid grid-cols-12 gap-4 mb-4">
//           {/* <div className="col-span-12 md:col-span-2">
//             <Select
//               name="addressTypeId"
//               label="Address Type"
//               value={values.addressTypeId}
//               onChange={handleChange}
//               options={addressTypes}
//             />
//           </div> */}

//           <div className="col-span-12 md:col-span-10">
//         <CitySearchWithTimezone
//                             locationSearchText={locationSearchText}
//                             location={location}
//                             setLocation={setLocation}
//                             setLocationSearchText={setLocationSearchText}
//                             locationSearch={locationSearch}
//                             errors={errors}
//                             setErrors={setErrors}
//                         />
//           </div>
//         </div>

//         <div className="grid grid-cols-12 gap-4 mb-4">
//           <div className="col-span-12 md:col-span-2">
//             <Input name="roomNo" label="Room No" value={values.roomNo} onChange={handleChange} placeholder="101" />
//           </div>
//           <div className="col-span-12 md:col-span-2">
//             <Input name="floorNo" label="Floor No" value={values.floorNo} onChange={handleChange} placeholder="1st" />
//           </div>
//           <div className="col-span-12 md:col-span-2">
//             <Input name="buildingNo" label="Building No" value={values.buildingNo} onChange={handleChange} placeholder="B-12" />
//           </div>
//           <div className="col-span-12 md:col-span-3">
//             <Input name="buildingName" label="Building Name" value={values.buildingName} onChange={handleChange} placeholder="Building Name" />
//           </div>
//           <div className="col-span-12 md:col-span-3">
//             <Input name="area" label="Area" value={values.area} onChange={handleChange} placeholder="Area" />
//           </div>
//         </div>

//         <div className="grid grid-cols-12 gap-4">
//           <div className="col-span-12 md:col-span-4">
//             <Input name="city" label="City" value={values.city} onChange={handleChange} placeholder="City" error={errors.city} required />
//           </div>
//           <div className="col-span-12 md:col-span-4">
//             <Input name="state" label="State" value={values.state} onChange={handleChange} placeholder="State" error={errors.state} required />
//           </div>
//           <div className="col-span-12 md:col-span-2">
//             <Input name="pincode" label="Pincode" value={values.pincode} onChange={handleChange} placeholder="6 digits" maxLength={6} error={errors.pincode} required />
//           </div>
//           <div className="col-span-6 md:col-span-1">
//             <Input name="latitude" label="Latitude" value={values.latitude} onChange={handleChange} type="number" step="any" placeholder="15.35" />
//           </div>
//           <div className="col-span-6 md:col-span-1">
//             <Input name="longitude" label="Longitude" value={values.longitude} onChange={handleChange} type="number" step="any" placeholder="75.13" />
//           </div>
//         </div>
//       </div>

//       {/* Section 3: Attachments */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
//           <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
//             <Upload className="w-5 h-5 text-purple-600" />
//           </div>
//           <h3 className="text-lg font-bold text-gray-800">Attachments (Optional)</h3>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer">
//             <Upload className="mx-auto text-gray-400 mb-2" size={32} />
//             <p className="text-xs font-semibold text-gray-700">Upload Images</p>
//             <p className="text-xs text-gray-500 mt-1">JPG, PNG</p>
//           </div>
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer">
//             <Upload className="mx-auto text-gray-400 mb-2" size={32} />
//             <p className="text-xs font-semibold text-gray-700">Upload Audio</p>
//             <p className="text-xs text-gray-500 mt-1">MP3, WAV</p>
//           </div>
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer">
//             <Upload className="mx-auto text-gray-400 mb-2" size={32} />
//             <p className="text-xs font-semibold text-gray-700">Upload Video</p>
//             <p className="text-xs text-gray-500 mt-1">MP4, AVI</p>
//           </div>
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer">
//             <Upload className="mx-auto text-gray-400 mb-2" size={32} />
//             <p className="text-xs font-semibold text-gray-700">Upload Documents</p>
//             <p className="text-xs text-gray-500 mt-1">PDF, DOC</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Task Form Component
// const TaskForm = ({ onAddTask, isAddingTask, setIsAddingTask }) => {
//   const [taskData, setTaskData] = useState({
//     taskName: '',
//     taskType: 'regular',
//     taskDescription: '',
//     startTime: '',
//     graceIn: '',
//     graceOut: '',
//     enableAudioVideo: false,
//     useCheckpointLocation: true,
//     roomNo: '',
//     floorNo: '',
//     buildingNo: '',
//     buildingName: '',
//     area: '',
//     city: '',
//     state: '',
//     pincode: '',
//     registeredAddress: '',
//     latitude: '',
//     longitude: ''
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setTaskData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const validateTask = () => {
//     const newErrors = {};
//     if (!taskData.taskName) newErrors.taskName = 'Task name is required';
//     if (!taskData.taskDescription) newErrors.taskDescription = 'Description is required';
//     if (!taskData.startTime) newErrors.startTime = 'Start time is required';
//     if (!taskData.graceIn) newErrors.graceIn = 'Grace in time is required';
//     if (!taskData.graceOut) newErrors.graceOut = 'Grace out time is required';
    
//     if (!taskData.useCheckpointLocation) {
//       if (!taskData.city) newErrors.city = 'City is required';
//       if (!taskData.state) newErrors.state = 'State is required';
//       if (!taskData.pincode) newErrors.pincode = 'Pincode is required';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleAddTask = () => {
//     if (validateTask()) {
//       onAddTask(taskData);
//       setTaskData({
//         taskName: '',
//         taskType: 'regular',
//         taskDescription: '',
//         startTime: '',
//         graceIn: '',
//         graceOut: '',
//         enableAudioVideo: false,
//         useCheckpointLocation: true,
//         roomNo: '',
//         floorNo: '',
//         buildingNo: '',
//         buildingName: '',
//         area: '',
//         city: '',
//         state: '',
//         pincode: '',
//         registeredAddress: '',
//         latitude: '',
//         longitude: ''
//       });
//       setErrors({});
//     }
//   };

//   if (!isAddingTask) return null;

//   return (
//     <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-4">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//           <Plus className="w-5 h-5 text-blue-600" />
//           Add New Task
//         </h3>
//         <button
//           type="button"
//           onClick={() => setIsAddingTask(false)}
//           className="p-2 hover:bg-blue-100 rounded-lg transition"
//         >
//           <X className="w-5 h-5 text-gray-600" />
//         </button>
//       </div>
      
//       <div className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <Input
//             name="taskName"
//             label="Task Name"
//             value={taskData.taskName}
//             onChange={handleChange}
//             placeholder="e.g., Gate Opening Check"
//             error={errors.taskName}
//             required
//           />
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Task Type</label>
//             <select
//               name="taskType"
//               value={taskData.taskType}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="regular">Regular</option>
//               <option value="urgent">Urgent</option>
//               <option value="periodic">Periodic</option>
//             </select>
//           </div>
//         </div>

//         <Textarea
//           name="taskDescription"
//           label="Description"
//           value={taskData.taskDescription}
//           onChange={handleChange}
//           placeholder="Describe the task"
//           error={errors.taskDescription}
//           required
//           rows={2}
//         />

//         <div className="grid grid-cols-3 gap-4">
//           <Input
//             name="startTime"
//             label="Start Time"
//             value={taskData.startTime}
//             onChange={handleChange}
//             type="time"
//             error={errors.startTime}
//             required
//           />
//           <Input
//             name="graceIn"
//             label="Grace In"
//             value={taskData.graceIn}
//             onChange={handleChange}
//             type="time"
//             error={errors.graceIn}
//             required
//           />
//           <Input
//             name="graceOut"
//             label="Grace Out"
//             value={taskData.graceOut}
//             onChange={handleChange}
//             type="time"
//             error={errors.graceOut}
//             required
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             id="enableAudioVideo"
//             name="enableAudioVideo"
//             checked={taskData.enableAudioVideo}
//             onChange={handleChange}
//             className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <label htmlFor="enableAudioVideo" className="text-sm font-medium text-gray-700">
//             Enable Audio/Video Recording
//           </label>
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             id="useCheckpointLocation"
//             name="useCheckpointLocation"
//             checked={taskData.useCheckpointLocation}
//             onChange={handleChange}
//             className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <label htmlFor="useCheckpointLocation" className="text-sm font-medium text-gray-700">
//             Use checkpoint location for this task
//           </label>
//         </div>

//         {!taskData.useCheckpointLocation && (
//           <div className="border-t pt-4 mt-4">
//             <h4 className="text-sm font-semibold text-gray-700 mb-3">Task Specific Location</h4>
//             <div className="grid grid-cols-2 gap-3">
//               <Input
//                 name="city"
//                 placeholder="City"
//                 value={taskData.city}
//                 onChange={handleChange}
//                 error={errors.city}
//               />
//               <Input
//                 name="state"
//                 placeholder="State"
//                 value={taskData.state}
//                 onChange={handleChange}
//                 error={errors.state}
//               />
//               <Input
//                 name="pincode"
//                 placeholder="Pincode"
//                 value={taskData.pincode}
//                 onChange={handleChange}
//                 maxLength={6}
//                 error={errors.pincode}
//               />
//               <Input
//                 name="registeredAddress"
//                 placeholder="Full Address"
//                 value={taskData.registeredAddress}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//         )}

//         <button
//           type="button"
//           onClick={handleAddTask}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 transition"
//         >
//           <Plus size={20} />
//           Add Task
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const CheckpointCreator = () => {
//   const [tasks, setTasks] = useState([]);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isAddingTask, setIsAddingTask] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [errors, setErrors] = useState({});

 
//         // console.log(values, 'va')
//   const clientList = [
//     { value: '690048f2b23f0fa4b1b8e873', label: 'ABC Corporation' },
//     { value: '2', label: 'XYZ Industries' }
//   ];
  
//   const branchList = [
//     { value: '690048f2b23f0fa4b1b8e876', label: 'Head Office' },
//     { value: '2', label: 'Branch Office' }
//   ];
  
//   const addressTypes = [
//     { value: '1', label: 'Office' },
//     { value: '2', label: 'Residential' }
//   ];

//   const [values, setValues] = useState({
//     name: '',
//     description: '',
//     clientId: '690048f2b23f0fa4b1b8e873',
//     clientBranchId: '690048f2b23f0fa4b1b8e876',
//     roomNo: '',
//     floorNo: '',
//     buildingNo: '',
//     buildingName: '',
//     area: '',
//     city: '',
//     state: '',
//     pincode: '',
//     registeredAddress: '',
//     latitude: '',
//     longitude: '',
//     addressTypeId: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setValues(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const showToast = (message, type) => {
//     setToast({ message, type });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!values.name) newErrors.name = 'Checkpoint name is required';
//     if (!values.description) newErrors.description = 'Description is required';
//     if (!values.clientId) newErrors.clientId = 'Client is required';
//     if (!values.clientBranchId) newErrors.clientBranchId = 'Branch is required';
//     if (!values.city) newErrors.city = 'City is required';
//     if (!values.state) newErrors.state = 'State is required';
//     if (!values.pincode) newErrors.pincode = 'Pincode is required';
//     else if (!/^[0-9]{6}$/.test(values.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
//     if (!values.registeredAddress) newErrors.registeredAddress = 'Address is required';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const generateCheckpointJSON = () => {
//     const fullAddress = [
//       values.roomNo,
//       values.floorNo,
//       values.buildingNo,
//       values.buildingName,
//       values.area,
//       values.registeredAddress,
//       values.city,
//       values.state,
//       'India'
//     ].filter(Boolean).join(', ');

//     return {
//       clientId: values.clientId,
//       clientBranchId: values.clientBranchId,
//       name: values.name,
//       description: values.description,
//       address: {
//         RoomNo: values.roomNo,
//         FloorNo: values.floorNo,
//         BuildingNo: values.buildingNo,
//         BuildingName: values.buildingName,
//         Area: values.area
//       },
//       geoLocation: {
//         city: values.city,
//         district: values.city,
//         state: values.state,
//         country: 'India',
//         pincode: parseInt(values.pincode) || 0,
//         address: fullAddress
//       },
//       geoJson: {
//         type: 'Point',
//         coordinates: [parseFloat(values.longitude) || 0, parseFloat(values.latitude) || 0]
//       },
//       attachments: {
//         image: [],
//         audio: [],
//         video: [],
//         documents: []
//       },
//       tasks: tasks.map(task => {
//         const taskFullAddress = task.useCheckpointLocation ? fullAddress : [
//           task.roomNo,
//           task.floorNo,
//           task.buildingNo,
//           task.buildingName,
//           task.area,
//           task.registeredAddress,
//           task.city,
//           task.state,
//           'India'
//         ].filter(Boolean).join(', ');

//         return {
//           name: task.taskName,
//           taskType: task.taskType,
//           description: task.taskDescription,
//           startTime: task.startTime,
//           graceIn: task.graceIn,
//           graceOut: task.graceOut,
//           enableAudioVideo: task.enableAudioVideo,
//           address: task.useCheckpointLocation ? {
//             RoomNo: values.roomNo,
//             FloorNo: values.floorNo,
//             BuildingNo: values.buildingNo,
//             BuildingName: values.buildingName,
//             Area: values.area
//           } : {
//             RoomNo: task.roomNo,
//             FloorNo: task.floorNo,
//             BuildingNo: task.buildingNo,
//             BuildingName: task.buildingName,
//             Area: task.area
//           },
//           geoLocation: task.useCheckpointLocation ? {
//             city: values.city,
//             district: values.city,
//             state: values.state,
//             country: 'India',
//             pincode: parseInt(values.pincode) || 0,
//             address: fullAddress
//           } : {
//             city: task.city,
//             district: task.city,
//             state: task.state,
//             country: 'India',
//             pincode: parseInt(task.pincode) || 0,
//             address: taskFullAddress
//           },
//           geoJson: task.useCheckpointLocation ? {
//             type: 'Point',
//             coordinates: [parseFloat(values.longitude) || 0, parseFloat(values.latitude) || 0]
//           } : {
//             type: 'Point',
//             coordinates: [parseFloat(task.longitude) || 0, parseFloat(task.latitude) || 0]
//           },
//           attachments: {
//             image: [],
//             audio: [],
//             video: [],
//             documents: []
//           }
//         };
//       })
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       showToast('Please fill all required fields', 'error');
//       return;
//     }

//     if (tasks.length === 0) {
//       showToast('Please add at least one task', 'error');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       const checkpointData = generateCheckpointJSON();
      
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       console.log('Checkpoint Data:', JSON.stringify(checkpointData, null, 2));
//       showToast('Checkpoint created successfully!', 'success');
      
//       setValues({
//         name: '',
//         description: '',
//         clientId: '690048f2b23f0fa4b1b8e873',
//         clientBranchId: '690048f2b23f0fa4b1b8e876',
//         roomNo: '',
//         floorNo: '',
//         buildingNo: '',
//         buildingName: '',
//         area: '',
//         city: '',
//         state: '',
//         pincode: '',
//         registeredAddress: '',
//         latitude: '',
//         longitude: '',
//         addressTypeId: '',
//       });
//       setTasks([]);
//     } catch (error) {
//       showToast('Failed to create checkpoint', 'error');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleAddTask = (taskData) => {
//     setTasks(prev => [...prev, { id: Date.now(), ...taskData }]);
//     showToast('Task added successfully!', 'success');
//     setIsAddingTask(false);
//   };

//   const handleDeleteTask = (taskId) => {
//     setTasks(prev => prev.filter(t => t.id !== taskId));
//     showToast('Task removed', 'success');
//   };

//   return (
//     <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
//       <form onSubmit={handleSubmit} className="w-full mx-auto space-y-4">
//         <div className=" p-6 mb-6 shadow-lg">
//           <h1 className="text-3xl font-bold text-black">Create Checkpoint</h1>
//           <p className="text-blue-100 mt-2">Set up security checkpoints and manage tasks</p>
//         </div>

//         <CheckpointFormFields 
//           values={values}
//           errors={errors}
//           setErrors={setErrors}
//           handleChange={handleChange}
//           clientList={clientList}
//           branchList={branchList}
//           addressTypes={addressTypes}
//         />

//         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
//                 <Clock className="w-5 h-5 text-orange-600" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold text-gray-800">Tasks</h3>
//                 <p className="text-sm text-gray-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''} added</p>
//               </div>
//             </div>
            
//             {!isAddingTask && (
//               <button
//                 type="button"
//                 onClick={() => setIsAddingTask(true)}
//                 className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
//               >
//                 <Plus className="w-5 h-5" />
//                 Add Task
//               </button>
//             )}
//           </div>

//           {tasks.length > 0 && (
//             <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     {['Task Name', 'Type', 'Start Time', 'Grace In', 'Grace Out', 'Actions'].map((head) => (
//                       <th key={head} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                         {head}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {tasks.map((task) => (
//                     <tr key={task.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.taskName}</td>
//                       <td className="px-4 py-3 text-sm text-gray-700">
//                         <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//                           {task.taskType}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-700">{task.startTime}</td>
//                       <td className="px-4 py-3 text-sm text-gray-700">{task.graceIn}</td>
//                       <td className="px-4 py-3 text-sm text-gray-700">{task.graceOut}</td>
//                       <td className="px-4 py-3">
//                         <button
//                           type="button"
//                           onClick={() => handleDeleteTask(task.id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                           title="Delete Task"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           <TaskForm 
//             onAddTask={handleAddTask}
//             isAddingTask={isAddingTask}
//             setIsAddingTask={setIsAddingTask}
//           />
//         </div>

//         <div className="flex justify-center gap-4 pt-4">
//           <button
//             type="submit"
//             disabled={isSaving || tasks.length === 0}
//             className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isSaving ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Creating Checkpoint...
//               </>
//             ) : (
//               <>
//                 <CheckCircle className="w-5 h-5" />
//                 Create Checkpoint
//               </>
//             )}
//           </button>
//         </div>

//         <div className="mt-6 bg-white rounded-lg shadow p-4">
//           <details>
//             <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
//               View JSON Output (for debugging)
//             </summary>
//             <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
//               {JSON.stringify(generateCheckpointJSON(), null, 2)}
//             </pre>
//           </details>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CheckpointCreator;


import React from 'react'

const Create = () => {
  return (
    <div>Create</div>
  )
}

export default Create