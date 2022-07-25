import * as types from "../constants/ActionTypes"

/*export const updateSimpleInfo = (dataAdminStats) => ({
    type:types.UPDATE_SIMPLE_DATA,
    dataAdminStats,
}); //mesmo que dataAdminStats:dataAdminStats


export const updatePieGraph = (dataAdminStats) => ({
    type:types.UPDATE_PIE_CHART,
    dataAdminStats,
}); 


export const updateLineChart = (dataAdminStats) => ({
    type:types.UPDATE_LINE_CHART,
    dataAdminStats
})


export const searchuserInfo = (userDataStats) => ({
    type:types.SEARCH_USER,
    userDataStats
});


export const feedCombobox = (dataAdminStats) => ({
    type: types.FEED_COMBOBOX,
    dataAdminStats
})*/

export const updateBoxes = (dataAdminStats) => ({
    type: types.FEED_BOXES,
    dataAdminStats
});

export const loadSidebar = (userData) => ({
    type: types.LOAD_SIDEBAR,
    userData
});

export const loadUrlInfor = (urlData) => ({
    type: types.LOAD_URL_INFO,
    urlData
})