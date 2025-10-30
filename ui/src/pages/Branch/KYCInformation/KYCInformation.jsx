// KYCInformation.js
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import FormikInput from '../../../components/Input/FormikInput';
import SubCardHeader from '../../../components/header/SubCardHeader';
import { SubOrgListAction } from '../../../redux/Action/SubOrgAction/SubOrgAction';
import AddressNew, { AddressCon } from '../../../components/Address/AddressNew';
import Header from '../../../components/header/Header';
import { useLocation } from 'react-router-dom';
import { BranchKycGetAction } from '../../../redux/Action/Branch/BranchAction';
import KYCInformationForm from './KyCInfromationForm';


const AddressConf = AddressCon();

const initialValues = {
  panNo: '',
  gstNo: '',
  ...AddressConf.initialValues
};

const validationSchema = Yup.object({
  ...AddressConf.validationSchema,
  panNo: Yup.string().required('PAN No is required'),
  gstNo: Yup.string().required('GST No is required'),
});

const KYCInformation = () => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log('✅ Submitted values:', values);
      }}
      validateOnMount
    >
      <KYCInformationForm />
    </Formik>
  );
};

export default KYCInformation;
