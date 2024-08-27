import axios from "axios";

class ApiSlackTeamService {
  async getSlackTeamAccessLogsData(token, selectedFile, maxPage) {
    // Call the backend API
    let response;
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (0 < maxPage) {
        formData.append("maxPage", maxPage);
      }
      response = await axios.post(
        "api/slack/teams/accessLogsByUserId",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      let getParams;
      if (0 < maxPage) {
        getParams = { maxPage };
      }
      response = await axios.get("api/slack/teams/accessLogs", {
        headers: { Authorization: `Bearer ${token}` },
        params: getParams,
      });
    }

    const contentDisposition = response.headers["content-disposition"];
    const filenameMatch = contentDisposition.match(/filename="?(.+)"$/);
    const filename = filenameMatch ? filenameMatch[1] : "file.txt";

    return {
      data: response.data,
      filename,
    };
  }
}

const apiSlackTeamService = new ApiSlackTeamService();
export default apiSlackTeamService;