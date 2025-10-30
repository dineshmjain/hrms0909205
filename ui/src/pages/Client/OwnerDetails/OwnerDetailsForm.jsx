import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import FormikInput from '../../../components/Input/FormikInput';
import SubCardHeader from '../../../components/header/SubCardHeader';
import { getTypeOfIndustyAction } from '../../../redux/Action/Global/GlobalAction';
import { useFormikContext } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { clientOwnerGetAction } from '../../../redux/Action/Client/ClientAction';

// ✅ Exporting field config for Formik in parent
export const OwnerConfig = () => {
    return {
        initialValues: {
            firstName: "",
            lastName: "",
            mobile: "",
            isEdit: false
        },
        validationSchema: {
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            mobile: Yup.string().matches('^[6-9][0-9]{9}$', 'Not a valid Mobile Number').required('Mobile Number is required'),


        },
    };
};

// ✅ React component
const OwnerDetailsForm = ({ isEditAvaliable = false }) => {
    const dispatch = useDispatch();
    const { state } = useLocation()
    // ✅ Use Redux state correctly
    const { typeOfIndustries = [] } = useSelector((state) => state.global);
    const { values, setFieldValue } = useFormikContext();
    const { ownerDetails } = useSelector((state) => state?.client)
    useEffect(() => {
        if (state) {
            setFieldValue('clientId', state?.clientId)
            dispatch(clientOwnerGetAction({ clientId: state?.clientId })).then(({ payload }) => {
                setFieldValue('firstName', payload?.data?.name?.firstName)
                setFieldValue('lastName', payload?.data?.name?.lastName)
                setFieldValue('mobile', payload?.data?.mobile)
                setFieldValue('email', payload?.data?.email)
                setFieldValue('relationshipToOrg', payload?.data?.relationshipToOrg)
                setFieldValue('clientId', state?.clientId)
                setFieldValue('_id', payload?.data?._id)
            })
        }


    }, [state?.clientId, dispatch])



    return (
        <div className="w-full p-2">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <FormikInput
                    name="firstName"
                    size="sm"
                    label={"First Name"}
                    type="text"
                    inputType={isEditAvaliable ? 'edit' : 'input'}
                    editValue={values?.firstName}
                />
                <FormikInput
                    name="lastName"
                    size="sm"
                    label={"Last Name"}
                    type="text"
                    inputType={isEditAvaliable ? 'edit' : 'input'}
                    editValue={values?.lastName} />
                <FormikInput
                    name="mobile"
                    size="sm"
                    label={"Mobile Number"}
                    type="number"
                    inputType={isEditAvaliable ? 'edit' : 'input'}
                    editValue={values?.mobile} />
                <FormikInput
                    name="email"
                    size="sm"
                    label={"Email"}
                    type="text"
                    inputType={isEditAvaliable ? 'edit' : 'input'}
                     editValue={values?.email}
                />
                <FormikInput
                    name="relationshipToOrg"
                    size="sm"
                    label={"Designation"}
                    type="text"
                    inputType={isEditAvaliable ? 'edit' : 'input'}
                     editValue={values?.relationshipToOrg}
                />

            </div>
        </div>
    );
};

export default OwnerDetailsForm;
