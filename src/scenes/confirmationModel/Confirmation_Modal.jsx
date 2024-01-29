import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};

export default function ConfirmationModal({isOpen, toggle, onConfirm}) {
  

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={toggle}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete this item?
          </Typography>
          <Button sx= {{marginLeft: "50%", marginTop: "40px"}} color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button sx= {{ marginTop: "40px"}} color="error" onClick={onConfirm}>
            Delete
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
