import {
  Box,
  Card,
  Divider,
  Grid,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AssetDTO } from '../../../../models/owns/asset';
import { UserMiniDTO } from '../../../../models/user';
import { Customer } from '../../../../models/owns/customer';
import { Vendor } from '../../../../models/owns/vendor';
import Team from '../../../../models/owns/team';
import {
  getCustomerUrl,
  getTeamUrl,
  getUserUrl,
  getVendorUrl
} from '../../../../utils/urlPaths';
import { useContext } from 'react';
import { CompanySettingsContext } from '../../../../contexts/CompanySettingsContext';

interface PropsType {
  asset: AssetDTO;
}

const AssetDetails = ({ asset }: PropsType) => {
  const { t }: { t: any } = useTranslation();
  const { getFormattedDate } = useContext(CompanySettingsContext);
  const informationFields = [
    { label: t('Name'), value: asset?.name },
    { label: t('Description'), value: asset?.description },
    { label: t('Category'), value: asset?.category?.name },
    { label: t('Model'), value: asset?.model },
    { label: t('Serial Number'), value: asset?.serialNumber },
    {
      label: t('Status'),
      value: asset?.status === 'OPERATIONAL' ? t('Operational') : t('Down')
    },
    { label: t('Area'), value: asset?.area },
    { label: t('Barcode'), value: asset?.barCode }
  ];
  const moreInfosFields = [
    {
      label: t('Placed in Service'),
      value: getFormattedDate(asset?.inServiceDate)
    },
    {
      label: t('Warranty expiration'),
      value: getFormattedDate(asset?.warrantyExpirationDate)
    }
  ];
  const BasicField = ({
    label,
    value
  }: {
    label: string | number;
    value: string | number;
  }) => {
    return value ? (
      <Grid item xs={12}>
        <Stack spacing={5} direction="row">
          <Typography variant="h6" fontWeight="bold">
            {label}
          </Typography>
          <Typography variant="h6">{value}</Typography>
        </Stack>
        <Divider sx={{ mt: 1 }} />
      </Grid>
    ) : null;
  };
  const ListField = <T extends { id: number }>({
    values,
    label,
    getHref,
    getValueLabel
  }: {
    values: T[];
    label: string;
    getHref: (value: T) => string;
    getValueLabel: (value: T) => string;
  }) => {
    return (
      !!values?.length && (
        <Grid item xs={12}>
          <Stack spacing={5} direction="row">
            <Typography variant="h6" fontWeight="bold">
              {label}
            </Typography>
            <Stack spacing={1} direction="row">
              {values.map((value, index) => (
                <Stack key={value.id} spacing={1} direction="row">
                  <Link href={getHref(value)} variant="h6">
                    {getValueLabel(value)}
                  </Link>
                  {index !== values.length - 1 && (
                    <Typography variant="h6">,</Typography>
                  )}
                </Stack>
              ))}
            </Stack>
          </Stack>
          <Divider sx={{ mt: 1 }} />
        </Grid>
      )
    );
  };
  return (
    <Box sx={{ px: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Grid container spacing={2} padding={2}>
              <Grid item xs={12}>
                <Typography variant="h3">{t('Asset Information')}</Typography>
              </Grid>
              {informationFields.map((field) => (
                <BasicField
                  key={field.label}
                  label={field.label}
                  value={field.value}
                />
              ))}
              <Grid item xs={12}>
                <Typography variant="h3">{t('More Informations')}</Typography>
              </Grid>
              {moreInfosFields.map((field) => (
                <BasicField
                  key={field.label}
                  label={field.label}
                  value={field.value}
                />
              ))}
              {asset?.primaryUser && (
                <Grid item xs={12}>
                  <Stack spacing={5} direction="row">
                    <Typography variant="h6" fontWeight="bold">
                      {t('Primary User')}
                    </Typography>
                    <Link
                      key={asset.primaryUser.id}
                      href={`/app/people-teams/people/${asset.primaryUser.id}`}
                      variant="h6"
                    >
                      {`${asset.primaryUser.firstName} ${asset.primaryUser.lastName}`}
                    </Link>
                  </Stack>
                  <Divider sx={{ mt: 1 }} />
                </Grid>
              )}
              {asset?.location && (
                <Grid item xs={12}>
                  <Stack spacing={5} direction="row">
                    <Typography variant="h6" fontWeight="bold">
                      {t('Location')}
                    </Typography>
                    <Link
                      href={`/app/locations/${asset.location.id}`}
                      variant="h6"
                    >
                      {asset.location.name}
                    </Link>
                  </Stack>
                  <Divider sx={{ mt: 1 }} />
                </Grid>
              )}
              <ListField
                values={asset?.assignedTo}
                label={t('Assignees')}
                getHref={(user: UserMiniDTO) => getUserUrl(user.id)}
                getValueLabel={(user: UserMiniDTO) =>
                  `${user.firstName} ${user.lastName}`
                }
              />
              <ListField
                values={asset?.customers}
                label={t('Customers')}
                getHref={(customer: Customer) => getCustomerUrl(customer.id)}
                getValueLabel={(customer: Customer) => customer.name}
              />
              <ListField
                values={asset?.vendors}
                label={t('Vendors')}
                getHref={(vendor: Vendor) => getVendorUrl(vendor.id)}
                getValueLabel={(vendor: Vendor) => vendor.companyName}
              />
              <ListField
                values={asset?.teams}
                label={t('Teams')}
                getHref={(team: Team) => getTeamUrl(team.id)}
                getValueLabel={(team: Team) => team.name}
              />
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetDetails;
