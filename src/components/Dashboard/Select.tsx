import React, { FC } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

interface IProps {
  label: string;
  disabled?: boolean;
  selectedValue: string;
  handleChange: (e) => void;
  possibleValues: string[];
  id: string;
  width: string | number;
}

const CustomSelect: FC<IProps> = ({
  label,
  disabled,
  selectedValue,
  handleChange,
  possibleValues,
  id,
  width = '100%',
}) => {
  return (
    <FormControl style={{ width }}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        color={'secondary'}
        disabled={disabled}
        labelId={`${id}-label`}
        id={`${id}-select`}
        value={selectedValue}
        onChange={handleChange}
      >
        {possibleValues.map((v: string, i: number) => {
          return (
            <MenuItem key={i} value={v}>
              {v}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export const CustomAutocomplete: FC<IProps> = ({
  label,
  disabled,
  selectedValue,
  handleChange,
  possibleValues,
  id,
  width = '100%',
}) => {
  return (
    <FormControl style={{ width, maxWidth: '300px', marginBottom: '13px' }}>
      <Autocomplete
        value={selectedValue}
        onChange={(event: any, newValue: string) => {
          if (newValue || newValue === null) {
            handleChange(newValue);
            return;
          }
          return;
        }}
        id='combo-box-demo'
        options={possibleValues}
        getOptionLabel={(option: string) => option}
        style={{ width }}
        renderInput={(params) => <TextField {...params} label={label} variant='outlined' />}
        autoHighlight={true}
        // autoSelect={true}
      />
    </FormControl>
  );
};

export default CustomSelect;
