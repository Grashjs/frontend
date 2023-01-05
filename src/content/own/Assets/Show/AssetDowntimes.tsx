import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomDataGrid from '../../components/CustomDatagrid';
import {
  GridActionsCellItem,
  GridRowParams,
  GridToolbar,
  GridValueGetterParams
} from '@mui/x-data-grid';
import { GridEnrichedColDef } from '@mui/x-data-grid/models/colDef/gridColDef';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { AssetDTO, AssetStatus } from '../../../../models/owns/asset';
import { useDispatch, useSelector } from '../../../../store';
import { editAsset } from '../../../../slices/asset';
import useAuth from '../../../../hooks/useAuth';
import { PermissionEntity } from '../../../../models/owns/role';
import {
  createAssetDowntime,
  deleteAssetDowntime,
  getAssetDowntimes
} from '../../../../slices/assetDowntime';
import { useContext, useEffect, useState } from 'react';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Form from '../../components/form';
import * as Yup from 'yup';
import { IField } from '../../type';
import { CustomSnackBarContext } from '../../../../contexts/CustomSnackBarContext';
import {
  getHMSString,
  getHoursAndMinutesAndSeconds
} from '../../../../utils/formatters';
import { CompanySettingsContext } from '../../../../contexts/CompanySettingsContext';
import AssetDowntime from '../../../../models/owns/assetDowntime';

interface PropsType {
  asset: AssetDTO;
}

const AssetDowntimes = ({ asset }: PropsType) => {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();
  const { assetDowntimesByAsset } = useSelector((state) => state.downtimes);
  const downtimes = assetDowntimesByAsset[asset?.id] ?? [];
  const { hasEditPermission, hasDeletePermission } = useAuth();
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [currentDowntime, setCurrentDowntime] = useState<AssetDowntime>();
  const { showSnackBar } = useContext(CustomSnackBarContext);
  const { getFormattedDate } = useContext(CompanySettingsContext);

  useEffect(() => {
    if (asset) dispatch(getAssetDowntimes(asset.id));
  }, [asset]);
  const handleDelete = (id: number) => {
    if (window.confirm(t('Are you sure you want to remove this Downtime?'))) {
      dispatch(deleteAssetDowntime(asset.id, id));
    }
  };
  const onCreationSuccess = () => {
    setOpenAddModal(false);
    showSnackBar(t('The Downtime has been added successfully'), 'success');
  };
  const onCreationFailure = (err) =>
    showSnackBar(t("The Downtime couldn't be added"), 'error');
  const onEditSuccess = () => {
    setOpenEditModal(false);
    showSnackBar(t('The Downtime has been edited successfully'), 'success');
  };
  const onEditFailure = (err) =>
    showSnackBar(t("The Downtime couldn't be edited"), 'error');

  const handleEdit = (id: number) => {
    setCurrentDowntime(downtimes.find((downtime) => downtime.id === id));
    setOpenEditModal(true);
  };
  const verifyValues = (values): boolean => {
    const seconds = values.hours * 60 * 60 + values.minutes * 60;
    let startsOn = new Date(values.startsOn);
    startsOn.setSeconds(startsOn.getSeconds() + seconds);
    if (startsOn > new Date()) {
      showSnackBar(
        'The end of the downtime should not be in the future',
        'error'
      );
      return false;
    }
    return true;
  };
  const columns: GridEnrichedColDef[] = [
    {
      field: 'duration',
      headerName: t('Duration'),
      description: t('Duration'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<number>) =>
        getHMSString(params.value)
    },
    {
      field: 'startsOn',
      headerName: t('Started On'),
      description: t('Started On'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<string>) =>
        getFormattedDate(params.value)
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('Actions'),
      description: t('Actions'),
      getActions: (params: GridRowParams) => {
        let actions = [
          <GridActionsCellItem
            key="edit"
            icon={<EditTwoToneIcon fontSize="small" color="primary" />}
            onClick={() => handleEdit(Number(params.id))}
            label="Edit Downtime"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteTwoToneIcon fontSize="small" color="error" />}
            onClick={() => handleDelete(Number(params.id))}
            label="Remove Downtime"
          />
        ];
        if (!hasEditPermission(PermissionEntity.ASSETS, asset)) actions = [];
        return actions;
      }
    }
  ];
  const fields: Array<IField> = [
    { name: 'startsOn', type: 'date', label: 'Started On' },
    {
      name: 'hours',
      type: 'number',
      label: t('Hours'),
      placeholder: t('Hours'),
      required: true,
      midWidth: true
    },
    {
      name: 'minutes',
      type: 'number',
      label: t('Minutes'),
      placeholder: t('Minutes'),
      required: true,
      midWidth: true
    }
  ];
  const shape = {
    startsOn: Yup.string().required(t('The start date is required')),
    hours: Yup.number().required(t('The hours are required')),
    minutes: Yup.number().required(t('The minutes are required'))
  };
  const renderAddModal = () => (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openAddModal}
      onClose={() => setOpenAddModal(false)}
    >
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('Add Downtime')}
        </Typography>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 3
        }}
      >
        <Box>
          <Form
            fields={fields}
            validation={Yup.object().shape(shape)}
            submitText={t('Add')}
            values={{}}
            onChange={({ field, e }) => {}}
            onSubmit={async (values) => {
              if (verifyValues(values))
                return dispatch(
                  createAssetDowntime(asset.id, {
                    ...values,
                    duration: values.hours * 60 * 60 + values.minutes * 60
                  })
                )
                  .then(onCreationSuccess)
                  .catch(onCreationFailure);
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
  const renderEditModal = () => (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openEditModal}
      onClose={() => setOpenEditModal(false)}
    >
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('Edit Downtime')}
        </Typography>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 3
        }}
      >
        <Box>
          <Form
            fields={fields}
            validation={Yup.object().shape(shape)}
            submitText={t('Save')}
            values={{
              ...currentDowntime,
              hours: currentDowntime
                ? getHoursAndMinutesAndSeconds(currentDowntime.duration)[0]
                : 0,
              minutes: currentDowntime
                ? getHoursAndMinutesAndSeconds(currentDowntime.duration)[1]
                : 0
            }}
            onChange={({ field, e }) => {}}
            onSubmit={async (values) => {
              if (verifyValues(values))
                return dispatch(
                  createAssetDowntime(asset.id, {
                    ...values,
                    duration: values.hours * 60 * 60 + values.minutes * 60
                  })
                )
                  .then(onEditSuccess)
                  .catch(onEditFailure);
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
  return (
    <Box sx={{ px: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ height: 500, width: '95%' }}>
              <Stack direction="row" justifyContent="space-between" py={3}>
                <Select
                  value={asset?.status ?? 'OPERATIONAL'}
                  onChange={(event) => {
                    dispatch(
                      editAsset(asset.id, {
                        ...asset,
                        status: event.target.value as AssetStatus
                      })
                    );
                  }}
                >
                  <MenuItem value={'OPERATIONAL'}>{t('Operational')}</MenuItem>
                  <MenuItem value={'DOWN'}>{t('Down')}</MenuItem>
                </Select>
                {hasEditPermission(PermissionEntity.ASSETS, asset) && (
                  <Button
                    startIcon={<AddTwoToneIcon />}
                    variant="contained"
                    onClick={() => setOpenAddModal(true)}
                  >
                    {t('Add Downtime')}
                  </Button>
                )}
              </Stack>
              <CustomDataGrid
                columns={columns}
                rows={downtimes.filter((downtime) => downtime.duration)}
                components={{
                  Toolbar: GridToolbar
                }}
                onRowClick={(params) => null}
                initialState={{
                  columns: {
                    columnVisibilityModel: {}
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      {renderAddModal()}
      {renderEditModal()}
    </Box>
  );
};

export default AssetDowntimes;
