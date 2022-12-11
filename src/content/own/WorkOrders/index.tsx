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
import { GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Form from '../components/form';
import UserAvatars from '../components/UserAvatars';
import * as Yup from 'yup';
import { isNumeric } from '../../../utils/validators';
import { UserMiniDTO } from '../../../models/user';
import Team from '../../../models/owns/team';
import WorkOrderDetails from './WorkOrderDetails';
import { useParams } from 'react-router-dom';
import Location from '../../../models/owns/location';
import Asset from '../../../models/owns/asset';
import { formatSelect, formatSelectMultiple } from '../../../utils/formatters';
import {
  addWorkOrder,
  editWorkOrder,
  getWorkOrders
} from '../../../slices/workOrder';
import { CustomSnackBarContext } from '../../../contexts/CustomSnackBarContext';
import { useDispatch, useSelector } from '../../../store';
import PriorityWrapper from '../components/PriorityWrapper';
import { patchTasks } from '../../../slices/task';
import { CompanySettingsContext } from '../../../contexts/CompanySettingsContext';
import useAuth from '../../../hooks/useAuth';
import { getWOBaseValues } from '../../../utils/fields';
import { PermissionEntity } from '../../../models/owns/role';
import PermissionErrorMessage from '../components/PermissionErrorMessage';

function WorkOrders() {
  const { t }: { t: any } = useTranslation();
  const [currentTab, setCurrentTab] = useState<string>('list');
  const { workOrders } = useSelector((state) => state.workOrders);
  const dispatch = useDispatch();
  const { uploadFiles } = useContext(CompanySettingsContext);
  const { companySettings, getFilteredFields } = useAuth();
  const { workOrderConfiguration } = companySettings;
  const { getFormattedDate } = useContext(CompanySettingsContext);
  const tabs = [
    { value: 'list', label: t('List View') },
    { value: 'map', label: t('Map View') }
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
  const { workOrdersRoot2 } = useSelector((state) => state.tasks);
  const tasks = workOrdersRoot2[currentWorkOrder?.id] ?? [];
  const handleDelete = (id: number) => {};
  const handleOpenUpdate = (id: number) => {
    setCurrentWorkOrder(workOrders.find((workOrder) => workOrder.id === id));
    setOpenUpdateModal(true);
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

  const formatValues = (values) => {
    values.primaryUser = formatSelect(values.primaryUser);
    values.location = formatSelect(values.location);
    values.team = formatSelect(values.team);
    values.asset = formatSelect(values.asset);
    values.assignedTo = formatSelectMultiple(values.assignedTo);
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
  const workOrderStatuses = [
    { label: t('Open'), value: 'OPEN' },
    { label: t('In Progress'), value: 'IN_PROGRESS' },
    { label: t('On Hold'), value: 'ON_HOLD' },
    { label: t('Complete'), value: 'COMPLETE' }
  ];

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
          <Typography sx={{ ml: 1 }}>
            {
              workOrderStatuses.find(
                (workOrderStatus) => workOrderStatus.value === params.value
              ).label
            }
          </Typography>
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
      valueGetter: (params) => params.row.location?.name
    },
    {
      field: 'locationAddress',
      headerName: t('Location address'),
      description: t('Location address'),
      width: 150,
      valueGetter: (params) => params.row.location?.address
    },
    {
      field: 'category',
      headerName: t('Category'),
      description: t('Category'),
      width: 150,
      valueGetter: (params) => params.row.category?.name
    },
    {
      field: 'asset',
      headerName: t('Asset name'),
      description: t('Asset name'),
      width: 150,
      valueGetter: (params) => params.row.asset?.name
    },
    {
      field: 'address',
      headerName: t('Address'),
      description: t('Address'),
      width: 150
    },
    {
      field: 'daysSinceCreated',
      headerName: t('Days since created'),
      description: t('Days since created'),
      width: 150
    },
    {
      field: 'additionalCost',
      headerName: t('Additional Cost'),
      description: t('Additional Cost'),
      width: 150
    },
    {
      field: 'files',
      headerName: t('Files'),
      description: t('Files'),
      width: 150,
      valueGetter: (params) => params.row.files.length
    },
    {
      field: 'tasks',
      headerName: t('Tasks'),
      description: t('Tasks'),
      width: 150
    },
    {
      field: 'requestedBy',
      headerName: t('Requested By'),
      description: t('Requested By'),
      width: 150,
      valueGetter: (params) => params.row.parentRequest?.createdBy
    },
    {
      field: 'laborCost',
      headerName: t('Labor Cost'),
      description: t('Labor Cost'),
      width: 150
    },
    {
      field: 'parts',
      headerName: t('Parts'),
      description: t('Parts'),
      width: 150
      //TODO
    },
    {
      field: 'completedOn',
      headerName: t('Completed On'),
      description: t('Completed On'),
      width: 150,
      valueGetter: (params) => getFormattedDate(params.value)
    },
    {
      field: 'updatedAt',
      headerName: t('Updated At'),
      description: t('Updated At'),
      width: 150,
      valueGetter: (params) => getFormattedDate(params.row.updatedAt)
    },
    {
      field: 'createdAt',
      headerName: t('Created At'),
      description: t('Created At'),
      width: 150,
      valueGetter: (params) => getFormattedDate(params.row.createdAt)
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
      label: t('Estimated Duration'),
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
      type2: 'worker'
    },
    {
      name: 'assignedTo',
      type: 'select',
      label: t('Additional Workers'),
      type2: 'worker',
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
    let fields = [...getFilteredFields(defaultFields)];
    let shape = { ...defaultShape };
    const fieldsToConfigure = [
      'asset',
      'description',
      'priority',
      'images',
      'primaryUser',
      'assignedTo',
      'team',
      'location',
      'dueDate',
      'category',
      'purchaseOrder',
      'files',
      'signature'
    ];
    fieldsToConfigure.forEach((name) => {
      const fieldConfig =
        workOrderConfiguration.workOrderFieldConfigurations.find(
          (woFC) => woFC.fieldName === name
        );
      const fieldIndexInFields = fields.findIndex(
        (field) => field.name === name
      );
      if (fieldIndexInFields !== -1) {
        if (fieldConfig.fieldType === 'REQUIRED') {
          fields[fieldIndexInFields] = {
            ...fields[fieldIndexInFields],
            required: true
          };
          const requiredMessage = t('This field is required');
          let yupSchema;
          switch (fields[fieldIndexInFields].type) {
            case 'text':
              yupSchema = Yup.string().required(requiredMessage);
              break;
            case 'number':
              yupSchema = Yup.number().required(requiredMessage);
              break;
            default:
              yupSchema = Yup.object().required(requiredMessage).nullable();
              break;
          }
          shape[name] = yupSchema;
        } else if (fieldConfig.fieldType === 'HIDDEN') {
          fields.splice(fieldIndexInFields, 1);
        }
      }
    });

    return [fields, shape];
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
            values={{ requiredSignature: false, dueDate: null }}
            onChange={({ field, e }) => {}}
            onSubmit={async (values) => {
              let formattedValues = formatValues(values);
              return new Promise<void>((resolve, rej) => {
                uploadFiles(formattedValues.files, formattedValues.image)
                  .then((files) => {
                    formattedValues = {
                      ...formattedValues,
                      image: files.find((file) => file.type === 'IMAGE')
                        ? { id: files.find((file) => file.type === 'IMAGE').id }
                        : null,
                      files: files
                        .filter((file) => file.type === 'OTHER')
                        .map((file) => {
                          return { id: file.id };
                        })
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
                    formattedValues = {
                      ...formattedValues,
                      image: files.find((file) => file.type === 'IMAGE')
                        ? { id: files.find((file) => file.type === 'IMAGE').id }
                        : currentWorkOrder.image,
                      files: [
                        ...currentWorkOrder.files,
                        ...files
                          .filter((file) => file.type === 'OTHER')
                          .map((file) => {
                            return { id: file.id };
                          })
                      ]
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
                    ).then(() =>
                      dispatch(
                        editWorkOrder(currentWorkOrder?.id, formattedValues)
                      )
                        .then(onEditSuccess)
                        .then(() => resolve())
                        .catch((err) => {
                          onEditFailure(err);
                          rej();
                        })
                    );
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
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
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
                  components={{
                    Toolbar: GridToolbar
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
            handleUpdate={handleOpenUpdate}
            tasks={tasks}
          />
        </Drawer>
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
