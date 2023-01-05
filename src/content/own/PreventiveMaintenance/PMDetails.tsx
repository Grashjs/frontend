import {
  Box,
  Divider,
  Grid,
  IconButton,
  Link,
  Typography,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import PreventiveMaintenance from '../../../models/owns/preventiveMaintenance';
import { getPriorityLabel } from '../../../utils/formatters';
import { useDispatch } from '../../../store';
import { editPreventiveMaintenance } from '../../../slices/preventiveMaintenance';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAssetUrl,
  getLocationUrl,
  getTeamUrl,
  getUserUrl
} from '../../../utils/urlPaths';
import useAuth from '../../../hooks/useAuth';
import { PermissionEntity } from '../../../models/owns/role';
import ImageViewer from 'react-simple-image-viewer';
import { CompanySettingsContext } from '../../../contexts/CompanySettingsContext';
import FilesList from '../components/FilesList';

interface RequestDetailsProps {
  preventiveMaintenance: PreventiveMaintenance;
  handleOpenUpdate: () => void;
  handleOpenDelete: () => void;
  onClose: () => void;
}
export default function PMDetails({
  preventiveMaintenance,
  handleOpenUpdate,
  handleOpenDelete,
  onClose
}: RequestDetailsProps) {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { hasEditPermission, hasDeletePermission, hasViewPermission } =
    useAuth();
  const navigate = useNavigate();
  const { getFormattedDate, getUserNameById } = useContext(
    CompanySettingsContext
  );
  const [isImageViewerOpen, setIsImageViewerOpen] = useState<boolean>(false);

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
    preventiveMaintenance: PreventiveMaintenance
  ): { label: string; value: string | number }[] => [
    {
      label: t('Title'),
      value: preventiveMaintenance.title
    },
    {
      label: t('Description'),
      value: preventiveMaintenance.description
    },
    {
      label: t('Priority'),
      value: preventiveMaintenance.priority
    },
    {
      label: t('Due Date'),
      value: getFormattedDate(preventiveMaintenance?.dueDate)
    },
    {
      label: t('Category'),
      value: preventiveMaintenance?.category?.name
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
          <Typography variant="h2">{preventiveMaintenance?.name}</Typography>
          {preventiveMaintenance?.schedule.disabled && (
            <Typography variant="h5">{t('Paused')}</Typography>
          )}
        </Box>
        <Box>
          {hasEditPermission(
            PermissionEntity.PREVENTIVE_MAINTENANCES,
            preventiveMaintenance
          ) && (
            <IconButton style={{ marginRight: 10 }} onClick={handleOpenUpdate}>
              <EditTwoToneIcon color="primary" />
            </IconButton>
          )}
          {hasDeletePermission(
            PermissionEntity.PREVENTIVE_MAINTENANCES,
            preventiveMaintenance
          ) && (
            <IconButton onClick={handleOpenDelete}>
              <DeleteTwoToneIcon color="error" />
            </IconButton>
          )}
        </Box>
      </Grid>
      <Divider />
      <Grid item xs={12}>
        <Box>
          <Typography sx={{ mt: 2, mb: 1 }} variant="h4">
            {t('Trigger details')}
          </Typography>
          <Grid container spacing={2}>
            {preventiveMaintenance.schedule?.startsOn && (
              <Grid item xs={12} lg={6}>
                <Typography
                  variant="h6"
                  sx={{ color: theme.colors.alpha.black[70] }}
                >
                  {t('Starts On')}
                </Typography>
                <Typography variant="h6">
                  {getFormattedDate(preventiveMaintenance.schedule.startsOn)}
                </Typography>
              </Grid>
            )}
            {preventiveMaintenance.schedule?.endsOn && (
              <Grid item xs={12} lg={6}>
                <Typography
                  variant="h6"
                  sx={{ color: theme.colors.alpha.black[70] }}
                >
                  {t('Ends On')}
                </Typography>
                <Typography variant="h6">
                  {getFormattedDate(preventiveMaintenance.schedule.endsOn)}
                </Typography>
              </Grid>
            )}
            {preventiveMaintenance.schedule.frequency && (
              <Grid item xs={12} lg={6}>
                <Typography
                  variant="h6"
                  sx={{ color: theme.colors.alpha.black[70] }}
                >
                  {t('Frequency')}
                </Typography>
                <Typography variant="h6">
                  {`Every ${preventiveMaintenance.schedule.frequency} days`}
                </Typography>
              </Grid>
            )}
            {preventiveMaintenance?.createdBy && (
              <Grid item xs={12} lg={6}>
                <Typography
                  variant="h6"
                  sx={{ color: theme.colors.alpha.black[70] }}
                >
                  {t('Created By')}
                </Typography>
                <Link
                  variant="h6"
                  href={getUserUrl(preventiveMaintenance.createdBy)}
                >
                  {getUserNameById(preventiveMaintenance.createdBy)}
                </Link>
              </Grid>
            )}
          </Grid>
        </Box>
        <Box>
          <Typography sx={{ mt: 2, mb: 1 }} variant="h4">
            {t('Work Order details')}
          </Typography>
          <Grid container spacing={2}>
            <>
              {preventiveMaintenance.image && (
                <Grid
                  item
                  xs={12}
                  lg={12}
                  display="flex"
                  justifyContent="center"
                >
                  <img
                    src={preventiveMaintenance.image.url}
                    style={{ borderRadius: 5, height: 250, cursor: 'pointer' }}
                    onClick={() => setIsImageViewerOpen(true)}
                  />
                </Grid>
              )}
              {fieldsToRender(preventiveMaintenance).map((field) => (
                <BasicField
                  key={field.label}
                  label={field.label}
                  value={field.value}
                  isPriority={field.label === t('Priority')}
                />
              ))}
              {preventiveMaintenance?.asset && (
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.alpha.black[70] }}
                  >
                    {t('Asset')}
                  </Typography>
                  <Link
                    variant="h6"
                    href={getAssetUrl(preventiveMaintenance.asset.id)}
                  >
                    {preventiveMaintenance.asset.name}
                  </Link>
                </Grid>
              )}
              {preventiveMaintenance?.location && (
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.alpha.black[70] }}
                  >
                    {t('Location')}
                  </Typography>
                  <Link
                    variant="h6"
                    href={getLocationUrl(preventiveMaintenance.location.id)}
                  >
                    {preventiveMaintenance.location.name}
                  </Link>
                </Grid>
              )}
              {preventiveMaintenance?.primaryUser && (
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.alpha.black[70] }}
                  >
                    {t('Assigned To')}
                  </Typography>
                  <Link
                    variant="h6"
                    href={getUserUrl(preventiveMaintenance.primaryUser.id)}
                  >
                    {`${preventiveMaintenance.primaryUser.firstName} ${preventiveMaintenance.primaryUser.lastName}`}
                  </Link>
                </Grid>
              )}
              {preventiveMaintenance?.team && (
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.alpha.black[70] }}
                  >
                    {t('Team')}
                  </Typography>
                  <Link
                    variant="h6"
                    href={getTeamUrl(preventiveMaintenance.team.id)}
                  >
                    {preventiveMaintenance.team.name}
                  </Link>
                </Grid>
              )}
              {!!preventiveMaintenance.files.length && (
                <Grid item xs={12} lg={12}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.alpha.black[70] }}
                  >
                    {t('Files')}
                  </Typography>
                  <FilesList
                    confirmMessage={t(
                      'Are you sure you want to remove this file?'
                    )}
                    removeDisabled={
                      !hasEditPermission(
                        PermissionEntity.PREVENTIVE_MAINTENANCES,
                        preventiveMaintenance
                      )
                    }
                    files={preventiveMaintenance.files}
                    onRemove={(id: number) => {
                      dispatch(
                        editPreventiveMaintenance(preventiveMaintenance.id, {
                          ...preventiveMaintenance,
                          files: preventiveMaintenance.files.filter(
                            (f) => f.id !== id
                          )
                        })
                      );
                    }}
                  />
                </Grid>
              )}
            </>
          </Grid>
        </Box>
      </Grid>
      {isImageViewerOpen && (
        <div style={{ zIndex: 100 }}>
          <ImageViewer
            src={[preventiveMaintenance.image.url]}
            currentIndex={0}
            onClose={() => setIsImageViewerOpen(false)}
            disableScroll={true}
            backgroundStyle={{
              backgroundColor: 'rgba(0,0,0,0.9)'
            }}
            closeOnClickOutside={true}
          />
        </div>
      )}
    </Grid>
  );
}
