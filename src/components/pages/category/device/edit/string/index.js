import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import DeviceService from "../../../../../../services/DeviceService";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { Switch, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import CustomerService from "../../../../../../services/CustomerService";
import SystemTypeService from "../../../../../../services/SystemTypeService";
import DeviceTypeService from "../../../../../../services/DeviceTypeService";
import AreaService from "../../../../../../services/AreaService";
import ProjectService from "../../../../../../services/ProjectService";
import CONS from "../../../../../../constants/constant";
import ObjectService from "../../../../../../services/ObjectService";
import $ from "jquery";
import SystemMapService from "../../../../../../services/SystemMapService";


const StringPV = (props) => {
    const initialValues = {
        deviceCode: props.device.deviceCode,
        deviceName: props.device.deviceName,
        deviceTypeId: props.device.deviceTypeId,
        systemTypeId: props.device.systemTypeId,
        address: props.device.address,
        latitude: props.device.latitude,
        longitude: props.device.longitude,
        projectId: props.device.projectId,
        customerId: props.device.customerId,
        managerId: props.device.managerId,
        areaId: props.device.areaId,
        objectId: props.device.objectId,
        location: props.device.location,
        uid: props.device.uid,
        model: props.device.model,
        dbId: props.device.dbId,
        description: props.device.description,
        manufacturer: props.device.manufacturer,
        p_max: props.device.p_max,
        vmp: props.device.vmp,
        imp: props.device.imp,
        voc: props.device.voc,
        isc: props.device.isc,
        gstc: props.device.gstc,
        tstc: props.device.tstc,
        gnoct: props.device.gnoct,
        tnoct: props.device.tnoct,
        cp_max: props.device.cp_max,
        cvoc: props.device.cvoc,
        cisc: props.device.cisc,
        ns: props.device.ns,
        sensor_radiation_id: props.device.sensor_radiation_id,
        sensor_temperature_id: props.device.sensor_temperature_id,
        eff: props.device.eff,
        reference_device_id: props.device.reference_device_id,
        work_date: props.device.work_date
    }
    const [systemTypes, setSystemTypes] = useState([]);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [cutomers, setCustomers] = useState([]);
    const [areas, setAreas] = useState([]);
    const [managers, setManagers] = useState([]);
    const [projects, setProjects] = useState([]);
    const { t } = useTranslation();
    const [errorsValidate, setErrorsValidate] = useState([]);
    const [error, setError] = useState(null);
    const [customer, setCustomer] = useState([]);
    const [objects, setObjects] = useState([]);
    const [deviceGateway, setDeviceGateway] = useState([]);

    const history = useHistory();

    const getInfoAdd = async () => {
        let responseCustomer = await CustomerService.getListCustomer()
        setCustomer(responseCustomer.data)
        let resSystemTypes = await SystemTypeService.listSystemType();
        setSystemTypes(resSystemTypes.data);
        let resDeviceTypes = await DeviceTypeService.listDeviceType();
        setDeviceTypes(resDeviceTypes.data);
        let resCustomers = await CustomerService.getListCustomer();
        setCustomers(resCustomers.data);
        let resAreas = await AreaService.listArea();
        setAreas(resAreas.data.areas);
        setManagers(resAreas.data.managers);
        let resProjects = await ProjectService.listProject();
        setProjects(resProjects.data);
        let resObject = await ObjectService.getListObjectMst();
        setObjects(resObject.data);
        let resDevice = await DeviceService.getDeviceGateway();
        setDeviceGateway(resDevice.data);
    }

    const closeModal = () => {
        let isCloseModal = false;
        props.parentCallback(isCloseModal)
    }

    const addDevice = () => {
        $.confirm({
            type: 'green',
            typeAnimated: true,
            icon: 'fa fa-success',
            title: t('content.notification'),
            content: t('content.category.device.list.edit_success'),
            buttons: {
                confirm: {
                    text: "<i class=\"fa-solid fa-arrow-rotate-left\"></i>" + t('content.category.device.list.title'),
                    action: async function () {
                        history.push({
                            pathname: "/category/device",
                            state: {
                                status: 200,
                                message: "UPDATE_SUCCESS"
                            }
                        });
                        closeModal();
                    }
                }
            }
        });
    }
    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        onSubmit: async (data) => {
            let res = await DeviceService.updateDevice(props.id, data);
            if (res.status === 200) {
                addDevice();
                let deviceRes = await DeviceService.detailsDevice(props.id);
                if (deviceRes.data.systemMapId != null) {
                    let data = await SystemMapService.getSystemMap(deviceRes.data.systemMapId);
                    let systemMapsResponse = data.data

                    let systemMapJsonData = JSON.parse(systemMapsResponse.jsonData);

                    if (systemMapJsonData != null && systemMapJsonData != "") {
                        for (let i = 0; i < systemMapJsonData.aCards.length; i++) {
                            if (typeof systemMapJsonData.aCards[i].deviceId !== "undefined" && systemMapJsonData.aCards[i].deviceId != "") {
                                if (Number(systemMapJsonData.aCards[i].deviceId) == Number(props.id)) {
                                    systemMapJsonData.aCards[i].deviceName = deviceRes.data.deviceName
                                }
                            }

                        }
                    }

                    systemMapsResponse.jsonData = JSON.stringify(systemMapJsonData);
                    await SystemMapService.updateSystemDevice(systemMapsResponse);
                }
            } else if (res.status === 400) {
                setErrorsValidate(res.data.errors);

            } else if (res.status === 500) {
                setError(t('validate.customer.INSERT_FAILED'));

            }
        }
    })


    useEffect(() => {
        getInfoAdd();
    }, [])

    return (
        <>
            {
                (error != null) &&
                <div className="alert alert-danger" role="alert">
                    <p className="m-0 p-0">{t('content.category.device.add.error_edit')}</p>
                </div>
            }
            {
                (errorsValidate.length > 0) &&
                <div className="alert alert-warning" role="alert">
                    {
                        errorsValidate.map((error, index) => {
                            return (<p key={index + 1} className="m-0 p-0">{error}</p>)
                        })
                    }
                </div>
            }
            <form onSubmit={formik.handleSubmit}>

                <table className={`table table-input `}>
                    <tbody>
                        <tr>
                            <th width="250px">{t('content.customer')} </th>
                            <td>
                                <select className="custom-select block customer-id" id="customer-id" value={props.device.customerId} disabled>
                                    {customer?.length > 0 && customer?.map((c, index) => {
                                        return <option key={index + 1} value={c.customerId}>{c.customerName}</option>
                                    })}
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th width="180px">{t('content.project')} </th>
                            <td>
                                <select className="custom-select block project-id" id="project-id" value={props.device.projectId} disabled>
                                    {projects?.length > 0 && projects?.map((p, index) => {
                                        return <option key={index + 1} value={p.projectId}>{p.projectName}</option>
                                    })}
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th width="230px">{t('content.system')}  </th>
                            <td>
                                <select className="custom-select block system-type-id" id="system-type-id" value={props.device.systemTypeId} disabled>
                                    {
                                        systemTypes?.length > 0 && systemTypes?.map((systemType, index) => {
                                            return <option key={index + 1} value={systemType.systemTypeId}>{systemType.systemTypeName}</option>
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th width="180px">{t('content.country')}  </th>
                            <td>
                                <select className="custom-select block country-id" id="country-id" disabled>
                                    <option value="84">Việt Nam</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th width="180px">{t('content.manager')}  </th>
                            <td>
                                <select className="custom-select block manager-id" id="manager-id" value={props.device.managerId} disabled>
                                    {
                                        managers?.length > 0 && managers?.map((manager, index) => {
                                            return <option key={index + 1} value={manager.managerId}>{manager.managerName}</option>
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th width="180px">{t('content.area')}  </th>
                            <td>
                                <select className="custom-select block area-id" id="area-id" value={props.device.areaId} disabled>
                                    {areas?.length > 0 && areas?.map((area, index) => {
                                        return <option key={index + 1} value={area.areaId}>{area.areaName}</option>
                                    })}
                                </select>
                            </td>
                        </tr>
                        <tr className="address">
                            <th>{t('content.address')} </th>
                            <td>
                                <input type="text" className="form-control" name="address" id="address" onChange={formik.handleChange} defaultValue={props.device.address} />
                            </td>
                        </tr>
                        <tr>
                            <th width="300px">{t('content.super_manager')} </th>
                            <td>
                                <input type="text" className="form-control area" name="location" onChange={formik.handleChange} defaultValue={props.device.location} />
                            </td>
                        </tr>
                        <tr className="longitude">
                            <th>{t('content.longitude')} </th>
                            <td>
                                <input type="number" step="0.0000000001" className="form-control input-number-m" name="longitude" id="longitude" onChange={formik.handleChange} defaultValue={props.device.longitude} />
                            </td>
                        </tr>
                        <tr className="latitude">
                            <th>{t('content.latitude')} </th>
                            <td>
                                <input type="number" step="0.0000000001" className="form-control input-number-m" name="latitude" id="latitude" onChange={formik.handleChange} defaultValue={props.device.latitude} />
                            </td>
                        </tr>
                        <tr className="device-name" >
                            <th width="180px">{t('content.category.device.lable_device_name')}<span className="required">※</span></th>
                            <td>
                                <input type="text" onChange={formik.handleChange} className="form-control" name="deviceName" id="deviceName" defaultValue={props.device.deviceName} />
                            </td>
                        </tr>
                        <tr>
                            <th width="180px">{t('content.category.device.lable_device_type')}</th>
                            <td>
                                <select className="custom-select block device-type-id" id="device-type-id" onChange={formik.handleChange} value={props.device.deviceTypeId} disabled>
                                    {
                                        deviceTypes?.length > 0 && deviceTypes?.map((dt, index) => {
                                            return <option key={index + 1} value={dt.id}>{dt.name}</option>
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr className="object-type">
                            <th width="180px">{t('content.object')}</th>
                            <td>
                                <select className="custom-select block object-type-id" id="object-type-id" onChange={formik.handleChange} value={props.device.objectId} disabled>
                                    {
                                        objects?.length > 0 && objects?.map((obj, index) => {
                                            return <option key={index + 1} value={obj.id}>{obj.name}</option>
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr className="deviceCode">
                            <th width="300px">{t('content.category.device.lable_device_id')} (SID)</th>
                            <td>
                                <input type="text" className="form-control" name="deviceCode" id="device-code" defaultValue={props.device.deviceCode} disabled />
                            </td>
                        </tr>
                        <tr>
                            <th>{t('content.category.device.lable_manufacture')}</th>
                            <td>
                                <input type="text" className="form-control" name="manufacturer" id="manufacturer" onChange={formik.handleChange} defaultValue={formik.values.manufacturer} />
                            </td>
                        </tr>
                        <tr className="model">
                            <th>Model</th>
                            <td>
                                <input type="text" className="form-control" name="model" id="model" onChange={formik.handleChange} defaultValue={formik.values.model} />
                            </td>
                        </tr>
                        <tr className="p_max">
                            <th>{t('content.category.device.power_max')}</th>
                            <td>
                                <input type="number" className="form-control input-number-m" name="p_max" id="p_max" onChange={formik.handleChange} defaultValue={formik.values.p_max} />
                            </td>
                        </tr>
                        <tr className="vmp">
                            <th id="lb-imccb">{t('content.category.device.rated_voltage')} Vmp [V]</th>
                            <td>
                                <input type="number" className="form-control input-number-m" name="vmp" id="vmp" onChange={formik.handleChange} defaultValue={formik.values.vmp} />
                            </td>
                        </tr>
                        <tr className="imp">
                            <th id="lb-imccb">{t('content.category.device.rated_voltage')} Imp [A]</th>
                            <td>
                                <input type="number" className="form-control input-number-m" name="imp" id="imp" onChange={formik.handleChange} defaultValue={formik.values.imp} />
                            </td>
                        </tr>
                        <tr className="voc">
                            <th id="lb-imccb">{t('content.category.device.open_circuit_voltage')} Voc [V]</th>
                            <td>
                                <input type="number" className="form-control input-number-m" name="voc" id="voc" onChange={formik.handleChange} defaultValue={formik.values.voc} />
                            </td>
                        </tr>
                        <tr className="isc">
                            <th id="lb-imccb">{t('content.category.device.short_circuit_voltage')} Isc [A]</th>
                            <td>
                                <input type="number" className="form-control input-number-m" name="isc" id="isc" onChange={formik.handleChange} defaultValue={formik.values.isc} />
                            </td>
                        </tr>
                        <tr className="eff string">
                            <th>{t('content.category.device.efficiency')}</th>
                            <td>
                                <input type="number" className="form-control" name="eff" id="eff" onChange={formik.handleChange} defaultValue={formik.values.eff} />
                            </td>
                        </tr>
                        <tr className="gstc">
                            <th>{t('content.category.device.radiation')} STC [W/m2]</th>
                            <td>
                                <input type="number" className="form-control" name="gstc" id="gstc" onChange={formik.handleChange} defaultValue={formik.values.gstc} />
                            </td>
                        </tr>
                        <tr className="tstc">
                            <th>{t('content.category.device.temperature')} STC [oC]</th>
                            <td>
                                <input type="number" className="form-control" name="tstc" id="tstc" onChange={formik.handleChange} defaultValue={formik.values.tstc} />
                            </td>
                        </tr>
                        <tr className="gnoct">
                            <th>{t('content.category.device.radiation')} NOCT [W/m2]</th>
                            <td>
                                <input type="number" className="form-control" name="gnoct" id="gnoct" onChange={formik.handleChange} defaultValue={formik.values.gnoct} />
                            </td>
                        </tr>
                        <tr className="tnoct">
                            <th>{t('content.category.device.temperature')} NOCT [oC]</th>
                            <td>
                                <input type="number" className="form-control" name="tnoct" id="tnoct" onChange={formik.handleChange} defaultValue={formik.values.tnoct} />
                            </td>
                        </tr>
                        <tr className="cp_max">
                            <th>{t('content.category.device.temp_coefficient')} Pmax</th>
                            <td>
                                <input type="number" className="form-control" name="cp_max" id="cp_max" onChange={formik.handleChange} defaultValue={formik.values.cp_max} />
                            </td>
                        </tr>
                        <tr className="cvoc">
                            <th>{t('content.category.device.temp_coefficient')} Voc</th>
                            <td>
                                <input type="number" className="form-control" name="cvoc" id="cvoc" onChange={formik.handleChange} defaultValue={formik.values.cvoc} />
                            </td>
                        </tr>
                        <tr className="cisc">
                            <th>{t('content.category.device.temp_coefficient')} Isc</th>
                            <td>
                                <input type="number" className="form-control" name="cisc" id="cisc" onChange={formik.handleChange} defaultValue={formik.values.cisc} />
                            </td>
                        </tr>
                        <tr className="ns">
                            <th>{t('content.category.device.panels_in_series')}</th>
                            <td>
                                <input type="number" className="form-control" name="ns" id="ns" onChange={formik.handleChange} defaultValue={formik.values.ns} />
                            </td>
                        </tr>

                        <tr className="sensor_radiation_id">
                            <th>{t('content.category.device.data_radiation')}</th>
                            <td>
                                <input type="number" className="form-control" name="sensor_radiation_id" id="sensor_radiation_id" onChange={formik.handleChange} defaultValue={formik.values.sensor_radiation_id} />
                            </td>
                        </tr>
                        <tr className="sensor_temperature_id">
                            <th>{t('content.category.device.data_temp')}</th>
                            <td>
                                <input type="number" className="form-control" name="sensor_temperature_id" id="sensor_temperature_id" onChange={formik.handleChange} defaultValue={formik.values.sensor_temperature_id} />
                            </td>
                        </tr>
                        <tr className="reference_device_id">
                            <th>{t('content.category.device.connect_device')}</th>
                            <td>
                                <select className="custom-select block system-type-id" name="reference_device_id" id="reference_device_id" defaultValue={formik.values.reference_device_id} >
                                    <option value=""></option>
                                    {
                                        deviceGateway?.length > 0 && deviceGateway?.map((device, index) => {
                                            return <option key={index + 1} value={device.deviceId}>{device.deviceName}</option>
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>{t('content.description')}</th>
                            <td>
                                <input type="text" className="form-control" name="description" onChange={formik.handleChange} defaultValue={formik.values.description} />
                            </td>
                        </tr>
                        <tr className="work_date string">
                            <th>{t('content.start_time')}</th>
                            <td>
                                <input type="date" className="form-control" name="work_date" id="work_date" defaultValue={formik.values.work_date} onChange={formik.handleChange}></input>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div id="main-button">
                    <button type="submit" className="btn btn-outline-secondary btn-agree mr-1 mb-3">
                        <i className="fa-solid fa-check"></i>
                    </button>
                    <button type="button" className="btn btn-outline-secondary btn-cancel mb-3" onClick={() => {
                        // history.push("/category/device")
                        closeModal();
                    }}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </form>
        </>
    )
}

export default StringPV;