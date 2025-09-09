import { Form, Formik, useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import AddressNew, { AddressCon } from '../../../components/Address/AddressNew';
import * as Yup from 'yup';
import Header from '../../../components/header/Header';
import {
    getBestGeocoderResult,
    getLocationWithLatLongFull,
    removeEmptyStrings
} from '../../../constants/reusableFun';
import { Circle, GoogleMap, Marker } from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { data } from 'autoprefixer';
import toast from 'react-hot-toast';
import { BranchRadiusUpdateAction } from '../../../redux/Action/Branch/BranchAction';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import BranchRadiusForm from './BranchRadiusForm';




const UpdateBranchRadius = () => {
    const AddressConf = AddressCon();
    const initialValues = {
        panNo: '',
        gstNo: '',
        ...AddressConf
    };

    const validationSchema = Yup.object({
        ...AddressConf.validationSchema
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnMount
            onSubmit={(values) => {
                console.log('Form submitted', values);
            }}
        >
            <BranchRadiusForm />
        </Formik>
    );
};

export default UpdateBranchRadius;
