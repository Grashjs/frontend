import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AnalyticsCard from '../../AnalyticsCard';
import { Filter } from '../WOModal';
import { useDispatch, useSelector } from '../../../../../store';
import { useEffect } from 'react';
import { getWOHours } from '../../../../../slices/analytics/workOrder';
import Loading from '../../Loading';

interface HoursWorkedProps {
  handleOpenModal: (
    columns: string[],
    filters: Filter[],
    title: string
  ) => void;
}
function HoursWorked({ handleOpenModal }: HoursWorkedProps) {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();
  const { hours, loading } = useSelector((state) => state.woAnalytics);

  useEffect(() => {
    dispatch(getWOHours());
  }, []);

  const columns = ['id'];
  const formattedData: { label: string; value: number; filters: Filter[] }[] = [
    { label: t('Estimated Hours'), value: hours.estimated, filters: [] },
    {
      label: t('Total time spent (Hours)'),
      value: hours.actual,
      filters: []
    }
  ];
  const title = t('Hours Worked');
  return (
    <AnalyticsCard
      title={title}
      height={200}
      description="These hours correspond to work orders that have a due date within the range specified in the filters."
    >
      <Stack sx={{ height: '100%', justifyContent: 'center' }}>
        {loading.hours ? (
          <Loading />
        ) : (
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
        )}
      </Stack>
    </AnalyticsCard>
  );
}

export default HoursWorked;
