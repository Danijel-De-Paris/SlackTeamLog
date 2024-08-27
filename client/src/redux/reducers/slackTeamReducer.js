const SET_SLACK_TEAM_ACCESSLOGS = "SET_SLACK_TEAM_ACCESSLOGS";
const SET_ERROR_SLACK_TEAM_ACCESSLOGS = "SET_ERROR_SLACK_TEAM_ACCESSLOGS";
const SET_LOADING_SLACK_TEAM_ACCESSLOGS = "SET_LOADING_SLACK_TEAM_ACCESSLOGS";

export const setSlackTeamAccessLogs = (fileContent) => dispatch => {
    dispatch({
        type: SET_SLACK_TEAM_ACCESSLOGS,
        payload: fileContent,
    })
};

export const setErrorSlackTeamAccessLogs = (error) => dispatch => {
    dispatch({
        type: SET_ERROR_SLACK_TEAM_ACCESSLOGS,
        payload: error,
    })
};

export const setLoadingSlackTeamAccessLogs = (loading) => dispatch => {
    dispatch({
        type: SET_LOADING_SLACK_TEAM_ACCESSLOGS,
        payload: loading,
    })
};

const initialState = {
    data: null,
    filename: null,
    error: null,
    loading: false
};

export default function slackTeamReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SLACK_TEAM_ACCESSLOGS:
            return { ...state, data: action.payload.data, filename: action.payload.filename, error: null, loading: false };
        case SET_ERROR_SLACK_TEAM_ACCESSLOGS:
            return { ...state, error: action.payload };
        case SET_LOADING_SLACK_TEAM_ACCESSLOGS:
            return { ...state, loading: action.payload };
        default:
            return state;
    }
}