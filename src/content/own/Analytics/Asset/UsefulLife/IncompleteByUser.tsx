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
import { getIncompleteByUser } from '../../../../../slices/analytics/workOrder';
import Loading from '../../Loading';
import { getRandomColor } from '../../../../../utils/overall';

interface WOStatusIncompleteProps {
  handleOpenModal: (
    columns: string[],
    filters: Filter[],
    title: string
  ) => void;
}
function IncompleteWOByUser({ handleOpenModal }: WOStatusIncompleteProps) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const { incompleteByUser, loading } = useSelector(
    (state) => state.woAnalytics
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIncompleteByUser());
  }, []);

  const columns: string[] = ['id'];

  const formattedData: {
    label: string;
    count: number;
    color: string;
    filters: Filter[];
  }[] = incompleteByUser.map((user) => {
    return {
      label: `${user.firstName} ${user.lastName}`,
      count: user.count,
      averageAge: user.averageAge,
      color: getRandomColor(),
      filters: [{ key: 'user', value: user.id }]
    };
  });
  const title = 'Workers';
  return (
    <AnalyticsCard
      title={title}
      description="Work order age is defined as the number of days between creation of the work order (or work request) and today."
    >
      {loading.incompleteByUser ? (
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
            name={t('Average age')}
            type="monotone"
            dataKey="averageAge"
            stroke="#ff7300"
          />
        </ComposedChart>
      )}
    </AnalyticsCard>
  );
}

export default IncompleteWOByUser;
