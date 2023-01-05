import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import AnalyticsCard from '../../AnalyticsCard';
import { Filter } from '../WOModal';
import { useDispatch, useSelector } from '../../../../../store';
import { useEffect } from 'react';
import { getCompleteCostsByMonth } from '../../../../../slices/analytics/workOrder';
import Loading from '../../Loading';
import { getDayAndMonth } from '../../../../../utils/dates';

interface WOStatusIncompleteProps {
  handleOpenModal: (
    columns: string[],
    filters: Filter[],
    title: string
  ) => void;
}
function CompleteCostsByMonth({ handleOpenModal }: WOStatusIncompleteProps) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const { completeCostsByMonth, loading } = useSelector(
    (state) => state.woAnalytics
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCompleteCostsByMonth());
  }, []);

  const columns: string[] = ['id'];
  const formattedData: {
    label: string;
    partCost: string;
    additionalCost: string;
    laborCost: string;
    filters: Filter[];
  }[] = completeCostsByMonth.map((data) => {
    return {
      partCost: data.partCost.toFixed(2),
      additionalCost: data.additionalCost.toFixed(2),
      laborCost: data.laborCost.toFixed(2),
      label: getDayAndMonth(data.date),
      filters: [{ key: 'range', value: data.date }]
    };
  });
  const lines: { label: string; dataKey: string; color: string }[] = [
    {
      label: t('Part Costs'),
      dataKey: 'partCost',
      color: theme.colors.primary.main
    },
    {
      label: t('Additional Costs'),
      dataKey: 'additionalCost',
      color: theme.colors.warning.main
    },
    {
      label: t('Labor Cost'),
      dataKey: 'laborCost',
      color: theme.colors.error.main
    }
  ];
  const title = 'Cost trends';
  return (
    <AnalyticsCard title={title}>
      {loading.completeCostsByMonth ? (
        <Loading />
      ) : (
        <LineChart width={400} height={508} data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              name={line.label}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
            />
          ))}
        </LineChart>
      )}
    </AnalyticsCard>
  );
}

export default CompleteCostsByMonth;
