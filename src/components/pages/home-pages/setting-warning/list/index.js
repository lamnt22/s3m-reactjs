import React, { useEffect, useState } from "react";
import CustomerService from "../../../../../services/CustomerService";
import ProjectService from "../../../../../services/ProjectService";
import $ from "jquery";
import SettingService from "../../../../../services/SettingService";
import CONS from "../../../../../constants/constant";
import moment from "moment";
import { Link, useHistory, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import authService from "../../../../../services/AuthService";
import { useTranslation } from "react-i18next";
import "./index.css"

const ListSetting = ({ ids }) => {

    const param = useParams();
    const { t } = useTranslation();
    const [customers, setCustomers] = useState([]);
    const [settings, setSettings] = useState([]);
    const [customerId, setCustomerId] = useState(0);
    const [projectId, setProjectId] = useState(0);
    const [typeSystem, setTypeSystem] = useState(0);
    const [projects, setProjects] = useState(0);
    const [status, setStatus] = useState(null);
    const location = useLocation();
    const history = useHistory();
    const [role, setRole] = useState("");

    const getRole = () => {
        let roleName = authService.getRoleName();
        setRole(roleName);
    }

    const getInfoAdd = async () => {
        listProject(ids.idProject, ids.typeSystem);
    }

    const listProject = async (idsIdproject, idsTypeSystem) => {
        let customerId = param.customerId;
        if (customerId != null && parseInt(customerId) > 0) {
            setCustomerId(customerId);
            let res = await ProjectService.getProjectByCustomerId(customerId);
            if (res.data.length > 0) {
                setProjects(() => res.data)
                if (idsIdproject != null) {
                    setProjectId(idsIdproject)
                    setTypeSystem(idsTypeSystem);
                } else {
                    let projectId = res.data[0].projectId;
                    idsIdproject = projectId
                    idsTypeSystem = 1
                    setProjectId(projectId)
                    setTypeSystem(1);
                }
                let resSetting = await SettingService.listSetting(customerId, idsIdproject, idsTypeSystem);
                if (resSetting.status === 200 && parseInt(resSetting.data.length) > 0) {
                    setSettings(resSetting.data);
                } else {
                    setSettings([]);
                }
            }
        }
    }

    const listSetting = async (type) => {
        let customerId = param.customerId;
        setCustomerId(customerId);
        if (type === null || type === undefined) {
            type = 1;
        }
        setTypeSystem(type);
        let res = await SettingService.listSetting(customerId, projectId, type);
        if (res.status === 200 && parseInt(res.data.length) > 0) {
            setSettings(res.data);
        } else {
            setSettings([]);
        }
    }

    const listSettingProject = async (projectId, typeSystem) => {
        let customerId = param.customerId;
        setCustomerId(customerId);
        setProjectId(projectId)
        if (typeSystem === null) {
            typeSystem = 1;
        }
        let res = await SettingService.listSetting(customerId, projectId, typeSystem);
        if (res.status === 200 && parseInt(res.data.length) > 0) {
            setSettings(res.data);
        } else {
            setSettings([]);
        }
    }

    const setNotification = state => {
        if (state?.status === 200 && state?.message === "INSERT_SUCCESS") {
            setStatus({
                code: 200,
                message: "Thêm mới cài đặt thành công"
            });
        } else if (state?.status === 200 && state?.message === "UPDATE_SUCCESS") {
            setStatus({
                code: 200,
                message: "Chỉnh sửa cài đặt thành công"
            });
        }
        setTimeout(() => {
            setStatus(null);
        }, 3000);
    };

    useEffect(() => {
        document.title = "Danh sách cài đặt";
        if (location.state) {
            setNotification(location.state);
        };
        getInfoAdd();
        getRole();
    }, [param.customerId]);

    return (
        <div>
            <div className="title-up-warning text-left">
                <div style={{ marginTop: "-21px", color: "white" }}><i className="fa-solid fa-triangle-exclamation ml-1" style={{ color: "#fff" }}></i> {t('content.home_page.warning_setting.title')}
                </div>
            </div>
            <div className="note">
                <div>
                    <div className="icon-note">
                        <i className="fa-solid ml-1 fa-circle-info"></i>
                    </div>
                    <div className={"level3 text-note"}></div>
                    <div className="text-note-content">{t('content.home_page.warning_setting.high')}</div>

                    <div className={"level2 text-note"}></div>
                    <div className="text-note-content">{t('content.home_page.warning_setting.medium')}</div>

                    <div className={"level1 text-note"}> </div>
                    <div className="text-note-content">{t('content.home_page.warning_setting.low')}</div>

                </div>
            </div>
            <div id="" className="mt-1">
                <div id="" style={{ height: 32 }}>
                    <div className="div-left-setting-warning">
                        {projects.length > 0 ?
                            <>
                                {
                                    projects.length > 0 && projects?.map((item, index) => (
                                        <button key={index} className={(projectId === index && index === 0) || (projectId == item.projectId) ? "btn btn-block text-left btn-site-warning-active mb-1" : "btn btn-block text-left btn-site-warning mb-1"} data-bs-toggle="tooltip" data-bs-placement="right" title={item.projectName} onClick={() => listSettingProject(item.projectId, typeSystem)}>
                                            <img src="/resources/image/icon-th-solid.svg" style={{ height: "20px" }}></img> &nbsp; <span className="text-white">{item.projectName}</span>
                                        </button>
                                    ))
                                }
                            </> :
                            <>
                                <div>
                                    <div className="loading" style={{ marginTop: "10%", marginLeft: "40%" }}>
                                        <img height="60px" src="/resources/image/loading2.gif" alt="loading" />
                                    </div>
                                    <div className="text-center loading-chart mt-1">{t('content.home_page.warning_setting.no_data')}</div>
                                </div>
                            </>
                        }
                    </div>
                    <div className="div-right-setting-warning">
                        <div className="input-group float-left mr-1" style={{ width: "500px", marginLeft: "8px" }}>
                            <div className="system-type">
                                <div className="radio-tabs">
                                    <label className="radio-tabs__field" >
                                        <input type="radio" name="radio-tabs" value={1} className="radio-tabs__input" defaultChecked={ids.typeSystem === undefined || ids.typeSystem === 1 ? true : false} onChange={() => listSetting(1)} />
                                        <span className="radio-tabs__text">
                                            <img src="/resources/image/icon-load-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                            {t('content.home_page.load')}</span>
                                    </label>
                                    <label className="radio-tabs__field" >
                                        <input type="radio" name="radio-tabs" value={2} className="radio-tabs__input" defaultChecked={ids.typeSystem === 2 ? true : false} onChange={() => listSetting(2)} />
                                        <span className="radio-tabs__text">
                                            <img src="/resources/image/icon-solar-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                            {t('content.home_page.solar')}</span>
                                    </label>
                                    <label className="radio-tabs__field" >
                                        <input type="radio" name="radio-tabs" value={5} className="radio-tabs__input" defaultChecked={ids.typeSystem === 5 ? true : false} onChange={() => listSetting(5)} />
                                        <span className="radio-tabs__text">
                                            <img src="/resources/image/icon-grid-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                            {t('content.home_page.grid')}</span>
                                    </label>
                                    <label className="radio-tabs__field">
                                        <input type="radio" name="radio-tabs" value={3} className="radio-tabs__input" defaultChecked={ids.typeSystem === 4 ? true : false} onChange={() => listSetting(4)} />
                                        <span className="radio-tabs__text">
                                            <img src="/resources/image/icon-battery-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                            {t('content.home_page.battery')}</span>
                                    </label>
                                    <label className="radio-tabs__field">
                                        <input type="radio" name="radio-tabs" value={4} className="radio-tabs__input" defaultChecked={ids.typeSystem === 3 ? true : false} onChange={() => listSetting(3)} />
                                        <span className="radio-tabs__text">
                                            <img src="/resources/image/icon-wind-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                            {t('content.home_page.wind')}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {
                            status != null &&
                            <div>
                                {
                                    status.code === 200 ?
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                                            <p className="m-0 p-0">{status?.message}</p>
                                        </div> :
                                        <div className="alert alert-warning" role="alert">
                                            <p className="m-0 p-0">{status?.message}</p>
                                        </div>
                                }
                            </div>

                        }
                        <div id="main-content">
                            <table className="table">
                                <thead height="30px">
                                    <tr>
                                        <th width="40px">TT</th>
                                        <th width="370px">{t('content.home_page.warning_setting.setting')}</th>
                                        <th width="130px">{t('content.home_page.warning_setting.warning_level')}</th>
                                        <th width="130px">{t('content.home_page.warning_setting.value')}</th>
                                        <th>{t('content.home_page.warning_setting.description')}</th>
                                        <th width="150px">{t('content.home_page.warning_setting.update_date')}</th>
                                        <th width="40px"><i className="fa-regular fa-hand"></i></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        parseInt(settings?.length) > 0 && settings?.map((setting, index) => {
                                            return (
                                                <tr key={setting.settingId} height="25px">
                                                    <td className="text-center">{setting.warningType}</td>
                                                    <td style={{ wordWrap: "break-word" }}>{setting.settingMstName}</td>
                                                    <td style={{ wordWrap: "break-word" }}>
                                                        <div className={"level" + setting.warningLevel}>
                                                        </div>
                                                    </td>
                                                    <td style={{ wordWrap: "break-word" }}>{setting.settingValue}</td>
                                                    <td style={{ wordWrap: "break-word" }}>{setting.description}</td>
                                                    <td className="text-center">{moment(setting.updateDate).format(CONS.DATE_FORMAT)}</td>
                                                    <td className="text-center">
                                                        {
                                                            (role === "ROLE_ADMIN" || role === "ROLE_MOD") &&
                                                            <Link className="button-icon" to={`/${customerId}/setting-warning/${setting.settingId}/edit`} title="Chỉnh sửa">
                                                                <i className="fas fa-edit" style={{ color: "#F37021" }}></i>
                                                            </Link>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    {
                                        parseInt(settings?.length) === 0 &&
                                        <tr>
                                            <td colSpan={7} className="text-center">{t('content.home_page.warning_setting.no_data')}</td>
                                        </tr>
                                    }
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListSetting;