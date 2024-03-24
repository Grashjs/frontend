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
import { getRandomColor } from '../../../../../utils/overall';
import Loading from '../../Loading';
import { getDowntimesAndCostsByAsset } from '../../../../../slices/analytics/asset';

interface WOByPrimaryUserProps {
  handleOpenModal: (
    columns: string[],
    filters: Filter[],
    title: string
  ) => void;
}

function DowntimesAndCosts({ handleOpenModal }: WOByPrimaryUserProps) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { downtimesAndCostsByAsset, loading } = useSelector(
    (state) => state.assetAnalytics
  );

  useEffect(() => {
    dispatch(getDowntimesAndCostsByAsset());
  }, []);

  const columns: string[] = ['id'];

  const formattedData: {
    label: string;
    duration: string;
    cost: string;
    color: string;
    filters: Filter[];
  }[] = downtimesAndCostsByAsset.map((asset) => {
    return {
      label: asset.name,
      duration: (asset.duration / 3600).toFixed(2),
      cost: asset.workOrdersCosts.toFixed(2),
      color: getRandomColor(),
      filters: [{ key: 'user', value: asset.id }]
    };
  });
  const title = t('downtime_and_costs');
  return (
    <AnalyticsCard title={title}>
      {loading.downtimesAndCostsByAsset ? (
        <Loading />
      ) : (
        <ComposedChart width={508} height={508} data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis yAxisId="left-axis" unit={t('hours')} />
          <YAxis yAxisId="right-axis"
                 orientation="right" />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="duration"
            fill="#8884d8"
            name={t('total_downtime_in_hours')}
            yAxisId="left-axis"
          >
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
            name={t('cost')}
            type="monotone"
            dataKey="cost"
            stroke="#ff7300"
            yAxisId="right-axis"
          />
        </ComposedChart>
      )}
    </AnalyticsCard>
  );
}

export default DowntimesAndCosts;
