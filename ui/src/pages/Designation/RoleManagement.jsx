import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import SingleSelectDropdown from '../../components/SingleSelectDropdown/SingleSelectDropdown'
import { useDispatch, useSelector } from 'react-redux'
import { RoleGetAction } from '../../redux/Action/Roles/RoleAction'
import { Checkbox, Typography, Button, Card, CardBody, Progress, Chip } from "@material-tailwind/react"
import { FaShieldAlt } from 'react-icons/fa'
import { saveDesinationRoleApi } from '../../apis/Role/Role'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

const RoleManagement = () => {
    const { rolesList, loading } = useSelector((state) => state?.roles)
    const dispatch = useDispatch()
    const [selectedRole, setSelectedRole] = useState()
    const [modifiedPermissions, setModifiedPermissions] = useState({})
    const { state } = useLocation()

    const getRolesList = () => {
        const updatedParams = { orgLevel: true }
        dispatch(RoleGetAction(updatedParams))
    }

    useEffect(() => {
        getRolesList()
    }, [])

    useEffect(() => {
        if (state?.roles) {
            const temp = rolesList?.filter((r) => r?.roleId == state?.roles)
            if (temp?.[0]) {
                setSelectedRole(temp[0])
                const initialPermissions = {}
                temp[0]?.Modules?.forEach((mod) => {
                    initialPermissions[mod.moduleId] = Array.isArray(mod?.permissions) 
                        ? [...mod.permissions] 
                        : []
                })
                setModifiedPermissions(initialPermissions)
            }
        }
    }, [state?.roles, rolesList])

    const togglePermission = (moduleId, permission) => {
        setModifiedPermissions(prev => {
            const currentPerms = prev[moduleId] || []
            const newPerms = currentPerms.includes(permission)
                ? currentPerms.filter(p => p !== permission)
                : [...currentPerms, permission]
            
            return {
                ...prev,
                [moduleId]: newPerms
            }
        })
    }

    const toggleAllModulePermissions = (moduleId, enable) => {
        setModifiedPermissions(prev => ({
            ...prev,
            [moduleId]: enable ? ['c', 'r', 'u', 'd'] : []
        }))
    }

    const togglePermissionForAll = (permission) => {
        setModifiedPermissions(prev => {
            const newPerms = {}
            Object.keys(prev).forEach(moduleId => {
                const currentPerms = prev[moduleId] || []
                if (currentPerms.includes(permission)) {
                    newPerms[moduleId] = currentPerms.filter(p => p !== permission)
                } else {
                    newPerms[moduleId] = [...currentPerms, permission]
                }
            })
            return newPerms
        })
    }

    const hasPermission = (moduleId, permission) => {
        return modifiedPermissions[moduleId]?.includes(permission) || false
    }

    const hasAllPermissions = (moduleId) => {
        const perms = modifiedPermissions[moduleId] || []
        return perms.length === 4
    }

    const getPermissionStats = () => {
        const modules = selectedRole?.Modules || []
        let total = modules.length * 4
        let enabled = 0
        
        modules.forEach(mod => {
            enabled += (modifiedPermissions[mod.moduleId] || []).length
        })
        
        return { total, enabled, percentage: total > 0 ? Math.round((enabled / total) * 100) : 0 }
    }

    const saveRole = async () => {
        try {
            const updatedModules = selectedRole?.Modules?.map(mod => ({
                moduleId: mod.moduleId,
                permissions: modifiedPermissions[mod.moduleId] || []
            }))

            const data = {
                designationId: state?._id,
                roles: selectedRole?.roleId,
                modules: updatedModules
            }
            
            const response = await saveDesinationRoleApi(data)
            
            if (response?.status == 200) {
                toast.success(response?.message || 'Role saved successfully')
            }
        } catch (error) {
            console.log(error, 'error')
            if (error?.status) {
                toast.error(error?.message || 'Failed to save role')
            }
        }
    }

    const stats = getPermissionStats()

    return (
        <div className="flex flex-col gap-4 w-full h-full pb-4 bg-white border border-gray-100 rounded-md p-2 shadow-hrms overflow-auto">
            <Header
                buttonTitle="Save Changes"
                isSubTab={true}
                isBackHandler={true}
                headerLabel="Role Management"
                subHeaderLabel="Configure module permissions for designation roles"
                isButton={true}
                handleClick={() => { saveRole() }}
            />

            <div className="flex flex-col gap-6 px-2">
                {/* Role Selector Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
                    <CardBody>
                        <div className="flex items-center gap-3 mb-3">
                            <FaShieldAlt className="text-blue-600 text-xl" />
                            <Typography variant="h5" color="blue-gray" className="font-semibold">
                                Select Role
                            </Typography>
                        </div>
                        <div className="w-80">
                            <SingleSelectDropdown
                                inputName="Choose a role"
                                hideLabel
                                listData={rolesList}
                                selectedOptionDependency="roleId"
                                selectedOption={selectedRole?.roleId}
                                handleClick={(role) => {
                                    setSelectedRole(role)
                                    const initialPermissions = {}
                                    role?.Modules?.forEach((mod) => {
                                        initialPermissions[mod.moduleId] = Array.isArray(mod?.permissions) 
                                            ? [...mod.permissions] 
                                            : []
                                    })
                                    setModifiedPermissions(initialPermissions)
                                }}
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* Permissions Section */}
                {selectedRole?.Modules?.length > 0 && selectedRole?.modules?.length > 0 && (
                    <>
                        {/* Statistics Card */}
                        <Card className="shadow-sm">
                            <CardBody>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                        <Typography variant="small" className="text-gray-600 mb-1 font-medium">
                                            Permission Coverage
                                        </Typography>
                                        <div className="flex items-baseline gap-2">
                                            <Typography variant="h2" color="blue-gray" className="font-bold">
                                                {stats.percentage}%
                                            </Typography>
                                            <Typography variant="small" className="text-gray-500">
                                                ({stats.enabled} of {stats.total} permissions)
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="flex-1 max-w-md">
                                        <Progress 
                                            value={stats.percentage} 
                                            size="lg"
                                            color="blue"
                                            className="border border-blue-gray-50"
                                        />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Permissions Table */}
                        <Card className="shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                        <tr>
                                            <th className="p-4 text-left">
                                                <div className="flex items-center gap-2">
                                                    <Typography variant="small" className="font-bold text-gray-700">
                                                        Module Name
                                                    </Typography>
                                                    <Chip 
                                                        value={selectedRole.Modules.length} 
                                                        size="sm" 
                                                        color="blue-gray"
                                                        className="rounded-full"
                                                    />
                                                </div>
                                            </th>
                                            <th className="p-4 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <Typography variant="small" className="font-bold text-gray-700">
                                                        Create
                                                    </Typography>
                                                    <Button
                                                        onClick={() => togglePermissionForAll('c')}
                                                        size="sm"
                                                        variant="text"
                                                        color="blue"
                                                        className="p-0 text-xs normal-case font-medium"
                                                    >
                                                        Toggle All
                                                    </Button>
                                                </div>
                                            </th>
                                            <th className="p-4 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <Typography variant="small" className="font-bold text-gray-700">
                                                        Read
                                                    </Typography>
                                                    <Button
                                                        onClick={() => togglePermissionForAll('r')}
                                                        size="sm"
                                                        variant="text"
                                                        color="blue"
                                                        className="p-0 text-xs normal-case font-medium"
                                                    >
                                                        Toggle All
                                                    </Button>
                                                </div>
                                            </th>
                                            <th className="p-4 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <Typography variant="small" className="font-bold text-gray-700">
                                                        Update
                                                    </Typography>
                                                    <Button
                                                        onClick={() => togglePermissionForAll('u')}
                                                        size="sm"
                                                        variant="text"
                                                        color="blue"
                                                        className="p-0 text-xs normal-case font-medium"
                                                    >
                                                        Toggle All
                                                    </Button>
                                                </div>
                                            </th>
                                            <th className="p-4 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <Typography variant="small" className="font-bold text-gray-700">
                                                        Delete
                                                    </Typography>
                                                    <Button
                                                        onClick={() => togglePermissionForAll('d')}
                                                        size="sm"
                                                        variant="text"
                                                        color="blue"
                                                        className="p-0 text-xs normal-case font-medium"
                                                    >
                                                        Toggle All
                                                    </Button>
                                                </div>
                                            </th>
                                            <th className="p-4 text-center">
                                                <Typography variant="small" className="font-bold text-gray-700">
                                                    Quick Actions
                                                </Typography>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedRole.Modules.map((mod, idx) => {
                                            const moduleInfo = selectedRole.modules.find(
                                                (m) => m._id === mod.moduleId
                                            )
                                            const allEnabled = hasAllPermissions(mod.moduleId)

                                            return (
                                                <tr
                                                    key={idx}
                                                    className="hover:bg-blue-50 transition duration-150 ease-in-out group"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${allEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                            <Typography variant="small" className="font-semibold text-gray-900">
                                                                {moduleInfo?.name}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <Checkbox
                                                            checked={hasPermission(mod.moduleId, 'c')}
                                                            onChange={() => togglePermission(mod.moduleId, 'c')}
                                                            color="blue"
                                                            ripple={true}
                                                            className="hover:before:opacity-0"
                                                        />
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <Checkbox
                                                            checked={hasPermission(mod.moduleId, 'r')}
                                                            onChange={() => togglePermission(mod.moduleId, 'r')}
                                                            color="blue"
                                                            ripple={true}
                                                            className="hover:before:opacity-0"
                                                        />
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <Checkbox
                                                            checked={hasPermission(mod.moduleId, 'u')}
                                                            onChange={() => togglePermission(mod.moduleId, 'u')}
                                                            color="blue"
                                                            ripple={true}
                                                            className="hover:before:opacity-0"
                                                        />
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <Checkbox
                                                            checked={hasPermission(mod.moduleId, 'd')}
                                                            onChange={() => togglePermission(mod.moduleId, 'd')}
                                                            color="blue"
                                                            ripple={true}
                                                            className="hover:before:opacity-0"
                                                        />
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                onClick={() => toggleAllModulePermissions(mod.moduleId, true)}
                                                                size="sm"
                                                                color="green"
                                                                variant="outlined"
                                                                className="normal-case px-3 py-1"
                                                            >
                                                                All
                                                            </Button>
                                                            <Button
                                                                onClick={() => toggleAllModulePermissions(mod.moduleId, false)}
                                                                size="sm"
                                                                color="red"
                                                                variant="outlined"
                                                                className="normal-case px-3 py-1"
                                                            >
                                                                None
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        {/* Info Card */}
                        <Card className="bg-blue-50 border-l-4 border-blue-500 shadow-sm">
                            <CardBody>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <Typography variant="small" className="text-blue-800">
                                            <span className="font-bold">Quick Tips:</span> Use checkboxes to control individual permissions, 
                                            "Toggle All" buttons in column headers to enable/disable permissions across all modules, 
                                            or "All/None" buttons for quick module-specific changes. Don't forget to save your changes!
                                        </Typography>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </>
                )}

                {/* No Role Selected State */}
                {(!selectedRole || !selectedRole?.Modules?.length) && (
                    <Card className="bg-gray-50 border-2 border-dashed border-gray-300 shadow-sm">
                        <CardBody className="text-center py-12">
                            <FaShieldAlt className="mx-auto text-gray-400 text-5xl mb-4" />
                            <Typography variant="h5" color="blue-gray" className="mb-2">
                                No Role Selected
                            </Typography>
                            <Typography variant="small" className="text-gray-500">
                                Please select a role from the dropdown above to manage its permissions
                            </Typography>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default RoleManagement