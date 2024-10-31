import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import WarningService from "../../../../../services/WarningService";
import CONS from "../../../../../constants/constant";
import ReactModal from "react-modal";
import AuthService from "../../../../../services/AuthService";
import { useFormik } from 'formik';
import { Link, useLocation } from "react-router-dom";
import { Calendar } from 'primereact/calendar';
import Pagination from "react-js-pagination";
import converter from "../../../../../common/converter";
import authService from "../../../../../services/AuthService";
import { useTranslation } from "react-i18next";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const $ = window.$;

const WarningGrid = ({ customerId, projectId, systemTypeId }) => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [totalPage, setTotalPage] = useState(1);
    const [viewTypeModal, setViewTypeModal] = useState(null);
    const [settingValue, setSettingValue] = useState(null);
    const [isActiveButton, setIsActiveButton] = useState(true);

    const [display, setDisplay] = useState(false)
    const [valueTime, setValueTime] = useState(0);
    const { t } = useTranslation();
    const [warnedDevice, setWarnedDevice] = useState([]);
    const [searchWarnedDevice, setSearchWarnedDevice] = useState([]);
    const [tableOrChart, setTableOrChart] = useState(0);
    const [listWarning, setListWarning] = useState([]);
    const [selectedWarningType, setSelectedWarningType] = useState();

    // total warning state
    const [warnings, setWarnings] = useState({
        canhBao1: 0,
        canhBao2: 0,
        heSoCongSuatThap: 0,
        lechApPha: 0,
        lechPha: 0,
        matNguon: 0,
        nguocPha: 0,
        nguongApCao: 0,
        nguongApThap: 0,
        nguongMeoSongN: 0,
        nguongTongMeoSongHai: 0,
        nhietDoTiepXuc: 0,
        quaDongTiepDia: 0,
        quaDongTrungTinh: 0,
        quaTai: 0,
        tanSoCao: 0,
        tanSoThap: 0
    });

    // Location
    const location = useLocation();

    // active warning state
    const [activeWarning, setActiveWaring] = useState("warning-all");

    // current page state
    const [page, setPage] = useState(1);

    // detail warning
    const [detailWarnings, setDetailWarnings] = useState([]);

    // active modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    // active modal update warning
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

    // update warning state
    const [updateWarning, setUpdateWarning] = useState(null);

    // warning type table
    const [warningType, setWarningType] = useState(0);

    const [inforWarning, setInforWarning] = useState({
        deviceName: "",
        warningTypeName: "",
        value: "-",
        settingValue: "-",
        deviceLevel: "-",
        warningLevel: "-",
        fromDate: "",
        toDate: ""
    });

    const formik = useFormik({
        initialValues: updateWarning,
        enableReinitialize: true,
        onSubmit: async data => {
            let updateWarningData = {
                id: data.warningId,
                status: data.status,
                description: data.description,
                username: AuthService.getAuth().username
            }
            let res = await WarningService.updateWarningCache(updateWarningData, customerId);
            if (res.status === 200) {
                setIsModalUpdateOpen(false);
                deviceWarning(warningType, activeWarning);
            }
        }
    });

    // data load frame warning by warning type
    const [dataLoadFrameWarning, setDataLoadFrameWarning] = useState({
        page: 1,
        totalPage: 1,
        warningType: null,
        data: []
    });

    const getWarning = async (fromTime, toTime) => {
        deviceWarning("ALL", "warning-all", fromTime, toTime);
        let fDate = moment(fromTime).format("YYYY-MM-DD");
        let tDate = moment(toTime).format("YYYY-MM-DD");
        let res = await WarningService.getWarnings(fDate, tDate, projectId, customerId, systemTypeId);
        if (res.status === 200) {
            setWarnings(res.data);
            console.log("Project(CustomerId) warning", res.data);
        }
    }
    const deviceWarning = async (type, idSelector, fromTime, toTime) => {
        $('#warnedDevices').hide();
        $('#warning-loading').show();
        setActiveWaring(idSelector);
        setWarningType(type);
        console.log("Type warning", type);
        let fDate = moment(fromTime).format("YYYY-MM-DD");
        let tDate = moment(toTime).format("YYYY-MM-DD");
        let res = await WarningService.getListWarnedDevice(fDate, tDate, projectId, customerId, systemTypeId, type);
        if (res.status === 200) {
            setWarnedDevice(res.data);
            setSearchWarnedDevice(res.data);
            console.log("device", res.data);
            $('#warning-loading').hide();
            $('#warnedDevices').show();

        }
    }

    const handleClickWarning = async (warningType, deviceId, fromDate, toDate) => {
        let res = await WarningService.showDataWarningByDevice(warningType, fromDate, toDate, deviceId, customerId, page);
        if (res.status === 200) {
            if (warningType !== CONS.WARNING_TYPE.LECH_PHA) {
                setSettingValue(res.data.settingValue);
            } else {
                let values = res.data.settingValue.split(",");
                setSettingValue(values);
            }
            handleSetViewTypeTable(res.data.dataWarning);
            setDataLoadFrameWarning({ ...dataLoadFrameWarning, data: res.data.dataWarning })
            setIsModalOpen(true);

        }
    }

    const handleSetViewTypeTable = (data) => {
        let values = [];

        data.forEach(item => {
            if (item.ep && item.ep > 0) {
                values.push(item.ep);
            }
            if (item.pa && item.pa > 0) {
                values.push(item.pa);
            }
            if (item.pb && item.pb > 0) {
                values.push(item.pb);
            }
            if (item.pc && item.pc > 0) {
                values.push(item.pc);
            }
            if (item.ptotal && item.ptotal > 0) {
                values.push(item.ptotal);
            }
            if (item.qa && item.qa > 0) {
                values.push(item.qa);
            }
            if (item.qb && item.qb > 0) {
                values.push(item.qb);
            }
            if (item.qc && item.qc > 0) {
                values.push(item.qc);
            }
            if (item.qtotal && item.qtotal > 0) {
                values.push(item.qtotal);
            }
            if (item.sa && item.sa > 0) {
                values.push(item.sa);
            }
            if (item.sb && item.sb > 0) {
                values.push(item.sb);
            }
            if (item.sc && item.sc > 0) {
                values.push(item.sc);
            }
            if (item.stotal && item.stotal > 0) {
                values.push(item.stotal);
            }
        });

        let min = Math.min(...values);

        setViewTypeModal(converter.setViewType(values.length > 0 ? min : 0));
    }

    const handleClickUpdate = async (warningId) => {
        let res = await WarningService.getDetailWarningCache(warningId, customerId);
        if (res.status === 200) {
            setUpdateWarning(res.data);
        }
        setIsModalUpdateOpen(true);
    }

    const handleDownloadData = async (warningType, deviceId, fromDate, toDate) => {
        let res = await WarningService.download(warningType, fromDate, toDate, deviceId, customerId, authService.getUserName());
        if (res.status !== 200)
            $.alert("Không có dữ liệu.");
    }

    const setNotification = (state) => {
        if (state?.message === "warning_all") {
            deviceWarning("ALL", "warning-all");
        }
    }

    const handlePagination = async page => {
        setPage(page);
        let fDate = moment(fromDate).format("YYYY-MM-DD");
        let tDate = moment(toDate).format("YYYY-MM-DD");
        let res = await WarningService.getWarningsByType(fDate, tDate, projectId, customerId, warningType, page);
        if (res.status === 200) {
            setDetailWarnings(res.data.data);
            setTotalPage(res.data.totalPage);
        }
    }

    const handleChangeView = (isActive) => {
        setIsActiveButton(!isActive)
        setValueTime(() => 1)
        let fromTime = moment(new Date).format("YYYY-MM-DD") + " 00:00:00"
        let toTime = moment(new Date).format("YYYY-MM-DD") + " 23:59:59"
        setFromDate(fromTime)
        setToDate(toTime)
    }

    const getDataByDate = () => {
        if (fromDate > toDate) {
            console.log("error");
            setDisplay(true)
        } else {
            setDisplay(false)
            let fromTime = moment(fromDate).format("YYYY-MM-DD") + " 00:00:00";
            let toTime = moment(toDate).format("YYYY-MM-DD") + " 23:59:59";
            setFromDate(fromTime)
            setToDate(toTime)
            //     funcGetWarnings(fromTime, toTime, warningLevel, 1, 1, projectId)
            //     funcGetWarningCar(fromTime, toTime, 1, 1, projectId)
            getWarning(fromTime, toTime);
        }
    }

    const onChangeValue = async (e) => {
        let time = e.target.value;
        setValueTime(() => e.target.value)
        const today = new Date();
        let fromTime = "";
        let toTime = "";
        if (time == 2) {
            today.setDate(today.getDate() - 1);
            fromTime = moment(today).format("YYYY-MM-DD") + " 00:00:00";
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
            setFromDate(fromTime)
            setToDate(toTime)

        } else if (time == 3) {
            fromTime = moment(today).format("YYYY-MM") + "-01" + " 00:00:00";
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
            setFromDate(fromTime)
            setToDate(toTime)

        } else if (time == 4) {
            today.setMonth(today.getMonth() - 1);
            fromTime = moment(today).format("YYYY-MM") + "-01" + " 00:00:00";
            /**Xét ngày cuối tháng trước */
            today.setMonth(today.getMonth() + 1)
            let temp = new Date(today.getFullYear() + "-" + today.getMonth() + "-" + "01")
            today.setDate(temp.getDate() - 1);
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
            setFromDate(fromTime)
            setToDate(toTime)

        } else if (time == 5) {
            today.setMonth(today.getMonth() - 3);
            fromTime = moment(today).format("YYYY-MM") + "-01" + " 00:00:00";
            /**Xét ngày cuối 3 tháng trước */
            today.setMonth(today.getMonth() + 3)
            let temp = new Date(today.getFullYear() + "-" + today.getMonth() + "-" + "01")
            today.setDate(temp.getDate() - 1);
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
            setFromDate(fromTime)
            setToDate(toTime)

        } else if (time == 6) {
            today.setMonth(today.getMonth() - 6);
            fromTime = moment(today).format("YYYY-MM") + "-01" + " 00:00:00";
            /**Xét ngày cuối 6 tháng trước */
            today.setMonth(today.getMonth() + 6)
            let temp = new Date(today.getFullYear() + "-" + today.getMonth() + "-" + "01")
            today.setDate(temp.getDate() - 1);
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
            setFromDate(fromTime)
            setToDate(toTime)

        } else if (time == 7) {
            fromTime = moment(today).format("YYYY") + "-01-01" + " 00:00:00";
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
            setFromDate(fromTime)
            setToDate(toTime)

        } else if (time == 8) {
            today.setYear(today.getFullYear() - 1);
            fromTime = moment(today).format("YYYY") + "-01-01" + " 00:00:00";
            /**Xét ngày cuối năm ngoái */
            toTime = moment(today).format("YYYY") + "-12-31" + " 23:59:59";
            setFromDate(fromTime)
            setToDate(toTime)

        } else {
            fromTime = moment(today).format("YYYY-MM-DD") + " 00:00:00";
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
            setFromDate(fromTime)
            setToDate(toTime)
        }
        getWarning(fromTime, toTime);
    }

    const searchDevice = async (e) => {
        let deviceName = e.target.value;
        if (deviceName === "") {
            setSearchWarnedDevice(warnedDevice);
        } else {
            let customerSearch = warnedDevice?.filter(d => d.deviceName.toLowerCase().includes(deviceName.toLowerCase()));
            setSearchWarnedDevice(customerSearch);
        }
    }

    const funcInforWarning = async (warning) => {
        let data = warning;
        let res = await WarningService.getInfoWarnedDevice(customerId, systemTypeId, warning.deviceId, warning.warningType, warning.toDate);
        if (res.status == 200) {
            let dataWarning = res.data.data;
            let setting = res.data.setting;
            let warningType = warning.warningType;
            let settingValue = setting.split(",");
            if (settingValue.length > 1) {
                if (warningType == 530) {
                    settingValue = settingValue[1];
                } else {
                    settingValue = settingValue[0];
                }
            } else {
                if (warningType == 506) {
                    settingValue = parseFloat(settingValue[0]) * parseFloat(dataWarning.imccb);
                }
            }
            let value = "-"
            if (warningType == CONS.WARNING_TYPE_GRID.DO_AM) {
                value = dataWarning.h
            } else if (warningType == CONS.WARNING_TYPE_GRID.PHONG_DIEN) {
                value = dataWarning.indicator;
            } else if (warningType == CONS.WARNING_TYPE_GRID.TAN_SO_THAP) {
                value = dataWarning.f
            } else if (warningType == CONS.WARNING_TYPE_GRID.TAN_SO_CAO) {
                value = dataWarning.f
            } else if (warningType == CONS.WARNING_TYPE_GRID.SONG_HAI) {
                value = Math.max(dataWarning.thdVan, dataWarning.thdVbn, dataWarning.thdVcn);
            } else if (warningType == CONS.WARNING_TYPE_GRID.QUA_TAI_TONG) {
                value = Math.max(dataWarning.ia, dataWarning.ib, dataWarning.ic);
            } else if (warningType == CONS.WARNING_TYPE_GRID.NHIET_DO) {
                value = dataWarning.t
            } else if (warningType == CONS.WARNING_TYPE_GRID.MAT_DIEN_NHANH) {
                value = Math.min(dataWarning.uan, dataWarning.ubn, dataWarning.ucn);
            } else if (warningType == CONS.WARNING_TYPE_GRID.DIEN_AP_CAO) {
                value = Math.max(dataWarning.uan, dataWarning.ubn, dataWarning.ucn);
            } else if (warningType == CONS.WARNING_TYPE_GRID.DIEN_AP_THAP) {
                value = Math.min(dataWarning.uan, dataWarning.ubn, dataWarning.ucn);
            } else if (warningType == CONS.WARNING_TYPE_GRID.HE_SO_CONG_SUAT_THAP) {
                value = Math.min(dataWarning.pfa, dataWarning.pfb, dataWarning.pfc);
            }
            settingValue = { settingValue: settingValue }
            console.log(dataWarning)
            value = { value: value }
            data = { ...data, ...settingValue, ...value }
            funcDrawChart(customerId, warning.deviceId, warning.warningType, warning.toDate, settingValue.settingValue)
        }
        setInforWarning(data)
    }

    const funcDrawChart = async (customerId, deviceId, warningType, toDate, setting) => {
        let res = await WarningService.getListDataWarning(customerId, systemTypeId, deviceId, warningType, toDate);
        if (res.status == 200) {
            setListWarning(res.data.data);
            console.log(res.data.data);
            setSelectedWarningType(warningType);

            drawChart(res.data.data, setting, warningType);
        }
    }

    const drawChart = (dataWarning, settingValue, warningType) => {
        const data = dataWarning.map((item) => {
            return { ...item, settingValue: parseFloat(settingValue) };
        });
        console.log("list Warning", data);
        am5.array.each(am5.registry.rootElements, function (root) {
            if (root) {
                if (root.dom.id == "chartdivWarning") {
                    root.dispose();
                }
            }
        });
        am5.ready(function () {
            var root = am5.Root.new("chartdivWarning");

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            var chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    focusable: true,
                    panX: true,
                    panY: false,
                    heelX: "panX",
                    wheelY: "zoomX",
                    layout: root.verticalLayout

                })
            );

            chart.get("colors").set("colors", [
                am5.color(0xe41a1c),
                am5.color(0x377eb8),
                am5.color(0x4daf4a),
                am5.color(0x984ea3),
                am5.color(0xff7f00),
                am5.color(0xffff33),
                am5.color(0xa65628),
                am5.color(0x999999),
                am5.color(0x66c2a5),
                am5.color(0xfc8d62),
                am5.color(0xe78ac3),
                am5.color(0xa6d854),
                am5.color(0xffd92f),
            ]);

            var easing = am5.ease.linear;

            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                behavior: "none"
            }));
            cursor.lineY.set("visible", false);

            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var xRenderer = am5xy.AxisRendererX.new(root, {
                minGridDistance: 50,
                strokeOpacity: 0.2,
            });
            xRenderer.labels.template.setAll({
                rotation: -30,
                paddingTop: 10,
                paddingRight: 10,
                fontSize: 10
            });
            xRenderer.grid.template.set("forceHidden", true);

            var xAxis = chart.xAxes.push(
                am5xy.CategoryAxis.new(root, {
                    categoryField: "viewTime",
                    renderer: xRenderer,
                    tooltip: am5.Tooltip.new(root, {})
                })
            );

            xAxis.data.setAll(data);

            var yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(root, {
                    maxPrecision: 0,
                    renderer: am5xy.AxisRendererY.new(root, {
                        inversed: false
                    })
                })
            );

            // Add series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

            function createSeries(name, field, checked) {
                var series = chart.series.push(
                    am5xy.LineSeries.new(root, {
                        name: name,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: field,
                        categoryXField: "viewTime",
                        tooltip: am5.Tooltip.new(root, {
                            pointerOrientation: "horizontal",
                            labelText: "[bold]{name}[/]\n{categoryX}: {valueY}"
                        })
                    })
                );
                if (checked) {
                    series.bullets.push(function () {
                        return am5.Bullet.new(root, {
                            sprite: am5.Circle.new(root, {
                                radius: 2,
                                fill: series.get("fill")
                            })
                        });
                    });
                }


                // create hover state for series and for mainContainer, so that when series is hovered,
                // the state would be passed down to the strokes which are in mainContainer.
                series.set("setStateOnChildren", true);
                series.states.create("hover", {});

                series.mainContainer.set("setStateOnChildren", true);
                series.mainContainer.states.create("hover", {});

                series.strokes.template.states.create("hover", {
                    strokeWidth: 4
                });

                series.data.setAll(data);
                series.appear(1000);
            }

            createSeries("Ngưỡng", "settingValue");
            if (warningType == CONS.WARNING_TYPE_GRID.DO_AM) {
                createSeries("H", "h", true);
            } else if (warningType == CONS.WARNING_TYPE_GRID.PHONG_DIEN) {
                createSeries("Indicator", "indicator", true);
            } else if (warningType == CONS.WARNING_TYPE_GRID.TAN_SO_THAP) {
                createSeries("F", "f", true);
            } else if (warningType == CONS.WARNING_TYPE_GRID.TAN_SO_CAO) {
                createSeries("F", "f", true);
            } else if (warningType == CONS.WARNING_TYPE_GRID.SONG_HAI) {
                createSeries("TH_dVan", "thdVan", true);
                createSeries("TH_dVbn", "thdVbn", true);
                createSeries("TH_dVcn", "thdVcn", true);
            } else if (warningType == CONS.WARNING_TYPE_GRID.QUA_TAI_TONG) {
                createSeries("Ia", "ia", true);
                createSeries("Ib", "ib", true);
                createSeries("Ic", "ic", true);
            } else if (warningType == CONS.WARNING_TYPE_GRID.NHIET_DO) {
                createSeries("T", "t", true);
            } else if (warningType == CONS.WARNING_TYPE_GRID.MAT_DIEN_NHANH) {
                createSeries("Uan", "uan", true);
                createSeries("Ubn", "ubn", true);
                createSeries("Ucn", "ucn", true);
            } else if (warningType == CONS.WARNING_TYPE_GRID.DIEN_AP_CAO) {
                createSeries("Uan", "uan", true);
                createSeries("Ubn", "ubn", true);
                createSeries("Ucn", "ucn", true);
            } else if (warningType == CONS.WARNING_TYPE_GRID.DIEN_AP_THAP) {
                createSeries("Uan", "uan", true);
                createSeries("Ubn", "ubn", true);
                createSeries("Ucn", "ucn", true);
            } else if (warningType == CONS.WARNING_TYPE_GRID.HE_SO_CONG_SUAT_THAP) {
                createSeries("PFa", "pfa", true);
                createSeries("PFb", "pfb", true);
                createSeries("PFc", "pfc", true);
            }

            var legend = chart.children.push(
                am5.Legend.new(root, {
                    centerX: am5.p50,
                    x: am5.p50
                })
            );

            // Make series change state when legend item is hovered
            legend.itemContainers.template.states.create("hover", {});

            legend.itemContainers.template.events.on("pointerover", function (e) {
                e.target.dataItem.dataContext.hover();
            });
            legend.itemContainers.template.events.on("pointerout", function (e) {
                e.target.dataItem.dataContext.unhover();
            });

            legend.data.setAll(chart.series.values);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            chart.appear(1000, 100);

        });
    };

    const funcTableOrChart = (e) => {
        setTableOrChart(e)
    }

    useEffect(() => {
        document.title = "Cảnh báo"
        getWarning(fromDate, toDate);
        // if (location.state) {
        //     setNotification(location.state);
        // };
    }, [customerId, projectId]);

    return (
        <div className="mt-2">
            <div>
                {/* <div className="project-infor" style={{ padding: "0px 10px", display: "block", marginTop: "10px" }}>
                    <span className="project-tree">{projectInfo}</span>
                </div> */}
                <div className="content-warning-calendar">
                    <div className="input-group p-1">
                        <div className="input-group-prepend float-left" style={{ zIndex: 0 }}>
                            <button className="btn btn-outline-secondary" title="Kiểu xem" type="button" style={{ backgroundColor: isActiveButton ? "#0a1a5c" : "#e9ecef" }} onClick={() => handleChangeView(isActiveButton)}>
                                <img src="/resources/image/icon-calendar.svg" style={{ height: "18px" }}></img>
                            </button>
                            <button className="btn btn-outline-secondary btn-time" title="Kiểu xem" type="button" style={{ backgroundColor: isActiveButton ? "#e9ecef" : "#0a1a5c" }} onClick={() => handleChangeView(isActiveButton)}>
                                <img src="/resources/image/icon-play.svg" style={{ height: "18px" }}></img>
                            </button>
                        </div>
                        {!isActiveButton && (
                            <div className="input-group float-left mr-1 select-calendar" style={{ width: "100px", marginLeft: 10, height: 34 }}>
                                <select className="form-control select-value"
                                    //onChange={(e) => handleChangeChartType(e.target.value)}
                                    style={{ backgroundColor: "#0a1a5c", borderRadius: 5, border: "1px solid #FFA87D", color: "white" }}
                                    title="Chi tiết"
                                    onChange={onChangeValue}
                                >
                                    <option className="value" key={1} value={1}>Hôm nay</option>
                                    <option className="value" key={2} value={2}>Hôm qua</option>
                                    <option className="value" key={3} value={3}>Tháng này</option>
                                    <option className="value" key={4} value={4}>Tháng trước</option>
                                    <option className="value" key={5} value={5}>3 Tháng trước</option>
                                    <option className="value" key={6} value={6}>6 Tháng trước</option>
                                    <option className="value" key={7} value={7}>Năm nay</option>
                                    <option className="value" key={8} value={8}>Năm trước</option>
                                </select>
                            </div>
                        )}
                        {isActiveButton && (
                            <div className="input-group float-left mr-1 select-time" title="Chi tiết" style={{ width: "300px", marginLeft: 10, height: 34 }}>
                                <button className="form-control button-calendar" readOnly data-toggle="modal" data-target={"#modal-calendar"} style={{ backgroundColor: "#ffffff", border: "1px solid #0A1A5C" }}>
                                    {moment(fromDate).format("YYYY-MM-DD") + " - " + moment(toDate).format("YYYY-MM-DD")}
                                </button>
                                <div className="input-group-append" style={{ zIndex: 0 }}>
                                    <button className="btn button-infor" type="button" data-toggle="modal" data-target={"#modal-calendar"} style={{ fontWeight: "bold", height: 34 }}>......</button>
                                </div>
                            </div>
                        )}
                        <div className="modal fade" id="modal-calendar" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header" style={{ backgroundColor: "#0a1a5c", height: "44px", color: "white" }}>
                                        <h5 style={{ color: "white" }}>CALENDAR</h5>
                                        <button style={{ color: "#fff" }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="input-group float-left mr-1" style={{ width: "270px" }}>
                                            <h5>Từ ngày</h5>
                                            <Calendar
                                                id="from-value"
                                                className="celendar-picker"
                                                dateFormat="yy-mm-dd"
                                                maxDate={(new Date)}
                                                value={fromDate}
                                                onChange={e => setFromDate(e.value)}
                                            />
                                            <div className="input-group-prepend background-ses">
                                                <span className="input-group-text pickericon">
                                                    <span className="far fa-calendar"></span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="input-group float-left mr-1" style={{ width: "270px" }}>
                                            <h5>Đến ngày</h5>
                                            <Calendar
                                                id="to-value"
                                                className="celendar-picker"
                                                dateFormat="yy-mm-dd"
                                                maxDate={(new Date)}
                                                value={toDate}
                                                onChange={e => setToDate(e.value)}
                                            />
                                            <div className="input-group-prepend background-ses">
                                                <span className="input-group-text pickericon" >
                                                    <span className="far fa-calendar"></span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="input-group float-left mr-1">
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Đóng</button>
                                        <button type="button" className="btn btn-primary" onClick={() => getDataByDate()} style={{ backgroundColor: "#0a1a5c", borderColor: "#fff" }}>Lấy dữ liệu</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="content-warning-card mt-2" style={{ overflow: "auto" }}>
                    <div className={`card warning-card float-left ${activeWarning === "warning-1" ? 'warning-active' : ''}`} id="warning-1" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.DO_AM, "warning-1", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-doam.png" alt="Độ ẩm" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.doAm > 0 ? 'numberWarning' : ''}`}>{warnings.doAm ? warnings.doAm : 0}</div>
                                <p>ĐỘ ẨM</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-2" ? 'warning-active' : ''}`} id="warning-2" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.PHONG_DIEN, "warning-2", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-phongdien.png" alt="Phóng điện" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.phongDien > 0 ? 'numberWarning' : ''}`}>{warnings.phongDien ? warnings.phongDien : 0}</div>
                                <p>PHÓNG ĐIỆN</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-3" ? 'warning-active' : ''}`} id="warning-3" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.TAN_SO_THAP, "warning-3", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-tansothap.png" alt="Tần số thấp" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.tanSoThap > 0 ? 'numberWarning' : ''}`}>{warnings.tanSoThap ? warnings.tanSoThap : 0}</div>
                                <p>TẦN SỐ THẤP</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-4" ? 'warning-active' : ''}`} id="warning-4" onClick={() => {
                        deviceWarning(CONS.WARNING_TYPE_GRID.TAN_SO_CAO, "warning-4", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-tansocao.png" alt="Tần số cao" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.tanSoCao > 0 ? 'numberWarning' : ''}`}>{warnings.tanSoCao ? warnings.tanSoCao : 0}</div>
                                <p>TẦN SỐ CAO</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-5" ? 'warning-active' : ''}`} id="warning-5" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.SONG_HAI, "warning-5", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-songhai.png" alt="Sóng hài" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.songHai > 0 ? 'numberWarning' : ''}`}>{warnings.songHai ? warnings.songHai : 0}</div>
                                <p>SÓNG HÀI</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-6" ? 'warning-active' : ''}`} id="warning-6" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.QUA_TAI_TONG, "warning-6", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-quataitong.png" alt="Quá tải tổng" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.quaTaiTong > 0 ? 'numberWarning' : ''}`}>{warnings.quaTaiTong ? warnings.quaTaiTong : 0}</div>
                                <p>QUÁ TẢI TỔNG</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-7" ? 'warning-active' : ''}`} id="warning-7" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.QUA_TAI_NHANH, "warning-7", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-quatainhanh.png" alt="Quá tải nhánh" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.quaTaiNhanh > 0 ? 'numberWarning' : ''}`}>{warnings.quaTaiNhanh ? warnings.quaTaiNhanh : 0}</div>
                                <p>QUÁ TẢI NHÁNH</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-8" ? 'warning-active' : ''}`} id="warning-8" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.LECH_PHA_TONG, "warning-8", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-lechphatong.png" alt="Lệch pha tổng" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matNguonLuoi > 0 ? 'numberWarning' : ''}`}>{warnings.matNguonLuoi ? warnings.matNguonLuoi : 0}</div>
                                <p>LỆCH PHA TỔNG</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-9" ? 'warning-active' : ''}`} id="warning-9" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.LECH_PHA_NHANH, "warning-9", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-lechphanhanh.png" alt="Lệch pha nhánh" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.lechPha > 0 ? 'numberWarning' : ''}`}>{warnings.lechPha ? warnings.lechPha : 0}</div>
                                <p>LỆCH PHA NHÁNH</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-14" ? 'warning-active' : ''}`} id="warning-14" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.NHIET_DO, "warning-14", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-nhietdotiepxuc.png" alt="Nhiệt độ" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.nhietDoCao > 0 ? 'numberWarning' : ''}`}>{warnings.nhietDoCao ? warnings.nhietDoCao : 0}</div>
                                <p>NHIỆT ĐỘ CAO</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-15" ? 'warning-active' : ''}`} id="warning-15" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.NHIET_DO_DAU, "warning-15", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-nhietdodau.png" alt="Nhiệt độ dầu" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.nhietDoDau > 0 ? 'numberWarning' : ''}`}>{warnings.nhietDoDau ? warnings.nhietDoDau : 0}</div>
                                <p>NHIỆT ĐỘ DẦU</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-16" ? 'warning-active' : ''}`} id="warning-16" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.MAT_DIEN_TONG, "warning-16", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-matdientong.png" alt="Mật điện tổng" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.dienApCaoDC > 0 ? 'numberWarning' : ''}`}>{warnings.dienApCaoDC ? warnings.dienApCaoDC : 0}</div>
                                <p>MẤT ĐIỆN TỔNG</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-17" ? 'warning-active' : ''}`} id="warning-17" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.MAT_DIEN_NHANH, "warning-17", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-matdiennhanh.png" alt="Mất điện nhánh" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matDienNhanh > 0 ? 'numberWarning' : ''}`}>{warnings.matDienNhanh ? warnings.matDienNhanh : 0}</div>
                                <p>MẤT ĐIỆN NHÁNH</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-22" ? 'warning-active' : ''}`} id="warning-22" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.DIEN_AP_CAO, "warning-22", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-dienapcao.png" alt="Điện áp cao" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.dienApCao > 0 ? 'numberWarning' : ''}`}>{warnings.dienApCao ? warnings.dienApCao : 0}</div>
                                <p>ĐIỆN ÁP CAO</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-23" ? 'warning-active' : ''}`} id="warning-23" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.DIEN_AP_THAP, "warning-23", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-dienapthap.png" alt="Điện áp thấp" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.dienApThap > 0 ? 'numberWarning' : ''}`}>{warnings.dienApThap ? warnings.dienApThap : 0}</div>
                                <p>ĐIỆN ÁP THẤP</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-24" ? 'warning-active' : ''}`} id="warning-24" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.COS_TONG_THAP, "warning-24", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-hesocongsuatthap.png" alt="COS tổng thấp" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>COSφ TỔNG THẤP</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-25" ? 'warning-active' : ''}`} id="warning-25" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.COS_NHANH_THAP, "warning-25", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-hesocongsuatthap.png" alt="COS nhánh thấp" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>COSφ NHÁNH THẤP</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-10" ? 'warning-active' : ''}`} id="warning-10" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.FI_TU_RMU, "warning-10", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-matdienrmu.png" alt="FI Tủ RMU" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>FI TỦ RMU</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-11" ? 'warning-active' : ''}`} id="warning-11" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.KHOANG_TON_THAT, "warning-11", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-homtonthat.png" alt="Khoang tổn thất" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>KHOANG TỔN THẤT</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-12" ? 'warning-active' : ''}`} id="warning-12" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.DONG_MO_CUA, "warning-12", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-dongmocua.png" alt="Đóng mở cửa" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>ĐÓNG MỞ CỬA</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-13" ? 'warning-active' : ''}`} id="warning-13" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.MUC_DAU_THAP, "warning-13", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-mucdauthap.png" alt="Mức dầu thấp" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>MỨC DẦU THẤP</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-18" ? 'warning-active' : ''}`} id="warning-18" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.ROLE_GAS, "warning-18", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-rolegas.png" alt="Role gas" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>RƠLE GAS</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-19" ? 'warning-active' : ''}`} id="warning-19" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.CHAM_VO, "warning-19", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-apluckhi.png" alt="Chạm vỏ" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>CHẠM VỎ</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-20" ? 'warning-active' : ''}`} id="warning-20" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.MUC_DAU_CAO, "warning-20", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-mucdaucao.png" alt="Mức dầu cao" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>MỨC DẦU CAO</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-21" ? 'warning-active' : ''}`} id="warning-21" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.CAM_BIEN_HONG_NGOAI, "warning-21", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-hongngoai.png" alt="Cảm biến hồng ngoại" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>CẢM BIẾN HỒNG NGOẠI</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-26" ? 'warning-active' : ''}`} id="warning-26" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.AP_SUAT_NOI_BO_MBA, "warning-26", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-apsuatnoimba.png" alt="Áp suất nội bộ MBA" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>ÁP SUẤT NỘI BỘ MBA</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-27" ? 'warning-active' : ''}`} id="warning-27" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.ROLE_NHIET_DO_DAU, "warning-27", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-nhietdodau.png" alt="Role Nhiệt độ dầu" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>RƠLE NHIỆT ĐỘ DẦU</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-28" ? 'warning-active' : ''}`} id="warning-28" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.NHIET_DO_CUON_DAY, "warning-28", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-nhietdocuonday.png" alt="Nhiệt độ cuộn dây" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>NHIỆT ĐỘ CUỘN DÂY</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-29" ? 'warning-active' : ''}`} id="warning-29" onClick={() => {

                        deviceWarning(CONS.WARNING_TYPE_GRID.KHI_GAS_MBA, "warning-29", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"><img src="/resources/image/icon-khigatrongmba.png" alt="Khí gas mba" /></h4>
                        </div>
                        <div className="card-content">
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.matBoNho > 0 ? 'numberWarning' : ''}`}>{warnings.matBoNho ? warnings.matBoNho : 0}</div>
                                <p>KHÍ GAS MBA</p>
                            </div>
                        </div>
                    </div>
                    <div className={`card warning-card float-left ${activeWarning === "warning-all" ? 'warning-active' : ''}`} id="warning-all" onClick={() => {
                        deviceWarning("ALL", "warning-all", fromDate, toDate)
                    }}>
                        <div className="card-header">
                            <h4 className="card-title"> </h4>
                        </div>
                        <div className="card-content" style={{ padding: 14 }}>
                            <div className="card-body">
                                <div className={`numberCircle ${warnings.devicesWarning > 0 ? 'numberWarning' : ''}`}>{warnings.devicesWarning ? warnings.devicesWarning : 0}</div>
                                <p>ALL</p>
                            </div>
                        </div>
                    </div>


                </div>
                <div className="content-warning-device mt-2">
                    <div className="warning-search-device">
                        <input className="warning-search-device-input" type="text" placeholder={t('content.home_page.search')} onChange={searchDevice}></input>
                        <i className="fas fa-solid fa-search position-absolute" style={{ color: "#333", left: "90%", top: "35%" }}></i>
                    </div>
                    <div className="loading" id="warning-loading" style={{ marginTop: "", marginLeft: "45%" }}>
                        <img height="60px" src="/resources/image/loading2.gif" alt="loading" />
                    </div>
                    <div id="warnedDevices">
                        {searchWarnedDevice.length > 0 ?
                            <>
                                {searchWarnedDevice.map((item, index) => (
                                    <div key={index} className="polygon-warning-outside">
                                        <div className="polygon-warning-inside">
                                            <div>
                                                <div className="title">{item.deviceName}</div>
                                                <div className="priority pl-1">
                                                    <label>Mức ưu tiên thiết bị: Cao</label>
                                                    <button className="warning-btn">
                                                        <i className="fas fa-solid fa-cube" style={{ color: "var(--ses-orange-100-color)" }}></i>
                                                    </button>
                                                </div>
                                                <div className="content">
                                                    <table className="warning-table">
                                                        <thead className={item.listWarning.length > 2 ? "scroll" : ""}>
                                                            <tr height="40px">
                                                                <th>STT</th>
                                                                <th>
                                                                    Loại cảnh báo
                                                                </th>
                                                                <th>
                                                                    Thời gian
                                                                </th>
                                                                <th >
                                                                    Số lần
                                                                </th>
                                                                <th>
                                                                    Mức cảnh báo
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody style={{ lineHeight: 1 }} >
                                                            {
                                                                item.listWarning.map((warning, i) => (
                                                                    <tr key={i} height="30px" data-toggle="modal" data-target="#infor-warning-modal-lg" onClick={() => funcInforWarning(warning)}>
                                                                        <td className="text-center">{i + 1}</td>
                                                                        <td className="text-center">{warning.warningTypeName}</td>
                                                                        <td className="text-center" >{warning.toDate}</td>
                                                                        <td className="text-center" >{warning.total}</td>
                                                                        <td className="text-center" >
                                                                            {warning.warningLevel == 1 && <div className="level1"></div>}
                                                                            {warning.warningLevel == 2 && <div className="level2"></div>}
                                                                            {warning.warningLevel == 3 && <div className="level3"></div>}
                                                                        </td>

                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                }
                            </>
                            :
                            <div className="text-center loading-chart mt-1">{t('content.home_page.chart.no_data')}</div>
                        }
                    </div>
                </div>
            </div>
            <div className="modal fade bd-example-modal-lg" id="infor-warning-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="left-warning">
                            <div className="infor">
                                <i className="fa-solid fa-circle fa-2xs"> &nbsp;</i>    <label>Tên điểm đo: &nbsp;</label>{inforWarning.deviceName} <br />
                                <i className="fa-solid fa-circle fa-2xs"> &nbsp;</i>    <label>Loại cảnh báo: &nbsp;</label>{inforWarning.warningTypeName} <br />
                                <i className="fa-solid fa-circle fa-2xs"> &nbsp;</i>    <label>Giá trị cảnh báo: &nbsp;</label>{inforWarning.value} <br />
                                <i className="fa-solid fa-circle fa-2xs"> &nbsp;</i>    <label>Ngưỡng cảnh báo: &nbsp;</label>{inforWarning.settingValue} <br />
                                <i className="fa-solid fa-circle fa-2xs"> &nbsp;</i>    <label>Mức độ quan trọng của điểm đo: &nbsp;</label> -<br />
                                <i className="fa-solid fa-circle fa-2xs"> &nbsp;</i>    <label>Mức ưu tiên của cảnh báo: &nbsp;</label>
                                {inforWarning.warningLevel == 1 && "Thấp"}
                                {inforWarning.warningLevel == 2 && "Trung bình"}
                                {inforWarning.warningLevel == 3 && "Cao"}<br />
                                <i className="fa-solid fa-circle fa-2xs"> &nbsp;</i>    <label>Thời điểm bắt đầu: &nbsp;</label>{moment(inforWarning.fromDate).format("YYYY-MM-DD HH:mm:ss")} <br />
                                <i className="fa-solid fa-circle fa-2xs"> &nbsp;</i>    <label>Thời điểm kết thúc: &nbsp;</label>{moment(inforWarning.toDate).format("YYYY-MM-DD HH:mm:ss")}  <br />
                                <i className="fa-solid fa-circle fa-2xs"> &nbsp;</i>    <label>Khoảng thời gian: &nbsp;</label>-
                            </div>
                        </div>
                        <div className="right-warning">
                            <div className="chart">
                                <div className="text-right" style={{ height: "fit-content" }}>
                                    <button className="btn" onClick={() => funcTableOrChart(1)} hidden={tableOrChart == 0 ? false : true}>
                                        <i className="fas fa-solid fa-bars" style={{ color: "var(--ses-orange-100-color)" }} ></i>
                                    </button>
                                    <button className="btn" onClick={() => funcTableOrChart(0)} hidden={tableOrChart == 1 ? false : true}>
                                        <i className="fas fa-solid fa-chart-line" style={{ color: "var(--ses-orange-100-color)" }}></i>
                                    </button>
                                    <button className="btn">
                                        <i className="fas fa-solid fa-download" style={{ color: "var(--ses-orange-100-color)" }}></i>
                                    </button>
                                </div>
                                <div id="chartdivWarning" style={{ height: "95%", width: "100%" }} hidden={tableOrChart == 0 ? false : true}>
                                </div>
                                <div id="tabledivWarning" style={{ height: "92%", width: "100%" }} hidden={tableOrChart == 1 ? false : true}>
                                    <table className="table">

                                        <thead>
                                            <tr>
                                                <th width="50px">TT</th>
                                                <th>THỜI GIAN</th>
                                                {selectedWarningType == CONS.WARNING_TYPE_GRID.DO_AM &&
                                                    <>
                                                        <th>Độ ẩm</th>
                                                    </>
                                                }
                                                {selectedWarningType == CONS.WARNING_TYPE_GRID.PHONG_DIEN &&
                                                    <>
                                                        <th>Phóng điện</th>
                                                    </>
                                                }
                                                {(selectedWarningType == CONS.WARNING_TYPE_GRID.TAN_SO_CAO || selectedWarningType == CONS.WARNING_TYPE_GRID.TAN_SO_THAP) &&
                                                    <>
                                                        <th>F</th>
                                                    </>
                                                }
                                                {selectedWarningType == CONS.WARNING_TYPE_GRID.SONG_HAI &&
                                                    <>
                                                        <th>THD_Van</th>
                                                        <th>THD_Vbn</th>
                                                        <th>THD_Vcn</th>
                                                    </>
                                                }
                                                {(selectedWarningType == CONS.WARNING_TYPE_GRID.QUA_TAI_TONG || selectedWarningType == CONS.WARNING_TYPE_GRID.LECH_PHA_NHANH) &&
                                                    <>
                                                        <th>Ia</th>
                                                        <th>Ib</th>
                                                        <th>Ic</th>
                                                    </>
                                                }
                                                {selectedWarningType == CONS.WARNING_TYPE_GRID.NHIET_DO &&
                                                    <>
                                                        <th>Nhiệt độ</th>
                                                    </>
                                                }
                                                {(selectedWarningType == CONS.WARNING_TYPE_GRID.MAT_DIEN_NHANH || selectedWarningType == CONS.WARNING_TYPE_GRID.DIEN_AP_CAO || selectedWarningType == CONS.WARNING_TYPE_GRID.DIEN_AP_THAP) &&
                                                    <>
                                                        <th>UAn</th>
                                                        <th>UBn</th>
                                                        <th>Ucn</th>
                                                    </>
                                                }
                                                {(selectedWarningType == CONS.WARNING_TYPE_GRID.HE_SO_CONG_SUAT_THAP) &&
                                                    <>
                                                        <th>PFA</th>
                                                        <th>PFB</th>
                                                        <th>PFC</th>
                                                    </>
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                listWarning.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.viewTime}</td>
                                                        {selectedWarningType == CONS.WARNING_TYPE_GRID.DO_AM &&
                                                            <>
                                                                <td>{item.h}</td>
                                                            </>
                                                        }
                                                        {selectedWarningType == CONS.WARNING_TYPE_GRID.PHONG_DIEN &&
                                                            <>
                                                                <td>{item.indicator}</td>
                                                            </>
                                                        }
                                                        {(selectedWarningType == CONS.WARNING_TYPE_GRID.TAN_SO_CAO || selectedWarningType == CONS.WARNING_TYPE_GRID.TAN_SO_THAP) &&
                                                            <>
                                                                <td>{item.f}</td>
                                                            </>
                                                        }
                                                        {selectedWarningType == CONS.WARNING_TYPE_GRID.SONG_HAI &&
                                                            <>
                                                                <td>{item.thdVan}</td>
                                                                <td>{item.thdVbn}</td>
                                                                <td>{item.thdVcn}</td>
                                                            </>
                                                        }
                                                        {(selectedWarningType == CONS.WARNING_TYPE_GRID.QUA_TAI_TONG || selectedWarningType == CONS.WARNING_TYPE_GRID.LECH_PHA_NHANH) &&
                                                            <>
                                                                <td>{item.ia}</td>
                                                                <td>{item.ib}</td>
                                                                <td>{item.ic}</td>
                                                            </>
                                                        }
                                                        {selectedWarningType == CONS.WARNING_TYPE_GRID.NHIET_DO &&
                                                            <>
                                                                <td>{item.t}</td>
                                                            </>
                                                        }
                                                        {(selectedWarningType == CONS.WARNING_TYPE_GRID.MAT_DIEN_NHANH || selectedWarningType == CONS.WARNING_TYPE_GRID.DIEN_AP_CAO || selectedWarningType == CONS.WARNING_TYPE_GRID.DIEN_AP_THAP) &&
                                                            <>
                                                                <td>{item.uan}</td>
                                                                <td>{item.ubn}</td>
                                                                <td>{item.ucn}</td>
                                                            </>
                                                        }
                                                        {(selectedWarningType == CONS.WARNING_TYPE_GRID.HE_SO_CONG_SUAT_THAP) &&
                                                            <>
                                                                <td>{item.pfa}</td>
                                                                <td>{item.pfb}</td>
                                                                <td>{item.pfc}</td>
                                                            </>
                                                        }
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WarningGrid;