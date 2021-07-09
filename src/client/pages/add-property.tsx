import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';

import * as F from '../components/Form';
import { PropertyTable } from '../components/Table';
import Button from '../components/Button';
import Success from '../components/Success';
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
import useGenerateInput from '../hooks/use-generate-input';
import range from '../utils/range';

import propertyIcon from '../assets/images/app_icon_properties.svg';
import deleteIcon from '../assets/images/app_icon_delete.svg';

import type { AxiosRequestConfig } from 'axios';
import type { ESW } from '../../@types/esw';

type RequestType = ESW.Building | ESW.Building[];

type PropertyForm = {
  name: string;
  systemType: 'permit' | 'sticker';
};

type DataError = {
  property?: string;
  building?: string;
}

const AppRequestConfig: AxiosRequestConfig = {
  baseURL: '/api/v1',
  method: 'POST',
};

export default function AddProperty(): JSX.Element {
  const [isAdded, setIsAdded] = useState(false);
  const [buildings, setBuildings] = useState<ESW.Building[]>([]);
  const [buildingsData, setBuildingsData] = useState([]);
  const [dataError, setDataError] = useState<DataError | null>(null);
  const [residence, setResidence] = useState(null);
  const div = useRef<HTMLDivElement>();
  const startingContinous = useRef<HTMLInputElement>();
  const endingContinous = useRef<HTMLInputElement>();
  const router = useRouter();
  const { execute, isLoading, error } = useRequest<RequestType>(
    AppRequestConfig,
  );
  const { user } = useUser();
  const { openModal, isOpenModal, closeModal } = useModal(false);
  const {
    inputs,
    // handleInputChange,
    handleClick,
    handleRemove,
    reset,
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
      try {
        const response = await execute('/residence', { ...values });
        const data = await response?.data;
        setResidence(data);
      } catch (error) {
        console.log({ error });
      }
    },
  });

  const onUpdateBuilding = async (e, data: [{ name: string }]) => {
    try {
      const buildingsName = data.map(item => item.name);
      setBuildingsData(buildingsName);

      const buildings = data.map(
        async (data) =>
          execute(`building/${residence.id}`, { name: data.name }),
      );

      const apiResponse = await Promise.all(buildings);
      const buildingResponse = apiResponse.map((value) => value.data);

      setBuildings(buildingResponse as ESW.Building[]);
    } catch (error) {
      console.log('from updateBuilding', error);
    } finally {
      closeModal();
      reset();
    }
  };

  const handleOnAddProperty = async () => {
    const parkingSlotsArr = [];
    const continuosRange = range({
      starting: Number(startingContinous.current.value),
      ending: Number(endingContinous.current.value),
    });
    const children = [
      ...((div.current.children as unknown) as HTMLDivElement[]),
    ];

    parkingSlotsArr.push(...continuosRange);

    const elements = children
      .map((item) => item.children)
      .map((item) =>
        [...((item as unknown) as HTMLElement[])].map((el) => {
          const label = el.children[0] as HTMLLabelElement;
          const input = el.children[1] as HTMLInputElement;
          const isButton = !el.className.includes('button');
          const name = label.textContent.toLowerCase();

          const schema = isButton ? { name, value: input.value } : null;

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
    //

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
      setIsAdded(true);
    }
  };

  const onRemoveBuilding = async (id: string) => {
    await execute(`building/${id}`, null, { method: 'DELETE' });
    const response = await execute('building', null, { method: 'GET' });
    const buildingList = await response.data as ESW.Building[];
    setBuildings(buildingList);
  };

  const filterBuildingById = (buildings: ESW.Building[]) => {
    if (!residence || !buildings) {
      return;
    }

    const buildingsFiltred = buildings.filter(
      (building) => building.residenceId === residence.id,
    );

    return buildingsFiltred;
  };

  useEffect(() => {
    if (user === null) {
      router.replace('/login');
    }

    const getBuildings = async () => {
      const response = await execute('building', null, { method: 'GET' });
      const buildingList = await response.data as ESW.Building[];
      setBuildings(buildingList);
    };

    if (error) {      
      const errorMessage = error.response.data.message;
      if (errorMessage.includes(formik.values.name)) {
        formik.setErrors({ name: 'Property already exists' });
        setTimeout(() => {
          formik.setErrors({ name: '' });
        }, 3000);
      }

      if (buildingsData.includes(errorMessage.split(' ')[0]) && !dataError.building) {
        setDataError({ building: errorMessage });
        setTimeout(() => setDataError({ building: '' }), 3000);
        getBuildings();
      }
    }
  }, [router, user, error]);

  if (isAdded) {
    return <Success isSuccess={true} content="Property added successfully" />;
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
        {!buildings.length && <p>Still no buildings</p>}
        <PropertyTable
          headings={['Building ID', 'Apartments', 'Actions']}
          data={filterBuildingById(buildings)}
          onRemoveBuilding={onRemoveBuilding}
        />
        <F.Feedback text={dataError?.building} />
        <Button mode="plus" onClick={() => openModal()} />
        <PropertyModal
          title="Add building"
          inputLabel="Building name"
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
