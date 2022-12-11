import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import Request from '../../../models/owns/request';
import { getPriorityLabel } from '../../../utils/formatters';
import { useDispatch } from '../../../store';
import { approveRequest, cancelRequest } from '../../../slices/request';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAssetUrl,
  getCustomerUrl,
  getLocationUrl,
  getTeamUrl,
  getUserUrl
} from '../../../utils/urlPaths';
import useAuth from '../../../hooks/useAuth';
import { PermissionEntity } from '../../../models/owns/role';
import { isUser } from '../../../models/owns/worker';

interface RequestDetailsProps {
  request: Request;
  handleOpenUpdate: () => void;
  handleOpenDelete: () => void;
  onClose: () => void;
}
export default function RequestDetails({
  request,
  handleOpenUpdate,
  handleOpenDelete,
  onClose
}: RequestDetailsProps) {
  const [approving, setApproving] = useState<boolean>(false);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { hasEditPermission, hasDeletePermission } = useAuth();
  const navigate = useNavigate();

  const onApprove = () => {
    setApproving(true);
    dispatch(approveRequest(request.id))
      .then((workOrderId) => {
        navigate(`/app/work-orders/${workOrderId}`);
      })
      .finally(() => setApproving(false));
  };

  const onCancel = () => {
    setCancelling(true);
    dispatch(cancelRequest(request.id))
      .then(onClose)
      .finally(() => setCancelling(false));
  };
  const BasicField = ({
    label,
    value,
    isPriority
  }: {
    label: string | number;
    value: string | number;
    isPriority?: boolean;
  }) => {
    return value ? (
      <Grid item xs={12} lg={6}>
        <Typography variant="h6" sx={{ color: theme.colors.alpha.black[70] }}>
          {label}
        </Typography>
        <Typography variant="h6">
          {isPriority ? getPriorityLabel(value.toString(), t) : value}
        </Typography>
      </Grid>
    ) : null;
  };
  const fieldsToRender = (
    request: Request
  ): { label: string; value: any }[] => [
    {
      label: t('Description'),
      value: request.description
    },
    {
      label: t('ID'),
      value: request.id
    },
    {
      label: t('Priority'),
      value: request.priority
    },
    {
      label: t('Due Date'),
      value: request.dueDate
    },
    {
      label: t('Category'),
      value: request.category
    }
  ];
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="stretch"
      spacing={2}
      padding={4}
    >
      <Grid
        item
        xs={12}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h2">{request?.title}</Typography>
          {request?.cancelled && (
            <Typography variant="h5">{t('Cancelled')}</Typography>
          )}
        </Box>
        <Box>
          {!request.cancelled &&
            hasEditPermission(PermissionEntity.REQUESTS, request) && (
              <IconButton
                style={{ marginRight: 10 }}
                onClick={handleOpenUpdate}
              >
                <EditTwoToneIcon color="primary" />
              </IconButton>
            )}
          {hasDeletePermission(PermissionEntity.REQUESTS, request) && (
            <IconButton onClick={handleOpenDelete}>
              <DeleteTwoToneIcon color="error" />
            </IconButton>
          )}
        </Box>
      </Grid>
      {!request.workOrder && !request.cancelled && (
        <>
          <Divider />
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <Button
              startIcon={
                cancelling ? (
                  <CircularProgress size="1rem" sx={{ color: 'white' }} />
                ) : (
                  <ClearTwoToneIcon />
                )
              }
              onClick={onCancel}
              variant="outlined"
            >
              {t('Cancel')}
            </Button>
            <Button
              startIcon={
                approving ? (
                  <CircularProgress size="1rem" sx={{ color: 'white' }} />
                ) : (
                  <CheckTwoToneIcon />
                )
              }
              onClick={onApprove}
              variant="contained"
            >
              {t('Approve')}
            </Button>
          </Grid>
        </>
      )}
      <Divider />
      <Grid item xs={12}>
        <Box>
          <Typography sx={{ mt: 2, mb: 1 }} variant="h4">
            Request details
          </Typography>
          <Grid container spacing={2}>
            <>
              {fieldsToRender(request).map((field) => (
                <BasicField
                  key={field.label}
                  label={field.label}
                  value={field.value}
                  isPriority={field.label === t('Priority')}
                />
              ))}
              {request?.asset && (
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.alpha.black[70] }}
                  >
                    {t('Asset')}
                  </Typography>
                  <Link variant="h6" href={getAssetUrl(request.asset.id)}>
                    {request.asset.name}
                  </Link>
                </Grid>
              )}
              {request?.location && (
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.alpha.black[70] }}
                  >
                    {t('Location')}
                  </Typography>
                  <Link variant="h6" href={getLocationUrl(request.location.id)}>
                    {request.location.name}
                  </Link>
                </Grid>
              )}
              {request?.primaryUser && (
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.alpha.black[70] }}
                  >
                    {t('Assigned To')}
                  </Typography>
                  <Link
                    variant="h6"
                    href={
                      isUser(request.primaryUser)
                        ? getUserUrl(request.primaryUser.id)
                        : getCustomerUrl(request.primaryUser.id)
                    }
                  >
                    {isUser(request.primaryUser)
                      ? `${request.primaryUser.firstName} ${request.primaryUser.lastName}`
                      : request.primaryUser.name}
                  </Link>
                </Grid>
              )}
              {request?.team && (
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.alpha.black[70] }}
                  >
                    {t('Team')}
                  </Typography>
                  <Link variant="h6" href={getTeamUrl(request.team.id)}>
                    {request.team.name}
                  </Link>
                </Grid>
              )}
            </>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
