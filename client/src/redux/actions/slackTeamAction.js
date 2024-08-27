import apiSlackTeamService from "../../api/api-slackTeam.service";
import { setErrorSlackTeamAccessLogs, setSlackTeamAccessLogs, setLoadingSlackTeamAccessLogs } from "../reducers/slackTeamReducer";

export const downloadSlackTeamAccessLogs =
  (token, selectedFile, maxPage) => async (dispatch) => {
    dispatch(setErrorSlackTeamAccessLogs(null));
    dispatch(setLoadingSlackTeamAccessLogs(true));
    try {
      const accessLogsData =
        await apiSlackTeamService.getSlackTeamAccessLogsData(
          token,
          selectedFile,
          maxPage
        );
      dispatch(setSlackTeamAccessLogs(accessLogsData));
    } catch (error) {
      dispatch(
        setErrorSlackTeamAccessLogs(
          error?.response?.data?.message || error?.message || error?.toString()
        )
      );
      dispatch(setLoadingSlackTeamAccessLogs(false));
    }
  };