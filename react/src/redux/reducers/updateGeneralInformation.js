import * as types from "../constants/ActionTypes"

/*const initStructure = {
    dashStats: {
        simpleStats:{
            numUsers:0,
            avg:0
        },
        graphsStats:{
            pieChart:[],
            lineChart:[]
        }
    },
    checkUser:{
        comboBox:[],
        
    },
    userInfo:{
        totalAct:0,
        finishedAct:0,
        openAct:0,
        nextAct:0,
        unfinishedAct:0
    }
}*/
const initStructure = {
    dashStats: {
        numUsers:0,
        numNews:0,
        numProjects:0,
        numUniqueKeywordsNews:0,
        numUniqueKeywordsProject:0,
        numUniqueKeywordsOverAll:0,
        mostRecentNews:{
            title:"--",
            date:"--"
        },
        mostRecentProject:{
            title:"--",
            date:"--"
        }
    },
    sidebarInfo:{
        profilePic: "",
        username:"",
        fullName:"",
        bio:""
    },
    urlInfo:{
        lang:"pt",
        token:""
    }
}

//UPDATE_GRAPHS
const dataAdminDashBoard = (state = initStructure, action) => {
    switch (action.type) {
        case types.FEED_BOXES:
            return {...state, dashStats:{
                numUsers:action.dataAdminStats.numUsers,
                numNews:action.dataAdminStats.numNews,
                numProjects:action.dataAdminStats.numProjects,
                numUniqueKeywordsNews:action.dataAdminStats.numUniqueKeywordsNews,
                numUniqueKeywordsProject:action.dataAdminStats.numUniqueKeywordsProject,
                numUniqueKeywordsOverAll:action.dataAdminStats.numUniqueKeywordsOverAll,
                mostRecentNews:{
                    title:action.dataAdminStats.mostRecentNews.title,
                    date:action.dataAdminStats.mostRecentNews.date
                },
                mostRecentProject:{
                    title:action.dataAdminStats.mostRecentProject.title,
                    date:action.dataAdminStats.mostRecentProject.date
                }
            }

            }
        case types.LOAD_SIDEBAR:
            return {...state, dashStats:{
                ...state.dashStats
            },
            sidebarInfo:{
                profilePic:action.userData.profilePic,
                username:action.userData.username,
                fullName:action.userData.firstName + " " + action.userData.lastName,
                bio:action.userData.biography
            }

            }
        
            case types.LOAD_URL_INFO:
                return{...state, dashStats:{
                    ...state.dashStats
                }, sidebarInfo:{
                    ...state.sidebarInfo
                },urlInfo:{
                    lang:action.urlData.lang,
                    token:action.urlData.token
                }
                }
          /*case types.UPDATE_SIMPLE_DATA:
              return  {...state, dashStats: {
                  simpleStats: {
                    numUsers: action.dataAdminStats.numNews,
                    avg: action.dataAdminStats.avgNumberActivities,
                  },
                  graphsStats:{

                  }
                  
              }}

              case types.UPDATE_PIE_CHART: //tenho de tratar os dados do pie chart
              return  {...state, dashStats: {...state.dashStats,
                  graphsStats:{
                      ...state.dashStats.graphsStats,
                      pieChart:action.dataAdminStats.pieChartInfo
                      
                  }
                  
              }}

              case types.UPDATE_LINE_CHART: //tenho de tratar os dados do pie chart
              return  {...state, dashStats: {...state.dashStats,
                  graphsStats:{
                    ...state.dashStats.graphsStats,
                    lineChart: action.dataAdminStats.userCreationDate
                  }
                  
              }}

              case types.FEED_COMBOBOX:
              return {...state,
                checkUser:{
                    comboBox:action.dataAdminStats.userList
                }
              }

              case types.SEARCH_USER:
              return{...state, 
                userInfo:{
                    totalAct:action.userDataStats.activitiesTotal,
                    finishedAct:action.userDataStats.activitiesEnded,
                    openAct:action.userDataStats.activitiesOpen,
                    nextAct:action.userDataStats.activitiesNext,
                    unfinishedAct:action.userDataStats.activitiesUnfinished

                }}*/
          default:
              return state
      }
  }

export default dataAdminDashBoard

