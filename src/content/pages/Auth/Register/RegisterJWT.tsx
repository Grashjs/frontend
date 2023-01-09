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
  Typography
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';
import { phoneRegExp } from '../../../../utils/validators';
import { useContext } from 'react';
import { CustomSnackBarContext } from '../../../../contexts/CustomSnackBarContext';
import { useNavigate } from 'react-router-dom';
import { IS_LOCALHOST } from '../../../../config';

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

  const getFieldsAndShapes = (): [
    { [key: string]: any },
    { [key: string]: any }
  ] => {
    let fields = {
      email,
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      companyName: '',
      employeesCount: 5,
      terms: false,
      submit: null
    };
    let shape = {
      email: Yup.string()
        .email(t('The email provided should be a valid email address'))
        .max(255)
        .required(t('The email field is required')),
      firstName: Yup.string()
        .max(255)
        .required(t('The first name field is required')),
      lastName: Yup.string()
        .max(255)
        .required(t('The last name field is required')),
      companyName: Yup.string()
        .max(255)
        .required(t('The company name field is required')),
      employeesCount: Yup.number()
        .min(0)
        .required(t('Please provide the number of employees')),
      phone: Yup.string().matches(
        phoneRegExp,
        t('The phone number is invalid')
      ),
      password: Yup.string()
        .min(8)
        .max(255)
        .required(t('The password field is required')),
      terms: Yup.boolean().oneOf(
        [true],
        t('You must agree to our terms and conditions')
      )
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
        return register(role ? { ...values, role: { id: role } } : values)
          .then(() => {
            if (!IS_LOCALHOST) {
              showSnackBar(
                t('Please check your email to verify your account'),
                'success'
              );
              navigate('/account/login');
            }
          })
          .catch((err) =>
            showSnackBar(t("The registration didn't succeed"), 'error')
          )
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
        values
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={6}>
              <TextField
                error={Boolean(touched.firstName && errors.firstName)}
                fullWidth
                margin="normal"
                helperText={touched.firstName && errors.firstName}
                label={t('First Name')}
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
                label={t('Last Name')}
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
            label={t('Email address')}
            name="email"
            disabled={!!email}
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.phone && errors.phone)}
            fullWidth
            margin="normal"
            helperText={touched.phone && errors.phone}
            label={t('Phone')}
            name="phone"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.phone}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            margin="normal"
            helperText={touched.password && errors.password}
            label={t('Password')}
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          {!role && (
            <>
              <Grid item xs={12} lg={6}>
                <TextField
                  error={Boolean(touched.companyName && errors.companyName)}
                  fullWidth
                  margin="normal"
                  helperText={touched.companyName && errors.companyName}
                  label={t('Company Name')}
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
                  label={t('Number of Employees')}
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
                  {t('I accept the')}{' '}
                  <Link component="a" href="#">
                    {t('terms and conditions')}
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
            {t('Create your account')}
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default RegisterJWT;
