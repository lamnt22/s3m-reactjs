
import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Link, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import ReactDOMServer from 'react-dom/server';
import AccessDenied from "../../access-denied/AccessDenied";
import CONS from "../../../../constants/constant";
import HomeService from "../../../../services/HomeService";
import AuthService from "../../../../services/AuthService";
import CustomerService from "../../../../services/CustomerService";
import ProjectService from "../../../../services/ProjectService";
import converter from "../../../../common/converter";
import useAppData from "../../../../applications/store/AppStore";
import moment from "moment";
import ProjectMap from "../../home-pages/project-map";
import { Calendar } from "primereact/calendar";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5xy from "@amcharts/amcharts5/xy";
import "./index.css"
import { style } from "d3";
import { CSVLink } from "react-csv";
import { useTranslation } from "react-i18next";
import ReactModal from "react-modal";
import { async } from "q";
import { useDownloadExcel } from "react-export-table-to-excel";
import UserService from "../../../../services/UserService";
import SelectPriorityLevel from "./SelectPriorityLevel/select-priority-level";
// import SelectPriorityLevel from "../../../..";

const $ = window.$;

const Overview = () => {

    const param = useParams();
    const location = useLocation();
    const { t } = useTranslation();
    const [projectId, setProjectId] = useState(0);
    const history = useHistory();
    const [userName] = useState(AuthService.getUserName());
    const [typeModuldeTab1, setTypeModuldeTab1] = useState(1)
    const [typeModuldeTab2, setTypeModuldeTab2] = useState(1)
    const [typeModuldeTab4, setTypeModuldeTab4] = useState(1)
    const [typeModuldeTab5, setTypeModuldeTab5] = useState(1)
    const [typeModuldeTab6, setTypeModuldeTab6] = useState(1)
    const [showToDateTab1, setShowToDateTab1] = useState(false)
    const [showToDateTab6, setShowToDateTab6] = useState(false)
    const [showToDateTab4, setShowToDateTab4] = useState(false)
    const [activeButtonTab1, setActiveButtonTab1] = useState(1)
    const [activeButtonTab2, setActiveButtonTab2] = useState(1)
    const [activeButtonTab3, setActiveButtonTab3] = useState(1)
    const [activeButtonTab4, setActiveButtonTab4] = useState(1)
    const [activeButtonTab5, setActiveButtonTab5] = useState(1)
    const [activeButtonTab6, setActiveButtonTab6] = useState(1)
    const [fDate, setFDate] = useState();
    const [fDateTab6, setFDateTab6] = useState();
    const [dataTab1, setDataTab1] = useState([]);
    const [dataTab1ListTime, setDataTab1ListTime] = useState([]);
    const [dataTab1ListTotal, setDataTab1ListTotal] = useState([]);
    const [dataTab2Default, setDataTab2Default] = useState([]);
    const [dataTab2, setDataTab2] = useState([]);
    const [dataTab3Default, setDataTab3Default] = useState([]);
    const [dataTab3, setDataTab3] = useState([]);
    const [dataTab4Default, setDataTab4Default] = useState([]);
    const [dataTab4, setDataTab4] = useState([]);
    const [dataTab5Default, setDataTab5Default] = useState([]);
    const [dataTab5, setDataTab5] = useState([]);
    const [dataTab6Default, setDataTab6Default] = useState([]);
    const [dataTab6, setDataTab6] = useState([]);
    const [dataTableTab6, setDataTableTab6] = useState([]);
    const [projectIdDataTab6, setProjectIdDataTab6] = useState([]);
    const [dataTableTab6Project, setDataTableTab6Project] = useState([]);
    const [dataPower, setDataPower] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataDrawChartModalTab1, setDataDrawChartModalTab1] = useState()
    const [nameSite, setNameSite] = useState("")
    const [loadPower, setLoadPower] = useState(0)
    const [countDevice, setCountDevice] = useState(0)
    const [fDateExport, setFDateExport] = useState();
    const [tDateExport, setTDateExport] = useState();
    const [fDateExportTab6, setFDateExportTab6] = useState();
    const [tDateExportTab6, setTDateExportTab6] = useState();
    const [customerId, setCustomerId] = useState(0);
    const [unitTab1, setUnitTab1] = useState("(kW)");
    const [listPriority, setListPriority] = useState([])
    const [user, setUser] = useState({
        staffName: "",
        userType: "",
        authorized: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        lockFlag: "",
        customerName: ""
    });

    const tableRef = useRef(null);
    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "dataEnergyOverview",
        sheet: "dataEnergyOverview"
    });
    let today = new Date();
    var fromTime = ""
    var toTime = ""
    fromTime = moment(today).format("YYYY-MM-DD") + " 00:00:00";
    toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
    const fetchDataTab6 = async (typeModule) => {
        await getListDataTab6Default(typeModule, 1, fromTime, toTime)
        await getListDataTab6(typeModule, activeButtonTab6, fromTime, toTime)
    }
    const fetchDataTab1 = async (typeModule) => {
        await getListDataTab1Default(typeModule, activeButtonTab2)
        await getListDataTab1(typeModule, activeButtonTab2)
    }
    const fetchDataTab2 = async (typeModule) => {
        await getListDataTab2Default(typeModule, activeButtonTab2)
        await getListDataTab2(typeModule, activeButtonTab2)
    }
    const fetchDataTab3 = async () => {
        await getListDataTab3Default(activeButtonTab3)
        await getListDataTab3(activeButtonTab3)
    }
    const fetchDataTab4 = async (typeModule) => {
        await getListDataTab4Default(typeModule, activeButtonTab4)
        await getListDataTab4(typeModule, activeButtonTab4)
    }
    const fetchDataTab5 = async (typeModule) => {
        await getListDataTab5Default(typeModule, activeButtonTab5)
        await getListDataTab5(typeModule, activeButtonTab5)
    }

    const [listPrioritySystem, setListPrioritySystem] = useState(
        [
            { label: t('content.home_page.overview.load'), value: 1 },
            { label: t('content.home_page.overview.solar'), value: 2 },
            { label: t('content.home_page.overview.grid'), value: 5 },
            { label: t('content.home_page.overview.wind'), value: 3 },
            { label: t('content.home_page.overview.battery'), value: 4 },
        ]
    )
    const [listPriorityIngredients, setListPriorityIngredients] = useState(
        [
            { label: t('content.home_page.overview.power_flow'), value: 1 },
            { label: t('content.home_page.overview.map'), value: 2 },
            { label: t('content.home_page.overview.energy_data'), value: 3 },
            { label: t('content.home_page.overview.energy_usage_plan'), value: 4 },
            { label: t('content.home_page.overview.energy_cost_revenue'), value: 5 },
            { label: t('content.home_page.overview.energy_statistics'), value: 6 },
            { label: t('content.home_page.overview.warning_statistics'), value: 7 },
            { label: t('content.home_page.overview.management_failure'), value: 8 },
        ]
    )

    useEffect(() => {
        checkAuthorization()
        setFromDateCost(fromTime);
        setToDateCost(toTime)
        setFDateExportTab6(fromTime);
        setTDateExportTab6(toTime);
        setActiveButtonTab6(1)
        getListData(param.projectId);
        getUser(0);
        // setInterval(() => {
        //     getListData(param.projectId);
        //     fetchDataTab1().catch(console.error);
        //     fetchDataTab2().catch(console.error);
        //     fetchDataTab3().catch(console.error);
        //     fetchDataTab4().catch(console.error);
        //     fetchDataTab5().catch(console.error);
        //     fetchDataTab6().catch(console.error);
        // }, 60000);
    }, [param.customerId, param.projectId]);

    const [role] = useState(AuthService.getRoleName());
    const [userTreeData] = useState(useAppData(state => state.userTreeData));
    const [map, setMap] = useState();
    const [markers, setMarkers] = useState(useAppData(state => state.projectMarkers));



    $(document).on("click", "#site-event", (e) => {
        e.preventDefault();
    })


    const handleData = (
        data,
        systemMaps
    ) => {
        data.forEach(item => {
            if (item.type === "load" || item.type === "solar" || item.type === "wind" || item.type === "battery" || item.type === "grid") {
                systemMaps.push(item);
            }
            if (item.children && item.children.length > 0) {
                handleData(item.children,
                    systemMaps);
            }
        });

        return systemMaps;
    }

    const getLocations = async () => {
        let res = await HomeService.getProjectLocationsHomePage();
        return res.data;
    }

    const getUser = async (check) => {
        let response = await UserService.getUserByUsername();
        if (response.status === 200) {
            const userData = response.data;
            setUser(userData);
            const typeModule = userData.prioritySystem;
            setTypeModuldeTab1(typeModule)
            setTypeModuldeTab2(typeModule)
            setTypeModuldeTab4(typeModule)
            setTypeModuldeTab5(typeModule)
            setTypeModuldeTab6(typeModule)
            fetchDataTab1(typeModule).catch(console.error);
            fetchDataTab2(typeModule).catch(console.error);
            fetchDataTab3(typeModule).catch(console.error);
            fetchDataTab4(typeModule).catch(console.error);
            fetchDataTab5(typeModule).catch(console.error);
            fetchDataTab6(typeModule).catch(console.error);
            if (userData.priorityIngredients != null || userData.priorityIngredients != undefined) {
                const priorityList = userData.priorityIngredients.split(',').map(item => parseInt(item));
                if (check == 0) {
                    setListPriority(priorityList)
                }
            }
        }
    }


    const updatePriorityIngredients = async (user) => {
        let response = await UserService.updatePriorityIngredients(user);
    }

    const initMap = async () => {
        const gMarkers = [];

        let styledMapType = new window.google.maps.StyledMapType(
            [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ebe3cd"
                }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#523735"
                }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#f5f1e6"
                }]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#c9b2a6"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#dcd2be"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#ae9e90"
                }]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "poi",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#93817c"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#a5b076"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#447530"
                }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f1e6"
                }]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#fdfcf8"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f8c967"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#e9bc62"
                }]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e98d58"
                }]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#db8555"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#806b63"
                }]
            },
            {
                "featureType": "transit",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#8f7d77"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#ebe3cd"
                }]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dfd2ae"
                }]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#b9d3c2"
                }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#92998d"
                }]
            }
            ], {
            name: 'Styled Map'
        });

        let mapOptions = {
            zoom: 15,
            center: { lat: 21.0307869, lng: 105.7879486 },
            gestureHandling: "cooperative",

        };

        // Create a map object, and include the MapTypeId to add
        // to the map type control.
        var map = new window.google.maps.Map(document.getElementById('project-map'), mapOptions);
        setMap(map);

        // map.mapTypes.set('styled_map', styledMapType);
        // map.setMapTypeId('styled_map');
        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');

        // Display multiple markers on a map
        let infoWindow = new window.google.maps.InfoWindow();

        let bounds = new window.google.maps.LatLngBounds();

        let locations = (role === "ROLE_ADMIN") || (role === "ROLE_MOD") ? await getLocations() : markers;

        let clusters = locations.map(location => {

            let marker = new window.google.maps.Marker({
                customerId: location.customerId,
                id: location.projectId,
                map: map,
                animation: window.google.maps.Animation.DROP,
                position: {
                    lat: location.latitude,
                    lng: location.longitude
                },
                icon: {
                    labelOrigin: new window.google.maps.Point(10, 35),
                    url: "/resources/image/map-marker-" + location.statusColor + ".png",
                    origin: new window.google.maps.Point(0, 0),
                },
                label: {
                    text: location.projectName,
                    anchor: new window.google.maps.Point(0, 0),
                },
            });

            let systemMapProjectCurrents = [];

            systemMapProjectCurrents = handleData(userTreeData, systemMapProjectCurrents);

            // click event

            marker.addListener("click", async () => {
                let res = await HomeService.getProjectById(marker.customerId, marker.id);
                if (res.status === 200) {
                    let project = res.data;
                    let content = ReactDOMServer.renderToString(
                        <div id="project-info-window" className="">
                            <div style={{ border: '1px solid #B3B3B3', borderRadius: '5px' }}>
                                <div className="system-project-title w-100" >
                                    <h4 className="w-100">{project.projectName}</h4>
                                </div>

                                <div id="project-overview">
                                    <div className="text-center">
                                        <h4>{project.description}</h4>
                                        <h5>{project.address}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    infoWindow.setContent(content);
                    infoWindow.open(map, marker);
                }
            });


            bounds.extend(marker.position);

            gMarkers.push(marker);

            return marker;
        });


        // Add a marker clusterer to manage the markers.
        let markerCluster = new MarkerClusterer(map, gMarkers);

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
        map.setZoom(8);
        map.panTo(new window.google.maps.LatLng(21.0307869, 105.7879486));

        return {
            map: map,
            markers: gMarkers
        }
    }

    // new overview


    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [fromDateTab6, setFromDateTab6] = useState(new Date());
    const [toDateTab6, setToDateTab6] = useState(new Date());
    const [fromDateCost, setFromDateCost] = useState(new Date());
    const [toDateCost, setToDateCost] = useState(new Date());
    const [isActiveButton, setIsActiveButton] = useState(1);
    const [typeFormat, setTypeFormat] = useState("yy-mm")
    const [viewCalender, setViewCalender] = useState("month")
    const [typeFormatTab2, setTypeFormatTab2] = useState("yy-mm")
    const [viewCalenderTab2, setViewCalenderTab2] = useState("month")
    const [typeFormatTab3, setTypeFormatTab3] = useState("yy-mm")
    const [viewCalenderTab3, setViewCalenderTab3] = useState("month")
    const [typeFormatTab4, setTypeFormatTab4] = useState("yy-mm")
    const [viewCalenderTab4, setViewCalenderTab4] = useState("month")
    const [typeFormatTab6, setTypeFormatTab6] = useState("yy-mm-dd")
    const [viewCalenderTab6, setViewCalenderTab6] = useState("")
    const [listData, setListData] = useState([])
    const [listPower, setListPower] = useState([])
    const [energy, setEnergy] = useState(0);
    const [energyLoad, setEnergyLoad] = useState(0);
    const [viewValue, setViewValue] = useState(1);
    const [typeView, setTypeView] = useState(true)
    const [viewValueTab6, setViewValueTab6] = useState(1);
    const [typeViewTab6, setTypeViewTab6] = useState(true)
    const [viewValueTab6Pro, setViewValueTab6Pro] = useState(1);
    const [typeViewTab6Pro, setTypeViewTab6Pro] = useState(true)
    const [dataTable, setDataTable] = useState([])
    const [accessDenied, setAccessDenied] = useState(false)
    const headerFile = [
        { label: "Thời gian", key: "time" },
        { label: "PV", key: "powerPV" },
        { label: "GRID", key: "powerGrid" },
        { label: "WIND", key: "powerWind" },
        { label: "BATTERY", key: "powerBattery" },
        { label: "LOAD", key: "powerLoad" }
    ];

    const checkAuthorization = async () => {
        let cusId = 0;
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let check = true;
        let resCheckProjectInCus = await ProjectService.getProjectByCustomerId(cusId);
        if (param.projectId != null) {
            check = resCheckProjectInCus.data.some(project => parseInt(project.projectId) === parseInt(param.projectId));
            if (!check) {
                setAccessDenied(true);
            }
        }
        if (check) {
            if (role === "ROLE_ADMIN") {
                setAccessDenied(false)
            }
            if (role === "ROLE_MOD") {
                let customerIds = ""

                let res = await CustomerService.getCustomerIds(userName)
                if (res.status === 200 && res.data !== '') {
                    for (let i = 0; i < res.data.length; i++) {
                        customerIds += res.data[i].customerId + ","
                    }
                }

                if (param.customerId != undefined) {
                    if (!customerIds.includes(param.customerId)) {
                        setAccessDenied(true)
                    } else {
                        setAccessDenied(false)
                    }
                } else {
                    setAccessDenied(false)
                }
            }
            if (role == "ROLE_USER") {
                let customerIds = ""
                let projectIds = ""

                let res = await CustomerService.getCustomerIds(userName)
                if (res.status === 200 && res.data !== '') {
                    for (let i = 0; i < res.data.length; i++) {
                        customerIds += res.data[i].customerId + ","
                    }
                }

                if (param.customerId != undefined) {
                    if (!customerIds.includes(param.customerId)) {
                        setAccessDenied(true)
                    } else {
                        let re = await ProjectService.getProIds(userName)
                        if (re.status === 200 && re.data !== "") {
                            projectIds = "" + re.data
                        }

                        if (param.projectId != null) {
                            if (!projectIds.includes(param.projectId)) {
                                setAccessDenied(true)
                            }
                        }
                    }
                }
            }
        }
    }

    const getListData = async (projectId) => {
        let ids = ""
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId != null) {
            cusId = param.customerId
        }

        let idProject = ""
        if (projectId == undefined) {
            idProject = 0
        } else {
            idProject = projectId
        }
        let res = await HomeService.getListData(cusId, idProject, null, null, ids)
        if (res.status == 200) {
            setListData(res.data)
        }
    }

    const onChangeValueTime = async (e) => {
        let date = "YYYY-MM-DD";
        let month = "YYYY-MM";
        let year = "YYYY";
        let from = "";
        if (activeButtonTab1 == 4) {
            from = moment(e.target.value).format(date)
            setFromDate(e.target.value)
            setFDate(from)
            setFDateExport(from)
        } else {
            if (activeButtonTab1 != 3) {
                if (activeButtonTab1 == 0) {
                    from = moment(e.target.value).format(date)
                }
                if (activeButtonTab1 == 1) {
                    from = moment(e.target.value).format(month)
                }
                if (activeButtonTab1 == 2) {
                    from = moment(e.target.value).format(year)
                }
                setFDateExport(from)
                await getListDataTab1Default(typeModuldeTab1, activeButtonTab1, from)
                getListDataTab1(typeModuldeTab1, activeButtonTab1, from)
            }
        }

    }

    const onChangeValueTimeTab2 = async (e) => {

        let date = "YYYY-MM-DD";
        let month = "YYYY-MM";
        let year = "YYYY";
        let from = "";
        if (activeButtonTab2 != 3) {
            if (activeButtonTab2 == 0) {
                from = moment(e.target.value).format(date)
            }
            if (activeButtonTab2 == 1) {
                from = moment(e.target.value).format(month)
            }
            if (activeButtonTab2 == 2) {
                from = moment(e.target.value).format(year)
            }

            getListDataTab2Default(typeModuldeTab2, activeButtonTab2, from)
            getListDataTab2(typeModuldeTab2, activeButtonTab2, from)
        }

    }

    const onChangeValueTimeTab3 = async (e) => {
        let date = "YYYY-MM-DD";
        let month = "YYYY-MM";
        let year = "YYYY";
        let from = "";
        if (activeButtonTab3 != 3) {
            if (activeButtonTab3 == 0) {
                from = moment(e.target.value).format(date)
            }
            if (activeButtonTab3 == 1) {
                from = moment(e.target.value).format(month)
            }
            if (activeButtonTab3 == 2) {
                from = moment(e.target.value).format(year)
            }
            getListDataTab3Default(activeButtonTab3, from)
            getListDataTab3(activeButtonTab3, from)
        }

    }

    const onChangeValueTimeTab4 = async (e) => {
        let date = "YYYY-MM-DD";
        let month = "YYYY-MM";
        let from = "";
        if (activeButtonTab4 == 4) {
            from = moment(e.target.value).format(date)
            setFromDate(e.target.value)
            setFDate(from)
        } else {
            if (activeButtonTab4 != 3) {
                if (activeButtonTab4 == 0) {
                    from = moment(e.target.value).format(date)
                }
                if (activeButtonTab4 == 1) {
                    from = moment(e.target.value).format(month)
                }
                getListDataTab4(typeModuldeTab4, activeButtonTab4, from)
            }
        }

    }

    const onChangeValueTimeTab6 = async (e) => {
        let fromDate = moment(e.value).format("YYYY-MM-DD") + " 00:00:00";
        let toDateYear = toDate;
        if (activeButtonTab6 == 3) {
            toDateYear = moment(e.value).format("YYYY") + "-12-31" + " 23:59:59";
        }
        if (activeButtonTab6 == 2) {
            toDateYear = moment(e.value).format("YYYY-MM") + "-31" + " 23:59:59";
        }
        if (activeButtonTab6 == 1) {
            toDateYear = moment(e.value).format("YYYY-MM-DD") + " 23:59:59";
        }
        if (activeButtonTab6 == 5) {
            setFromDateTab6(fromDate)
            toDateYear = moment(toDateYear).format("YYYY-MM-DD") + " 23:59:59";
        }
        setFDateExportTab6(fromDate)
        setTDateExportTab6(toDateYear);
        getListDataTab6Default(typeModuldeTab6, activeButtonTab6, fromDate, toDateYear)
        getListDataTab6(typeModuldeTab6, activeButtonTab6, fromDate, toDateYear)
    }

    const onChangeToDateValueTime = async (e) => {
        setUnitTab1("(kWh)");
        let date = "YYYY-MM-DD";
        let to = moment(e.target.value).format(date)
        let from = ""
        if (fDate == undefined) {
            from = moment(fromDate).format(date)
        } else {
            from = fDate
        }

        if (from > to) {
            $.alert({
                title: 'Thông báo',
                content: 'Từ ngày phải nhỏ hơn đến ngày'
            });
        }
        else {
            setFDateExport(from)
            setTDateExport(to)
            await getListDataTab1Default(typeModuldeTab1, activeButtonTab1, from, to)
            getListDataTab1(typeModuldeTab1, activeButtonTab1, from, to)
        }
    }

    const onChangeToDateValueTimeTab4 = async (e) => {
        let date = "YYYY-MM-DD";
        let to = moment(e.target.value).format(date)
        let from = ""
        if (fDate == undefined) {
            from = moment(fromDate).format(date)
        } else {
            from = fDate
        }

        if (from > to) {
            $.alert({
                title: 'Thông báo',
                content: 'Từ ngày phải nhỏ hơn đến ngày'
            });
        }
        else {
            getListDataTab4Default(typeModuldeTab4, activeButtonTab4, from, to)
        }
    }

    const onChangeToDateValueTimeTab6 = async (e) => {
        setUnitTab1("(kWh)");
        let date = "YYYY-MM-DD";
        let to = moment(e.target.value).format(date)
        let from = ""
        from = moment(fromDateTab6).format(date)
        if (from > to) {
            $.alert({
                title: 'Thông báo',
                content: 'Từ ngày phải nhỏ hơn đến ngày'
            });
        }
        else {
            setFDateExportTab6(from)
            setTDateExportTab6(to)
            await getListDataTab6Default(typeModuldeTab6, activeButtonTab6, from, to)
            getListDataTab6(typeModuldeTab6, activeButtonTab6, from, to)
        }
    }

    const changeValueView = (value) => {
        if (value == 1) {
            setViewValue(value)
            if (typeView == false) {
                $("#table-power").hide()
                $("#chartdiv").show()
            }
            if (typeView == true) {
                $("#chartdiv").hide()
                $("#table-power").show()
            }
            setTypeView(!typeView)

            // if (isActiveButton == 1) {
            //     setDataTable(listPower[12])
            // }
            // if (isActiveButton == 2) {
            //     setDataTable(listPower[13])
            // }
            // if (isActiveButton == 3) {
            //     setDataTable(listPower[14])
            // }
            // if (isActiveButton == 4) {
            //     setDataTable(listPower[15])
            // }
        }
        if (value == 2) {
            let header = [];
            let tableInstance = document.getElementById("table-instance-tab-1")
            for (let i = 0, row; row = tableInstance.rows[i]; i = 1) {
                if (i = 1) {
                    let column = "";
                    for (var j = 0, col; col = row.cells[j]; j++) {
                        if (col.innerText == "TIMESTAMPS") {
                            column = "sendDate"
                        } else {
                            column = "power"
                        }

                        let object = {
                            label: col.innerText,
                            key: column
                        }
                        header.push(object);
                    }
                }
            }
        }
    }

    const changeValueViewTab6 = (value) => {
        if (value == 1) {
            setViewValueTab6(value)
            if (typeViewTab6 == false) {
                $("#table-tab-6").hide()
                $("#chart-modal-tab-6").show()
            }
            if (typeViewTab6 == true) {
                $("#chart-modal-tab-6").hide()
                $("#table-tab-6").show()
            }
            setTypeViewTab6(!typeViewTab6)

        }
    }

    const changeValueViewTab6Pro = (value) => {
        if (value == 1) {
            setViewValueTab6Pro(value)
            if (typeViewTab6Pro == false) {
                $("#table-tab-6-pro").hide()
                for (let x = 0; x < dataTab6.length; x++) {
                    $("#chart-tab-6-" + x).show()
                }

            }
            if (typeViewTab6Pro == true) {
                for (let x = 0; x < dataTab6.length; x++) {
                    $("#chart-tab-6-" + x).hide()
                }
                $("#table-tab-6-pro").show()
            }
            setTypeViewTab6Pro(!typeViewTab6Pro)
        }
    }



    const drawChartTab1 = (data, active) => {
        am5.array.each(am5.registry.rootElements, function (root) {
            if (root) {
                if (root.dom.id == "chartdiv") {
                    root.dispose();
                }
            }
        });
        /**
 * ---------------------------------------
 * This demo was created using amCharts 5.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v5/
 * ---------------------------------------
 */
        if (active == 0) {
            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            let element = document.getElementById("chartdiv")
            if (element != null) {
                var root = am5.Root.new("chartdiv");

                root._logo.dispose();

                // Set themes
                // https://www.amcharts.com/docs/v5/concepts/themes/
                root.setThemes([
                    am5themes_Animated.new(root)
                ]);

                // Create chart
                // https://www.amcharts.com/docs/v5/charts/xy-chart/
                var chart = root.container.children.push(
                    am5xy.XYChart.new(root, {
                        panX: true,
                        panY: true,
                        wheelX: "panX",
                        wheelY: "zoomX",
                        layout: root.verticalLayout,
                        pinchZoomX: true
                    })
                );


                chart.children.unshift(am5.Label.new(root, {
                    text: t('content.home_page.chart.power_chart'),
                    fontSize: 18,
                    fontWeight: "500",
                    textAlign: "center",
                    x: am5.percent(50),
                    y: am5.percent(-2),
                    centerX: am5.percent(50),
                    paddingTop: 0,
                    paddingBottom: 0
                }));

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

                // Add cursor
                // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
                var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                    behavior: "none"
                }));
                cursor.lineY.set("visible", false);

                // The data

                // Create axes
                // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
                var xRenderer = am5xy.AxisRendererX.new(root, {});
                xRenderer.grid.template.set("location", 0.5);
                xRenderer.labels.template.setAll({
                    location: 0.5,
                    multiLocation: 0.5,
                    rotation: -20,
                    fontSize: 8
                });

                var xAxis = chart.xAxes.push(
                    am5xy.CategoryAxis.new(root, {
                        categoryField: "viewTime",
                        renderer: xRenderer,
                        tooltip: am5.Tooltip.new(root, {})
                    })
                );

                let max = 0
                let index = 0
                for (let i = 0; i < data.length; i++) {
                    if (max < data[i].listDataPower.length) {
                        max = data[i].listDataPower.length
                        index = i
                    }
                }


                xAxis.data.setAll(data[index].listDataPower);
                var yAxis = chart.yAxes.push(
                    am5xy.ValueAxis.new(root, {
                        extraMax: 0.1,
                        renderer: am5xy.AxisRendererY.new(root, {
                        })
                    })
                );
                yAxis.children.moveValue(am5.Label.new(root, { text: `${t('content.home_page.chart.power')} [[kW]]`, rotation: -90, y: am5.p50, centerX: am5.p50 }), 0);


                // Add series
                // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

                function createSeries(name, data) {
                    var series = chart.series.push(
                        am5xy.LineSeries.new(root, {
                            name: name,
                            xAxis: xAxis,
                            yAxis: yAxis,
                            valueYField: "power",
                            categoryXField: "viewTime",
                            tooltip: am5.Tooltip.new(root, {
                                pointerOrientation: "horizontal",
                                labelText: "[bold]{name}[/]\n{categoryX}[bold][/]\nĐiện năng: [bold]{valueY} [bold]kW"
                            })
                        })
                    );


                    series.bullets.push(function () {
                        return am5.Bullet.new(root, {
                            sprite: am5.Circle.new(root, {
                                radius: 2,
                                fill: series.get("fill")
                            })
                        });
                    });

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

                for (let i = 0; i < data.length; i++) {
                    createSeries(data[i].name, data[i].listDataPower)
                }

                var legend = chart.children.push(
                    am5.Legend.new(root, {
                        centerX: am5.p50,
                        x: am5.p50,
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
            }
        }
        if (active != 0) {
            // Create root element
            // https://www.amcharts.com/docs/v5/getting-started/#Root_element
            let element = document.getElementById("chartdiv")
            if (element != null) {
                var root = am5.Root.new("chartdiv");

                root._logo.dispose();

                // Set themes
                // https://www.amcharts.com/docs/v5/concepts/themes/
                root.setThemes([
                    am5themes_Animated.new(root)
                ]);


                // Create chart
                // https://www.amcharts.com/docs/v5/charts/xy-chart/
                var chart = root.container.children.push(am5xy.XYChart.new(root, {
                    panX: true,
                    panY: true,
                    wheelX: "panX",
                    wheelY: "zoomX",
                    layout: root.verticalLayout,
                    pinchZoomX: true
                }));

                chart.children.unshift(am5.Label.new(root, {
                    text: t('content.home_page.chart.energy_chart'),
                    fontSize: 18,
                    fontWeight: "500",
                    textAlign: "center",
                    x: am5.percent(50),
                    y: am5.percent(-2),
                    centerX: am5.percent(50),
                    paddingTop: 0,
                    paddingBottom: 0
                }));

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


                // Add legend
                // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
                var legend = chart.children.push(am5.Legend.new(root, {
                    centerX: am5.p50,
                    x: am5.p50
                }));



                // Create axes
                // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
                var xRenderer = am5xy.AxisRendererX.new(root, {
                    cellStartLocation: 0.1,
                    cellEndLocation: 0.9
                });

                var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                    categoryField: "viewTime",
                    renderer: xRenderer,
                    tooltip: am5.Tooltip.new(root, {})
                }));

                xRenderer.grid.template.setAll({
                    location: 1
                })

                if (data.length > 0) {
                    xAxis.data.setAll(data[0].listDataPower);
                }

                let yRenderer = am5xy.AxisRendererY.new(root, {
                    minGridDistance: 30,
                    opposite: false
                });

                let yAxis = chart.yAxes.push(
                    am5xy.ValueAxis.new(root, {
                        min: 0,
                        renderer: yRenderer,
                        maxDeviation: 0,
                    })
                );

                yAxis.children.moveValue(am5.Label.new(root, { text: t('content.home_page.chart.energy_power') + ` [[kWh]]`, rotation: -90, y: am5.p50, centerX: am5.p50 }), 0);

                yRenderer.grid.template.set("strokeOpacity", 0.05);

                yRenderer = am5xy.AxisRendererY.new(root, {
                    opposite: true
                });
                let yAxis2 = chart.yAxes.push(
                    am5xy.ValueAxis.new(root, {
                        min: 0,
                        maxDeviation: 0,
                        renderer: yRenderer,
                    })
                );
                yAxis2.children.moveValue(am5.Label.new(root, { text: t('content.home_page.chart.energy_power_accumulated') + ` [[kWh]]`, rotation: -90, y: am5.p50, centerX: am5.p50 }), 1);

                // Add series
                // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
                function makeSeries(name, data) {
                    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                        stacked: true,
                        name: name,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: "power",
                        categoryXField: "viewTime"
                    }));

                    series.columns.template.setAll({
                        tooltipText: "[bold]{name}[/]\n{categoryX}[/]\n" + t('content.home_page.chart.energy_power') + ": [bold]{valueY} [bold]kWh",
                        width: am5.percent(90),
                        tooltipY: am5.percent(10)
                    });

                    series.data.setAll(data);

                    // Make stuff animate on load
                    // https://www.amcharts.com/docs/v5/concepts/animations/
                    series.appear();

                    series.bullets.push(function () {
                        return am5.Bullet.new(root, {
                            locationY: 0.5,
                            sprite: am5.Label.new(root, {
                                text: "{valueY}",
                                fill: root.interfaceColors.get("alternativeText"),
                                centerY: am5.percent(50),
                                centerX: am5.percent(50),
                                populateText: true
                            })
                        });
                    });

                    legend.data.push(series);
                }

                // makeSeries("Europe", "europe", true);
                // makeSeries("North America", "namerica", true);
                // makeSeries("Asia", "asia", true);
                // makeSeries("Latin America", "lamerica", true);
                // makeSeries("Middle East", "meast", true);
                // makeSeries("Africa", "africa", true);
                for (let i = 0; i < data.length; i++) {
                    makeSeries(data[i].name, data[i].listDataPower)
                }


                // Make stuff animate on load
                // https://www.amcharts.com/docs/v5/concepts/animations/
                chart.appear(1000, 100);
            }
        }
    }

    const drawChartTab2 = (type, data, option) => {
        am5.array.each(am5.registry.rootElements, function (root) {
            if (root) {
                if (root.dom.id == "chart-" + type) {
                    root.dispose();
                }
            }
        });

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        let element = document.getElementById("chart-" + type)
        if (element != null) {
            let root = am5.Root.new("chart-" + type);

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            var chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    panX: true,
                    panY: true,
                    layout: root.verticalLayout,
                })
            );

            if (param.projectId != undefined) {
                chart.children.unshift(am5.Label.new(root, {
                    text: t('content.home_page.chart.energy_chart'),
                    fontSize: 18,
                    fontWeight: "500",
                    textAlign: "center",
                    x: am5.percent(50),
                    y: am5.percent(-2),
                    centerX: am5.percent(50),
                    paddingTop: 0,
                    paddingBottom: 0
                }));
            }



            chart.get("colors").set("colors", [
                am5.color(0x0a1a5c),
                am5.color(0xFF0000),
                am5.color(0x00FF00),
            ]);

            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                behavior: "none"
            }));
            cursor.lineY.set("visible", false);

            // The data


            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var xRenderer = am5xy.AxisRendererX.new(root, {});
            xRenderer.grid.template.set("location", 0.5);
            xRenderer.labels.template.setAll({
                location: 0.5,
                multiLocation: 0.5,
                fontSize: 8
            });

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
                    maxPrecision: 10,
                    renderer: am5xy.AxisRendererY.new(root, {
                    })
                })
            );

            yAxis.children.moveValue(am5.Label.new(root, { text: t('content.home_page.chart.energy_power') + ` [[kWh]]`, rotation: -90, y: am5.p50, centerX: am5.p50 }), 0);

            // Add series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

            function createSeries(name, field, checked) {

                let tooltip = am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: `{categoryX}[/]\n${name}: [bold]{valueY} [bold]kWh`
                })


                var series = chart.series.push(
                    am5xy.LineSeries.new(root, {
                        name: name,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: field,
                        categoryXField: "viewTime",
                        tooltip: tooltip
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

            if (option == 2) {
                createSeries(t('content.home_page.chart.accumulated_energy'), "power", true)
                createSeries(t('content.home_page.chart.base_line'), "sumLandmark")
                createSeries(t('content.home_page.chart.target_line'), "sumEnergy")

            } else {
                createSeries(t('content.home_page.chart.accumulated_energy'), "power", true)
                createSeries(t('content.home_page.chart.base_line'), "targetEnergy")
                createSeries(t('content.home_page.chart.target_line'), "planEnergy")


            }



            // Add scrollbar
            // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/

            var legend = chart.children.push(
                am5.Legend.new(root, {
                    centerX: am5.percent(50),
                    x: am5.percent(50),
                    layout: am5.GridLayout.new(root, {
                        maxColumns: 3,
                    })
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

            legend.labels.template.setAll({
                fontSize: 10
            })

            legend.data.setAll(chart.series.values);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            chart.appear(1000, 100);
        }
    }

    const drawChartTab3 = (type, data, option) => {
        let name = ""
        if (option == 1) {
            name = t('content.home_page.load_month')
        } else if (option == 2) {
            name = t('content.home_page.load_year')
        } else if (option == 0) {
            name = t('content.home_page.load_day')
        }

        am5.array.each(am5.registry.rootElements, function (root) {
            if (root) {
                if (root.dom.id == "chart-tab-3-" + type) {
                    root.dispose();
                }
            }
        });

        let newDataSr0 = [{
            name: t('content.home_page.load'),
            dataPower: data.dataPower,
            sliceSettings: { fill: am5.color(0x00ffff) }
        }]

        let dataDraw = [{
            name: t('content.home_page.solar'),
            dataPower: data.listDataModule[0].dataPower,
            sliceSettings: { fill: am5.color(0x00FF00) }
        },
        {
            name: t('content.home_page.grid'),
            dataPower: data.listDataModule[1].dataPower,
            sliceSettings: { fill: am5.color(0x0a1a5c) }
        }]

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element

        let element = document.getElementById("chart-tab-3-" + type)
        if (element != null) {
            var root = am5.Root.new("chart-tab-3-" + type);

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
            // start and end angle must be set both for chart and series
            var chart = root.container.children.push(
                am5percent.PieChart.new(root, {
                    layout: root.verticalLayout
                })
            );

            // Create series
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
            // start and end angle must be set both for chart and series
            var series0 = chart.series.push(
                am5percent.PieSeries.new(root, {
                    valueField: "dataPower",
                    categoryField: "name",
                    radius: am5.percent(0),
                    innerRadius: am5.percent(65),
                    x: am5.percent(-23),
                    y: am5.percent(-5),
                })
            );

            series0.slices.template.setAll({
                templateField: "sliceSettings",
                strokeOpacity: 0
            });

            series0.slices.template.states.create("hover", { scale: 1 });
            series0.slices.template.states.create("active", { shiftRadius: 0 });
            series0.labels.template.adapters.add("y", function (y, target) {
                var dataItem = target.dataItem;
                if (dataItem) {
                    var tick = dataItem.get("tick");
                    if (tick) {
                        if (dataItem.get("valuePercentTotal") < 1) {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                        else {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                    }
                    return y;
                }
            });


            var series1 = chart.series.push(
                am5percent.PieSeries.new(root, {
                    radius: am5.percent(75),
                    innerRadius: am5.percent(85),
                    layout: root.horizontalLayout,
                    valueField: "dataPower",
                    categoryField: "name",
                    alignLabels: false,
                    x: am5.percent(-23),
                    y: am5.percent(-5),
                })
            );


            series1.slices.template.setAll({
                templateField: "sliceSettings",
                strokeOpacity: 0
            });

            series1.labels.template.setAll({
                textType: "circular"
            });


            series1.slices.template.states.create("hover", { scale: 1 });
            series1.slices.template.states.create("active", { shiftRadius: 0 });
            series1.labels.template.adapters.add("y", function (y, target) {
                var dataItem = target.dataItem;
                if (dataItem) {
                    var tick = dataItem.get("tick");
                    if (tick) {
                        if (dataItem.get("valuePercentTotal") < 1) {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                        else {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                    }
                    return y;
                }
            });

            if (param.projectId != undefined) {
                var label = chart.seriesContainer.children.push(
                    am5.Label.new(root, {
                        textAlign: "center",
                        x: am5.percent(-24),
                        y: am5.percent(-15),
                        text: `[fontSize:18px]${name}[/]:\n[bold fontSize:30px]${data.dataPower != null ? data.dataPower : 0} kWh[/]`
                    })
                );
            } else {
                var label = chart.seriesContainer.children.push(
                    am5.Label.new(root, {
                        textAlign: "center",
                        x: am5.percent(-26),
                        y: am5.percent(-15),
                        text: `[fontSize:9px]${name}[/]:\n[bold fontSize:12px]${data.dataPower != null ? data.dataPower : 0} kWh[/]`
                    })
                );
            }


            // Set data
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
            series0.data.setAll(newDataSr0);
            series1.data.setAll(dataDraw);

            // Play initial series animation
            // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
            series0.appear(1000, 100);
            series1.appear(1000, 100);
        }
    }

    const drawChartTab4 = (type, data) => {
        am5.array.each(am5.registry.rootElements, function (root) {
            if (root) {
                if (root.dom.id == "chart-tab-4-" + type) {
                    root.dispose();
                }
            }
        });

        let newDataSr0 = [{
            nameType: t('content.home_page.chart.total_devices'),
            count: data.countDeviceWarning + data.countDeviceWarning + data.countDeviceOffline,
            sliceSettings: { fill: am5.color(0x00ffff) }
        }]

        let newData = [
            {
                nameType: t('content.home_page.normal'),
                count: data.countDeviceOnline,
                sliceSettings: { fill: am5.color(0x0a1a5c) }
            },
            {
                nameType: t('content.home_page.warning'),
                count: data.countDeviceWarning,
                sliceSettings: { fill: am5.color(0xff671f) }
            },
            {
                nameType: t('content.home_page.lost_signal'),
                count: data.countDeviceOffline,
                sliceSettings: { fill: am5.color(0xb5b6d1) }
            },
        ]

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        let element = document.getElementById("chart-tab-4-" + type)
        if (element != null) {
            var root = am5.Root.new("chart-tab-4-" + type);

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
            // start and end angle must be set both for chart and series
            var chart = root.container.children.push(
                am5percent.PieChart.new(root, {
                    layout: root.verticalLayout
                })
            );


            var series0 = chart.series.push(
                am5percent.PieSeries.new(root, {
                    valueField: "count",
                    categoryField: "nameType",
                    radius: am5.percent(0),
                    innerRadius: am5.percent(65),
                    x: am5.percent(-23),
                    y: am5.percent(-5),
                })
            );

            series0.slices.template.setAll({
                templateField: "sliceSettings",
                strokeOpacity: 0
            });

            series0.slices.template.states.create("hover", { scale: 1 });
            series0.slices.template.states.create("active", { shiftRadius: 0 });
            series0.labels.template.adapters.add("y", function (y, target) {
                var dataItem = target.dataItem;
                if (dataItem) {
                    var tick = dataItem.get("tick");
                    if (tick) {
                        if (dataItem.get("valuePercentTotal") < 1) {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                        else {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                    }
                    return y;
                }
            });

            // Create series
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
            // start and end angle must be set both for chart and series
            var series1 = chart.series.push(
                am5percent.PieSeries.new(root, {
                    radius: am5.percent(75),
                    innerRadius: am5.percent(85),
                    layout: root.horizontalLayout,
                    valueField: "count",
                    categoryField: "nameType",
                    alignLabels: false,
                    x: am5.percent(-23),
                    y: am5.percent(-5),
                })
            );


            series1.slices.template.setAll({
                templateField: "sliceSettings",
                strokeOpacity: 0
            });

            series1.labels.template.setAll({
                textType: "circular"
            });


            series1.slices.template.states.create("hover", { scale: 1 });
            series1.slices.template.states.create("active", { shiftRadius: 0 });
            series1.labels.template.adapters.add("y", function (y, target) {
                var dataItem = target.dataItem;
                if (dataItem) {
                    var tick = dataItem.get("tick");
                    if (tick) {
                        if (dataItem.get("valuePercentTotal") < 1) {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                        else {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                    }
                    return y;
                }
            });

            if (param.projectId != undefined) {
                var label = chart.seriesContainer.children.push(
                    am5.Label.new(root, {
                        textAlign: "center",
                        x: am5.percent(-24),
                        y: am5.percent(-15),
                        text: `[fontSize:18px]${t('content.home_page.chart.total_devices')}[/]:\n[bold fontSize:30px]${data.countDevice}[/]`
                    })
                );
            } else {
                var label = chart.seriesContainer.children.push(
                    am5.Label.new(root, {
                        textAlign: "center",
                        x: am5.percent(-26),
                        y: am5.percent(-15),
                        text: `[fontSize:9px]${t('content.home_page.chart.total_devices')}[/]:\n[bold fontSize:12px]${data.countDevice}[/]`
                    })
                );
            }


            // Set data
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
            series0.data.setAll(newDataSr0);
            series1.data.setAll(newData);

            // Play initial series animation
            // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
            series1.appear(1000, 100);
            series0.appear(1000, 100);
        }
    }

    const drawChartTab5 = (type, data) => {
        am5.array.each(am5.registry.rootElements, function (root) {
            if (root) {
                if (root.dom.id == "chart-tab-5-" + type) {
                    root.dispose();
                }
            }
        });

        let element = document.getElementById("chart-tab-5-" + type)
        if (element != null) {
            var root = am5.Root.new("chart-tab-5-" + type);

            var myTheme = am5.Theme.new(root);

            myTheme.rule("Grid", ["base"]).setAll({
                strokeOpacity: 0.1
            });


            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root),
                myTheme
            ]);


            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            var chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    panX: false,
                    panY: false,
                    wheelX: "none",
                    wheelY: "none"
                })
            );

            chart.get("colors").set("colors", [
                am5.color(0x0a1a5c),
                am5.color(0xff671f),
                am5.color(0xb5b6d1),
            ]);

            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var yRenderer = am5xy.AxisRendererY.new(root, { minGridDistance: 30 });
            yRenderer.grid.template.set("location", 1);

            var yAxis = chart.yAxes.push(
                am5xy.CategoryAxis.new(root, {
                    maxDeviation: 0,
                    categoryField: "name",
                    renderer: yRenderer,
                })
            );

            yAxis.data.setAll(data);

            var xAxis = chart.xAxes.push(
                am5xy.ValueAxis.new(root, {
                    maxDeviation: 0,
                    min: 0,
                    renderer: am5xy.AxisRendererX.new(root, {
                        visible: true,
                        strokeOpacity: 0.1
                    })
                })
            );


            // Create series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
            function makeSeries(fieldName, textName) {
                var series = chart.series.push(
                    am5xy.ColumnSeries.new(root, {
                        name: "Series 1",
                        stacked: true,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueXField: fieldName,
                        clustered: false,
                        // sequencedInterpolation: true,
                        categoryYField: "name"
                    })
                );

                // if (param.projectId != undefined) {

                //     series.bullets.push(function () {
                //         return am5.Bullet.new(root, {
                //             locationX: 1,
                //             locationY: 0.5,
                //             sprite: am5.Label.new(root, {
                //                 centerX: am5.percent(-10),
                //                 centerY: am5.p50,
                //                 text: `${fieldName} thiết bị`,
                //                 fill: am5.color(0x000000),
                //                 populateText: true
                //             })
                //         });
                //     });
                // } else {
                //     series.bullets.push(function () {
                //         return am5.Bullet.new(root, {
                //             locationX: 1,
                //             locationY: 0.5,
                //             sprite: am5.Label.new(root, {
                //                 centerX: am5.percent(10),
                //                 centerY: am5.p50,
                //                 text: "{countDevice} thiết bị",
                //                 fill: am5.color(0x000000),
                //                 populateText: true
                //             })
                //         });
                //     });
                // }

                series.columns.template.setAll({
                    tooltipText: `[bold]{valueX} ${textName}`,
                    //height: am5.percent(50),
                    tooltipY: 0,
                    strokeOpacity: 0,
                });


                // Set data


                series.data.setAll(data);
                series.appear(1000);
            }

            makeSeries("countDeviceOnline", t('content.home_page.chart.active_device'))
            makeSeries("countDeviceWarning", t('content.home_page.chart.warning_device'))
            makeSeries("countDeviceOffline", t('content.home_page.chart.inactive_device'))

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/

            chart.appear(1000, 100);
        }
    }

    const drawChartTab6 = (type, data, typeModule) => {
        $("#table-tab-6-pro").hide()
        am5.array.each(am5.registry.rootElements, function (root) {
            if (root) {
                if (root.dom.id == "chart-tab-6-" + type) {
                    root.dispose();
                }
            }
        });

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        let element = document.getElementById("chart-tab-6-" + type)
        if (element != null) {
            let root = am5.Root.new("chart-tab-6-" + type);

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            let chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    heelX: "panX",
                    wheelY: "zoomX",
                    panX: true,
                    panY: false,
                    layout: root.verticalLayout

                })
            );

            chart.children.unshift(am5.Label.new(root, {
                text: t('content.home_page.chart.revenue_energy_cost'),
                fontSize: 13,
                fontWeight: "500",
                textAlign: "center",
                x: am5.percent(50),
                y: am5.percent(-2),
                centerX: am5.percent(50),
                paddingTop: 0,
                paddingBottom: 0
            }));

            chart.get("colors").set("colors", [
                am5.color(0x1d6930),
                am5.color(0x175978),
                am5.color(0xd92323),
                am5.color(0xff7f00),
            ]);

            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var xRenderer = am5xy.AxisRendererX.new(root, {});
            xRenderer.labels.template.setAll({
                fontSize: 10
            });

            var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: "viewTime",
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {})
            }));

            xRenderer.grid.template.setAll({
                location: 1
            })

            xAxis.data.setAll(data);

            var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                min: 0,
                renderer: am5xy.AxisRendererY.new(root, {
                    strokeOpacity: 0.1
                })
            }));

            yAxis.children.moveValue(am5.Label.new(root, { text: `${t('content.home_page.chart.cost')} [[VND]]`, fontSize: 10, fontWeight: "500", rotation: -90, y: am5.p50, centerX: am5.p50 }), 0);


            // Add legend
            // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
            if (projectId == null) {
                var legend = chart.children.push(am5.Legend.new(root, {
                    centerX: am5.percent(50),
                    x: am5.percent(50),
                    layout: am5.GridLayout.new(root, {
                        maxColumns: 3,
                        fixedWidthGrid: false
                    })

                }));
            } else {
                var legend = chart.children.push(am5.Legend.new(root, {
                    centerX: am5.p50,
                    x: am5.p50,
                }));
            }

            legend.markers.template.setAll({
                width: 10,
                height: 10
            });

            // Add series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
            function makeSeries(name, fieldName, fill, ep) {
                var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    name: name,
                    stacked: true,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: fieldName,
                    categoryXField: "viewTime",
                    valueXField: ep,
                }));

                series.columns.template.setAll({
                    tooltipText: "[bold]{name}[/]\n{categoryX}[/]\n" + t('content.home_page.chart.cost') + ": [bold]{valueY} [[VND]] [/]\n" + t('content.home_page.chart.energy_power') + ": [bold]{valueX} [[kWh]]",
                    tooltipY: am5.percent(10)
                });

                series.data.setAll(data);

                // Make stuff animate on load
                // https://www.amcharts.com/docs/v5/concepts/animations/
                series.appear();

                series.bullets.push(function () {
                    return am5.Bullet.new(root, {
                        sprite: am5.Label.new(root, {
                            // text: "{valueY}",
                            fill: fill,
                            centerY: am5.p50,
                            centerX: am5.p50,
                            populateText: true
                        })
                    });
                });


                // Điều chỉnh khoảng cách giữa các mục trong legend

                legend.itemContainers.template.states.create("hover", {});

                legend.itemContainers.template.events.on("pointerover", function (e) {
                    e.target.dataItem.dataContext.hover();
                });
                legend.itemContainers.template.events.on("pointerout", function (e) {
                    e.target.dataItem.dataContext.unhover();
                });

                legend.labels.template.setAll({
                    fontSize: 10
                })
                legend.data.push(series);
                series.appear();
            }

            makeSeries(t('content.home_page.chart.off_peak_hours'), "costLowIn", null, "lowEp")
            makeSeries(t('content.home_page.chart.normal'), "costMediumIn", null, "normalEp")
            makeSeries(t('content.home_page.chart.peak_hours'), "costHighIn", null, "highEp")
            makeSeries(t('content.home_page.vat'), "")

            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            }));
            cursor.lineY.set("visible", false);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            chart.appear(1000, 100);
        }
    }


    const changeMoudleTab1 = async (e) => {

        $("#table-power").hide()
        $("#chartdiv").show()
        setTypeView(true)
        setTypeModuldeTab1(e.target.value)
        await getListDataTab1Default(e.target.value, activeButtonTab1)
        getListDataTab1(e.target.value, activeButtonTab1)
    }

    const getListDataTab1Default = async (type, option, fDate, tDate) => {
        let ids = ""
        $("#table-power").hide()
        if (option == undefined) {
            option = null
        }
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {
            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {
            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab1(cusId, projectId, option, type, fDate, tDate, ids)
        if (res.status === 200) {
            setDataTab1(res.data)
            sumPowerByViewTimeFromObjects(res.data)
            for (let x = 0; x < res.data.length; x++) {
                if (res.data[x].listDataPower.length > 0) {
                    setDataTab1ListTime(res.data[x].listDataPower)
                    break;
                }

            }
        }
    }

    const getListDataTab1 = async (type, option, fDate, tDate) => {
        let ids = ""
        $("#table-power").hide()
        if (option == undefined) {
            option = null
        }
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab1(cusId, projectId, option, type, fDate, tDate, ids)

        if (res.status === 200) {
            drawChartTab1(res.data, option)
        }
    }
    function sumPowerByViewTimeFromObjects(objects) {
        const result = {};

        for (const object of objects) {
            const listDataPower = object.listDataPower;

            for (const item of listDataPower) {
                const viewTime = item.viewTime;

                if (!result[viewTime]) {
                    result[viewTime] = { viewTime, power: item.power };
                } else {
                    result[viewTime].power += item.power;
                }
            }
        }
        setDataTab1ListTotal(Object.values(result))
    }

    const showDataByOptionTab1 = async (option) => {
        $("#table-power").hide()
        $("#chartdiv").show()
        setFDateExport()
        setTDateExport()
        setTypeView(true)
        setActiveButtonTab1(option)
        if (option == 4) {
            setTypeFormat("yy-mm-dd")
            setShowToDateTab1(true)
            setUnitTab1("(kW)")
        } else {
            setShowToDateTab1(false)
            await getListDataTab1Default(typeModuldeTab1, option)
            getListDataTab1(typeModuldeTab1, option)
            if (option == 0) {
                setTypeFormat("yy-mm-dd")
                setUnitTab1("(kW)")
            }
            if (option == 1) {
                setTypeFormat("yy-mm")
                setViewCalender("month")
                setUnitTab1("(kWh)")
            }
            if (option == 2) {
                setTypeFormat("yy")
                setViewCalender("year")
                setUnitTab1("(kWh)")
            }
        }
    }

    const getListDataTab2Default = async (type, option, fDate, tDate) => {
        let ids = ""
        if (option == undefined) {
            option = null
        }
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab2(cusId, projectId, option, type, fDate, tDate, ids)
        if (res.status === 200) {
            setDataTab2Default(res.data)
            setDataTab2(res.data)
        }
    }

    const getListDataTab2 = async (type, option, fDate, tDate) => {
        let ids = ""
        if (option == undefined) {
            option = null
        }
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab2(cusId, projectId, option, type, fDate, tDate, ids)
        if (res.status === 200) {
            if (option == 0) {
                if (res.data != null) {
                    for (let x = 0; x < res.data.length; x++) {
                        if (res.data[x].listDataPower != null && res.data[x].listDataPower[0] != undefined) {
                            let num = res.data[x].listDataPower[0].power
                            for (let i = 0; i < res.data[x].listDataPower.length; i++) {
                                if (res.data[x].listDataPower[i].power != null) {
                                    res.data[x].listDataPower[i].power = res.data[x].listDataPower[i].power - num
                                    // res.data[x].listDataPower[i].power = res.data[x].listDataPower[i].power + 0
                                }
                            }
                            drawChartTab2(x, res.data[x].listDataPower, option)
                        }
                    }
                }
            }
            else {
                if (res.data != null) {
                    for (let x = 0; x < res.data.length; x++) {
                        if (res.data[x].listDataPower != null) {
                            if (res.data[x].listDataPower[0] != undefined && res.data[x].listDataPower[0] != null) {
                                let num = 0;
                                for (let i = 0; i < res.data[x].listDataPower.length; i++) {
                                    if (res.data[x].listDataPower[i].power != null) {
                                        num = res.data[x].listDataPower[i].power
                                        break;
                                    }
                                }

                                for (let i = 0; i < res.data[x].listDataPower.length; i++) {
                                    if (res.data[x].listDataPower[i].power != 0 && res.data[x].listDataPower[i].power != null) {
                                        // res.data[x].listDataPower[i].power = res.data[x].listDataPower[i].power - num
                                        res.data[x].listDataPower[i].power = res.data[x].listDataPower[i].power + 0
                                    }
                                }
                                drawChartTab2(x, res.data[x].listDataPower, option)

                            }
                        }
                    }
                }
            }
        }
    }

    const changeMoudleTab2 = async (e) => {
        setTypeModuldeTab2(e.target.value)
        await getListDataTab2Default(e.target.value, activeButtonTab2)
        getListDataTab2(e.target.value, activeButtonTab2)
    }

    const showDataByOptionTab2 = async (option) => {
        setActiveButtonTab2(option)
        getListDataTab2Default(typeModuldeTab2, option)
        getListDataTab2(typeModuldeTab2, option)
        if (option == 0) {
            setTypeFormatTab2("yy-mm-dd")
        }
        if (option == 1) {
            setTypeFormatTab2("yy-mm")
            setViewCalenderTab2("month")
        }
        if (option == 2) {
            setTypeFormatTab2("yy")
            setViewCalenderTab2("year")
        }
    }

    const onFilterByNameTab2 = () => {
        let name = $("#keyword-tab-2").val();
        $("#polygon-0").hide()

        if (name == "") {
            for (let i = 0; i < dataTab2Default.length; i++) {
                $(`#polygon-${i}`).show()
            }
        } else {
            for (let i = 0; i < dataTab2Default.length; i++) {

                if (dataTab2Default[i].name.toLowerCase().includes(name)) {
                    $(`#polygon-${i}`).show()
                } else {
                    $(`#polygon-${i}`).hide()
                }
            }
        }
    }

    const getListDataTab3Default = async (option, fDate) => {
        let ids = "";
        if (option == undefined) {
            option = null
        }
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab3(cusId, projectId, option, fDate, ids)
        if (res.status === 200) {
            setDataTab3Default(res.data)
            setDataTab3(res.data)
        }
    }

    const getListDataTab3 = async (option, fDate) => {
        let ids = "";
        if (option == undefined) {
            option = null
        }
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab3(cusId, projectId, option, fDate, ids)
        if (res.status === 200) {
            for (let x = 0; x < res.data.length; x++) {
                if (res.data[x].listDataModule != null) {
                    if (res.data[x].listDataModule.length > 0) {
                        drawChartTab3(x, res.data[x], option)
                    }
                }
            }
        }
    }

    const showDataByOptionTab3 = async (option) => {
        setDataPower([])
        setActiveButtonTab3(option)
        getListDataTab3Default(option)
        getListDataTab3(option)
        if (option == 0) {
            setTypeFormatTab3("yy-mm-dd")
        }
        if (option == 1) {
            setTypeFormatTab3("yy-mm")
            setViewCalenderTab3("month")
        }
        if (option == 2) {
            setTypeFormatTab3("yy")
            setViewCalenderTab3("year")
        }
    }

    const changeMoudleTab4 = async (e) => {
        setTypeModuldeTab4(e.target.value)
        await getListDataTab4Default(e.target.value, activeButtonTab4)
        getListDataTab4(e.target.value, activeButtonTab4)
    }

    const showDataByOptionTab4 = async (option) => {
        setDataPower([])
        setActiveButtonTab4(option)


        if (option == 4) {
            setTypeFormatTab4("yy-mm-dd")
            setShowToDateTab4(true)
        } else {
            setShowToDateTab4(false)
            getListDataTab4Default(typeModuldeTab4, option)
            getListDataTab4(typeModuldeTab4, option)
            if (option == 0) {
                setTypeFormatTab4("yy-mm-dd")
            }
            if (option == 1) {
                setTypeFormatTab4("yy-mm")
                setViewCalender("month")
            }
        }
    }

    const getListDataTab4Default = async (type, option, fDate, tDate) => {
        let ids = ""
        if (option == undefined) {
            option = null
        }
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab4(cusId, projectId, option, type, fDate, tDate, ids)
        if (res.status === 200) {
            setDataTab4Default(res.data)
            setDataTab4(res.data)
        }
    }

    const getListDataTab4 = async (type, option, fDate, tDate) => {
        let ids = ""
        if (option == undefined) {
            option = null
        }
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab4(cusId, projectId, option, type, fDate, tDate, ids)
        if (res.status === 200) {
            if (res.data.length > 0) {
                for (let x = 0; x < res.data.length; x++) {
                    drawChartTab4(x, res.data[x])
                }
            }
        }
    }

    const changeMoudleTab5 = async (e) => {
        setTypeModuldeTab5(e.target.value)
        await getListDataTab5Default(e.target.value, activeButtonTab5)
        getListDataTab5(e.target.value, activeButtonTab5)
    }

    const getListDataTab5Default = async (type, typeFil) => {
        let ids = ""
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab5(cusId, projectId, typeFil, type, ids)
        if (res.status === 200) {
            setDataTab5Default(res.data)
            setDataTab5(res.data)
        }
    }

    const getListDataTab5 = async (type, typeFil) => {
        let ids = ""
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab5(cusId, projectId, typeFil, type, ids)
        if (res.status === 200) {
            if (res.data.length > 0) {
                for (let x = 0; x < res.data.length; x++) {
                    if (res.data[x].listDataModule != null) {
                        if (res.data[x].listDataModule.length > 0) {
                            drawChartTab5(x, res.data[x].listDataModule)
                        }
                    }
                }
            }
        }
    }

    const showDataByOptionTab5 = async (option) => {
        setActiveButtonTab5(option)
    }

    const getListDataTab6Default = async (type, option, fDate, tDate) => {
        let ids = ""
        $("#chart-modal-tab-6").show()
        $("#table-tab-6").hide()
        $("#table-tab-6-pro").hide()
        setViewValueTab6Pro(1)
        setTypeViewTab6Pro(true)
        setViewValueTab6(1)
        setTypeViewTab6(true)
        if (option == undefined) {
            option = null
        }
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab6(cusId, projectId, option, type, fDate, tDate, ids)
        if (res.status === 200) {
            setDataTab6Default(res.data)
            setDataTab6(res.data)
            for (let x = 0; x < res.data.length; x++) {
                $("#chart-tab-6-" + x).show()
                // $("#chart-tab-6-" + x).show()
            }
        }
    }

    const getListDataTab6 = async (type, option, fDate, tDate) => {
        let ids = ""
        if (option == undefined) {
            option = null
        }
        $("#table-tab-6-pro").hide()
        $("#table-tab-6").hide()
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.getDataTab6(cusId, projectId, option, type, fDate, tDate, ids)
        if (res.status === 200) {

            for (let x = 0; x < res.data.length; x++) {
                if (res.data[x].listDataCost != undefined) {
                    drawChartTab6(x, res.data[x].listDataCost, type)
                }
            }

        }
    }

    const changeMoudleTab6 = async (e) => {
        setTypeModuldeTab6(e.target.value)
        await getListDataTab6Default(e.target.value, activeButtonTab2, fromDateCost, toDateCost)
        getListDataTab6(e.target.value, activeButtonTab2, fromDateCost, toDateCost)
    }

    const showDataByOptionTab6 = async (option) => {
        setActiveButtonTab6(option)
        setShowToDateTab6(false)
        if (option == 1) {
            setTypeFormatTab6("yy-mm-dd")
        }
        if (option == 2) {
            setTypeFormatTab6("yy-mm")
            setViewCalenderTab6("month")
        }
        if (option == 3) {
            setTypeFormatTab6("yy")
            setViewCalenderTab6("year")
        }
        if (option == 4) {
            setTypeFormatTab6("yy")
            setViewCalenderTab6("year")
        }

        if (option == 5) {
            setTypeFormatTab6("yy-mm-dd")
            setShowToDateTab6(true)
        }

        let time = option
        const today = new Date();
        let fromTime = "";
        let toTime = "";
        if (time == 1) {
            //hôm qua - hôm nay
            today.setDate(today.getDate());
            fromTime = moment(today).format("YYYY-MM-DD") + " 00:00:00";
            today.setDate(today.getDate());
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
        } else if (time == 2) {
            //tháng trước - tháng này
            today.setMonth(today.getMonth());
            fromTime = moment(today).format("YYYY-MM") + "-01" + " 00:00:00";
            today.setMonth(today.getMonth());
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
        } else if (time == 3) {
            //năm trước - năm này
            today.setYear(today.getFullYear());
            fromTime = moment(today).format("YYYY") + "-01-01" + " 00:00:00";
            today.setYear(today.getFullYear());
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
        }
        else if (time == 5) {
            today.setYear(today.getFullYear());
            fromTime = moment(today).format("YYYY-MM-DD") + " 00:00:00";
            today.setYear(today.getFullYear());
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
        }
        else {
            //năm trước - năm này
            today.setYear(today.getFullYear());
            fromTime = moment(today).format("YYYY") + "-01-01" + " 00:00:00";
            today.setYear(today.getFullYear());
            toTime = moment(today).format("YYYY-MM-DD") + " 23:59:59";
        }
        setFDateExportTab6(fromTime);
        setTDateExportTab6(toTime)
        getListDataTab6Default(typeModuldeTab6, time, fromTime, toTime)
        getListDataTab6(typeModuldeTab6, time, fromTime, toTime)
    }

    const onFilterByNameTab6 = () => {
        let name = $("#keyword-tab-2").val();
        $("#polygon-0").hide()

        if (name == "") {
            for (let i = 0; i < dataTab2Default.length; i++) {
                $(`#polygon-${i}`).show()
            }
        } else {
            for (let i = 0; i < dataTab2Default.length; i++) {

                if (dataTab2Default[i].name.toLowerCase().includes(name)) {
                    $(`#polygon-${i}`).show()
                } else {
                    $(`#polygon-${i}`).hide()
                }
            }
        }
    }

    const downloadDataTab1 = async () => {
        let ids = ""
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        }
        let res = await HomeService.exportDataTab1(cusId, projectId, activeButtonTab1, typeModuldeTab1, fDateExport, tDateExport, ids)
    }

    const downloadDataTab6 = async () => {
        let ids = ""
        let cusId = 0;
        if (role === "ROLE_ADMIN") {
            let res = await CustomerService.getListCustomer();
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_MOD") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
        }
        if (role === "ROLE_USER") {

            let res = await CustomerService.getCustomerIds(userName)
            if (res.status === 200 && res.data !== '') {
                cusId = res.data[0].customerId
            }
            let re = await ProjectService.getProIds(userName)
            if (re.status === 200 && re.data !== '') {
                ids = re.data
            }
        }
        if (param.customerId !== undefined) {
            cusId = param.customerId;
        }
        let projectId = null
        if (param.projectId !== undefined) {
            projectId = param.projectId;
        } else {
            projectId = projectIdDataTab6;
        }
        let res = await HomeService.exportDataTab6(cusId, projectId, activeButtonTab6, typeModuldeTab6, fDateExportTab6, tDateExportTab6, ids)
    }

    const clickShowTab2 = (name) => {

        setNameSite(name)

        $('#modal-tab-2').modal('show').on('shown.bs.modal', function () {
            let data = dataTab2Default.filter(data => data.name === name)
            am5.array.each(am5.registry.rootElements, function (root) {
                if (root) {
                    if (root.dom.id == "chart-modal-tab-2") {
                        root.dispose();
                    }
                }
            });

            let root = am5.Root.new("chart-modal-tab-2");

            root._logo.dispose();

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            var chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    panX: true,
                    panY: true,
                    layout: root.verticalLayout,
                })
            );

            chart.children.unshift(am5.Label.new(root, {
                text: t('content.home_page.chart.energy_chart') + ` [[kWh]]`,
                fontSize: 18,
                fontWeight: "500",
                textAlign: "center",
                x: am5.percent(50),
                y: am5.percent(-2),
                centerX: am5.percent(50),
                paddingTop: 0,
                paddingBottom: 0
            }));



            chart.get("colors").set("colors", [
                am5.color(0x0a1a5c),
                am5.color(0xFF0000),
                am5.color(0x00FF00),
            ]);

            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
                behavior: "none"
            }));
            cursor.lineY.set("visible", false);

            // The data


            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var xRenderer = am5xy.AxisRendererX.new(root, {});
            xRenderer.grid.template.set("location", 0.5);
            xRenderer.labels.template.setAll({
                location: 0.5,
                multiLocation: 0.5,
                fontSize: 8
            });

            var xAxis = chart.xAxes.push(
                am5xy.CategoryAxis.new(root, {
                    categoryField: "viewTime",
                    renderer: xRenderer,
                    tooltip: am5.Tooltip.new(root, {})
                })
            );
            if (activeButtonTab2 == 0) {
                xAxis.data.setAll(data[0].listDataPower);
            } else {
                xAxis.data.setAll(data[0].listDataPower);
            }



            var yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(root, {
                    maxPrecision: 10,
                    renderer: am5xy.AxisRendererY.new(root, {
                    })
                })
            );

            if (activeButtonTab2 == 0) {
                yAxis.children.moveValue(am5.Label.new(root, { text: t('content.home_page.chart.energy_power') + ` [[kWh]]`, rotation: -90, y: am5.p50, centerX: am5.p50 }), 0);
            } else {
                yAxis.children.moveValue(am5.Label.new(root, { text: t('content.home_page.chart.energy_power') + ` [[kWh]]`, rotation: -90, y: am5.p50, centerX: am5.p50 }), 0);
            }

            // Add series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

            function createSeries(name, field, checked) {

                let tooltip = am5.Tooltip.new(root, {
                    pointerOrientation: "horizontal",
                    labelText: `{categoryX}[/]\n[bold]${name}: [bold]{valueY} [bold]kWh`,
                });


                var series = chart.series.push(
                    am5xy.LineSeries.new(root, {
                        name: name,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: field,
                        categoryXField: "viewTime",
                        tooltip: tooltip
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
                    strokeWidth: 0
                });

                if (activeButtonTab2 == 0) {
                    series.data.setAll(data[0].listDataPower);
                } else {
                    series.data.setAll(data[0].listDataPower);
                }

                series.appear(1000);
            }

            if (activeButtonTab2 == 0) {

                for (let x = 0; x < data.length; x++) {
                    if (data[x].listDataPower[0] != undefined) {
                        let num = data[x].listDataPower[0].power
                        for (let i = 0; i < data[x].listDataPower.length; i++) {
                            if (data[x].listDataPower[i].power != null) {
                                data[x].listDataPower[i].power = data[x].listDataPower[i].power - num
                                // data[x].listDataPower[i].power = data[x].listDataPower[i].power + 0
                            }
                        }

                        if (activeButtonTab2 == 2) {
                            createSeries(t('content.home_page.chart.accumulated_energy'), "power", true)
                            createSeries(t('content.home_page.chart.base_line'), "sumLandmark")
                            createSeries(t('content.home_page.chart.target_line'), "sumEnergy")

                        } else {
                            createSeries(t('content.home_page.chart.accumulated_energy'), "power", true)
                            createSeries(t('content.home_page.chart.base_line'), "targetEnergy")
                            createSeries(t('content.home_page.chart.target_line'), "planEnergy")


                        }

                    }
                }
            } else {
                for (let x = 0; x < data.length; x++) {
                    if (data[x].listDataPower[0] != undefined) {
                        let num = 0;
                        for (let i = 0; i < data[x].listDataPower.length; i++) {
                            if (data[x].listDataPower[i].power != null) {
                                num = data[x].listDataPower[i].power
                                break;
                            }
                        }
                        for (let i = 0; i < data[x].listDataPower.length; i++) {
                            if (data[x].listDataPower[i].power != null && data[x].listDataPower[i].power != 0) {
                                // data[x].listDataPower[i].power = data[x].listDataPower[i].power - num
                                data[x].listDataPower[i].power = data[x].listDataPower[i].power + 0
                            }
                        }

                        if (activeButtonTab2 == 2) {
                            createSeries(t('content.home_page.chart.accumulated_energy'), "power", true)
                            createSeries(t('content.home_page.chart.base_line'), "sumLandmark")
                            createSeries(t('content.home_page.chart.target_line'), "sumEnergy")

                        } else {
                            createSeries(t('content.home_page.chart.accumulated_energy'), "power", true)
                            createSeries(t('content.home_page.chart.base_line'), "targetEnergy")
                            createSeries(t('content.home_page.chart.target_line'), "planEnergy")
                        }
                    }
                }
            }

            // Add scrollbar
            // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/

            var legend = chart.children.push(
                am5.Legend.new(root, {
                    centerX: am5.p50,
                    x: am5.percent(60),
                    layout: root.horizontalLayout
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

            legend.labels.template.setAll({
                fontSize: 10
            })

            legend.data.setAll(chart.series.values);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            chart.appear(1000, 100);
        });
    }

    const setDataE = async (name) => {
        let data = dataTab3Default.filter(data => data.name === name)
        dataPower.splice(0, data[0].listDataModule.length)
        // setDataPower(data[0].listDataModule)
        for (let i = 0; i < data[0].listDataModule.length; i++) {
            let dataP = data[0].listDataModule[i];
            dataPower.push(dataP)
        }
    }

    const clickShowTab3 = async (name) => {
        let nameLoad = ""
        if (activeButtonTab3 == 1) {
            nameLoad = t('content.month')
        } else if (activeButtonTab3 == 2) {
            nameLoad = t('content.year')
        } else if (activeButtonTab3 == 0) {
            nameLoad = t('content.day')
        }
        setNameSite(name)
        await setDataE(name)
        $('#modal-tab-3').modal('show').on('shown.bs.modal', function () {
            let data = dataTab3Default.filter(data => data.name === name)
            setLoadPower(data[0].dataPower)
            let newDataSr0 = [{
                name: t('content.home_page.load'),
                dataPower: data[0].dataPower,
                sliceSettings: { fill: am5.color(0x00ffff) }
            }]

            let dataDr = data[0].listDataModule
            let dataDraw = [{
                name: "Điện mặt trời",
                dataPower: dataDr[0].dataPower,
                sliceSettings: { fill: am5.color(0x00FF00) }
            },
            {
                name: "Lưới điện",
                dataPower: dataDr[1].dataPower,
                sliceSettings: { fill: am5.color(0x0a1a5c) }
            }
            ]

            am5.array.each(am5.registry.rootElements, function (root) {
                if (root) {
                    if (root.dom.id == "chart-modal-tab-3") {
                        root.dispose();
                    }
                }
            });

            let root = am5.Root.new("chart-modal-tab-3");

            root._logo.dispose();

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            var chart = root.container.children.push(
                am5percent.PieChart.new(root, {
                    layout: root.verticalLayout
                })
            );

            // Create series
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
            // start and end angle must be set both for chart and series
            var series0 = chart.series.push(
                am5percent.PieSeries.new(root, {
                    valueField: "dataPower",
                    categoryField: "name",
                    radius: am5.percent(0),
                    innerRadius: am5.percent(65),
                    x: am5.percent(-23),
                    y: am5.percent(-5),
                })
            );

            series0.slices.template.setAll({
                templateField: "sliceSettings",
                strokeOpacity: 0
            });

            series0.slices.template.states.create("hover", { scale: 1 });
            series0.slices.template.states.create("active", { shiftRadius: 0 });
            series0.labels.template.adapters.add("y", function (y, target) {
                var dataItem = target.dataItem;
                if (dataItem) {
                    var tick = dataItem.get("tick");
                    if (tick) {
                        if (dataItem.get("valuePercentTotal") < 1) {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                        else {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                    }
                    return y;
                }
            });


            var series1 = chart.series.push(
                am5percent.PieSeries.new(root, {
                    radius: am5.percent(75),
                    innerRadius: am5.percent(85),
                    layout: root.horizontalLayout,
                    valueField: "dataPower",
                    categoryField: "name",
                    alignLabels: false,
                    x: am5.percent(-23),
                    y: am5.percent(-5),
                })
            );


            series1.slices.template.setAll({
                templateField: "sliceSettings",
                strokeOpacity: 0
            });

            series1.labels.template.setAll({
                textType: "circular"
            });


            series1.slices.template.states.create("hover", { scale: 1 });
            series1.slices.template.states.create("active", { shiftRadius: 0 });
            series1.labels.template.adapters.add("y", function (y, target) {
                var dataItem = target.dataItem;
                if (dataItem) {
                    var tick = dataItem.get("tick");
                    if (tick) {
                        if (dataItem.get("valuePercentTotal") < 1) {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                        else {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                    }
                    return y;
                }
            });

            var label = chart.seriesContainer.children.push(
                am5.Label.new(root, {
                    textAlign: "center",
                    x: am5.percent(-24),
                    y: am5.percent(-15),
                    text: `[fontSize:18px]${nameLoad}[/]:\n[bold fontSize:30px]${data[0].dataPower != null ? data[0].dataPower : 0} kWh[/]`
                })
            );


            // Set data
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
            series0.data.setAll(newDataSr0);
            series1.data.setAll(dataDraw);

            // Play initial series animation
            // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
            series0.appear(1000, 100);
            series1.appear(1000, 100);
        });
    }

    const setDataC = async (name) => {
        let data = dataTab4Default.filter(data => data.name === name)
        dataPower.splice(0, data.length)
        // setDataPower(data[0].listDataModule)
        for (let i = 0; i < data.length; i++) {
            let dataP = data[i];
            dataPower.push(dataP)
        }
    }

    const clickShowTab4 = async (name) => {
        setNameSite(name)
        await setDataC(name)
        $('#modal-tab-4').modal('show').on('shown.bs.modal', function () {
            let data = dataTab4Default.filter(data => data.name === name)
            setCountDevice(data[0].countDevice)
            let newDataSr0 = [{
                nameType: t('content.home_page.chart.total_devices'),
                count: data[0].countDeviceWarning + data[0].countDeviceWarning + data[0].countDeviceOffline,
                sliceSettings: { fill: am5.color(0x00ffff) }
            }]

            am5.array.each(am5.registry.rootElements, function (root) {
                if (root) {
                    if (root.dom.id == "chart-modal-tab-4") {
                        root.dispose();
                    }
                }
            });

            let newData = [
                {
                    nameType: t('content.home_page.normal'),
                    count: data[0].countDeviceOnline,
                    sliceSettings: { fill: am5.color(0x0a1a5c) }
                },
                {
                    nameType: t('content.home_page.warning'),
                    count: data[0].countDeviceWarning,
                    sliceSettings: { fill: am5.color(0xff671f) }
                },
                {
                    nameType: t('content.home_page.lost_signal'),
                    count: data[0].countDeviceOffline,
                    sliceSettings: { fill: am5.color(0xb5b6d1) }
                },
            ]

            var root = am5.Root.new("chart-modal-tab-4");

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            root._logo.dispose();

            // Create chart
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
            // start and end angle must be set both for chart and series
            var chart = root.container.children.push(
                am5percent.PieChart.new(root, {
                    layout: root.verticalLayout
                })
            );


            var series0 = chart.series.push(
                am5percent.PieSeries.new(root, {
                    valueField: "count",
                    categoryField: "nameType",
                    radius: am5.percent(0),
                    innerRadius: am5.percent(65),
                    x: am5.percent(-23),
                    y: am5.percent(-5),
                })
            );

            series0.slices.template.setAll({
                templateField: "sliceSettings",
                strokeOpacity: 0
            });

            series0.slices.template.states.create("hover", { scale: 1 });
            series0.slices.template.states.create("active", { shiftRadius: 0 });
            series0.labels.template.adapters.add("y", function (y, target) {
                var dataItem = target.dataItem;
                if (dataItem) {
                    var tick = dataItem.get("tick");
                    if (tick) {
                        if (dataItem.get("valuePercentTotal") < 1) {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                        else {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                    }
                    return y;
                }
            });

            // Create series
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
            // start and end angle must be set both for chart and series
            var series1 = chart.series.push(
                am5percent.PieSeries.new(root, {
                    radius: am5.percent(75),
                    innerRadius: am5.percent(85),
                    layout: root.horizontalLayout,
                    valueField: "count",
                    categoryField: "nameType",
                    alignLabels: false,
                    x: am5.percent(-23),
                    y: am5.percent(-5),
                })
            );


            series1.slices.template.setAll({
                templateField: "sliceSettings",
                strokeOpacity: 0
            });

            series1.labels.template.setAll({
                textType: "circular"
            });


            series1.slices.template.states.create("hover", { scale: 1 });
            series1.slices.template.states.create("active", { shiftRadius: 0 });
            series1.labels.template.adapters.add("y", function (y, target) {
                var dataItem = target.dataItem;
                if (dataItem) {
                    var tick = dataItem.get("tick");
                    if (tick) {
                        if (dataItem.get("valuePercentTotal") < 1) {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                        else {
                            target.set("forceHidden", true);
                            tick.set("forceHidden", true);
                        }
                    }
                    return y;
                }
            });

            var label = chart.seriesContainer.children.push(
                am5.Label.new(root, {
                    textAlign: "center",
                    x: am5.percent(-24),
                    y: am5.percent(-15),
                    text: `[fontSize:18px]${t('content.home_page.chart.total_devices')}[/]:\n[bold fontSize:30px]${data[0].countDevice}[/]`
                })
            );

            // Set data
            // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
            series0.data.setAll(newDataSr0);
            series1.data.setAll(newData);

            // Play initial series animation
            // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
            series1.appear(1000, 100);
            series0.appear(1000, 100);
        });
    }

    const clickShowTab5 = (name) => {
        setNameSite(name)

        $('#modal-tab-5').modal('show').on('shown.bs.modal', function () {
            let data = dataTab5Default.filter(data => data.name === name)

            am5.array.each(am5.registry.rootElements, function (root) {
                if (root) {
                    if (root.dom.id == "chart-modal-tab-5") {
                        root.dispose();
                    }
                }
            });

            var root = am5.Root.new("chart-modal-tab-5");

            root._logo.dispose();

            var myTheme = am5.Theme.new(root);

            myTheme.rule("Grid", ["base"]).setAll({
                strokeOpacity: 0.1
            });


            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root),
                myTheme
            ]);


            // Create chart
            // https://www.amcharts.com/docs/v5/charts/xy-chart/
            var chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    panX: false,
                    panY: false,
                    wheelX: "none",
                    wheelY: "none"
                })
            );

            chart.get("colors").set("colors", [
                am5.color(0x0a1a5c),
                am5.color(0xff671f),
                am5.color(0xb5b6d1),
            ]);

            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var yRenderer = am5xy.AxisRendererY.new(root, { minGridDistance: 30 });
            yRenderer.grid.template.set("location", 1);

            var yAxis = chart.yAxes.push(
                am5xy.CategoryAxis.new(root, {
                    maxDeviation: 0,
                    categoryField: "name",
                    renderer: yRenderer,
                })
            );

            yAxis.data.setAll(data[0].listDataModule);

            var xAxis = chart.xAxes.push(
                am5xy.ValueAxis.new(root, {
                    maxDeviation: 0,
                    min: 0,
                    renderer: am5xy.AxisRendererX.new(root, {
                        visible: true,
                        strokeOpacity: 0.1
                    })
                })
            );


            // Create series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
            function makeSeries(fieldName, textName) {
                var series = chart.series.push(
                    am5xy.ColumnSeries.new(root, {
                        name: "Series 1",
                        stacked: true,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueXField: fieldName,
                        clustered: false,
                        // sequencedInterpolation: true,
                        categoryYField: "name"
                    })
                );

                // if (param.projectId != undefined) {

                //     series.bullets.push(function () {
                //         return am5.Bullet.new(root, {
                //             locationX: 1,
                //             locationY: 0.5,
                //             sprite: am5.Label.new(root, {
                //                 centerX: am5.percent(-10),
                //                 centerY: am5.p50,
                //                 text: `${fieldName} thiết bị`,
                //                 fill: am5.color(0x000000),
                //                 populateText: true
                //             })
                //         });
                //     });
                // } else {
                //     series.bullets.push(function () {
                //         return am5.Bullet.new(root, {
                //             locationX: 1,
                //             locationY: 0.5,
                //             sprite: am5.Label.new(root, {
                //                 centerX: am5.percent(10),
                //                 centerY: am5.p50,
                //                 text: "{countDevice} thiết bị",
                //                 fill: am5.color(0x000000),
                //                 populateText: true
                //             })
                //         });
                //     });
                // }

                series.columns.template.setAll({
                    tooltipText: `[bold]{valueX} ${textName}`,
                    //height: am5.percent(50),
                    tooltipY: 0,
                    strokeOpacity: 0,
                });


                // Set data


                series.data.setAll(data[0].listDataModule);
                series.appear(1000);
            }

            makeSeries("countDeviceOnline", t('content.home_page.chart.active_device'))
            makeSeries("countDeviceWarning", t('content.home_page.chart.warning_device'))
            makeSeries("countDeviceOffline", t('content.home_page.chart.inactive_device'))

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/

            chart.appear(1000, 100);
        });
    }

    const clickShowTab6 = (name) => {
        setNameSite(name)

        $('#modal-tab-6').modal('show').on('shown.bs.modal', function () {
            let data = dataTab6Default.filter(data => data.name === name)
            setDataTableTab6(data[0].listDataCost);
            if (data[0].listDataCost.length > 0) {
                setProjectIdDataTab6(data[0].listDataCost[0].projectId)
            }

            am5.array.each(am5.registry.rootElements, function (root) {
                if (root) {
                    if (root.dom.id == "chart-modal-tab-6") {
                        root.dispose();
                    }
                }
            });

            let root = am5.Root.new("chart-modal-tab-6");

            root._logo.dispose();

            // Set themes
            // https://www.amcharts.com/docs/v5/concepts/themes/
            root.setThemes([
                am5themes_Animated.new(root)
            ]);

            let chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    heelX: "panX",
                    wheelY: "zoomX",
                    panX: true,
                    panY: false,
                    layout: root.verticalLayout

                })
            );

            chart.children.unshift(am5.Label.new(root, {
                text: t('content.home_page.chart.revenue_energy_cost'),
                fontSize: 18,
                fontWeight: "500",
                textAlign: "center",
                x: am5.percent(50),
                y: am5.percent(-2),
                centerX: am5.percent(50),
                paddingTop: 0,
                paddingBottom: 0
            }));

            chart.get("colors").set("colors", [
                am5.color(0x1d6930),
                am5.color(0x175978),
                am5.color(0xd92323),
                am5.color(0xff7f00),
            ]);

            // Create axes
            // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
            var xRenderer = am5xy.AxisRendererX.new(root, {});
            xRenderer.labels.template.setAll({
                rotation: -70,
                paddingTop: -20,
                paddingRight: 10,
                fontSize: 10
            });

            var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
                categoryField: "viewTime",
                renderer: xRenderer,
                tooltip: am5.Tooltip.new(root, {})
            }));

            xRenderer.grid.template.setAll({
                location: 1
            })

            xAxis.data.setAll(data[0].listDataCost);

            var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
                min: 0,
                renderer: am5xy.AxisRendererY.new(root, {
                    strokeOpacity: 0.1
                })
            }));

            yAxis.children.moveValue(am5.Label.new(root, { text: `${t('content.home_page.chart.cost')} [[VND]]`, rotation: -90, y: am5.p50, centerX: am5.p50 }), 0);


            // Add legend
            // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
            var legend = chart.children.push(am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50
            }));

            // Add series
            // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
            function makeSeries(name, fieldName, ep) {
                var series = chart.series.push(am5xy.ColumnSeries.new(root, {
                    name: name,
                    stacked: true,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: fieldName,
                    categoryXField: "viewTime",
                    valueXField: ep,
                }));

                series.columns.template.setAll({
                    tooltipText: "[bold]{name}[/]\n{categoryX}[/]\n" + `${t('content.home_page.chart.cost')}` + ": [bold]{valueY} [[VND]][/]  \n" + `${t('content.home_page.chart.energy_power')}` + ": [bold]{valueX} [[kWh]]",
                    tooltipY: am5.percent(10)
                });

                series.data.setAll(data[0].listDataCost);

                // Make stuff animate on load
                // https://www.amcharts.com/docs/v5/concepts/animations/
                series.appear();

                series.bullets.push(function () {
                    return am5.Bullet.new(root, {
                        sprite: am5.Label.new(root, {
                            text: "{valueY}",
                            fill: root.interfaceColors.get("alternativeText"),
                            centerY: am5.p50,
                            centerX: am5.p50,
                            populateText: true
                        })
                    });
                });
                legend.labels.template.setAll({
                    fontSize: 10
                })
                legend.data.push(series);
                series.appear();
            }
            if (typeModuldeTab6 == 1) {
                makeSeries(t('content.home_page.chart.off_peak_hours'), "costLowIn", "lowEp")
                makeSeries(t('content.home_page.chart.normal'), "costMediumIn", "normalEp")
                makeSeries(t('content.home_page.chart.peak_hours'), "costHighIn", "highEp")
                makeSeries(t('content.home_page.vat'), "")
            } else if (typeModuldeTab6 == 2) {
                makeSeries("Giá bán điện thấp điểm", "costLowOut", "lowEp")
                makeSeries("Giá bán điện bình thường", "costMediumOut", "normalEp")
                makeSeries("Giá bán điện cao điểm", "costHighOut", "highEp")
                makeSeries(t('content.home_page.vat'), "")
            } else if (typeModuldeTab6 == 3) {
                makeSeries("Tiền điện thấp điểm", "costLowIn", "lowEp")
                makeSeries("Tiền điện bình thường", "costMediumIn")
                makeSeries("Tiền điện cao điểm", "costHighIn", "highEp")
                makeSeries(t('content.home_page.vat'), "")
            }

            // Add cursor
            // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
            let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            }));
            cursor.lineY.set("visible", false);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            chart.appear(1000, 100);
        });
    }

    function formatCurrency(value) {
        if (value != null) {
            return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        } else {
            return '0 VNĐ';
        }
    }

    function formatNumber(number) {
        return new Intl.NumberFormat('vi-VN').format(number);
    }

    const renderPowerFlow = () => {
        return (
            <>
                <div className="div-content-left">
                    <div className="content-1">
                        <div className="sent-date" style={{ height: 0, marginLeft: 30 }}>
                            {listData.sentDate}
                        </div>
                        <div className="ct-1-left">
                            <div className="text-center row-ct1">
                                <div style={{ position: "absolute", left: "67%", bottom: "78%", fontWeight: "bold", fontSize: "16px" }}>{listData.powerInstantGrid != null && listData.powerInstantGrid != 0 ? listData.powerInstantGrid.toFixed(2) + " kW" : ""}</div>
                                <div style={{ position: "absolute", right: "42%", top: "10%", fontWeight: "bold" }}>{t('content.home_page.grid')}</div>
                                <div><img src="/resources/image/overview/icon-grid-overview.svg" style={{ height: "12%", position: "absolute", zIndex: "1", top: "16%", right: "40%" }}></img></div>
                                <div style={listData.powerInstantGrid > 0 || listData.powerInstantGrid == null ? { position: "absolute", left: "59%", top: "22%" } : { position: "absolute", left: "59%", top: "22%", rotate: "180deg" }} className={listData.powerInstantGrid != null && listData.powerInstantGrid != 0 ? "arrow-1" : "arrow-1-block"}>
                                    <div className="move"></div>
                                </div>
                            </div>
                            <div className="text-center row-ct1">
                                <div style={{ position: "absolute", left: "67%", bottom: "47%", fontWeight: "bold", fontSize: "16px" }}>{listData.powerInstantSolar != null && listData.powerInstantSolar != 0 ? listData.powerInstantSolar + " kW" : ""}</div>
                                <div style={{ position: "absolute", right: "39%", top: "42%", fontWeight: "bold" }}>{t('content.home_page.solar')}</div>
                                <img src="/resources/image/overview/icon-solar-overview.svg" style={{ height: "12%", position: "absolute", zIndex: "1", top: "48%", right: "40%" }}></img>
                                <div style={listData.powerInstantSolar >= 0 || listData.powerInstantSolar == null ? { position: "absolute", left: "59%", top: "54%" } : { position: "absolute", left: "59%", top: "54%", rotate: "180deg" }} className={listData.powerInstantSolar != null && listData.powerInstantSolar != 0 ? "arrow-1" : "arrow-1-block"}>
                                    <div className="move"></div>
                                </div>
                            </div>
                            <div className="text-center row-ct1 mb-4">
                                <div style={{ position: "absolute", left: "67%", bottom: "16%", fontWeight: "bold", fontSize: "16px" }}>{listData.powerInstantWind != null ? listData.powerInstantWind + " kW" : ""}</div>
                                <div style={{ position: "absolute", right: "43%", top: "74%", fontWeight: "bold" }}>{t('content.home_page.wind')}</div>
                                <img src="/resources/image/overview/icon-wind-overview.svg" style={{ height: "12%", position: "absolute", zIndex: "1", top: "80%", right: "40%" }}></img>
                                <div style={{ position: "absolute", left: "59%", top: "86%" }} className={listData.powerInstantWind != null && listData.powerInstantWind != 0 ? "arrow-1" : "arrow-1-block"}></div>
                            </div>
                        </div>
                        <div className="ct-1-right">
                            <div className="text-center row-ct1">
                                <div style={{ position: "absolute", left: "11%", bottom: "78%", fontWeight: "bold", fontSize: "16px" }}>{listData.powerInstantLoad != null ? listData.powerInstantLoad.toFixed(2) + " kW" : ""}</div>
                                <div style={{ position: "absolute", left: "43%", top: "10%", fontWeight: "bold" }}>{t('content.home_page.load')}</div>
                                <img src="/resources/image/overview/icon-load-overview.svg" style={{ height: "12%", position: "absolute", zIndex: "1", top: "16%", left: "41%" }}></img>
                                <div style={listData.powerInstantGrid > 0 || listData.powerInstantGrid == null ? { position: "absolute", left: "0%", top: "22%" } : { position: "absolute", left: "0%", top: "22%", rotate: "180deg" }} className={listData.powerInstantLoad != null && listData.powerInstantLoad != 0 ? "arrow-1" : "arrow-1-block"}>
                                    <div className="move"></div>
                                </div>
                            </div>
                            <div className="text-center row-ct1">
                                <div style={{ position: "absolute", left: "11%", bottom: "47%", fontWeight: "bold", fontSize: "16px" }}>{listData.powerInstantBattery != null ? listData.powerInstantBattery + " kW" : ""}</div>
                                <div style={{ position: "absolute", left: "41%", top: "42%", fontWeight: "bold" }}>{t('content.home_page.battery')}</div>
                                <img src="/resources/image/overview/icon-battery-overview.svg" style={{ height: "12%", position: "absolute", zIndex: "1", top: "48%", left: "41%" }}></img>
                                <div style={{ position: "absolute", left: "0%", top: "54%", rotate: "180deg" }} className={listData.powerInstantBattery != null && listData.powerInstantBattery != 0 ? "arrow-1" : "arrow-1-block"}></div>
                            </div>
                            <div className="text-center row-ct1">
                                <div style={{ position: "absolute", left: "11%", bottom: "47%", fontWeight: "bold", fontSize: "16px" }}>{listData.powerInstantBattery != null ? listData.powerInstantBattery + " kW" : ""}</div>
                                <div style={{ position: "absolute", left: "42%", top: "74%", fontWeight: "bold" }}>{t('content.home_page.generator')}</div>
                                <img src="/resources/image/overview/icon-generator-overview.svg" style={{ height: "12%", position: "absolute", zIndex: "1", top: "80%", left: "41%" }}></img>
                                <div style={{ position: "absolute", left: "0%", top: "86%", rotate: "180deg" }} className={listData.powerInstantBattery != null && listData.powerInstantBattery != 0 ? "arrow-1" : "arrow-1-block"}></div>
                            </div>
                        </div>
                    </div>

                </div>
            </>
        )
    }

    const renderMap = () => {
        return (
            <div className="div-content-right">
                <Switch>
                    <Route path={"/"} ><ProjectMap initMap={initMap} project={projectId}></ProjectMap></Route>
                    <Route path={"*"} ><AccessDenied /></Route>
                </Switch>
            </div>
        )
    }

    const renderEnergyData = () => {
        return (
            <div className="div-content-left">
                <>
                    <div>
                        <div className="input-group float-left mr-1" style={{ width: "100%", marginLeft: "8px", overflowX: "scroll" }}>
                            <div className="radio-tabs">
                                <label className="radio-tabs__field" style={{ width: "170px" }}>
                                    <input type="radio" name="radio-tabs-1" value={1} className="radio-tabs__input-1" checked={typeModuldeTab1 == 1 ? true : false} onChange={(e) => changeMoudleTab1(e)} />
                                    <span className="radio-tabs__text" style={{ width: "160px" }}>
                                        <img src="/resources/image/icon-load-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                        {t('content.home_page.load')}</span>
                                </label>
                                <label className="radio-tabs__field" style={{ width: "170px" }} >
                                    <input type="radio" name="radio-tabs-1" value={2} className="radio-tabs__input-1" checked={typeModuldeTab1 == 2 ? true : false} onChange={(e) => changeMoudleTab1(e)} />
                                    <span className="radio-tabs__text" style={{ width: "160px" }}>
                                        <img src="/resources/image/icon-solar-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                        {t('content.home_page.solar')}</span>
                                </label>
                                <label className="radio-tabs__field" style={{ width: "170px" }} >
                                    <input type="radio" name="radio-tabs-1" value={5} className="radio-tabs__input-1" checked={typeModuldeTab1 == 5 ? true : false} onChange={(e) => changeMoudleTab1(e)} />
                                    <span className="radio-tabs__text" style={{ width: "160px" }}>
                                        <img src="/resources/image/icon-grid-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                        {t('content.home_page.grid')}</span>
                                </label>
                                <label className="radio-tabs__field" style={{ width: "170px" }}>
                                    <input type="radio" name="radio-tabs-1" value={3} className="radio-tabs__input-1" checked={typeModuldeTab1 == 3 ? true : false} onChange={(e) => changeMoudleTab1(e)} />
                                    <span className="radio-tabs__text" style={{ width: "160px" }}>
                                        <img src="/resources/image/icon-battery-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                        {t('content.home_page.battery')}</span>
                                </label>
                                <label className="radio-tabs__field" style={{ width: "170px" }}>
                                    <input type="radio" name="radio-tabs-1" value={4} className="radio-tabs__input-1" checked={typeModuldeTab1 == 4 ? true : false} onChange={(e) => changeMoudleTab1(e)} />
                                    <span className="radio-tabs__text" style={{ width: "160px" }}>
                                        <img src="/resources/image/icon-wind-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                        {t('content.home_page.wind')}</span>
                                </label>
                                <label className="radio-tabs__field" style={{ width: "170px" }}>
                                    <input type="radio" name="radio-tabs-1" value={6} className="radio-tabs__input-1" onChange={(e) => changeMoudleTab1(e)} />
                                    <span className="radio-tabs__text" style={{ width: "160px" }}>
                                        <img src="/resources/image/icon-wind-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                        {t('content.home_page.generator')}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="option-time">
                        <button className={activeButtonTab1 == 0 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab1(0)}>{t('content.day')}</button>
                        <button className={activeButtonTab1 == 1 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab1(1)}>{t('content.month')}</button>
                        <button className={activeButtonTab1 == 2 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab1(2)}>{t('content.year')}</button>
                        <button className={activeButtonTab1 == 3 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab1(3)}>{t('content.total')}</button>
                        <button className={activeButtonTab1 == 4 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab1(4)}>{t('content.custom')}</button>
                        <button className="button-time-from">
                            {activeButtonTab1 == 1 || activeButtonTab1 == 2 ?
                                <Calendar
                                    id="from-value"
                                    className="celendar-picker"
                                    dateFormat={typeFormat}
                                    value={fromDate}
                                    view={viewCalender}
                                    onChange={e => onChangeValueTime(e)}
                                />
                                :
                                <Calendar
                                    id="from-value"
                                    className="celendar-picker"
                                    dateFormat={typeFormat}
                                    value={fromDate}
                                    onChange={e => onChangeValueTime(e)}
                                />
                            }
                        </button>
                        {showToDateTab1 == true &&
                            <button className="button-time-to">
                                <Calendar
                                    id="from-value"
                                    className="celendar-picker"
                                    dateFormat={typeFormat}
                                    value={toDate}
                                    onChange={e => onChangeToDateValueTime(e)}
                                />
                            </button>
                        }
                        <button className="float-right btn btn-view" title="Kiểu xem" type="button">
                            <i className="fa-solid fa-circle-info fa-2x"></i>
                        </button>
                        <button className="float-right btn btn-view" title="Chuyển đổi hiển thị bảng biểu" type="button" onClick={() => changeValueView(1)}>
                            <i className={typeView == true ? "fa-solid fa-bars fa-2x" : "fa-solid fa-chart-line fa-2x"} style={viewValue == 1 ? { color: "#ff671f" } : { color: "" }}></i>
                        </button>
                        {/* <CSVLink data={dataTable} headers={headerFile}> */}
                        <button className="float-right btn btn-view" title="Trích xuất dữ liệu" type="button" onClick={downloadDataTab1}>
                            <i className="fa-solid fa-download fa-2x" style={viewValue == 2 ? { color: "#ff671f" } : { color: "" }}></i>
                        </button>
                        {/* </CSVLink> */}
                    </div>
                    <div className="content">
                        <div id="chartdiv" style={{ height: "100%" }}></div>
                        <div id="table-power" className="table-power" style={{ position: "absolute", height: "100%", marginTop: "10px" }} >
                            <table id="table-instance-tab-1" className="table-parameter" style={{ maxHeight: "700px", overflow: "auto", width: "99%" }} ref={tableRef}>
                                <thead>
                                    <tr>
                                        <th className="th-view-time">Thời Gian</th>
                                        {dataTab1?.map((data, i) => (
                                            <th className="th-content" key={i}>
                                                {data.name} {unitTab1}
                                            </th>
                                        ))
                                        }
                                        <th className="th-content-last">Tổng {unitTab1}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataTab1ListTime.map((dataTime, i) => (
                                            <tr key={i}>
                                                <th className="td-view-time">{dataTime.viewTime}</th>
                                                {dataTab1?.map((data, i) => (
                                                    <th className="td-content-en" key={i}>
                                                        {dataTab1?.map((dataChil, i) => (
                                                            <div key={i}>
                                                                {dataChil.name == data.name &&
                                                                    <>
                                                                        {
                                                                            dataChil.listDataPower?.map((dataTimeChil, i) => (
                                                                                <div key={i}>
                                                                                    {dataTime.viewTime == dataTimeChil.viewTime &&
                                                                                        <>
                                                                                            <div key={i}>
                                                                                                {formatNumber(dataTimeChil.power)}
                                                                                            </div>
                                                                                        </>
                                                                                    }
                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </>
                                                                }
                                                            </div>
                                                        ))
                                                        }
                                                    </th>
                                                ))
                                                }
                                                <th className="td-content-en">
                                                    {dataTab1ListTotal?.map((dataTotal, i) => (
                                                        <div key={i}>
                                                            {dataTime.viewTime == dataTotal.viewTime ? formatNumber(dataTotal.power) : ""}
                                                        </div>
                                                    ))}
                                                </th>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            </div>
        )
    }

    const renderEnergyUsagePlan = () => {
        return (
            <div className="div-content-right">
                <div className="input-group float-left mr-1" style={{ width: "100%", marginLeft: "8px", overflowX: "scroll" }}>
                    <div className="radio-tabs">
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-2" value={1} className="radio-tabs__input-2" checked={typeModuldeTab2 == 1 ? true : false} onChange={(e) => changeMoudleTab2(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-load-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.load')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }} >
                            <input type="radio" name="radio-tabs-2" value={2} className="radio-tabs__input-2" checked={typeModuldeTab2 == 2 ? true : false} onChange={(e) => changeMoudleTab2(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-solar-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.solar')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }} >
                            <input type="radio" name="radio-tabs-2" value={5} className="radio-tabs__input-2" checked={typeModuldeTab2 == 5 ? true : false} onChange={(e) => changeMoudleTab2(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-grid-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.grid')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-2" value={3} className="radio-tabs__input-2" checked={typeModuldeTab2 == 3 ? true : false} onChange={(e) => changeMoudleTab2(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-battery-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.battery')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-2" value={4} className="radio-tabs__input-2" checked={typeModuldeTab2 == 4 ? true : false} onChange={(e) => changeMoudleTab2(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-wind-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.wind')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-2" value={4} className="radio-tabs__input-2" onChange={(e) => changeMoudleTab2(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-wind-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.generator')}</span>
                        </label>
                    </div>
                </div>
                <div className="option-time">
                    <button className={activeButtonTab2 == 0 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab2(0)}>{t('content.day')}</button>
                    <button className={activeButtonTab2 == 1 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab2(1)}>{t('content.month')}</button>
                    <button className={activeButtonTab2 == 2 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab2(2)}>{t('content.year')}</button>
                    <button className={activeButtonTab2 == 3 ? "button-time" : "button-time-block"} style={{ backgroundColor: "silver", color: "white" }}>{t('content.total')}</button>
                    <button className="button-time-from">
                        {activeButtonTab2 == 1 || activeButtonTab2 == 2 ?
                            <Calendar
                                id="from-value"
                                className="celendar-picker"
                                dateFormat={typeFormatTab2}
                                value={fromDate}
                                view={viewCalenderTab2}
                                onChange={e => onChangeValueTimeTab2(e)}
                            />
                            :
                            <Calendar
                                id="from-value"
                                className="celendar-picker"
                                dateFormat={typeFormatTab2}
                                value={fromDate}
                                onChange={e => onChangeValueTimeTab2(e)}
                            />
                        }
                    </button>
                    {param.projectId == undefined ?
                        <input type="text" id="keyword-tab-2" name="keyword" className="float-right input-name" placeholder={t('content.home_page.search') + '.....'} onChange={(e) => onFilterByNameTab2()} />
                        :
                        <></>
                    }
                </div>
                {param.projectId == undefined ?
                    <div className="content">
                        {dataTab2?.map((data, index) => (
                            <div className="polygon-overview-outside" id={"polygon-" + index} key={index} onClick={() => clickShowTab2(data.name)}>
                                <div className="polygon-overview-inside" title={data.name}>
                                    <div className="labelTag">{data.name}</div>
                                    {data.listDataPower != null ?
                                        <>
                                            {data.listDataPower.length > 0 ?
                                                <div className="box">
                                                    <div id={"chart-" + index} className="chart"></div>
                                                </div>
                                                :
                                                <div className="box">
                                                    <div className="chart">{t('content.no_data')}</div>
                                                </div>
                                            }
                                        </>
                                        :
                                        <>
                                            {data.listDataPower != null ?
                                                <>
                                                    {
                                                        data.listDataPower.length > 0 ?
                                                            <div className="box">
                                                                <div id={"chart-" + index} className="chart"></div>
                                                            </div>
                                                            :
                                                            <div className="box">
                                                                <div className="chart">{t('content.no_data')}</div>
                                                            </div>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <div className="box">
                                                        <div className="chart">{t('content.no_data')}</div>
                                                    </div>
                                                </>
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                        ))
                        }
                        <div className="modal fade" id="modal-tab-2" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="modal-content" style={{ maxWidth: "100%" }}>
                                    <div className="modal-header">
                                        <div style={{ fontWeight: "bold", fontSize: "20px" }}>{nameSite}</div>
                                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                    </div>
                                    <div className="modal-body">
                                        <div id="chart-modal-tab-2" style={{ width: "100%", height: "500px" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="content">

                        {dataTab2?.map((data, index) => (
                            <span key={index}>
                                {data.listDataPower != null ? <>
                                    {data.listDataPower.length > 0 ?
                                        <div id={"chart-" + index} style={{ height: "100%" }}></div>
                                        :
                                        <div className="chart" style={{ width: "100%", height: "200px", textAlign: "center", position: "absolute", top: "40%", fontSize: "24px", fontWeight: "300" }}>{t('content.no_data')}</div>
                                    }
                                </>
                                    :
                                    <>
                                        {data.listDataPower != null ?
                                            <>
                                                <>
                                                    {data.listDataPower.length > 0 ?
                                                        <div id={"chart-" + index} style={{ height: "100%" }}></div>
                                                        :
                                                        <div className="chart" style={{ width: "100%", height: "200px", textAlign: "center", position: "absolute", top: "40%", fontSize: "24px", fontWeight: "300" }}>{t('content.no_data')}</div>
                                                    }
                                                </>
                                            </>
                                            :
                                            <> <div className="chart" style={{ width: "100%", height: "200px", textAlign: "center", position: "absolute", top: "40%", fontSize: "24px", fontWeight: "300" }}>{t('content.no_data')}</div></>
                                        }
                                    </>


                                }

                            </span>
                        ))
                        }

                    </div>
                }
            </div >
        )
    }

    const renderEnergyCostRevenue = () => {
        return (
            <div className="div-content-left">
                <div className="input-group float-left mr-1" style={{ width: "100%", marginLeft: "8px", overflowX: "scroll" }}>
                    <div className="radio-tabs">
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-3" value={1} className="radio-tabs__input-3" checked={typeModuldeTab6 == 1 ? true : false} onChange={(e) => changeMoudleTab6(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-load-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.load')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }} >
                            <input type="radio" name="radio-tabs-3" value={2} className="radio-tabs__input-3" checked={typeModuldeTab6 == 2 ? true : false} onChange={(e) => changeMoudleTab6(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-solar-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.solar')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }} >
                            <input type="radio" name="radio-tabs-3" value={5} className="radio-tabs__input-3" checked={typeModuldeTab6 == 5 ? true : false} onChange={(e) => changeMoudleTab6(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-grid-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.grid')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-3" value={3} className="radio-tabs__input-3" checked={typeModuldeTab6 == 3 ? true : false} onChange={(e) => changeMoudleTab6(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-battery-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.battery')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-3" value={4} className="radio-tabs__input-3" checked={typeModuldeTab6 == 4 ? true : false} onChange={(e) => changeMoudleTab6(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-wind-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.wind')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-3" value={4} className="radio-tabs__input-3" onChange={(e) => changeMoudleTab6(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-wind-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.generator')}</span>
                        </label>
                    </div>
                </div>
                <div className="option-time">
                    <button className={activeButtonTab6 == 1 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab6(1)}>{t('content.day')}</button>
                    <button className={activeButtonTab6 == 2 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab6(2)}>{t('content.month')}</button>
                    <button className={activeButtonTab6 == 3 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab6(3)}>{t('content.year')}</button>
                    <button className={activeButtonTab6 == 4 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab6(4)}>{t('content.total')}</button>
                    <button className={activeButtonTab6 == 5 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab6(5)}>{t('content.custom')}</button>
                    <button className="button-time-from">
                        {activeButtonTab6 == 2 || activeButtonTab6 == 3 || activeButtonTab6 == 4 ?
                            <Calendar
                                id="from-value"
                                className="celendar-picker"
                                dateFormat={typeFormatTab6}
                                value={fromDate}
                                view={viewCalenderTab6}
                                onChange={e => onChangeValueTimeTab6(e)}
                            />
                            :
                            <Calendar
                                id="from-value"
                                className="celendar-picker"
                                dateFormat={typeFormatTab6}
                                value={fromDate}
                                onChange={e => onChangeValueTimeTab6(e)}
                            />
                        }
                    </button>
                    {showToDateTab6 == true &&
                        <button className="button-time-to">
                            <Calendar
                                id="from-value"
                                className="celendar-picker"
                                dateFormat={typeFormatTab6}
                                value={toDate}
                                onChange={e => onChangeToDateValueTimeTab6(e)}
                            />
                        </button>
                    }
                    {param.projectId == undefined ?

                        <>
                            <input type="text" id="keyword" name="keyword" className="float-right input-name" placeholder={t('content.home_page.search') + '.....'} />
                        </> :
                        <>
                            <button className="float-right btn btn-view" title="Kiểu xem" type="button">
                                <i className="fa-solid fa-circle-info fa-2x"></i>
                            </button>
                            <button className="float-right btn btn-view" title="Chuyển đổi hiển thị bảng biểu" type="button" onClick={() => changeValueViewTab6Pro(1)}>
                                <i className={typeViewTab6Pro == true ? "fa-solid fa-bars fa-2x" : "fa-solid fa-chart-line fa-2x"} style={viewValueTab6Pro == 1 ? { color: "#ff671f" } : { color: "" }}></i>
                            </button>

                            <button className="float-right btn btn-view" title="Trích xuất dữ liệu" type="button" onClick={downloadDataTab6}>
                                <i className="fa-solid fa-download fa-2x" style={viewValueTab6Pro == 2 ? { color: "#ff671f" } : { color: "" }}></i>
                            </button>
                        </>
                    }
                </div>
                {param.projectId == undefined ?
                    <div className="content">
                        {dataTab6?.map((data, index) => (
                            <div className="polygon-overview-outside" id={"polygon-" + index} key={index} onClick={() => clickShowTab6(data.name)}>
                                <div className="polygon-overview-inside" title={data.name}>
                                    <div className="labelTag">{data.name}</div>
                                    {data.listDataCost != undefined ?
                                        <div className="box">
                                            <div id={"chart-tab-6-" + index} className="chart"></div>
                                        </div>
                                        :
                                        <div className="box">
                                            <div className="chart">{t('content.no_data')}</div>
                                        </div>
                                    }
                                </div>
                            </div>
                        ))
                        }
                        <div className="modal fade" id="modal-tab-6" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="modal-content" style={{ maxWidth: "100%" }}>
                                    <div className="modal-header">
                                        <div style={{ fontWeight: "bold", fontSize: "20px" }}>{nameSite}
                                        </div>
                                        <div style={{ float: "right" }}>
                                            <button className="float-right btn btn-view" title="Kiểu xem" type="button">
                                                <i className="fa-solid fa-circle-info fa-2x"></i>
                                            </button>
                                            <button className="float-right btn btn-view" title="Chuyển đổi hiển thị bảng biểu" type="button" onClick={() => changeValueViewTab6(1)}>
                                                <i className={typeViewTab6 == true ? "fa-solid fa-bars fa-2x" : "fa-solid fa-chart-line fa-2x"} style={viewValueTab6 == 1 ? { color: "#ff671f" } : { color: "" }}></i>
                                            </button>
                                            <button className="float-right btn btn-view" title="Trích xuất dữ liệu" type="button" onClick={downloadDataTab6}>
                                                <i className="fa-solid fa-download fa-2x" style={viewValueTab6 == 2 ? { color: "#ff671f" } : { color: "" }}></i>
                                            </button>
                                        </div>
                                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                    </div>
                                    <div className="modal-body">
                                        <div id="chart-modal-tab-6" style={{ width: "100%", height: "500px" }}></div>
                                        <div id="table-tab-6" className="table-power" style={{ minHeight: "500px", height: "100%", marginTop: "10px" }} >
                                            <table id="table-instance-tab-6" className="table-parameter" style={{ maxHeight: "500px", overflowY: "auto", width: "99%" }} ref={tableRef}>
                                                <thead>
                                                    <tr>
                                                        <th className="th-view-time">Thời Gian</th>
                                                        <th className="th-content">Giờ Thấp Điểm</th>
                                                        <th className="th-content">Giờ {t('content.home_page.normal')}</th>
                                                        <th className="th-content">Giờ Cao Điểm</th>
                                                        <th className="th-content-last">Tổng</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {dataTableTab6.length > 0 &&
                                                        <>
                                                            {
                                                                dataTableTab6.map((data, i) => (
                                                                    <React.Fragment key={i}>
                                                                        <tr>
                                                                            <td rowSpan="2" className="td-view-time">{data.viewTime}</td>
                                                                            <td className="td-content-cost">{formatCurrency(data.costLowIn)}</td>
                                                                            <td className="td-content-cost">{formatCurrency(data.costMediumIn)}</td>
                                                                            <td className="td-content-cost">{formatCurrency(data.costHighIn)}</td>
                                                                            <td className="td-content-cost">
                                                                                {formatCurrency((data.costLowIn || 0) + (data.costMediumIn || 0) + (data.costHighIn || 0))}
                                                                            </td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td className="td-content-en">{formatNumber(parseFloat(data.lowEp != null ? data.lowEp : 0))} kWh</td>
                                                                            <td className="td-content-en">{formatNumber(parseFloat(data.normalEp != null ? data.normalEp : 0))} kWh</td>
                                                                            <td className="td-content-en">{formatNumber(parseFloat(data.highEp != null ? data.highEp : 0))} kWh</td>
                                                                            <td className="td-content-en">
                                                                                {formatNumber(
                                                                                    parseFloat(data.lowEp != null ? data.lowEp : 0) +
                                                                                    parseFloat(data.normalEp != null ? data.normalEp : 0) +
                                                                                    parseFloat(data.highEp != null ? data.highEp : 0)
                                                                                )} kWh
                                                                            </td>

                                                                        </tr>

                                                                    </React.Fragment>
                                                                ))
                                                            }
                                                        </>
                                                    }


                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="content">
                        {dataTab6?.map((data, index) => (
                            <span key={index}>
                                {data.listDataCost.length > 0 ?
                                    <>
                                        <div id={"chart-tab-6-" + index} style={{ height: "100%" }}></div>
                                        <div id="table-tab-6-pro" className="table-power" style={{ minHeight: "500px", height: "100%", marginTop: "10px" }} >
                                            <table id="table-instance-tab-6" className="table-parameter" style={{ maxHeight: "700px", overflow: "auto", width: "99%" }} ref={tableRef}>
                                                <thead>
                                                    <tr>
                                                        <th className="th-view-time">Thòi Gian</th>
                                                        <th className="th-content">Giờ Thấp Điểm</th>
                                                        <th className="th-content">Giờ {t('content.home_page.normal')}</th>
                                                        <th className="th-content">Giờ Cao Điểm</th>
                                                        <th className="th-content-last">Tổng</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataTab6[0].listDataCost.length > 0 &&
                                                        <>
                                                            {
                                                                dataTab6[0].listDataCost.map((data, i) => (
                                                                    <React.Fragment key={i}>
                                                                        <tr>
                                                                            <td rowSpan="2" className="td-view-time">{data.viewTime}</td>
                                                                            <td className="td-content-cost">{formatCurrency(data.costLowIn)}</td>
                                                                            <td className="td-content-cost">{formatCurrency(data.costMediumIn)}</td>
                                                                            <td className="td-content-cost">{formatCurrency(data.costHighIn)}</td>
                                                                            <td className="td-content-cost">
                                                                                {formatCurrency((data.costLowIn || 0) + (data.costMediumIn || 0) + (data.costHighIn || 0))}
                                                                            </td>
                                                                        </tr>
                                                                        <tr >
                                                                            <td className="td-content-en">{formatNumber(parseFloat(data.lowEp != null ? data.lowEp : 0))} kWh</td>
                                                                            <td className="td-content-en">{formatNumber(parseFloat(data.normalEp != null ? data.normalEp : 0))} kWh</td>
                                                                            <td className="td-content-en">{formatNumber(parseFloat(data.highEp != null ? data.highEp : 0))} kWh</td>
                                                                            <td className="td-content-en">
                                                                                {formatNumber(
                                                                                    parseFloat(data.lowEp != null ? data.lowEp : 0) +
                                                                                    parseFloat(data.normalEp != null ? data.normalEp : 0) +
                                                                                    parseFloat(data.highEp != null ? data.highEp : 0)
                                                                                )} kWh
                                                                            </td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                ))
                                                            }
                                                        </>
                                                    }


                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                    :
                                    <div className="chart-tab-6-" style={{ width: "100%", height: "200px", textAlign: "center", position: "absolute", top: "40%", fontSize: "24px", fontWeight: "300" }}>{t('content.no_data')}</div>
                                }
                            </span>
                        ))
                        }
                    </div>
                }
            </div>
        )
    }

    const renderEnergyStatistics = () => {
        return (
            <div className="div-content-right">
                <div className="option-time">
                    <button className={activeButtonTab3 == 0 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab3(0)}>{t('content.day')}</button>
                    <button className={activeButtonTab3 == 1 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab3(1)}>{t('content.month')}</button>
                    <button className={activeButtonTab3 == 2 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab3(2)}>{t('content.year')}</button>
                    <button className={activeButtonTab3 == 3 ? "button-time" : "button-time-block"} style={{ backgroundColor: "silver", color: "white" }}>{t('content.total')}</button>
                    <button className="button-time-from">
                        {activeButtonTab3 == 1 || activeButtonTab3 == 2 ?
                            <Calendar
                                id="from-value"
                                className="celendar-picker"
                                dateFormat={typeFormatTab3}
                                value={fromDate}
                                view={viewCalenderTab3}
                                onChange={e => onChangeValueTimeTab3(e)}
                            />
                            :
                            <Calendar
                                id="from-value"
                                className="celendar-picker"
                                dateFormat={typeFormatTab3}
                                value={fromDate}
                                onChange={e => onChangeValueTimeTab3(e)}
                            />
                        }
                    </button>
                    {param.projectId == undefined ?
                        <input type="text" id="keyword" name="keyword" className="float-right input-name" placeholder={t('content.home_page.search') + '.....'} />
                        :
                        <></>
                    }
                </div>
                {param.projectId == undefined ?
                    <div className="content">
                        {dataTab3?.map((data, index) => (
                            <div className="polygon-overview-outside" id={"polygon-" + index} key={index} onClick={() => clickShowTab3(data.name)}>
                                <div className="polygon-overview-inside" title={data.name}>
                                    <>
                                        <div className="labelTag">{data.name}</div>
                                        {data.listDataModule.length > 0 ?
                                            <>
                                                {/* {data.dataPower > 0 && data.dataPower != null &&
                                                            <div className="circle-energy">
                                                                <div className="label-data">
                                                                    Tải điện:
                                                                </div>
                                                                <div className="data-energy">
                                                                    {data.dataPower > 0 ? data.dataPower : 0}&nbsp;kWh
                                                                </div>
                                                            </div>
                                                        } */}
                                                <div className="data-energy">
                                                    <div>{t('content.home_page.chart.energy_data')}</div>
                                                    <div className="data-module">
                                                        <div className="module">
                                                            <div className="left"><i className="fa-solid fa-square" style={{ color: "#0a1a5c" }}></i>&nbsp; {t('content.home_page.grid')}</div>
                                                            <div className="right">{t('content.home_page.rate')}</div>
                                                        </div>
                                                        <div className="module">
                                                            <div className="left">{data.listDataModule[1].dataPower != null ? data.listDataModule[1].dataPower : 0} kWh</div>
                                                            <div className="right">{data.dataPower != 0 && data.dataPower != null && data.listDataModule[1].dataPower != null ? (data.listDataModule[1].dataPower / data.dataPower * 100).toFixed(1) : 0} %</div>
                                                        </div>
                                                    </div>
                                                    <div className="data-module">
                                                        <div className="module">
                                                            <div className="left"><i className="fa-solid fa-square" style={{ color: "#00FF00" }}></i>&nbsp; {t('content.home_page.solar')}</div>
                                                            <div className="right">{t('content.home_page.rate')}</div>
                                                        </div>
                                                        <div className="module">
                                                            <div className="left">{data.listDataModule[0].dataPower != null ? data.listDataModule[0].dataPower : 0} kWh</div>
                                                            <div className="right">{data.dataPower != 0 && data.dataPower != null && data.listDataModule[0].dataPower != null ? (data.listDataModule[0].dataPower / data.dataPower * 100).toFixed(1) : 0} %</div>
                                                        </div>
                                                    </div>
                                                    <div className="data-module">
                                                        <div className="module">
                                                            <div className="left"><i className="fa-solid fa-square" style={{ color: "silver" }}></i>&nbsp; {t('content.home_page.wind')}</div>
                                                            <div className="right">{t('content.home_page.rate')}</div>
                                                        </div>
                                                        <div className="module">
                                                            <div className="left">0 kWh</div>
                                                            <div className="right">0%</div>
                                                        </div>
                                                    </div>
                                                    <div className="data-module">
                                                        <div className="module">
                                                            <div className="left"><i className="fa-solid fa-square" style={{ color: "blue" }}></i>&nbsp;   {t('content.home_page.battery')}</div>

                                                            <div className="right">{t('content.home_page.rate')}</div>
                                                        </div>
                                                        <div className="module">
                                                            <div className="left">0 kWh</div>
                                                            <div className="right">0%</div>
                                                        </div>
                                                    </div>
                                                    <div className="data-module">
                                                        <div className="module">
                                                            <div className="left"><i className="fa-solid fa-square" style={{ color: "orange" }}></i>&nbsp; {t('content.home_page.generator')}</div>

                                                            <div className="right">{t('content.home_page.rate')}</div>
                                                        </div>
                                                        <div className="module">
                                                            <div className="left">0 kWh</div>
                                                            <div className="right">0%</div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="box">
                                                    <div id={"chart-tab-3-" + index} className="chart"></div>
                                                </div>
                                            </>
                                            :
                                            <div className="box">
                                                <div className="chart">{t('content.no_data')}</div>
                                            </div>
                                        }
                                    </>
                                </div>
                            </div>
                        ))

                        }
                        <div className="modal fade" id="modal-tab-3" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="modal-content" style={{ position: "relative", maxWidth: "100%" }}>
                                    <div className="modal-header">
                                        <div style={{ fontWeight: "bold", fontSize: "20px" }}>{nameSite}</div>
                                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">{t('content.close')}</span></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="content-modal" style={{ position: "absolute", width: "100%" }}>
                                            <div className="data-energy">
                                                <div>{t('content.home_page.chart.energy_data')}</div>
                                                <div className="data-module">
                                                    <div className="module">
                                                        <div className="left"><i className="fa-solid fa-square" style={{ color: "#0a1a5c" }}></i>&nbsp; {t('content.home_page.grid')}</div>
                                                        <div className="right">{t('content.home_page.rate')}</div>
                                                    </div>
                                                    <div className="module">
                                                        <div className="module">
                                                            <div className="left">{dataPower[1] != undefined && dataPower[1].dataPower != null ? dataPower[1].dataPower : 0} kWh</div>
                                                            <div className="right">{loadPower != 0 && loadPower != null && dataPower[1] != undefined && dataPower[1].dataPower != null ? (dataPower[1].dataPower / loadPower * 100).toFixed(1) : 0} %</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="data-module">
                                                    <div className="module">
                                                        <div className="left"><i className="fa-solid fa-square" style={{ color: "#00FF00" }}></i>&nbsp; {t('content.home_page.solar')}</div>
                                                        <div className="right">{t('content.home_page.rate')}</div>
                                                    </div>
                                                    <div className="module">
                                                        <div className="left">{dataPower[0] != undefined && dataPower[0].dataPower != null ? dataPower[0].dataPower : 0} kWh</div>
                                                        <div className="right">{loadPower != 0 && loadPower != null && dataPower[0] != undefined && dataPower[0].dataPower != null ? (dataPower[0].dataPower / loadPower * 100).toFixed(1) : 0} %</div>
                                                    </div>
                                                </div>
                                                <div className="data-module">
                                                    <div className="module">
                                                        <div className="left"><i className="fa-solid fa-square" style={{ color: "silver" }}></i>&nbsp; {t('content.home_page.wind')}</div>
                                                        <div className="right">{t('content.home_page.rate')}</div>
                                                    </div>
                                                    <div className="module">
                                                        <div className="left">0 kWh</div>
                                                        <div className="right">0%</div>
                                                    </div>
                                                </div>
                                                <div className="data-module">
                                                    <div className="module">
                                                        <div className="left"><i className="fa-solid fa-square" style={{ color: "blue" }}></i>&nbsp;   {t('content.home_page.battery')}</div>
                                                        <div className="right">{t('content.home_page.rate')}</div>
                                                    </div>
                                                    <div className="module">
                                                        <div className="left">0 kWh</div>
                                                        <div className="right">0%</div>
                                                    </div>
                                                </div>
                                                <div className="data-module">
                                                    <div className="module">
                                                        <div className="left"><i className="fa-solid fa-square" style={{ color: "orange" }}></i>&nbsp; {t('content.home_page.generator')}</div>
                                                        <div className="right">{t('content.home_page.rate')}</div>
                                                    </div>
                                                    <div className="module">
                                                        <div className="left">0 kWh</div>
                                                        <div className="right">0%</div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div id="chart-modal-tab-3" style={{ width: "100%", height: "500px" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="content">
                        {dataTab3.map((data, index) => (
                            <span key={index}>
                                {data.listDataModule.length > 0 ?
                                    <>
                                        {data.listDataModule.length > 0 ?
                                            <div className="site">
                                                <div className="header-chart">{t('content.home_page.chart.energy_data')}</div>
                                                {/* {data.dataPower > 0 && data.dataPower != null &&
                                                            <div className="circle-energy">
                                                                <div className="label-data">
                                                                    Tải điện:
                                                                </div>
                                                                <div className="data-energy">
                                                                    {data.dataPower > 0 ? data.dataPower : 0}&nbsp;kWh
                                                                </div>
                                                            </div>
                                                        } */}
                                                <div className="data-energy">
                                                    <div className="data-module">
                                                        <div className="module">
                                                            <div className="left"><i className="fa-solid fa-square" style={{ color: "#0a1a5c" }}></i>&nbsp; Lưới điện</div>
                                                            <div className="right">{t('content.home_page.rate')}</div>
                                                        </div>
                                                        <div className="module">
                                                            <div className="module">
                                                                <div className="left">{data.listDataModule[1].dataPower > 0 ? data.listDataModule[1].dataPower : 0} kWh</div>
                                                                <div className="right">{data.dataPower != 0 && data.dataPower != null && data.listDataModule[1].dataPower != null ? (data.listDataModule[1].dataPower / data.dataPower * 100).toFixed(1) : 0} %</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="data-module">
                                                        <div className="module">
                                                            <div className="left"><i className="fa-solid fa-square" style={{ color: "#00FF00" }}></i>&nbsp; Điện mặt trời</div>
                                                            <div className="right">{t('content.home_page.rate')}</div>
                                                        </div>
                                                        <div className="module">
                                                            <div className="left">{data.listDataModule[0].dataPower > 0 ? data.listDataModule[0].dataPower : 0} kWh</div>
                                                            <div className="right">{data.dataPower != 0 && data.dataPower != null && data.listDataModule[0].dataPower != null ? (data.listDataModule[0].dataPower / data.dataPower * 100).toFixed(1) : 0} %</div>
                                                        </div>
                                                    </div>
                                                    <div className="data-module">
                                                        <div className="module">
                                                            <div className="left"><i className="fa-solid fa-square" style={{ color: "silver" }}></i>&nbsp; {t('content.home_page.wind')}</div>
                                                            <div className="right">{t('content.home_page.rate')}</div>
                                                        </div>
                                                        <div className="module">
                                                            <div className="left">0 kWh</div>
                                                            <div className="right">0%</div>
                                                        </div>
                                                    </div>
                                                    <div className="data-module">
                                                        <div className="module">
                                                            <div className="left"><i className="fa-solid fa-square" style={{ color: "blue" }}></i>&nbsp;   {t('content.home_page.battery')}</div>
                                                            <div className="right">{t('content.home_page.rate')}</div>
                                                        </div>
                                                        <div className="module">
                                                            <div className="left">0 kWh</div>
                                                            <div className="right">0%</div>
                                                        </div>
                                                    </div>
                                                    <div className="data-module">
                                                        <div className="module">
                                                            <div className="left"><i className="fa-solid fa-square" style={{ color: "orange" }}></i>&nbsp; {t('content.home_page.generator')}</div>
                                                            <div className="right">{t('content.home_page.rate')}</div>
                                                        </div>
                                                        <div className="module">
                                                            <div className="left">0 kWh</div>
                                                            <div className="right">0%</div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="box">
                                                    <div id={"chart-tab-3-" + index} className="chart" style={{ height: "500px" }}></div>
                                                </div>
                                            </div>
                                            :
                                            <div className="box">
                                                <div className="chart">{t('content.no_data')}</div>
                                            </div>
                                        }
                                    </>
                                    :
                                    <div className="chart" style={{ width: "100%", height: "200px", textAlign: "center", position: "absolute", top: "40%", fontSize: "24px", fontWeight: "300" }}>{t('content.no_data')}</div>
                                }
                            </span>
                        ))
                        }


                    </div>
                }
            </div>
        )
    }

    const renderWarningStatistics = () => {
        return (
            <div className="div-content-left">
                <div className="input-group float-left mr-1" style={{ width: "100%", marginLeft: "8px", overflowX: "scroll" }}>
                    <div className="radio-tabs">
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-4" value={1} className="radio-tabs__input-4" checked={typeModuldeTab4 == 1 ? true : false} onChange={(e) => changeMoudleTab4(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-load-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.load')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }} >
                            <input type="radio" name="radio-tabs-4" value={2} className="radio-tabs__input-4" checked={typeModuldeTab4 == 2 ? true : false} onChange={(e) => changeMoudleTab4(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-solar-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.solar')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }} >
                            <input type="radio" name="radio-tabs-4" value={5} className="radio-tabs__input-4" checked={typeModuldeTab4 == 5 ? true : false} onChange={(e) => changeMoudleTab4(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-grid-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.grid')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-4" value={3} className="radio-tabs__input-4" checked={typeModuldeTab4 == 3 ? true : false} onChange={(e) => changeMoudleTab4(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-battery-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.battery')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-4" value={4} className="radio-tabs__input-4" checked={typeModuldeTab4 == 4 ? true : false} onChange={(e) => changeMoudleTab4(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-wind-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.wind')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs-4" value={4} className="radio-tabs__input-4" onChange={(e) => changeMoudleTab4(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-wind-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.generator')}</span>
                        </label>
                    </div>
                </div>
                <div className="option-time">
                    <button className={activeButtonTab4 == 1 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab4(1)}>{t('content.day')}</button>
                    {param.projectId == undefined ?
                        <input type="text" id="keyword" name="keyword" className="float-right input-name" placeholder={t('content.home_page.search') + '.....'} />
                        :
                        <></>
                    }
                </div>
                {param.projectId == undefined ?
                    <div className="content">
                        {dataTab4?.map((data, index) => (
                            <div className="polygon-overview-outside" id={"polygon-" + index} key={index} onClick={() => clickShowTab4(data.name)}>
                                <div className="polygon-overview-inside" title={data.name}>
                                    <>
                                        <div className="labelTag">{data.name}</div>
                                        {/* <div className="circle-count">
                        <div className="label-count" style={{ fontSize: "11px" }}>
                            Tổng {t('content.home_page.chart.device_count')}:
                        </div>
                        <div className="data-count">
                            {data.countDevice > 0 ? data.countDevice : 0}
                        </div>
                    </div> */}
                                        <>
                                            <div className="data-energy">
                                                <div>{t('content.home_page.chart.device_count')}</div>
                                                <div className="data-module">
                                                    <div className="module">
                                                        <div className="left"><i className="fa-solid fa-square" style={{ color: "#0a1a5c" }}></i>&nbsp; {t('content.home_page.normal')}</div>
                                                        <div className="right">{t('content.home_page.rate')}</div>
                                                    </div>
                                                    <div className="module">
                                                        <div className="left">{data.countDeviceOnline != null && data.countDeviceOnline > 0 ? data.countDeviceOnline : 0}</div>
                                                        <div className="right">{data.countDeviceOnline != null && data.countDevice != null ? (data.countDeviceOnline / data.countDevice * 100).toFixed(1) : 0}%</div>
                                                    </div>
                                                </div>
                                                <div className="data-module">
                                                    <div className="module">
                                                        <div className="left"><i className="fa-solid fa-square" style={{ color: "#ff671f" }}></i>&nbsp; {t('content.home_page.warning')}</div>
                                                        <div className="right">{t('content.home_page.rate')}</div>
                                                    </div>
                                                    <div className="module">
                                                        <div className="left">{data.countDeviceWarning != null && data.countDeviceWarning > 0 ? data.countDeviceWarning : 0}</div>
                                                        <div className="right">{data.countDeviceWarning != null && data.countDevice != null ? (data.countDeviceWarning / data.countDevice * 100).toFixed(1) : 0}%</div>
                                                    </div>
                                                </div>
                                                <div className="data-module">
                                                    <div className="module">
                                                        <div className="left"><i className="fa-solid fa-square" style={{ color: "#b5b6d1" }}></i>&nbsp; {t('content.home_page.lost_signal')}</div>
                                                        <div className="right">{t('content.home_page.rate')}</div>
                                                    </div>
                                                    <div className="module">
                                                        <div className="left">{data.countDeviceOffline != null && data.countDeviceOffline > 0 ? data.countDeviceOffline : 0}</div>
                                                        <div className="right">{data.countDeviceOffline != null && data.countDevice != null ? (data.countDeviceOffline / data.countDevice * 100).toFixed(1) : 0}%</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box">
                                                <div id={"chart-tab-4-" + index} className="chart"></div>
                                            </div>
                                        </>
                                        :
                                        <div className="box">
                                            <div className="chart">{t('content.no_data')}</div>
                                        </div>

                                    </>
                                </div>
                            </div>
                        ))
                        }
                        <div className="modal fade" id="modal-tab-4" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="modal-content" style={{ position: "relative", maxWidth: "100%" }}>
                                    <div className="modal-header">
                                        <div style={{ fontWeight: "bold", fontSize: "20px" }}>{nameSite}</div>
                                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="content-modal" style={{ position: "absolute", width: "100%" }}>
                                            <div className="data-count">
                                                <div>{t('content.home_page.chart.device_count')}</div>
                                                <div className="data-module">
                                                    <div className="module">
                                                        <div className="left"><i className="fa-solid fa-square" style={{ color: "#0a1a5c" }}></i>&nbsp; {t('content.home_page.normal')}</div>
                                                        <div className="right">{t('content.home_page.rate')}</div>
                                                    </div>
                                                    <div className="module">
                                                        <div className="left"> {dataPower[0] != undefined && dataPower[0].countDeviceOnline != null ? dataPower[0].countDeviceOnline : 0}</div>
                                                        <div className="right">{countDevice != 0 && countDevice != null && dataPower[0] != undefined && dataPower[0].countDeviceOnline != null ? (dataPower[0].countDeviceOnline / countDevice * 100).toFixed(1) : 0} %</div>
                                                    </div>
                                                </div>
                                                <div className="data-module">
                                                    <div className="module">
                                                        <div className="left"><i className="fa-solid fa-square" style={{ color: "#ff671f" }}></i>&nbsp; {t('content.home_page.warning')}</div>
                                                        <div className="right">{t('content.home_page.rate')}</div>
                                                    </div>
                                                    <div className="module">
                                                        <div className="left">{dataPower[0] != undefined && dataPower[0].countDeviceWarning != null ? dataPower[0].countDeviceWarning : 0}</div>
                                                        <div className="right">{countDevice != 0 && countDevice != null && dataPower[0] != undefined && dataPower[0].countDeviceWarning != null ? (dataPower[0].countDeviceWarning / countDevice * 100).toFixed(1) : 0} %</div>
                                                    </div>
                                                </div>
                                                <div className="data-module">
                                                    <div className="module">
                                                        <div className="left"><i className="fa-solid fa-square" style={{ color: "#b5b6d1" }}></i>&nbsp; {t('content.home_page.lost_signal')}</div>
                                                        <div className="right">{t('content.home_page.rate')}</div>
                                                    </div>
                                                    <div className="module">
                                                        <div className="left">{dataPower[0] != undefined && dataPower[0].countDeviceOffline != null ? dataPower[0].countDeviceOffline : 0}</div>
                                                        <div className="right">{countDevice != 0 && countDevice != null && dataPower[0] != undefined && dataPower[0].countDeviceOffline != null ? (dataPower[0].countDeviceOffline / countDevice * 100).toFixed(1) : 0} %</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="chart-modal-tab-4" style={{ width: "100%", height: "500px" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="content">
                        {dataTab4?.map((data, index) => (
                            <span key={index}>
                                <div className="site">
                                    <div className="header-chart">{t('content.home_page.overview.warning_statistics')}</div>
                                    {/* <div className="circle-count">
                    <div className="label-count">
                        Tổng {t('content.home_page.chart.device_count')}:
                    </div>
                    <div className="data-count">
                        {data.countDevice > 0 ? data.countDevice : 0}
                    </div>
                </div> */}
                                    <div className="data-count-warning">
                                        <div className="data-module">
                                            <div className="module">
                                                <div className="left"><i className="fa-solid fa-square" style={{ color: "#0a1a5c" }}></i>&nbsp; {t('content.home_page.normal')}</div>
                                                <div className="right">{t('content.home_page.rate')}</div>
                                            </div>
                                            <div className="module">
                                                <div className="left">{data.countDeviceOnline != null && data.countDeviceOnline > 0 ? data.countDeviceOnline : 0}</div>
                                                <div className="right">{data.countDeviceOnline != null && data.countDevice != null ? (data.countDeviceOnline / data.countDevice * 100).toFixed(1) : 0}%</div>
                                            </div>
                                        </div>
                                        <div className="data-module">
                                            <div className="module">
                                                <div className="left"><i className="fa-solid fa-square" style={{ color: "#ff671f" }}></i>&nbsp; {t('content.home_page.warning')}</div>
                                                <div className="right">{t('content.home_page.rate')}</div>
                                            </div>
                                            <div className="module">
                                                <div className="left">{data.countDeviceWarning != null && data.countDeviceWarning > 0 ? data.countDeviceWarning : 0}</div>
                                                <div className="right">{data.countDeviceWarning != null && data.countDevice != null ? (data.countDeviceWarning / data.countDevice * 100).toFixed(1) : 0}%</div>
                                            </div>
                                        </div>
                                        <div className="data-module">
                                            <div className="module">
                                                <div className="left"><i className="fa-solid fa-square" style={{ color: "#b5b6d1" }}></i>&nbsp; {t('content.home_page.lost_signal')}</div>
                                                <div className="right">{t('content.home_page.rate')}</div>
                                            </div>
                                            <div className="module">
                                                <div className="left">{data.countDeviceOffline != null && data.countDeviceOffline > 0 ? data.countDeviceOffline : 0}</div>
                                                <div className="right">{data.countDeviceOffline != null && data.countDevice != null ? (data.countDeviceOffline / data.countDevice * 100).toFixed(1) : 0}%</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="box">
                                        <div id={"chart-tab-4-" + index} className="chart" style={{ height: "500px" }}></div>
                                    </div>
                                </div>
                            </span>
                        ))
                        }
                    </div>
                }
            </div>
        )
    }

    const renderManagementFailure = () => {
        return (
            <div className="div-content-right">
                <div className="input-group float-left mr-1" style={{ width: "100%", marginLeft: "8px", overflowX: "scroll" }}>
                    <div className="radio-tabs">
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs" value={1} className="radio-tabs__input" checked={typeModuldeTab5 == 1 ? true : false} onChange={(e) => changeMoudleTab5(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-load-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.load')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }} >
                            <input type="radio" name="radio-tabs" value={2} className="radio-tabs__input" checked={typeModuldeTab5 == 2 ? true : false} onChange={(e) => changeMoudleTab5(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-solar-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.solar')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }} >
                            <input type="radio" name="radio-tabs" value={5} className="radio-tabs__input" checked={typeModuldeTab5 == 5 ? true : false} onChange={(e) => changeMoudleTab5(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-grid-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.grid')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs" value={3} className="radio-tabs__input" checked={typeModuldeTab5 == 3 ? true : false} onChange={(e) => changeMoudleTab5(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-battery-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.battery')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs" value={4} className="radio-tabs__input" checked={typeModuldeTab5 == 4 ? true : false} onChange={(e) => changeMoudleTab5(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-wind-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.wind')}</span>
                        </label>
                        <label className="radio-tabs__field" style={{ width: "170px" }}>
                            <input type="radio" name="radio-tabs" value={4} className="radio-tabs__input" onChange={(e) => changeMoudleTab5(e)} />
                            <span className="radio-tabs__text" style={{ width: "160px" }}>
                                <img src="/resources/image/icon-wind-circle.svg" style={{ height: "23px", marginRight: "10px" }}></img>
                                {t('content.home_page.generator')}</span>
                        </label>
                    </div>
                </div>
                <div className="option-time">
                    <button className={activeButtonTab5 == 0 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab5(0)}>{t('content.home_page.area')}</button>
                    <button className={activeButtonTab5 == 1 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab5(1)}>{t('content.home_page.device_type')}</button>
                    <button className={activeButtonTab5 == 4 ? "button-time" : "button-time-block"} onClick={() => showDataByOptionTab5(4)}>{t('content.home_page.load_type')}</button>
                </div>
                {param.projectId == null ?
                    <div className="content">
                        {dataTab5?.map((data, index) => (
                            <span key={index}>
                                {data.listDataModule.length > 0 &&
                                    <div className="polygon-overview-outside" id={"polygon-" + index} onClick={() => clickShowTab5(data.name)}>
                                        <div className="polygon-overview-inside" title={data.name}>
                                            <div className="labelTag">{data.name}</div>

                                            <div className="box">
                                                <div id={"chart-tab-5-" + index} className="chart"></div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </span>
                        ))
                        }
                        <div className="modal fade" id="modal-tab-5" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="modal-content" style={{ maxWidth: "100%" }}>
                                    <div className="modal-header">
                                        <div style={{ fontWeight: "bold", fontSize: "20px" }}>{nameSite}</div>
                                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                                    </div>
                                    <div className="modal-body">
                                        <div id="chart-modal-tab-5" style={{ width: "100%", height: "500px" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="content">
                        {dataTab5?.map((data, index) => (
                            <span key={index}>
                                <div className="site">
                                    <div className="header-chart">{t('content.home_page.overview.count_device_statistics')}</div>
                                </div>

                                {data.listDataModule.length > 0 ?
                                    <div key={index} id={"chart-tab-5-" + index} style={{ height: "90%", marginTop: "50px" }}></div>
                                    :
                                    <div className="chart" style={{ width: "100%", height: "200px", textAlign: "center", position: "absolute", top: "40%", fontSize: "24px", fontWeight: "300" }}>{t('content.no_data')}</div>
                                }

                            </span>
                        ))
                        }
                    </div>
                }
            </div>
        )
    }

    const renderTemplateOverview = (priority) => {
        switch (priority) {
            case 1:
                return renderPowerFlow();
            case 2:
                return renderMap();
            case 3:
                return renderEnergyData();
            case 4:
                return renderEnergyUsagePlan();
            case 5:
                return renderEnergyCostRevenue();
            case 6:
                return renderEnergyStatistics();
            case 7:
                return renderWarningStatistics();
            case 8:
                return renderManagementFailure();
            default:
                return '';
        }
    }

    const renderNameTitleOveview = (priority) => {
        switch (priority) {
            case 1:
                return t('content.home_page.overview.power_flow');
            case 2:
                return t('content.home_page.overview.map');
            case 3:
                return t('content.home_page.overview.energy_data');
            case 4:
                return t('content.home_page.overview.energy_usage_plan');
            case 5:
                return t('content.home_page.overview.energy_cost_revenue');
            case 6:
                return t('content.home_page.overview.energy_statistics');
            case 7:
                return t('content.home_page.overview.warning_statistics');
            case 8:
                return t('content.home_page.overview.management_failure');
            default:
                return '';
        }
    }

    const callbackFunctionPriority = (childData, data) => {
        const filteredList = listPriority.filter(item => !childData.includes(item));
        const result = childData.concat(filteredList);
        setListPriority(result);
        const userData = {
            ...user,
            priorityIngredients: result.toString()
        };
        updatePriorityIngredients(userData);
        getUser(1);
    }


    return (
        <>
            {!accessDenied ?
                <div className="tab-container tab-overview">

                    <div className="div-container-right">
                        <div className="content-header">
                            <div className="header-left">
                                <div className="title">
                                    <div>{renderNameTitleOveview(listPriority[0])}</div>
                                </div>
                            </div>
                            <div className="header-right">
                                <div className="title">
                                    <div>{renderNameTitleOveview(listPriority[1])}</div>
                                </div>
                                <div style={{ float: "right" }}>
                                    <SelectPriorityLevel parentCallback={callbackFunctionPriority}></SelectPriorityLevel>
                                </div>
                            </div>
                        </div>
                        <div className="content">
                            {renderTemplateOverview(listPriority[0])}
                            {renderTemplateOverview(listPriority[1])}
                        </div>
                        <div className="content-header">
                            <div className="header-left">
                                <div className="title">
                                    <div>{renderNameTitleOveview(listPriority[2])}</div>
                                </div>
                            </div>
                            <div className="header-right">
                                <div className="title">
                                    <div>{renderNameTitleOveview(listPriority[3])}</div>
                                </div>
                            </div>
                        </div>
                        <div className="content">
                            {renderTemplateOverview(listPriority[2])}
                            {renderTemplateOverview(listPriority[3])}
                        </div>
                        <div className="content-header">
                            <div className="header-left">
                                <div className="title">
                                    <div>{renderNameTitleOveview(listPriority[4])}</div>
                                </div>
                            </div>
                            <div className="header-right">
                                <div className="title">
                                    <div>{renderNameTitleOveview(listPriority[5])}</div>
                                </div>
                            </div>
                        </div>
                        <div className="content">
                            {renderTemplateOverview(listPriority[4])}
                            {renderTemplateOverview(listPriority[5])}
                        </div>
                        <div className="content-header">
                            <div className="header-left">
                                <div className="title">
                                    <div>{renderNameTitleOveview(listPriority[6])}</div>
                                </div>
                            </div>
                            <div className="header-right">
                                <div className="title">
                                    <div>{renderNameTitleOveview(listPriority[7])}</div>
                                </div>
                            </div>
                        </div>
                        <div className="content">
                            {renderTemplateOverview(listPriority[6])}
                            {renderTemplateOverview(listPriority[7])}

                        </div>
                    </div>
                </div >
                :
                <AccessDenied></AccessDenied>
            }
        </>
    )
}

export default Overview;
