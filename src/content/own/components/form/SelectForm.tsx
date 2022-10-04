import { Autocomplete, Box, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PropsType {
  options: {
    label: string;
    value: string;
  }[];
  label: string;
  value: string | { label: string; value: string }[];
  placeholder?: string;
  multiple?: boolean;
  fullWidth?: boolean;
  //   defaultValue: any;
  //   variant?: 'outlined' | any;
}

export default (props: PropsType) => {
  const { t }: { t: any } = useTranslation();

  return (
    <Box sx={{ my: 2 }}>
      <Autocomplete
        fullWidth={props.fullWidth || true}
        multiple={props.multiple}
        filterSelectedOptions
        limitTags={5}
        // @ts-ignore
        isOptionEqualToValue={(option, value) => option.value === value.value}
        defaultValue={
          props.multiple
            ? props.value
            : props.value
            ? { label: props.value, value: props.value }
            : null
        }
        options={props.options}
        // @ts-ignore
        getOptionLabel={(option) => option.label}
        // defaultValue={[jobsLocations[1]]}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth={props.fullWidth || true}
            variant="outlined"
            label={t(props.label)}
            placeholder={t(props.placeholder || props.label)}
          />
        )}
      />
    </Box>
  );
};
