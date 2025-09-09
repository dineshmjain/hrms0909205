import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import SingleSelectDropdown from '../../components/SingleSelectDropdown/SingleSelectDropdown'
import { useDispatch, useSelector } from 'react-redux'
import { RoleGetAction } from '../../redux/Action/Roles/RoleAction'
import { MdClose } from 'react-icons/md'
import { FaCheck } from 'react-icons/fa'
import { ImCross } from "react-icons/im";
import { saveDesinationRoleApi } from '../../apis/Role/Role'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'


const RoleManagement = () => {
    const { rolesList, loading } = useSelector((state) => state?.roles)
    const dispatch = useDispatch()
    const [selectedRole, setSelectedRole] = useState()
    const { state } = useLocation()
    const getRolesList = () => {
        const updatedParams = { orgLevel: true }
        dispatch(RoleGetAction(updatedParams))
    }

    useEffect(() => {
        getRolesList()
    }, [])
    useEffect(()=>{
if(state?.roles)
{
    const temp = rolesList?.filter((r)=>r?.roleId ==state?.roles)
    console.log(temp,'temp')
    setSelectedRole(temp?.[0])
}
    },[state?.roles])
    const saveRole = async () => {

        try {
            const data = {
                designationId: state?._id,
                roles: selectedRole?.roleId
            }
            console.log(data, 'designationId:state?._id')
            const response = await saveDesinationRoleApi(data)
            console.log(response,'front')
            if(response?.status==200)
            {
                toast.success(response?.message)
            }
        }
        catch (error) {
console.log(error,'error')
if(error?.status)
{
        toast.error(error?.message)
}
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full pb-4 bg-white border border-gray-100 rounded-md p-2 shadow-hrms overflow-auto">
            <Header
                buttonTitle="Save"
                isSubTab={true}
                isBackHandler={true}
                headerLabel="Role Management"
                subHeaderLabel="Add Your Roles to Designation Details"
                isButton={true}
                handleClick={() => { saveRole() }}
            />

            <div className="flex flex-col">
                {/* Role selector */}
                <div className="w-64">
                    <SingleSelectDropdown
                        inputName="Select Role"
                        hideLabel
                        listData={rolesList}
                        selectedOptionDependency="roleId"
                        selectedOption={selectedRole?.roleId}
                        handleClick={(role) => setSelectedRole(role)}
                    />
                </div>

                {/* Permissions table */}
                {selectedRole?.Modules?.length > 0 && selectedRole?.modules?.length > 0 && (
                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-3 text-left text-sm font-semibold text-gray-700">Module</th>
                                    <th className="p-3 text-center text-sm font-semibold text-gray-700">Create</th>
                                    <th className="p-3 text-center text-sm font-semibold text-gray-700">Read</th>
                                    <th className="p-3 text-center text-sm font-semibold text-gray-700">Update</th>
                                    <th className="p-3 text-center text-sm font-semibold text-gray-700">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {selectedRole.Modules.map((mod, idx) => {
                                    // Find the matching module details by ID
                                    const moduleInfo = selectedRole.modules.find(
                                        (m) => m._id === mod.moduleId
                                    )
                                    const perms = Array.isArray(mod?.permissions) ? mod.permissions : []

                                    return (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gray-50 transition duration-150 ease-in-out"
                                        >
                                            <td className="p-3 font-medium text-gray-900">
                                                {moduleInfo?.name}
                                            </td>
                                            <td className="p-3 text-center">
                                                {perms.includes('c') ? (

                                                    <FaCheck className="w-5 h-5 text-green-500 inline" />
                                                ) : (
                                                    <MdClose className="w-5 h-5 text-red-500 inline" />
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                {perms.includes('r') ? (
                                                    <FaCheck className="w-5 h-5 text-green-500 inline" />
                                                ) : (
                                                    <MdClose className="w-5 h-5 text-red-500 inline" />
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                {perms.includes('u') ? (
                                                    <FaCheck className="w-5 h-5 text-green-500 inline" />
                                                ) : (
                                                    <MdClose className="w-5 h-5 text-red-500 inline" />
                                                )}
                                            </td>
                                            <td className="p-3 text-center">
                                                {perms.includes('d') ? (
                                                    <FaCheck className="w-5 h-5 text-green-500 inline" />
                                                ) : (
                                                    <MdClose className="w-5 h-5 text-red-500 inline" />
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RoleManagement
