import Asset from '../../../../models/owns/asset';
import { Box, Card, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from '../../../../store';
import { useEffect } from 'react';
import { getAssetWorkOrders } from '../../../../slices/asset';
import { getStatusLabel } from '../../../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { isUser } from '../../../../models/owns/worker';

interface PropsType {
  asset: Asset;
}

const AssetWorkOrders = ({ asset }: PropsType) => {
  const { t }: { t: any } = useTranslation();
  const { assetInfos } = useSelector((state) => state.assets);
  const workOrders = assetInfos[asset?.id]?.workOrders;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (asset) dispatch(getAssetWorkOrders(asset.id));
  }, [asset]);

  return (
    <Box sx={{ px: 4 }}>
      <Grid container spacing={2}>
        {workOrders?.length ? (
          workOrders.map((workOrder) => (
            <Grid key={workOrder.id} item xs={12}>
              <Card
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/app/work-orders/${workOrder.id}`)}
              >
                <Box
                  sx={{
                    p: 2,
                    flexDirection: 'row',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      {workOrder.title}
                    </Typography>
                    <Typography variant="subtitle1">{`#${workOrder.id}`}</Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    color={workOrder.dueDate ? 'error' : 'primary'}
                  >
                    {workOrder.dueDate
                      ? `Due ${workOrder.dueDate}`
                      : t('No Due Date')}
                  </Typography>
                  <Typography variant="h6">
                    {workOrder.primaryUser
                      ? isUser(workOrder.primaryUser)
                        ? `${workOrder.primaryUser.firstName} ${workOrder.primaryUser.lastName}`
                        : workOrder.primaryUser.name
                      : t('No primary User')}
                  </Typography>
                  <Typography variant="h6">
                    {getStatusLabel(workOrder.status, t)}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card>
              <Box
                sx={{
                  height: 500,
                  p: 2,
                  flexDirection: 'row',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h4">
                  {t('There is no Work Order linked to this Asset')}
                </Typography>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AssetWorkOrders;
