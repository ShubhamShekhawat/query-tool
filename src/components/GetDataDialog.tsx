import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Popover,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  useMediaQuery,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTheme } from '@mui/material/styles';
import NBTheme from '../theme';

function GetDataDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const DOCKER_RUN_COMMAND =
    'docker run -t -v $(pwd):/data neurobagel/dataget:latest /data/neurobagel-query-results-with-URIs.tsv /data/output';
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [showPopover, setShowPopover] = useState(false);

  const handleCopyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(DOCKER_RUN_COMMAND);
    setAnchorEl(event.currentTarget);
    setShowPopover(true);

    setTimeout(() => {
      setShowPopover(false);
    }, 2000);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowPopover(false);
  };

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose} data-cy="get-data-dialog">
      <DialogContent>
        <DialogContentText>
          <Typography variant="h6" className="font-bold">
            Download matching source data results using Datalad
          </Typography>
          We have a helper tool to automatically download matching subjects from datasets available
          through DataLad. To do so:
          <ol>
            <li>Select at least one dataset</li>
            <li>
              Download one of the query results files using the &rdquo;Download selected query
              results&rdquo; dropdown
            </li>
            <li>Change directory to the location of the downloaded TSV</li>
            <li>Copy and run the command below</li>
          </ol>
        </DialogContentText>
        <DialogContentText>
          <div className="flex items-center rounded bg-gray-200 px-2 py-1 text-sm">
            <code className="flex-grow text-black">{DOCKER_RUN_COMMAND}</code>
            <IconButton
              color="primary"
              onClick={handleCopyClick}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ContentCopyIcon />
            </IconButton>
            <Popover
              open={showPopover}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Typography
                className="rounded px-2 py-1 text-sm text-white shadow"
                sx={{ backgroundColor: NBTheme.palette.primary.main }}
              >
                Copied!
              </Typography>
            </Popover>
          </div>
          <br />
          The downloaded data will be saved in the current directory, in a subdirectory called
          &quot;output&quot;. (Note: this directory will be created if it does not already exist)
          <br />
          ⚠️ The above command currently only gets data for DataLad datasets. To download a cohort
          from other remote filesystems you have access to, you may need to write your own script
          that uses the paths from a results file.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-cy="get-data-dialog-close-button" onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GetDataDialog;
