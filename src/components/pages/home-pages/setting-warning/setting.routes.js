import SettingCost from "../setting/setting-cost/setting-cost";
import EditSetting from "./edit";
import ListSetting from "./list/index2";

const SettingRouters = [
    {
        component: EditSetting,
        path: '/:customerId/setting-warning/:id/edit',
        link: {
            title: "Cập nhật cài đặt",
            icon: "fas fa-user-tie"
        },
        action: "UPDATE"
    },
    
    {
        component: ListSetting,
        path: '/:customerId/setting-warning',
        link: {
            title: "Danh sách cài đặt",
            icon: "fas fa-user-tie"
        },
        action: "READ"
    },{
        component: ListSetting,
        path: '/:customerId/:projectId/setting-warning',
        link: {
            title: "Danh sách cài đặt",
            icon: "fas fa-user-tie"
        },
        action: "READ"
    },
    {
        component: SettingCost,
        path: '/:customerId/:projectId/setting-cost',
        link: {
            title: "Danh sách cài đặt",
            icon: "fas fa-user-tie"
        },
        action: "READ"
    },
    {
        component: SettingCost,
        path: '/:customerId/setting-warning',
        link: {
            title: "Danh sách cài đặt",
            icon: "fas fa-user-tie"
        },
        action: "READ"
    },
];

export default SettingRouters;