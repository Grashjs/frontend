import { Helmet } from 'react-helmet-async';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  Grid,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import { IField } from '../type';
import WorkOrder from '../../../models/owns/workOrder';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { TitleContext } from '../../../contexts/TitleContext';
import { GridEnrichedColDef } from '@mui/x-data-grid/models/colDef/gridColDef';
import CustomDataGrid from '../components/CustomDatagrid';
import {
  GridRenderCellParams,
  GridToolbar,
  GridValueGetterParams
} from '@mui/x-data-grid';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Form from '../components/form';
import UserAvatars from '../components/UserAvatars';
import * as Yup from 'yup';
import { isNumeric } from '../../../utils/validators';
import { UserMiniDTO } from '../../../models/user';
import Team from '../../../models/owns/team';
import WorkOrderDetails from './WorkOrderDetails';
import { useParams, useSearchParams } from 'react-router-dom';
import Location, { LocationMiniDTO } from '../../../models/owns/location';
import Asset, { AssetMiniDTO } from '../../../models/owns/asset';
import { formatSelect, formatSelectMultiple } from '../../../utils/formatters';
import {
  addWorkOrder,
  deleteWorkOrder,
  editWorkOrder,
  getWorkOrders
} from '../../../slices/workOrder';
import { CustomSnackBarContext } from '../../../contexts/CustomSnackBarContext';
import { useDispatch, useSelector } from '../../../store';
import PriorityWrapper from '../components/PriorityWrapper';
import { patchTasks } from '../../../slices/task';
import { CompanySettingsContext } from '../../../contexts/CompanySettingsContext';
import useAuth from '../../../hooks/useAuth';
import { getWOBaseValues } from '../../../utils/woBase';
import { PermissionEntity } from '../../../models/owns/role';
import PermissionErrorMessage from '../components/PermissionErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import NoRowsMessageWrapper from '../components/NoRowsMessageWrapper';
import { getImageAndFiles } from '../../../utils/overall';
import { getSingleLocation } from '../../../slices/location';
import { getSingleAsset } from '../../../slices/asset';
import Category from '../../../models/owns/category';
import File from '../../../models/owns/file';
import { dayDiff } from '../../../utils/dates';

function WorkOrders() {
  const { t }: { t: any } = useTranslation();
  const [currentTab, setCurrentTab] = useState<string>('list');
  const { workOrders, loadingGet } = useSelector((state) => state.workOrders);
  const [searchParams, setSearchParams] = useSearchParams();
  const locationParam = searchParams.get('location');
  const assetParam = searchParams.get('asset');
  const dispatch = useDispatch();
  const { uploadFiles, getWOFieldsAndShapes } = useContext(
    CompanySettingsContext
  );
  const { companySettings, getFilteredFields } = useAuth();
  const { workOrderConfiguration } = companySettings;
  const { getFormattedDate, getUserNameById } = useContext(
    CompanySettingsContext
  );
  const tabs = [
    { value: 'list', label: t('List View'), disabled: false },
    { value: 'calendar', label: t('Calendar View'), disabled: true },
    { value: 'column', label: t('Column View'), disabled: true }
  ];
  const theme = useTheme();
  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const { setTitle } = useContext(TitleContext);
  const { workOrderId } = useParams();
  const { showSnackBar } = useContext(CustomSnackBarContext);
  const { hasViewPermission, hasCreatePermission } = useAuth();
  const [currentWorkOrder, setCurrentWorkOrder] = useState<WorkOrder>();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const { tasksByWorkOrder } = useSelector((state) => state.tasks);
  const { locations } = useSelector((state) => state.locations);
  const { assetInfos } = useSelector((state) => state.assets);
  const locationParamObject = locations.find(
    (location) => location.id === Number(locationParam)
  );
  const assetParamObject = assetInfos[assetParam]?.asset;
  const tasks = tasksByWorkOrder[currentWorkOrder?.id] ?? [];
  const handleDelete = (id: number) => {
    dispatch(deleteWorkOrder(id)).then(onDeleteSuccess).catch(onDeleteFailure);
    setOpenDelete(false);
  };
  const handleOpenUpdate = (id: number) => {
    setCurrentWorkOrder(workOrders.find((workOrder) => workOrder.id === id));
    setOpenUpdateModal(true);
  };
  const handleOpenDelete = (id: number) => {
    setCurrentWorkOrder(workOrders.find((workOrder) => workOrder.id === id));
    setOpenDelete(true);
    setOpenDrawer(false);
  };
  const handleOpenDetails = (id: number) => {
    const foundWorkOrder = workOrders.find((workOrder) => workOrder.id === id);
    if (foundWorkOrder) {
      setCurrentWorkOrder(foundWorkOrder);
      window.history.replaceState(
        null,
        'WorkOrder details',
        `/app/work-orders/${id}`
      );
      setOpenDrawer(true);
    }
  };
  const handleCloseDetails = () => {
    window.history.replaceState(null, 'WorkOrder', `/app/work-orders`);
    setOpenDrawer(false);
  };
  useEffect(() => {
    setTitle(t('Work Orders'));
    if (hasViewPermission(PermissionEntity.WORK_ORDERS))
      dispatch(getWorkOrders());
  }, []);

  useEffect(() => {
    if (workOrderId && isNumeric(workOrderId)) {
      handleOpenDetails(Number(workOrderId));
    }
  }, [workOrders]);

  useEffect(() => {
    if (locationParam || assetParam) {
      if (locationParam && isNumeric(locationParam)) {
        dispatch(getSingleLocation(Number(locationParam)));
      }
      if (assetParam && isNumeric(assetParam)) {
        dispatch(getSingleAsset(Number(assetParam)));
      }
    }
  }, []);

  useEffect(() => {
    let shouldOpen1 = locationParam && locationParamObject;
    let shouldOpen2 = assetParam && assetParamObject;
    if (shouldOpen1 || shouldOpen2) {
      setOpenAddModal(true);
    }
  }, [locationParamObject, assetParamObject]);

  const formatValues = (values) => {
    values.primaryUser = formatSelect(values.primaryUser);
    values.location = formatSelect(values.location);
    values.team = formatSelect(values.team);
    values.asset = formatSelect(values.asset);
    values.assignedTo = formatSelectMultiple(values.assignedTo);
    values.customers = formatSelectMultiple(values.customers);
    values.priority = values.priority?.value;
    values.requiredSignature = Array.isArray(values.requiredSignature)
      ? values?.requiredSignature.includes('on')
      : values.requiredSignature;
    values.category = formatSelect(values.category);
    return values;
  };
  const onCreationSuccess = () => {
    setOpenAddModal(false);
    showSnackBar(t('The Work Order has been created successfully'), 'success');
  };
  const onCreationFailure = (err) =>
    showSnackBar(t("The Work Order couldn't be created"), 'error');
  const onEditSuccess = () => {
    setOpenUpdateModal(false);
    showSnackBar(t('The changes have been saved'), 'success');
  };
  const onEditFailure = (err) =>
    showSnackBar(t("The Work Order couldn't be edited"), 'error');
  const onDeleteSuccess = () => {
    showSnackBar(t('The Work Order has been deleted successfully'), 'success');
  };
  const onDeleteFailure = (err) =>
    showSnackBar(t("The Work Order couldn't be deleted"), 'error');

  const columns: GridEnrichedColDef[] = [
    {
      field: 'id',
      headerName: t('ID'),
      description: t('ID')
    },
    {
      field: 'status',
      headerName: t('Status'),
      description: t('Status'),
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => (
        <Box display="flex" flexDirection="row" justifyContent="center">
          <CircleTwoToneIcon
            fontSize="small"
            color={
              params.value === 'IN_PROGRESS'
                ? 'success'
                : params.value === 'ON_HOLD'
                ? 'warning'
                : params.value === 'COMPLETE'
                ? 'info'
                : 'secondary'
            }
          />
          <Typography sx={{ ml: 1 }}>{t(params.value)}</Typography>
        </Box>
      )
    },
    {
      field: 'title',
      headerName: t('Title'),
      description: t('Title'),
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => (
        <Box sx={{ fontWeight: 'bold' }}>{params.value}</Box>
      )
    },

    {
      field: 'priority',
      headerName: t('Priority'),
      description: t('Priority'),
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => (
        <PriorityWrapper priority={params.value} />
      )
    },
    {
      field: 'description',
      headerName: t('Description'),
      description: t('Description'),
      width: 150
    },
    {
      field: 'primaryUser',
      headerName: t('Worker'),
      description: t('Worker'),
      width: 150,
      renderCell: (params: GridRenderCellParams<UserMiniDTO>) =>
        params.value ? <UserAvatars users={[params.value]} /> : null
    },
    {
      field: 'assignedTo',
      headerName: t('Assignees'),
      description: t('Assignees'),
      width: 150,
      renderCell: (params: GridRenderCellParams<UserMiniDTO[]>) => (
        <UserAvatars users={params.value} />
      )
    },
    {
      field: 'location',
      headerName: t('Location name'),
      description: t('Location name'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<LocationMiniDTO>) =>
        params.value?.name
    },
    {
      field: 'locationAddress',
      headerName: t('Location address'),
      description: t('Location address'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<null, WorkOrder>) =>
        params.row.location?.address
    },
    {
      field: 'category',
      headerName: t('Category'),
      description: t('Category'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<Category>) =>
        params.value?.name
    },
    {
      field: 'asset',
      headerName: t('Asset name'),
      description: t('Asset name'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<AssetMiniDTO>) =>
        params.value?.name
    },
    {
      field: 'daysSinceCreated',
      headerName: t('Days since creation'),
      description: t('Days since creation'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<null, WorkOrder>) =>
        dayDiff(new Date(), new Date(params.row.createdAt))
    },
    {
      field: 'files',
      headerName: t('Files'),
      description: t('Files'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<File[]>) =>
        params.value.length
    },
    {
      field: 'requestedBy',
      headerName: t('Requested By'),
      description: t('Requested By'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<null, WorkOrder>) =>
        getUserNameById(params.row.parentRequest?.createdBy)
    },
    {
      field: 'completedOn',
      headerName: t('Completed On'),
      description: t('Completed On'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<string>) =>
        getFormattedDate(params.value)
    },
    {
      field: 'updatedAt',
      headerName: t('Updated At'),
      description: t('Updated At'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<string>) =>
        getFormattedDate(params.value)
    },
    {
      field: 'createdAt',
      headerName: t('Created At'),
      description: t('Created At'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<string>) =>
        getFormattedDate(params.value)
    }
  ];
  const defaultFields: Array<IField> = [
    {
      name: 'title',
      type: 'text',
      label: t('Title'),
      placeholder: t('Enter Work Order title'),
      required: true
    },
    {
      name: 'description',
      type: 'text',
      label: t('Description'),
      placeholder: t('Description'),
      multiple: true
    },
    {
      name: 'image',
      type: 'file',
      fileType: 'image',
      label: t('Image')
    },
    {
      name: 'dueDate',
      type: 'date',
      label: t('Due Date')
    },
    {
      name: 'estimatedDuration',
      type: 'number',
      label: t('Estimated Duration in Hours'),
      placeholder: t('Hours')
    },
    {
      name: 'priority',
      type: 'select',
      label: t('Priority'),
      type2: 'priority'
    },
    {
      name: 'category',
      type: 'select',
      label: t('Category'),
      type2: 'category',
      category: 'work-order-categories'
    },
    {
      name: 'primaryUser',
      type: 'select',
      label: t('Primary Worker'),
      type2: 'user'
    },
    {
      name: 'assignedTo',
      type: 'select',
      label: t('Additional Workers'),
      type2: 'user',
      multiple: true
    },
    {
      name: 'customers',
      type: 'select',
      label: t('Customers'),
      type2: 'customer',
      multiple: true
    },
    {
      name: 'team',
      type: 'select',
      type2: 'team',
      label: 'Team',
      placeholder: 'Select team'
    },
    {
      name: 'location',
      type: 'select',
      type2: 'location',
      label: 'Location',
      placeholder: 'Select location'
    },
    {
      name: 'asset',
      type: 'select',
      type2: 'asset',
      label: t('Asset'),
      placeholder: 'Select Asset'
    },
    {
      name: 'tasks',
      type: 'select',
      type2: 'task',
      label: t('Tasks'),
      placeholder: 'Select Tasks'
    },
    {
      name: 'files',
      type: 'file',
      multiple: true,
      label: t('Files'),
      fileType: 'file'
    },
    {
      name: 'requiredSignature',
      type: 'switch',
      label: t('Requires Signature')
    }
  ];
  const defaultShape: { [key: string]: any } = {
    title: Yup.string().required(t('WorkOrder title is required'))
  };
  const getFieldsAndShapes = (): [Array<IField>, { [key: string]: any }] => {
    return getWOFieldsAndShapes(defaultFields, defaultShape);
  };

  const renderWorkOrderAddModal = () => (
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
          {t('Add Work Order')}
        </Typography>
        <Typography variant="subtitle2">
          {t('Fill in the fields below to create and add a new Work Order')}
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
            fields={getFieldsAndShapes()[0]}
            validation={Yup.object().shape(getFieldsAndShapes()[1])}
            submitText={t('Add')}
            values={{
              requiredSignature: false,
              dueDate: null,
              asset: assetParamObject
                ? { label: assetParamObject.name, value: assetParamObject.id }
                : null,
              location: locationParamObject
                ? {
                    label: locationParamObject.name,
                    value: locationParamObject.id
                  }
                : null
            }}
            onChange={({ field, e }) => {}}
            onSubmit={async (values) => {
              let formattedValues = formatValues(values);
              return new Promise<void>((resolve, rej) => {
                uploadFiles(formattedValues.files, formattedValues.image)
                  .then((files) => {
                    const imageAndFiles = getImageAndFiles(files);
                    formattedValues = {
                      ...formattedValues,
                      image: imageAndFiles.image,
                      files: imageAndFiles.files
                    };
                    dispatch(addWorkOrder(formattedValues))
                      .then(() => {
                        onCreationSuccess();
                        resolve();
                      })
                      .catch((err) => {
                        onCreationFailure(err);
                        rej();
                      });
                  })
                  .catch((err) => {
                    onCreationFailure(err);
                    rej();
                  });
              });
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
  const renderWorkOrderUpdateModal = () => (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openUpdateModal}
      onClose={() => setOpenUpdateModal(false)}
    >
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('Edit Work Order')}
        </Typography>
        <Typography variant="subtitle2">
          {t('Fill in the fields below to update the Work Order')}
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
            fields={getFieldsAndShapes()[0]}
            validation={Yup.object().shape(getFieldsAndShapes()[1])}
            submitText={t('Save')}
            values={{
              ...currentWorkOrder,
              tasks: tasks,
              ...getWOBaseValues(t, currentWorkOrder)
            }}
            onChange={({ field, e }) => {}}
            onSubmit={async (values) => {
              let formattedValues = formatValues(values);
              return new Promise<void>((resolve, rej) => {
                //differentiate files from api and formattedValues
                const files = formattedValues.files.find((file) => file.id)
                  ? []
                  : formattedValues.files;
                uploadFiles(files, formattedValues.image)
                  .then((files) => {
                    const imageAndFiles = getImageAndFiles(
                      files,
                      currentWorkOrder.image
                    );
                    formattedValues = {
                      ...formattedValues,
                      image: imageAndFiles.image,
                      files: [...currentWorkOrder.files, ...imageAndFiles.files]
                    };
                    dispatch(
                      //TODO editTask
                      patchTasks(
                        currentWorkOrder?.id,
                        formattedValues.tasks.map((task) => {
                          return {
                            ...task.taskBase,
                            options: task.taskBase.options.map(
                              (option) => option.label
                            )
                          };
                        })
                      )
                    )
                      .then(() =>
                        dispatch(
                          editWorkOrder(currentWorkOrder?.id, formattedValues)
                        )
                          .then(onEditSuccess)
                          .then(() => resolve())
                          .catch((err) => {
                            onEditFailure(err);
                            rej();
                          })
                      )
                      .catch((err) => {
                        onEditFailure(err);
                        rej();
                      });
                  })
                  .catch((err) => {
                    onEditFailure(err);
                    rej();
                  });
              });
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
  if (hasViewPermission(PermissionEntity.WORK_ORDERS))
    return (
      <>
        <Helmet>
          <title>{t('Work Orders')}</title>
        </Helmet>
        <Grid
          container
          justifyContent="center"
          alignItems="stretch"
          spacing={1}
          paddingX={4}
        >
          <Grid
            item
            xs={12}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Tabs
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) =>
                tab.disabled ? (
                  <Tooltip title={t('Coming Soon')} placement="top">
                    <span>
                      <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                        disabled={tab.disabled}
                      />
                    </span>
                  </Tooltip>
                ) : (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                )
              )}
            </Tabs>
            {hasCreatePermission(PermissionEntity.WORK_ORDERS) && (
              <Button
                onClick={() => setOpenAddModal(true)}
                startIcon={<AddTwoToneIcon />}
                sx={{ mx: 6, my: 1 }}
                variant="contained"
              >
                Work Order
              </Button>
            )}
          </Grid>
          <Grid item xs={12}>
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ height: 500, width: '95%' }}>
                <CustomDataGrid
                  columns={columns}
                  rows={workOrders}
                  loading={loadingGet}
                  components={{
                    Toolbar: GridToolbar,
                    NoRowsOverlay: () => (
                      <NoRowsMessageWrapper
                        message={t(
                          'Work Orders are tasks or jobs, that can be scheduled or assigned to someone'
                        )}
                        action={t(
                          "Press the '+' button to create a Work Order"
                        )}
                      />
                    )
                  }}
                  onRowClick={(params) => handleOpenDetails(Number(params.id))}
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
        {renderWorkOrderAddModal()}
        {renderWorkOrderUpdateModal()}
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={handleCloseDetails}
          PaperProps={{
            sx: { width: '50%' }
          }}
        >
          <WorkOrderDetails
            workOrder={currentWorkOrder}
            onEdit={handleOpenUpdate}
            tasks={tasks}
            onDelete={handleOpenDelete}
          />
        </Drawer>
        <ConfirmDialog
          open={openDelete}
          onCancel={() => {
            setOpenDelete(false);
            setOpenDrawer(true);
          }}
          onConfirm={() => handleDelete(currentWorkOrder?.id)}
          confirmText={t('Delete')}
          question={t('Are you sure you want to delete this Work Order?')}
        />
      </>
    );
  else
    return (
      <PermissionErrorMessage
        message={
          "You don't have access to Work Orders. Please contact your administrator if you should have access"
        }
      />
    );
}

export default WorkOrders;
