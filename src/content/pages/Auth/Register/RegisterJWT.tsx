import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography,
  Stack,
  Autocomplete,
  InputAdornment,
  IconButton,
  Box
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';
import { phoneRegExp } from '../../../../utils/validators';
import { useContext, useState } from 'react';
import { CustomSnackBarContext } from '../../../../contexts/CustomSnackBarContext';
import { useNavigate } from 'react-router-dom';
import { IS_LOCALHOST } from '../../../../config';
import i18n from 'i18next';
import countries from '../../../../i18n/countries';

function RegisterJWT({
  email,
  role
}: {
  email?: string | undefined;
  role?: number | undefined;
}) {
  const { register } = useAuth() as any;
  const isMountedRef = useRefMounted();
  const { t }: { t: any } = useTranslation();
  const { showSnackBar } = useContext(CustomSnackBarContext);
  const navigate = useNavigate();
  const getLanguage = i18n.language;
const [showPassword, setShowPassword] = useState(false);
  const getFieldsAndShapes = (): [
    { [key: string]: any },
    { [key: string]: any }
  ] => {
    let fields = {
      email,
      firstName: '',
      lastName: '',
      countryCode: null,
      phone: '',
      password: '',
      companyName: '',
      employeesCount: 5,
      terms: false,
      submit: null
    };
    let shape = {
      email: Yup.string()
        .email(t('invalid_email'))
        .max(255)
        .required(t('required_email')),
      firstName: Yup.string().max(255).required(t('required_firstName')),
      lastName: Yup.string().max(255).required(t('required_lastName')),
      companyName: Yup.string().max(255).required(t('required_company')),
      countryCode: Yup.object().required(t("required_field")),
      employeesCount: Yup.number()
        .min(0)
        .required(t('required_employeesCount')),
      phone: Yup.string().matches(phoneRegExp, t('invalid_phone')),
      password: Yup.string().min(8).max(255).required(t('required_password')),
      terms: Yup.boolean().oneOf([true], t('required_terms'))
    };
    if (role) {
      const keysToDelete = ['companyName', 'employeesCount'];
      keysToDelete.forEach((key) => {
        delete fields[key];
        delete shape[key];
      });
    }
    return [fields, shape];
  };
  return (
    <Formik
      initialValues={getFieldsAndShapes()[0]}
      validationSchema={Yup.object().shape(getFieldsAndShapes()[1])}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setSubmitting(true);
        values.language = getLanguage.toUpperCase();
        values.phone =`+${values.countryCode.phone}${values.phone}`;
        return register(role ? { ...values, role: { id: role } } : values)
          .then(() => {
            if (!IS_LOCALHOST) {
              if(!role) showSnackBar(t('verify_email'), 'success');
              navigate(role ? '/account/login' : '/account/verify');
            }
          })
          .catch((err) => showSnackBar(t('registration_error'), 'error'))
          .finally(() => {
            if (isMountedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
          });
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
          setFieldValue
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={6}>
              <TextField
                error={Boolean(touched.firstName && errors.firstName)}
                fullWidth
                margin="normal"
                helperText={touched.firstName && errors.firstName}
                label={t('first_name')}
                name="firstName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                error={Boolean(touched.lastName && errors.lastName)}
                fullWidth
                margin="normal"
                helperText={touched.lastName && errors.lastName}
                label={t('last_name')}
                name="lastName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            margin="normal"
            helperText={touched.email && errors.email}
            label={t('email')}
            name="email"
            disabled={!!email}
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <Stack direction={'row'} spacing={1}>
            <Autocomplete
              id="country-select-demo"
              sx={{ width: 275 }}
              options={countries}
              autoHighlight
              value={values.countryCode}
              onChange={(event: any, newValue: string | null) => {
                setFieldValue('countryCode',newValue);
              }}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <img
                    loading="lazy"
                    width="20"
                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    alt=""
                  />
                  {option.label} ({option.code}) +{option.phone}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose a country"
                  error={Boolean(touched.countryCode && errors.countryCode)}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <TextField
              error={Boolean(touched.phone && errors.phone)}
              fullWidth
              margin="normal"
              helperText={touched.phone && errors.phone}
              label={t('phone')}
              name="phone"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.phone}
              variant="outlined"
            />
          </Stack>
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            margin="normal"
            helperText={touched.password && errors.password}
            label={t('password')}
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type={showPassword?"text":"password"}
            value={values.password}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={()=>setShowPassword(!showPassword)}>
                  <VisibilityIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {!role && (
            <>
              <Grid item xs={12} lg={6}>
                <TextField
                  error={Boolean(touched.companyName && errors.companyName)}
                  fullWidth
                  margin="normal"
                  helperText={touched.companyName && errors.companyName}
                  label={t('companyName')}
                  name="companyName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.companyName}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  error={Boolean(
                    touched.employeesCount && errors.employeesCount
                  )}
                  fullWidth
                  margin="normal"
                  type="number"
                  helperText={touched.employeesCount && errors.employeesCount}
                  label={t('employeesCount')}
                  name="employeesCount"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.employeesCount}
                  variant="outlined"
                />
              </Grid>
            </>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={values.terms}
                name="terms"
                color="primary"
                onChange={handleChange}
              />
            }
            label={
              <>
                <Typography variant="body2">
                  {t('i_accept')}{' '}
                  <Link component="a" href="#">
                    {t('terms_conditions')}
                  </Link>
                  .
                </Typography>
              </>
            }
          />
          {Boolean(touched.terms && errors.terms) && (
            <FormHelperText error>{errors.terms}</FormHelperText>
          )}
          <Button
            sx={{
              mt: 3
            }}
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
            disabled={isSubmitting}
            type="submit"
            fullWidth
            size="large"
            variant="contained"
          >
            {t('create_your_account')}
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default RegisterJWT;
