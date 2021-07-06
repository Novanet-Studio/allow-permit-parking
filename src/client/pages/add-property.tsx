import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';

import * as F from '../components/Form';
import { PropertyTable } from '../components/Table';
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
import useRequest from '../hooks/use-request';
import useProperty from '../hooks/use-property';
import useBuilding from '../hooks/use-building';
import useGenerateInput from '../hooks/use-generate-input';
import range from '../utils/range';

import propertyIcon from '../assets/images/app_icon_properties.svg';
import deleteIcon from '../assets/images/app_icon_delete.svg';

import type { AxiosRequestConfig } from 'axios';
import type { ESW } from '../../@types/esw';

type PropertyForm = {
  name: string;
  systemType: 'permit' | 'sticker';
};

const AppRequestConfig: AxiosRequestConfig = {
  method: 'POST',
};

export default function AddProperty(): JSX.Element {
  const [isAdded, setIsAdded] = useState(false);
  const [buildings, setBuildings] = useState(null);
  const div = useRef<HTMLDivElement>();
  const startingContinous = useRef<HTMLInputElement>();
  const endingContinous = useRef<HTMLInputElement>();
  const router = useRouter();
  const { execute, isLoading } = useRequest(AppRequestConfig);
  const { user } = useUser();
  const { openModal, isOpenModal, closeModal } = useModal(false);
  const { response: property, createProperty } = useProperty<ESW.Residence>();
  const {
    buildings: allBuildings,
    updateBuildings,
    createBuilding,
  } = useBuilding<ESW.Building>();
  const {
    inputs,
    // handleInputChange,
    handleClick,
    handleRemove,
    // reset,
  } = useGenerateInput<{ type: string; value: string }>({
    type: '',
    value: '',
  });
  const formik = useFormik<PropertyForm>({
    initialValues: {
      name: '',
      systemType: 'permit',
    },
    onSubmit: async (values: PropertyForm) => {
      await createProperty({ ...values });
    },
  });

  const onUpdateBuilding = async (e, data: [{ name: string }]) => {
    const residence = property;
    try {
      const buildings = data.map(
        async (data) => await createBuilding(residence.id, { name: data.name }),
      );

      const response = await Promise.all(buildings);
      const dataResponse = response.map((value) => value.data);

      updateBuildings(dataResponse);

      closeModal();
    } catch (error) {
      throw new Error(error);
    } finally {
      closeModal();
    }
  };

  const handleOnAddProperty = async () => {
    const residence = property;
    const parkingSlotsArr = [];
    const continuosRange = range({
      starting: Number(startingContinous.current.value),
      ending: Number(endingContinous.current.value),
    });
    const children = [...div.current.children];

    parkingSlotsArr.push(...continuosRange);

    const elements = children
      .map((item) => item.children)
      .map((item) =>
        [...item].map((el) => {
          const label = el.children[0] as HTMLLabelElement;
          const input = el.children[1] as HTMLInputElement;
          const schema = !el.className.includes('button')
            ? {
                name: label.textContent.toLowerCase(),
                value: input.value,
              }
            : null;

          return schema;
        }),
      )
      .map((response) => response.filter((value) => value))
      .map((result) => result);

    elements.forEach((item) => {
      const prefix = item[0].value;
      const starting = +item[1].value;
      const ending = +item[2].value;

      const customRange = range({ prefix, starting, ending });

      parkingSlotsArr.push(...customRange);
    });

    if (parkingSlotsArr[0] === '0') {
      parkingSlotsArr.shift();
    }

    // if (prefix.current.value) {
    //   const customRange = range({
    //     starting: Number(startingCustom.current.value),
    //     ending: Number(endingCustom.current.value),
    //     prefix: prefix.current.value,
    //   });

    //   parkingSlotsArr.push(...customRange);
    // }

    const parkingSlots = parkingSlotsArr.map(
      async (value) =>
        await execute(`parking/slots/${residence.id}`, {
          name: value,
          parkingType: 'permit',
          isAvailable: true,
        }),
    );

    const response = await Promise.all(parkingSlots);
    const parkingSlotResponse = response.map((value) => value.data);

    if (parkingSlotResponse.length) {
      console.log(parkingSlotResponse);
      setIsAdded(true);
    }
  };

  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }

    const getBuildingsById = () => {
      if (!property) {
        return;
      }

      const buildingsFiltred = allBuildings.filter(
        (building) => building.residenceId === property.id,
      );

      setBuildings(buildingsFiltred);
    };

    getBuildingsById();
  }, [router, user, allBuildings]);

  if (isAdded) {
    alert('New property added!');
    router.replace('/');
  }

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
        <PropertyTable
          headings={['Building ID', 'Apartments']}
          data={buildings}
        />
        <Button mode="plus" onClick={() => openModal()} />
        <PropertyModal
          title="Add building"
          inputLabel="Building name"
          buttonText="Add building"
          isOpenModal={isOpenModal}
          closeModal={closeModal}
          onUpdate={onUpdateBuilding}
        />

        {/* Set Parking Slots */}
        <HeadingTable title="Set parking slots" subtitle="Continuous serial" />

        <form className="form form--three-columns">
          <div className="form__group form__group--range">
            <label className="form__label">Starting number</label>
            <input
              className="form__input"
              type="number"
              ref={startingContinous}
            />
          </div>
          <div className="form__group form__group--range">
            <label className="form__label">Ending number</label>
            <input
              className="form__input"
              type="number"
              ref={endingContinous}
            />
          </div>
        </form>

        {/* Custom serial */}
        <HeadingTable subtitle="Custom serial" />

        <div ref={div}>
          {inputs?.length &&
            inputs.map((input, index) => (
              <div className="form form--three-columns" key={index}>
                <div className="form__group form__group--range">
                  <label className="form__label">Prefix</label>
                  <input className="form__input" type="text" />
                </div>
                <div className="form__group form__group--range">
                  <label className="form__label">Starting number</label>
                  <input className="form__input" type="number" />
                </div>
                <div className="form__group form__group--range">
                  <label className="form__label">Ending number</label>
                  <input className="form__input" type="number" />
                </div>
                {inputs.length !== 1 && (
                  <button
                    className="button button--plus"
                    type="button"
                    onClick={() => handleRemove(index)}
                  >
                    <img
                      className="plus__icon"
                      src={deleteIcon}
                      alt="add icon"
                    />
                  </button>
                )}
              </div>
            ))}
        </div>

        <Button mode="plus" onClick={handleClick} />
        <div className="table__button-wrapper">
          <Button mode="top" onClick={handleOnAddProperty}>
            {isLoading ? 'Adding property' : 'Add property'}
          </Button>
        </div>
      </WrapperGrid>
    </DashboardLayout>
  );
}
