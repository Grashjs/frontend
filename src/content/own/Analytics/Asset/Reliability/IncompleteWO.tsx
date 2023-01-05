import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import AnalyticsCard from '../../AnalyticsCard';
import { Filter } from '../WOModal';
import { useDispatch, useSelector } from '../../../../../store';
import { useEffect } from 'react';
import { getIncompleteByPriority } from '../../../../../slices/analytics/workOrder';
import Loading from '../../Loading';

interface WOStatusIncompleteProps {
  handleOpenModal: (
    columns: string[],
    filters: Filter[],
    title: string
  ) => void;
}
function IncompleteWO({ handleOpenModal }: WOStatusIncompleteProps) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const { incompleteByPriority, loading } = useSelector(
    (state) => state.woAnalytics
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIncompleteByPriority());
  }, []);

  const columns: string[] = ['id'];

  const formattedData: {
    label: string;
    count: number;
    color: string;
    estimatedHours: number;
    filters: Filter[];
  }[] = [
    {
      label: 'High',
      count: incompleteByPriority.high.count,
      color: theme.colors.error.main,
      estimatedHours: incompleteByPriority.high.estimatedHours,
      filters: [{ key: 'fs', value: false }]
    },
    {
      label: 'Medium',
      count: incompleteByPriority.medium.count,
      color: theme.colors.warning.main,
      estimatedHours: incompleteByPriority.medium.estimatedHours,
      filters: [{ key: 'fs', value: false }]
    },
    {
      label: 'Low',
      count: incompleteByPriority.low.count,
      color: theme.colors.success.main,
      estimatedHours: incompleteByPriority.low.estimatedHours,
      filters: [{ key: 'fs', value: false }]
    },
    {
      label: 'None',
      count: incompleteByPriority.none.count,
      color: theme.colors.alpha.black[70],
      estimatedHours: incompleteByPriority.low.estimatedHours,
      filters: [{ key: 'fs', value: false }]
    }
  ];
  const title = 'Work Remaining';
  return (
    <AnalyticsCard
      title={title}
      description="This graph shows the number of incomplete work orders that are due in the date range specified in the filters. The estimated hours correspond to those individual work orders."
    >
      {loading.incompleteByPriority ? (
        <Loading />
      ) : (
        <ComposedChart width={400} height={508} data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name={t('Work Orders')}>
            {formattedData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                onClick={() => {
                  handleOpenModal(columns, entry.filters, t(title));
                }}
              />
            ))}
          </Bar>
          <Line
            name={t('Estimated duration')}
            type="monotone"
            dataKey="estimatedHours"
            stroke="#ff7300"
          />
        </ComposedChart>
      )}
    </AnalyticsCard>
  );
}

export default IncompleteWO;
