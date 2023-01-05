import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import AnalyticsCard from '../../AnalyticsCard';
import { Filter } from '../WOModal';
import { useDispatch, useSelector } from '../../../../../store';
import { useEffect } from 'react';
import { getIncompleteByStatus } from '../../../../../slices/analytics/workOrder';
import Loading from '../../Loading';

interface WOStatusPieProps {
  handleOpenModal: (
    columns: string[],
    filters: Filter[],
    title: string
  ) => void;
}
function WOStatusPie({ handleOpenModal }: WOStatusPieProps) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { incompleteByStatus, loading } = useSelector(
    (state) => state.woAnalytics
  );

  useEffect(() => {
    dispatch(getIncompleteByStatus());
  }, []);

  const columns = ['id'];
  const formattedData = [
    // {
    //   label: 'Complete',
    //   value: data.complete,
    //   color: theme.colors.error.main,
    //   filters: [{ key: 'status', value: 'COMPLETE' }]
    // },
    {
      label: 'On hold',
      value: incompleteByStatus.onHold,
      color: theme.colors.warning.main,
      filters: [{ key: 'status', value: 'ON_HOLD' }]
    },
    {
      label: 'In Progress',
      value: incompleteByStatus.inProgress,
      color: theme.colors.success.main,
      filters: [{ key: 'status', value: 'IN_PROGRESS' }]
    },
    {
      label: 'Open',
      value: incompleteByStatus.open,
      color: theme.colors.alpha.black[70],
      filters: [{ key: 'status', value: 'OPEN' }]
    }
  ];
  const title = t('Work Order Status');
  return (
    <AnalyticsCard title={title}>
      {loading.incompleteByStatus ? (
        <Loading />
      ) : (
        <PieChart width={200} height={300}>
          <Pie
            data={formattedData}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            fill="#8884d8"
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                onClick={() => {
                  handleOpenModal(columns, entry.filters, title);
                }}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </AnalyticsCard>
  );
}

export default WOStatusPie;
