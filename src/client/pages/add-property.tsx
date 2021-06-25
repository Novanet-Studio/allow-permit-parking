import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';

import * as F from '../components/Form';
// import Table from '../components/Table';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Subheader from '../components/Subheader';
import Breadcrumb from '../components/Breadcrumb';
import WrapperGrid from '../components/WrapperGrid';
import HeadingTable from '../components/HeadingTable';
import DashboardLayout from '../components/DashboardLayout';
import { PropertyModal } from '../components/Modal';

import useUser from '../hooks/use-user';
import useModal from '../hooks/use-modal';
import useProperty from '../hooks/use-property';
import useBuilding from '../hooks/use-building';

import propertyIcon from '../assets/images/app_icon_properties.svg';
import { ESW } from '../../@types/esw';

type PropertyForm = {
  name: string;
  systemType: 'permit' | 'sticker';
};

export default function AddProperty(): JSX.Element {
  const router = useRouter();
  const { user } = useUser();
  const { openModal, isOpenModal, closeModal } = useModal(false);
  const { response: property, createProperty, isLoading } = useProperty();
  const { response: buiding, createBuilding } = useBuilding();
  const formik = useFormik<PropertyForm>({
    initialValues: {
      name: '',
      systemType: 'permit',
    },
    onSubmit: async (values: PropertyForm) => {
      await createProperty({ ...values });
      formik.resetForm();
    },
  });

  const updateBuilding = (e, data: [{ name: string }]) => {
    const residence = property as ESW.Residence;
    data.forEach(
      async (data) => await createBuilding(residence.id, { name: data.name }),
    );
  };

  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }
  }, []);

  return (
    <DashboardLayout showMsg={false}>
      <Breadcrumb />
      <Subheader
        title="Properties"
        icon={propertyIcon}
        iconAlt="property icon"
      />
      <WrapperGrid>
        <HeadingTable title="Add a property" mode="top" />
        {isLoading && <p>Check new content</p>}
        <form className="form" onSubmit={formik.handleSubmit}>
          <F.Group>
            <F.Label text="Property name" htmlFor="property" />
            <F.Input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onFocus={formik.handleBlur}
            />
            <F.Feedback text={formik.errors.name} />
          </F.Group>
          <F.Group>
            <Dropdown
              value={formik.values.systemType}
              onChange={formik.handleChange}
              onFocus={formik.handleBlur}
            />
          </F.Group>
          <button type="submit" hidden></button>
        </form>

        {/* Set apartments */}

        <HeadingTable title="Set apartments" />
        {/* <Table /> */}
        <Button mode="plus" onClick={() => openModal()} />
        <PropertyModal
          title="Add building"
          inputLabel="Building name"
          buttonText="Add building"
          isOpenModal={isOpenModal}
          closeModal={closeModal}
          onUpdate={updateBuilding}
        />

        {/* Set Parking Slots */}
        <HeadingTable title="Set parking slots" subtitle="Continuous serial" />

        <form className="form form--three-columns">
          <div className="form__group form__group--range">
            <label className="form__label">Starting number</label>
            <input className="form__input" type="text" />
          </div>
          <div className="form__group form__group--range">
            <label className="form__label">Ending number</label>
            <input className="form__input" type="text" />
          </div>
        </form>

        {/* Custom serial */}
        <HeadingTable subtitle="Custom serial" />

        <form className="form form--three-columns">
          <div className="form__group form__group--range">
            <label className="form__label">Prefix</label>
            <input className="form__input" type="text" />
          </div>
          <div className="form__group form__group--range">
            <label className="form__label">Starting number</label>
            <input className="form__input" type="text" />
          </div>
          <div className="form__group form__group--range">
            <label className="form__label">Ending number</label>
            <input className="form__input" type="text" />
          </div>
        </form>
        <Button mode="plus" />
        <div className="table__button-wrapper">
          <Button mode="top">Add property</Button>
        </div>
      </WrapperGrid>
    </DashboardLayout>
  );
}
