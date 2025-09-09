import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/header/Header'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { GetEmployeeDesginationRoleAction, UpdateEmployeeDisabledModulesAction } from '../../../redux/Action/Employee/EmployeeAction'
import { Typography, Checkbox } from '@material-tailwind/react'
import { RoleGetAction } from '../../../redux/Action/Roles/RoleAction'
import { removeEmptyStrings } from '../../../constants/reusableFun'

const AccessManagement = () => {
  const [isEditAvailable, setIsEditAvailable] = useState(false)
  const dispatch = useDispatch()
  const { employeeRoleDetails } = useSelector((state) => state?.employee)
  const { rolesList } = useSelector((state) => state?.roles)
  const { state } = useLocation()

  useEffect(() => {
    if (state?._id) {
      getAccessModules()
      getRolesList()
    }
  }, [state?._id])

  const getRolesList = async () => {
    try {
      dispatch(RoleGetAction())
    } catch (error) {
      console.log('Error fetching roles:', error)
    }
  }

  const getAccessModules = async () => {
    try {
      dispatch(GetEmployeeDesginationRoleAction({ employeeUserId: state?._id }))
    } catch (error) {
      console.log('Error fetching access modules:', error)
    }
  }

  const handleUpdatePermissions = (values) => {

    console.log(values.disabledModules, 'values in access management')

    dispatch(UpdateEmployeeDisabledModulesAction(removeEmptyStrings({employeeId:state?._id, disabledModules:values.disabledModules.map((r)=>{return({moduleId:r.moduleId,permissions:r.permissions})})})))
    // console.log('Editable Modules:', values.modules)
    // console.log('Disabled Modules:', values.disabledModules)


    // dispatch(UpdateEmployeeRolePermissionsAction({
    //   employeeId: state?._id,
    //   modules: values.modules,
    //   disabledModules: values.disabledModules
    // }))
  }

  return (
    <div>
      <Formik
        initialValues={{
          modules: employeeRoleDetails?.modules || [],
          disabledModules: employeeRoleDetails?.disabledModules || [],
        }}
        enableReinitialize
        onSubmit={handleUpdatePermissions}
      >
        {({ values, submitForm, setFieldValue }) => (
          <>
            <Header
              isBackHandler={false}
              headerLabel="Access Management"
              subHeaderLabel="Manage Your User Modules Permissions"
              handleClick={submitForm}
              isEditAvaliable={isEditAvailable}
              isButton={true}
              handleEdit={() => setIsEditAvailable(!isEditAvailable)}
            />

            <Form>
              <div className="p-4">
                <div className="flex flex-col gap-4">
                  {/* Role name */}
                  <div className="flex flex-col gap-2">
                    <Typography>
                      Role Name:
                      <Typography className="font-semibold">
                        {employeeRoleDetails?.name || 'N/A'}
                      </Typography>
                    </Typography>
                  </div>

                  {/* Permissions Table */}
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
                        {values?.modules?.map((mod, idx) => {
                          const disabledMod = values.disabledModules.find(
                            (d) => d.moduleId === mod.moduleId
                          )

                          return (
                            <tr key={mod.moduleId} className="hover:bg-gray-50 transition">
                              <td className="p-3 font-medium text-gray-900">{mod?.name}</td>

                              {['c', 'r', 'u', 'd'].map((perm) => {
                                const isAvailable = mod?.permissions?.includes(perm)
                                const isDisabled = disabledMod?.permissions?.includes(perm)

                                return (
                                  <td key={perm} className="p-3 text-center">
                                    {!isAvailable ? (
                                      <span className="text-gray-800">NA</span>
                                    ) : (
                                      <Checkbox
                                        type="checkbox"
                                        checked={!isDisabled}
                                        onChange={(e) => {
                                          const checked = e.target.checked
                                          let updatedDisabled = [...values.disabledModules]

                                          // remove existing entry for this module
                                          updatedDisabled = updatedDisabled.filter(d => d.moduleId !== mod.moduleId)

                                          if (!checked) {
                                            // Add to disabledModules
                                            const newDisabled = {
                                              moduleId: mod.moduleId,
                                              // name: mod.name,
                                              // moduleKey: mod.moduleKey,
                                              permissions: [perm],
                                            }

                                            const existing = values.disabledModules.find(
                                              (d) => d.moduleId === mod.moduleId
                                            )

                                            if (existing) {
                                              newDisabled.permissions = [
                                                ...new Set([...existing.permissions, perm]),
                                              ]
                                            }
                                            updatedDisabled.push(newDisabled)
                                          } else {
                                            // Re-enable this permission
                                            const existing = values.disabledModules.find(
                                              (d) => d.moduleId === mod.moduleId
                                            )
                                            if (existing) {
                                              const newPerms = existing.permissions.filter((p) => p !== perm)
                                              if (newPerms.length > 0) {
                                                updatedDisabled.push({
                                                  ...existing,
                                                  permissions: newPerms,
                                                })
                                              }
                                            }
                                          }

                                          setFieldValue('disabledModules', updatedDisabled)
                                        }}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  )
}

export default AccessManagement
