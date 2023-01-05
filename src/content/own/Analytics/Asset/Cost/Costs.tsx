import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AnalyticsCard from '../../AnalyticsCard';
import { Filter } from '../WOModal';
import { useDispatch, useSelector } from '../../../../../store';
import { useContext, useEffect } from 'react';
import { getCompleteCosts } from '../../../../../slices/analytics/workOrder';
import { CompanySettingsContext } from '../../../../../contexts/CompanySettingsContext';

interface HoursWorkedProps {
  handleOpenModal: (
    columns: string[],
    filters: Filter[],
    title: string
  ) => void;
}
function Costs({ handleOpenModal }: HoursWorkedProps) {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();
  const { completeCosts, loading } = useSelector((state) => state.woAnalytics);
  const { getFormattedCurrency } = useContext(CompanySettingsContext);
  useEffect(() => {
    dispatch(getCompleteCosts());
  }, []);

  const columns = ['id'];
  const formattedData: { label: string; value: string; filters: Filter[] }[] = [
    {
      label: t('Total Cost'),
      value: getFormattedCurrency(completeCosts.total.toFixed(2)),
      filters: []
    },
    {
      label: t('Average Cost'),
      value: getFormattedCurrency(completeCosts.average.toFixed(2)),
      filters: []
    }
  ];
  const title = t('Costs');
  return (
    <AnalyticsCard
      title={title}
      height={200}
      description="Total cost includes labor cost, additional cost, and parts cost in a work order"
    >
      <Stack sx={{ height: '100%', justifyContent: 'center' }}>
        <Stack direction="row" spacing={2}>
          {formattedData.map((data) => (
            <Stack key={data.label} alignItems="center">
              <Typography
                variant="h2"
                fontWeight="bold"
                style={{ cursor: 'pointer' }}
                onClick={() => handleOpenModal(columns, data.filters, title)}
              >
                {data.value}
              </Typography>
              <Typography>{data.label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </AnalyticsCard>
  );
}

export default Costs;
