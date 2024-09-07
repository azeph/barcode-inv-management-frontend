import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material'
import React from 'react'

function PopupDialog({ show, close, title, content, action1, action2 }) {
    return (
        <Dialog
            open={show}
            onClose={close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className='font-lato'
        >
            <DialogTitle id="alert-dialog-title" fontSize={18}>
                {title}
            </DialogTitle>
            <DialogContent>
                <p>{content}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    action1();
                }} autoFocus>
                    Yes
                </Button>
                <Button onClick={() => {
                    action2();
                }}>No</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PopupDialog