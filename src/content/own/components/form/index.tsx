import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography
} from '@mui/material';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import FormikErrorFocus from 'formik-error-focus';
import * as Yup from 'yup';
import { ObjectSchema } from 'yup';
import { IField, IHash } from '../../type';
import CheckBoxForm from './CheckBoxForm';
import Field from './Field';
import SelectForm from './SelectForm';
import FileUpload from '../FileUpload';
import DateTimePicker from '@mui/lab/DateTimePicker';
import SelectParts from './SelectParts';
import { useDispatch, useSelector } from '../../../../store';
import CustomSwitch from './CustomSwitch';
import SelectTasksModal from './SelectTasks';
import SelectMapCoordinates from './SelectMapCoordinates';
import { getCustomersMini } from '../../../../slices/customer';
import { getVendorsMini } from '../../../../slices/vendor';
import { getLocationChildren, getLocationsMini } from 'src/slices/location';
import { getUsersMini } from '../../../../slices/user';
import { getAssetsMini } from '../../../../slices/asset';
import { getTeamsMini } from '../../../../slices/team';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import { useState } from 'react';
import { getPriorityLabel } from '../../../../utils/formatters';
import { getCategories } from '../../../../slices/category';
import SelectPartQuantities from './SelectPartQuantities';
import { getRoles } from '../../../../slices/role';
import { getCurrencies } from '../../../../slices/currency';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';

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
  const [openTask, setOpenTask] = useState(false);
  const dispatch = useDispatch();
  const { customersMini } = useSelector((state) => state.customers);
  const { vendorsMini } = useSelector((state) => state.vendors);
  const { locationsMini, locationsHierarchy } = useSelector(
    (state) => state.locations
  );
  const { categories } = useSelector((state) => state.categories);
  const { usersMini } = useSelector((state) => state.users);
  const { assetsMini } = useSelector((state) => state.assets);
  const { teamsMini } = useSelector((state) => state.teams);
  const { roles } = useSelector((state) => state.roles);
  const { currencies } = useSelector((state) => state.currencies);

  const fetchCustomers = async () => {
    dispatch(getCustomersMini());
  };

  const fetchVendors = async () => {
    dispatch(getVendorsMini());
  };
  const fetchUsers = async () => {
    dispatch(getUsersMini());
  };
  const fetchLocations = async () => {
    dispatch(getLocationsMini());
  };
  const fetchRoles = async () => {
    dispatch(getRoles());
  };
  const fetchRootLocations = async () => {
    dispatch(getLocationChildren(0, []));
  };
  const fetchCategories = async (category: string) => {
    dispatch(getCategories(category));
  };
  const fetchAssets = async () => {
    dispatch(getAssetsMini());
  };
  const fetchTeams = async () => {
    dispatch(getTeamsMini());
  };
  const fetchCurrencies = async () => {
    if (!currencies.length) dispatch(getCurrencies());
  };
  props.fields.forEach((f) => {
    shape[f.name] = Yup.string();
    if (f.required) {
      shape[f.name] = shape[f.name].required();
    }
  });

  const validationSchema = Yup.object().shape(shape);

  const handleChange = (formik: FormikProps<IHash<any>>, field, e) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.onChange && props.onChange({ field, e });
    if (props.fields.length == 1) {
      formik.setFieldTouched(field, true);
    }
    formik.setFieldValue(field, e);
    return formik.handleChange(field);
  };

  const renderSelect = (formik, field: IField) => {
    let options = field.items;
    let loading = field.loading;
    let onOpen = field.onPress;
    let values = formik.values[field.name];
    const excluded = field.excluded;

    switch (field.type2) {
      case 'customer':
        options = customersMini.map((customer) => {
          return {
            label: customer.name,
            value: customer.id
          };
        });
        onOpen = fetchCustomers;
        break;
      case 'vendor':
        options = vendorsMini.map((vendor) => {
          return {
            label: vendor.companyName,
            value: vendor.id
          };
        });
        onOpen = fetchVendors;
        break;
      case 'user':
        options = usersMini.map((user) => {
          return {
            label: `${user.firstName} ${user.lastName}`,
            value: user.id
          };
        });
        onOpen = fetchUsers;
        break;
      case 'team':
        options = teamsMini.map((team) => {
          return {
            label: team.name,
            value: team.id
          };
        });
        onOpen = fetchTeams;
        break;
      case 'location':
        options = locationsMini.map((location) => {
          return {
            label: location.name,
            value: location.id
          };
        });
        onOpen = fetchLocations;
        break;
      case 'currency':
        options = currencies.map((currency) => {
          return {
            label: currency.name,
            value: currency.id
          };
        });
        onOpen = fetchCurrencies;
        break;
      case 'parentLocation':
        options = locationsHierarchy.map((location) => {
          return {
            label: location.name,
            value: location.id
          };
        });
        onOpen = fetchRootLocations;
        break;
      case 'asset':
        options = assetsMini
          .filter((asset) => asset.id !== excluded)
          .map((asset) => {
            return {
              label: asset.name,
              value: asset.id
            };
          });
        onOpen = fetchAssets;
        break;
      case 'role':
        options = roles.map((role) => {
          return {
            label: role.name,
            value: role.id
          };
        });
        onOpen = fetchRoles;
        break;
      case 'category':
        options =
          categories[field.category]?.map((category) => {
            return {
              label: category.name,
              value: category.id
            };
          }) ?? [];
        onOpen = () => fetchCategories(field.category);
        break;
      case 'priority':
        options = ['NONE', 'LOW', 'MEDIUM', 'HIGH'].map((value) => {
          return {
            label: getPriorityLabel(value, t),
            value
          };
        });
        break;
      case 'part':
        return (
          <>
            <Box display="flex" flexDirection="column">
              {values?.length
                ? values.map(({ label, value }) => (
                    <Link
                      sx={{ mb: 1 }}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`/app/inventory/parts/${value}`}
                      key={value}
                      variant="h4"
                    >
                      {label}
                    </Link>
                  ))
                : null}
            </Box>
            <SelectParts
              selected={values?.map(({ label, value }) => Number(value)) ?? []}
              onChange={(newParts) => {
                handleChange(
                  formik,
                  field.name,
                  newParts.map((part) => {
                    return { label: part.name, value: part.id };
                  })
                );
              }}
            />
          </>
        );
      case 'task':
        return (
          <>
            <SelectTasksModal
              open={openTask}
              onClose={() => setOpenTask(false)}
              selected={values ?? []}
              onSelect={(tasks) => {
                handleChange(formik, field.name, tasks);
                return Promise.resolve();
              }}
            />
            <Card onClick={() => setOpenTask(true)} sx={{ cursor: 'pointer' }}>
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <AssignmentTwoToneIcon />
                <Box>
                  <Typography variant="h4" color="primary">
                    {values ? values.length : null} {t('tasks')}
                  </Typography>
                  <Typography variant="subtitle1">
                    {t('assign_tasks_description')}
                  </Typography>
                </Box>
                <IconButton>
                  {values?.length ? (
                    <EditTwoToneIcon color="primary" />
                  ) : (
                    <AddCircleTwoToneIcon color="primary" />
                  )}
                </IconButton>
              </Box>
            </Card>
          </>
        );
      default:
        break;
    }
    return (
      <SelectForm
        options={options}
        value={values}
        label={field.label}
        onChange={(e, values) => {
          handleChange(formik, field.name, values);
        }}
        disabled={formik.isSubmitting}
        loading={loading}
        required={field?.required}
        error={!!formik.errors[field.name] || field.error}
        errorMessage={formik.errors[field.name]}
        onOpen={onOpen}
        placeholder={field.placeholder}
        multiple={field.multiple}
        fullWidth={field.fullWidth}
        key={field.name}
      />
    );
  };

  return (
    <>
      <Formik<IHash<any>>
        validationSchema={props.validation || validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={props.values || {}}
        onSubmit={(
          values,
          { resetForm, setErrors, setStatus, setSubmitting }
        ) => {
          setSubmitting(true);
          props.onSubmit(values).finally(() => {
            // resetForm();
            setStatus({ success: true });
            setSubmitting(false);
          });
        }}
      >
        {(formik) => (
          <Grid container spacing={2}>
            {props.fields.map((field, index) => {
              return (
                <Grid item xs={12} lg={field.midWidth ? 6 : 12} key={index}>
                  {field.type === 'select' ? (
                    renderSelect(formik, field)
                  ) : field.type === 'checkbox' ? (
                    <CheckBoxForm
                      label={field.label}
                      onChange={(e) => {
                        handleChange(formik, field.name, e.target.checked);
                      }}
                      checked={formik.values[field.name]}
                    />
                  ) : field.type === 'groupCheckbox' ? (
                    <CheckBoxForm
                      label={field.label}
                      type="groupCheckbox"
                      listCheckbox={field.items}
                      key={field.name}
                    />
                  ) : field.type === 'switch' ? (
                    <CustomSwitch
                      title={field.label}
                      description={field.helperText}
                      name={field.name}
                      handleChange={formik.handleChange}
                      checked={formik.values[field.name]}
                    />
                  ) : field.type === 'titleGroupField' ? (
                    <Typography variant="h3" sx={{ pb: 1 }}>
                      {t(`${field.label}`)}
                    </Typography>
                  ) : field.type === 'file' ? (
                    <Box>
                      <FileUpload
                        multiple={field.multiple}
                        title={field.label}
                        type={field.fileType || 'file'}
                        description={t('upload')}
                        onDrop={(files) => {
                          formik.setFieldValue(field.name, files);
                        }}
                      />
                    </Box>
                  ) : field.type === 'date' ? (
                    <Box>
                      <Box pb={1}>
                        <b>{field.label}:</b>
                      </Box>
                      <DateTimePicker
                        value={formik.values[field.name]}
                        onChange={(newValue) => {
                          handleChange(formik, field.name, newValue);
                        }}
                        ampm={false}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            error={!!formik.errors[field.name] || field.error}
                            helperText={
                              !!formik.errors[field.name] || field.error
                                ? formik.errors[field.name]
                                : ''
                            }
                            placeholder={t('select_date')}
                            required={field?.required}
                            {...params}
                          />
                        )}
                      />
                    </Box>
                  ) : field.type === 'dateRange' ? (
                    <Box>
                      <Box pb={1}>
                        <b>{field.label}:</b>
                      </Box>
                      <LocalizationProvider
                        localeText={{ start: t('start'), end: t('end') }}
                        dateAdapter={AdapterDayjs}
                      >
                        <DateRangePicker
                          value={formik.values[field.name] ?? [null, null]}
                          onChange={(newValue) => {
                            handleChange(formik, field.name, newValue);
                          }}
                          renderInput={(startProps, endProps) => (
                            <>
                              <TextField {...startProps} />
                              <Box sx={{ mx: 2 }}> {t('to')} </Box>
                              <TextField {...endProps} />
                            </>
                          )}
                        />
                      </LocalizationProvider>
                    </Box>
                  ) : field.type === 'coordinates' ? (
                    <SelectMapCoordinates
                      selected={formik.values[field.name]}
                      onChange={(coordinates) => {
                        handleChange(formik, field.name, coordinates);
                      }}
                    />
                  ) : field.type === 'partQuantity' ? (
                    <SelectPartQuantities
                      selected={formik.values[field.name] ?? []}
                      onChange={(newPartQuantities) => {
                        handleChange(formik, field.name, newPartQuantities);
                      }}
                    />
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
                      error={!!formik.errors[field.name] || field.error}
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
            <FormikErrorFocus
              // See scroll-to-element for configuration options: https://www.npmjs.com/package/scroll-to-element
              offset={0}
              align={'bottom'}
              focusDelay={200}
              ease={'linear'}
              duration={500}
              formik={formik}
            />
          </Grid>
        )}
      </Formik>
    </>
  );
};
