import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AnalyticsCard from '../../AnalyticsCard';
import { Filter } from '../WOModal';
import { useDispatch, useSelector } from '../../../../../store';
import { useEffect } from 'react';
import { getOverviewStats } from '../../../../../slices/analytics/workOrder';

interface WOStatusNumbersProps {
  handleOpenModal: (
    columns: string[],
    filters: Filter[],
    title: string
  ) => void;
}
function Overview({ handleOpenModal }: WOStatusNumbersProps) {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();
  const { overview } = useSelector((state) => state.woAnalytics);

  useEffect(() => {
    dispatch(getOverviewStats());
  }, []);

  const datas: {
    label: string;
    value: number;
    config?: {
      columns: string[];
      filters: Filter[];
    };
  }[] = [
    {
      label: t('Count'),
      value: overview.complete,
      config: {
        columns: ['id'],
        filters: [{ key: 'fs', value: false }]
      }
    },
    {
      label: t('Compliant'),
      value: overview.compliant,
      config: {
        columns: ['id'],
        filters: [{ key: 'fs', value: false }]
      }
    },
    {
      label: t('Average Cycle Time (Days)'),
      value: overview.avgCycleTime
    }
  ];
  return (
    <AnalyticsCard
      title="The numbers"
      height={200}
      description="Compliant work orders are defined as work orders that were completed before the due date. Cycle time refers to the number of days until a work order was completed."
    >
      <Stack sx={{ height: '100%', justifyContent: 'center' }}>
        <Stack direction="row" spacing={2}>
          {datas.map((data) => (
            <Stack key={data.label} alignItems="center">
              <Typography
                variant="h2"
                fontWeight="bold"
                style={{ cursor: data.config ? 'pointer' : 'auto' }}
                onClick={() =>
                  handleOpenModal(
                    data.config.columns,
                    data.config.filters,
                    t('The numbers')
                  )
                }
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

export default Overview;
