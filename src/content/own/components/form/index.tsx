import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { ObjectSchema } from 'yup';
import { IField, IHash } from '../../type';
import CheckBoxForm from './CheckBoxForm';
import Field from './Field';
import SelectForm from './SelectForm';
import FileUpload from '../FileUpload';
import DatePicker from '@mui/lab/DatePicker';

interface PropsType {
  fields: Array<IField>;
  values?: IHash<any>;
  onSubmit?: (values: IHash<any>) => Promise<any>;
  onCanceled?: () => void;
  onChange?: any;
  submitText?: string;
  validation?: ObjectSchema<any>;
  isLoading?: boolean;
  isButtonEnabled?: (values: IHash<any>, ...props: any[]) => boolean;
}

export default (props: PropsType) => {
  const { t }: { t: any } = useTranslation();
  const shape: IHash<any> = {};

  props.fields.forEach((f) => {
    shape[f.name] = Yup.string();
    if (f.required) {
      shape[f.name] = shape[f.name].required();
    }
  });

  const validationSchema = Yup.object().shape(shape);

  const handleChange = (formik, field, e) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.onChange && props.onChange({ field, e });
    if (props.fields.length == 1) {
      formik.setFieldTouched(field, true);
    }
    formik.setFieldValue(field, e);
    return formik.handleChange(field);
  };

  return (
    <Formik<IHash<any>>
      validationSchema={props.validation || validationSchema}
      initialValues={props.values || {}}
      onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) =>
        props.onSubmit(values).finally(() => {
          setSubmitting(false);
          // resetForm();
          setStatus({ success: true });
          setSubmitting(false);
        })
      }
    >
      {(formik) => (
        <Grid container spacing={2}>
          {props.fields.map((field, index) => {
            return (
              <Grid item xs={12} lg={field.midWidth ? 6 : 12} key={index}>
                {field.type === 'select' ? (
                  <SelectForm
                    options={field.items}
                    value={formik.values[field.name]}
                    label={field.label}
                    loading={field.loading}
                    onOpen={field.onPress}
                    placeholder={field.placeholder}
                    multiple={field.multiple}
                    fullWidth={field.fullWidth}
                    key={field.name}
                  />
                ) : field.type === 'checkbox' ? (
                  <CheckBoxForm
                    label={field.label}
                    onChange={(e) => {
                      handleChange(formik, field.name, e.target.checked);
                    }}
                  />
                ) : field.type === 'groupCheckbox' ? (
                  <CheckBoxForm
                    label={field.label}
                    type="groupCheckbox"
                    listCheckbox={field.items}
                    key={field.name}
                  />
                ) : field.type === 'titleGroupField' ? (
                  <Typography variant="h3" sx={{ pb: 1 }}>
                    {t(`${field.label}`)}
                  </Typography>
                ) : field.type === 'file' ? (
                  <Box>
                    <FileUpload
                      title={field.label}
                      description={field.placeholder}
                      setFieldValue={(files) =>
                        formik.setFieldValue(field.name, files)
                      }
                    />
                  </Box>
                ) : field.type === 'date' ? (
                  <Box>
                    <Box pb={1}>
                      <b>{field.label}:</b>
                    </Box>
                    <DatePicker
                      value={formik.values[field.name]}
                      onChange={(newValue) => {
                        handleChange(formik, field.name, newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          placeholder={t('Select date...')}
                          {...params}
                        />
                      )}
                    />
                  </Box>
                ) : (
                  <Field
                    key={index}
                    {...field}
                    isDisabled={formik.isSubmitting}
                    type={field.type}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={formik.values[field.name]}
                    onBlur={formik.handleBlur}
                    // onChange={formik.handleChange}
                    onChange={(e) => {
                      handleChange(formik, field.name, e.target.value);
                    }}
                    error={
                      (formik.touched[field.name] &&
                        !!formik.errors[field.name]) ||
                      field.error
                    }
                    errorMessage={formik.errors[field.name]}
                    fullWidth={field.fullWidth}
                  />
                )}
              </Grid>
            );
          })}

          <Grid item xs={12}>
            <Button
              type="submit"
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={() => formik.handleSubmit()}
              variant="contained"
              startIcon={
                formik.isSubmitting ? <CircularProgress size="1rem" /> : null
              }
              disabled={Boolean(formik.errors.submit) || formik.isSubmitting}
            >
              {t(props.submitText)}
            </Button>

            {props.onCanceled && (
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => props.onCanceled}
                variant="outlined"
                disabled
              >
                {t(props.submitText)}
              </Button>
            )}
          </Grid>
        </Grid>
      )}
    </Formik>
  );
};
