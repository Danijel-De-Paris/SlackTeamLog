import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { downloadSlackTeamAccessLogs } from '../../redux/actions/slackTeamAction';
import { connect } from "react-redux";

import './App.css';
import { setSlackTeamAccessLogs } from '../../redux/reducers/slackTeamReducer';

function App({ data, filename, loading, error }) {
  const dispatch = useDispatch();
  const [token, setToken] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [maxPage, setMaxPage] = useState(0);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleClickSaveButton = async (event) => {
    dispatch(downloadSlackTeamAccessLogs(token, selectedFile, maxPage));
  };

  useEffect(() => {
    if (data && filename && !loading) {
      // Save the response as a file
      const file = new Blob([data], { type: "text/plain" });
      const fileUrl = URL.createObjectURL(file);
      const downloadLink = document.createElement("a");
      downloadLink.href = fileUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      dispatch(setSlackTeamAccessLogs({ data: null, filename: null }));
    }
  }, [dispatch, data, filename, loading]);

  return (
    <div className="App">
      <Box maxWidth={900}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h3" py={4}>
              Slack Team Access Log Downloader
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography py={2}>
              Please input your user token for Slack application
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ maxWidth: "600px" }}>
            <TextField
              py={2}
              label="Token"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} display={"flex"} alignItems={"center"}>
              <Grid item xs={8}>
                <Typography py={2}>
                  Please select the CSV file containing User IDs
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <input type="file" onChange={handleFileSelect} />
              </Grid>
              <Grid item xs={8}>
                <Typography py={2}>
                  Please input the maximum page number (0 for no limit)
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  py={2}
                  label="Max Page Number"
                  value={maxPage}
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  onChange={(e) => {
                    setMaxPage(e.target.value);
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              sx={{ my: 2 }}
              variant="contained"
              color="primary"
              onClick={handleClickSaveButton}
              disabled={loading}
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={12}>
            {filename ? (
              <Typography>File has been saved to {filename}</Typography>
            ) : (
              <></>
            )}
            {error ? <Typography color={"error"}>{error}</Typography> : <></>}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

const mapStatetoProps = state => {
  return {
    data: state.slackTeam.data,
    filename: state.slackTeam.filename,
    loading: state.slackTeam.loading,
    error: state.slackTeam.error,
  };
};

export default connect(mapStatetoProps, { downloadSlackTeamAccessLogs })(App);
