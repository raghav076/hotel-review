import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

const AddValue = (props) => {
    const type = props.type || 'location';
    const { value, setValue, options, disabled, addValue = true, required } = props;
    const [open, toggleOpen] = React.useState(false);

    const handleClose = () => {
        setDialogValue({
            [type]: ''
        });
        toggleOpen(false);
    };

    const [dialogValue, setDialogValue] = React.useState({
        [type]: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setValue(dialogValue[type]);
        handleClose();
    };

    return (
        <React.Fragment>
            <Autocomplete
                className="form-input"
                disabled={disabled}
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                        setValue(newValue);
                    } else if (newValue && newValue.inputValue) {
                        toggleOpen(true);
                        setDialogValue({
                            [type]: newValue.inputValue,
                        });
                    } else {
                        setValue(newValue);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if (addValue&&params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            title: `Add "${params.inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                id="free-solo-dialog-demo"
                options={options}
                getOptionLabel={(option) => {
                    // e.g value selected with enter, right from the input
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    if (typeof option === 'string') {
                        return option;
                    }
                    return option;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderOption={(props, option) => <li {...props}>{option.inputValue?option.title:option}</li>}
                sx={{ width: 300 }}
                freeSolo
                required={required}
                renderInput={(params) => <TextField {...params} label={type} required={required} />}
            />
            <Dialog open={open} onClose={handleClose}>
                <form>
                    <DialogTitle>Add a new {type}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {type} not there in the list? Add here!
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            value={dialogValue[type]}
                            onChange={(event) =>
                                setDialogValue({
                                    ...dialogValue,
                                    [type]: event.target.value,
                                })
                            }
                            label="title"
                            type="text"
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit}>Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    );
}

AddValue.defaultProps = {
    required: true
}

export default AddValue;
