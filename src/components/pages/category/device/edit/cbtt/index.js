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


const CBTTAny = (props) => {
    const initialValues = {
        deviceCode: props.device.deviceCode,
        deviceName: props.device.deviceName,
        deviceType: props.device.deviceType,
        systemTypeId: props.device.systemTypeId,
        address: props.device.address,
        latitude: props.device.latitude,
        longitude: props.device.longitude,
        projectId: props.device.projectId,
        customerId: props.device.customerId,
        managerId: props.device.managerId,
        areaId: props.device.areaId,
        objectId: props.device.objectTypeId,
        location: props.device.location,
        model: props.device.model,
        dbId: props.device.dbId,
        description: props.device.description,
        manufacturer: props.device.manufacturer,
        reference_device_id: props.device.reference_device_id,
        work_date: props.device.work_date,
    }
    const [systemTypes, setSystemTypes] = useState([]);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [cutomers, setCustomers] = useState([]);
    const [deviceGateway, setDeviceGateway] = useState([]);
    const [areas, setAreas] = useState([]);
    const [managers, setManagers] = useState([]);
    const [projects, setProjects] = useState([]);
    const { t } = useTranslation();
    const [errorsValidate, setErrorsValidate] = useState([]);
    const [error, setError] = useState(null);
    const [customer, setCustomer] = useState([]);
    const [objects, setObjects] = useState([]);
    const [isShowComponents, setIsShowComponents] = useState(false);

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
            title: "Thông báo",
            content: "Bạn đã cập nhật thiết bị thành công!",
            buttons: {
                confirm: {
                    text: "<i class=\"fa-solid fa-arrow-rotate-left\"></i> Danh sách thiết bị",
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
                    let data = await DeviceService.getSystemMap(deviceRes.data.systemMapId);
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
                    await DeviceService.updateSystemDevice(systemMapsResponse);
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
                    <p className="m-0 p-0">Lỗi phát sinh khi chỉnh sửa thiết bị!</p>
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
                            <th width="180px">Khách hàng1 </th>
                            <td>
                                <select className="custom-select block customer-id" id="customer-id" value={props.device.customerId} onChange={formik.handleChange} disabled>
                                    {customer?.length > 0 && customer?.map((c, index) => {
                                        return <option key={index + 1} value={c.customerId}>{c.customerName}</option>
                                    })}
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th width="180px">Dự án </th>
                            <td>
                                <select className="custom-select block project-id" id="project-id" value={props.device.projectId} onChange={formik.handleChange} disabled>
                                    {projects?.length > 0 && projects?.map((p, index) => {
                                        return <option key={index + 1} value={p.projectId}>{p.projectName}</option>
                                    })}
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th width="230px">Hệ thống </th>
                            <td>
                                <select className="custom-select block system-type-id" id="system-type-id" value={props.device.systemTypeId} onChange={formik.handleChange} disabled>
                                    {
                                        systemTypes?.length > 0 && systemTypes?.map((systemType, index) => {
                                            return <option key={index + 1} value={systemType.systemTypeId}>{systemType.systemTypeName}</option>
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th width="180px">Đất nước </th>
                            <td>
                                <select className="custom-select block country-id" id="country-id" disabled>
                                    <option value="84">Việt Nam</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th width="180px">Tỉnh thành </th>
                            <td>
                                <select className="custom-select block manager-id" id="manager-id" value={props.device.managerId} onChange={formik.handleChange} disabled>
                                    {
                                        managers?.length > 0 && managers?.map((manager, index) => {
                                            return <option key={index + 1} value={manager.managerId}>{manager.managerName}</option>
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th width="180px">Quận huyện </th>
                            <td>
                                <select className="custom-select block area-id" id="area-id" value={props.device.areaId} onChange={formik.handleChange} disabled>
                                    {areas?.length > 0 && areas?.map((area, index) => {
                                        return <option key={index + 1} value={area.areaId}>{area.areaName}</option>
                                    })}
                                </select>
                            </td>
                        </tr>
                        <tr className="address">
                            <th>Địa chỉ</th>
                            <td>
                                <input type="text" className="form-control" name="address" id="address" onChange={formik.handleChange} defaultValue={props.device.address} />
                            </td>
                        </tr>
                        <tr>
                            <th width="300px">Khu vực</th>
                            <td>
                                <input type="text" className="form-control area" name="location" onChange={formik.handleChange} defaultValue={props.device.location} />
                            </td>
                        </tr>
                        <tr className="longitude">
                            <th>Kinh độ</th>
                            <td>
                                <input type="number" step="0.0000000001" className="form-control input-number-m" name="longitude" id="longitude" onChange={formik.handleChange} defaultValue={props.device.longitude} />
                            </td>
                        </tr>
                        <tr className="latitude">
                            <th>Vĩ độ</th>
                            <td>
                                <input type="number" step="0.0000000001" className="form-control input-number-m" name="latitude" id="latitude" onChange={formik.handleChange} defaultValue={props.device.latitude} />
                            </td>
                        </tr>
                        <tr className="device-name" >
                            <th width="180px">Tên thiết bị<span className="required">※</span></th>
                            <td>
                                <input type="text" onChange={formik.handleChange} className="form-control" name="deviceName" id="deviceName" defaultValue={props.device.deviceName} />
                            </td>
                        </tr>
                        <tr>
                            <th width="180px">Loại thiết bị</th>
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
                            <th width="180px">Đối tượng được giám sát</th>
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
                            <th width="300px">Mã thiết bị (SID)</th>
                            <td>
                                <input type="text" className="form-control" name="deviceCode" id="device-code" value={props.device.deviceCode} disabled />
                            </td>
                        </tr>
                        <tr>
                            <th>Hãng sản xuất</th>
                            <td>
                                <input type="text" className="form-control" name="manufacturer" id="manufacturer" onChange={formik.handleChange} value={formik.values.manufacturer} />
                            </td>
                        </tr>
                        <tr className="model">
                            <th>Model</th>
                            <td>
                                <input type="text" className="form-control" name="model" id="model" onChange={formik.handleChange} value={formik.values.model} />
                            </td>
                        </tr>
                        <tr className="reference_device_id">
                            <th>Thiết bị truyền thông được kết nối</th>
                            <td>
                                <select className="custom-select block system-type-id" name="reference_device_id" id="reference_device_id" defaultValue={formik.values.reference_device_id} onChange={formik.handleChange}>
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
                            <th>Mô tả</th>
                            <td>
                                <input type="text" className="form-control" name="description" onChange={formik.handleChange} value={formik.values.description} />
                            </td>
                        </tr>
                        <tr className="work_date string">
                            <th>Thời gian bắt đầu hoạt động</th>
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

export default CBTTAny;