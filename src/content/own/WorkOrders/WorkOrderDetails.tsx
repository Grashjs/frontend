import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import WorkOrder from '../../../models/owns/workOrder';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoDisturbOnTwoToneIcon from '@mui/icons-material/DoDisturbOnTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Asset from '../../../models/owns/asset';
import { labors } from '../../../models/owns/labor';
import AddTimeModal from './AddTimeModal';
import { additionalCosts } from '../../../models/owns/additionalCost';
import AddCostModal from './AddCostModal';
import Tasks from './Tasks';
import { workOrderHistories } from '../../../models/owns/workOrderHistories';
import { partQuantities } from '../../../models/owns/partQuantity';
import PriorityWrapper from '../components/PriorityWrapper';
import { editWorkOrder } from '../../../slices/workOrder';
import { useDispatch } from '../../../store';

interface WorkOrderDetailsProps {
  workOrder: WorkOrder;
  handleUpdate: (id: number) => void;
}
export default function WorkOrderDetails(props: WorkOrderDetailsProps) {
  const { workOrder, handleUpdate } = props;
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  const [openAddTimeModal, setOpenAddTimeModal] = useState<boolean>(false);
  const [openAddCostModal, setOpenAddCostModal] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('details');
  const [changingStatus, setChangingStatus] = useState<boolean>(false);
  const [openSelectParts, setOpenSelectParts] = useState<boolean>(false);
  const dispatch = useDispatch();
  const workOrderStatuses = [
    { label: t('Open'), value: 'OPEN' },
    { label: t('In Progress'), value: 'IN_PROGRESS' },
    { label: t('On Hold'), value: 'ON_HOLD' },
    { label: t('Complete'), value: 'COMPLETE' }
  ];
  const tabs = [
    { value: 'details', label: t('Details') },
    { value: 'updates', label: t('Updates') }
  ];

  const getPath = (resource, id) => {
    switch (resource) {
      case 'asset':
        return `/app/assets/${id}/work-orders`;
      case 'team':
        return `/app/people-teams/teams/${id}`;
      default:
        return `/app/${resource}s/${id}`;
    }
  };
  const BasicField = ({
    label,
    value,
    id,
    type
  }: {
    label: string | number;
    value: string | number;
    type?: string;
    id?: number;
  }) => {
    if (value && (!type || (type && id))) {
      return (
        <Grid item xs={12} lg={6}>
          <Typography variant="h6" sx={{ color: theme.colors.alpha.black[70] }}>
            {label}
          </Typography>
          {type ? (
            <Link href={getPath(type, id)} variant="h6" fontWeight="bold">
              {value}
            </Link>
          ) : (
            <Typography variant="h6">{value}</Typography>
          )}
        </Grid>
      );
    } else return null;
  };
  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };
  const detailsFieldsToRender = (
    workOrder: WorkOrder
  ): {
    label: string;
    value: string | number;
    type?: 'location' | 'asset' | 'team';
    id?: number;
  }[] => [
    {
      label: t('ID'),
      value: workOrder.id
    },
    {
      label: t('Due Date'),
      value: workOrder.dueDate
    },
    {
      label: t('Category'),
      value: workOrder.category?.name
    },
    {
      label: t('Location'),
      value: workOrder.location?.name,
      type: 'location',
      id: workOrder.location?.id
    },
    {
      label: t('Asset'),
      value: workOrder.asset.name,
      type: 'asset',
      id: workOrder.asset.id
    },
    {
      label: t('Team'),
      value: workOrder.team?.name,
      type: 'team',
      id: workOrder.team?.id
    },
    {
      label: t('Date created'),
      value: workOrder.createdAt
    },
    {
      label: t('Created By'),
      value: workOrder.createdBy
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
          <Box sx={{ mb: 2 }}>
            <PriorityWrapper priority={workOrder?.priority} withSuffix />
          </Box>
          <Typography variant="h2">{workOrder?.title}</Typography>
          <Typography variant="h6">{workOrder?.description}</Typography>
        </Box>
        <Box>
          <EditTwoToneIcon
            onClick={() => handleUpdate(workOrder.id)}
            style={{ cursor: 'pointer', marginRight: 10 }}
            color="primary"
          />
          <DeleteTwoToneIcon style={{ cursor: 'pointer' }} color="error" />
        </Box>
      </Grid>
      <Divider />
      <Grid item xs={12}>
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
      </Grid>
      <Grid item xs={12}>
        {currentTab === 'details' && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {changingStatus ? (
                  <CircularProgress />
                ) : (
                  <Select
                    onChange={(event) => {
                      setChangingStatus(true);
                      dispatch(
                        editWorkOrder(workOrder?.id, {
                          ...workOrder,
                          status: event.target.value
                        })
                      ).finally(() => setChangingStatus(false));
                    }}
                    value={workOrder.status}
                    sx={
                      workOrder.status === 'OPEN'
                        ? {}
                        : {
                            backgroundColor:
                              workOrder.status === 'IN_PROGRESS'
                                ? theme.colors.success.main
                                : workOrder.status === 'ON_HOLD'
                                ? theme.colors.warning.main
                                : theme.colors.alpha.black[30],
                            color: 'white',
                            fontWeight: 'bold'
                          }
                    }
                  >
                    {workOrderStatuses.map((workOrderStatus, index) => (
                      <MenuItem key={index} value={workOrderStatus.value}>
                        {workOrderStatus.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Grid>
              {detailsFieldsToRender(workOrder).map((field) => (
                <BasicField
                  key={field.id}
                  label={field.label}
                  value={field.value}
                  type={field.type}
                  id={field.id}
                />
              ))}
              {!!workOrder.assignedTo.length && (
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.alpha.black[70] }}
                  >
                    Assigned To
                  </Typography>
                  {workOrder.assignedTo.map((user, index) => (
                    <Box key={user.id}>
                      <Link
                        href={`/app/people-teams/users/${user.id}`}
                        variant="h6"
                        fontWeight="bold"
                      >{`${user.firstName} ${user.lastName}`}</Link>
                    </Box>
                  ))}
                </Grid>
              )}
              {!!workOrder.customers.length && (
                <Grid item xs={12} lg={6}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.alpha.black[70] }}
                  >
                    {t('Customers')}
                  </Typography>
                  {workOrder.customers.map((customer, index) => (
                    <Box key={customer.id}>
                      <Link
                        href={`/app/vendors-customers/customers/${customer.id}`}
                        variant="h6"
                        fontWeight="bold"
                      >
                        {customer.name}
                      </Link>
                    </Box>
                  ))}
                </Grid>
              )}
            </Grid>
            <Box>
              <Divider sx={{ mt: 2 }} />
              <Tasks />
            </Box>
            <Box>
              <Divider sx={{ mt: 2 }} />
              <Typography sx={{ mt: 2, mb: 1 }} variant="h3">
                Labors
              </Typography>
              {!labors.length ? (
                <Typography sx={{ color: theme.colors.alpha.black[70] }}>
                  {t(
                    "No labor costs have been added yet. They'll show up here when a user logs time and has an hourly rate stored in Grash."
                  )}
                </Typography>
              ) : (
                <List>
                  {labors.map((labor) => (
                    <ListItem
                      key={labor.id}
                      secondaryAction={
                        <Typography variant="h6">
                          {labor.laborCost.cost} $
                        </Typography>
                      }
                    >
                      <ListItemText
                        primary={
                          <Link
                            href={`/app/people-teams/users/${labor.user.id}`}
                            variant="h6"
                          >
                            {`${labor.user.firstName} ${labor.user.lastName}`}
                          </Link>
                        }
                        secondary={labor.createdAt}
                      />
                    </ListItem>
                  ))}
                  <ListItem
                    secondaryAction={
                      <Typography variant="h6" fontWeight="bold">
                        {labors.reduce(
                          (acc, labor) => acc + labor.laborCost.cost,
                          0
                        )}{' '}
                        $
                      </Typography>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight="bold">
                          Total
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              )}
              <Button
                onClick={() => setOpenAddTimeModal(true)}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Time
              </Button>
            </Box>
            <Box>
              <Divider sx={{ mt: 2 }} />
              <Typography sx={{ mt: 2, mb: 1 }} variant="h3">
                Additional Costs
              </Typography>
              {!additionalCosts.length ? (
                <Typography sx={{ color: theme.colors.alpha.black[70] }}>
                  {t('No Additional costs have been added yet')}
                </Typography>
              ) : (
                <List>
                  {additionalCosts.map((additionalCost) => (
                    <ListItem
                      key={additionalCost.id}
                      secondaryAction={
                        <Typography variant="h6">
                          {additionalCost.cost} $
                        </Typography>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h6">
                            {additionalCost.description}
                          </Typography>
                        }
                        secondary={additionalCost.createdAt}
                      />
                    </ListItem>
                  ))}
                  <ListItem
                    secondaryAction={
                      <Typography variant="h6" fontWeight="bold">
                        {additionalCosts.reduce(
                          (acc, additionalCost) => acc + additionalCost.cost,
                          0
                        )}{' '}
                        $
                      </Typography>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight="bold">
                          Total
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              )}
              <Button
                onClick={() => setOpenAddCostModal(true)}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Additional Cost
              </Button>
            </Box>
            {!!partQuantities.length && (
              <Box>
                <Divider sx={{ mt: 2 }} />
                <Typography sx={{ mt: 2, mb: 1 }} variant="h3">
                  Parts
                </Typography>
                <List>
                  {partQuantities.map((partQuantity) => (
                    <ListItem
                      key={partQuantity.id}
                      secondaryAction={
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <TextField
                            label={t('Quantity')}
                            variant="outlined"
                            sx={{ mr: 1 }}
                            size="small"
                          />
                          <Typography variant="h6">
                            {' * '}
                            {partQuantity.part.cost} $
                          </Typography>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={
                          <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`/app/inventory/parts/${partQuantity.part.id}`}
                            key={partQuantity.part.id}
                            variant="h6"
                          >
                            {partQuantity.part.name}
                          </Link>
                        }
                        secondary={partQuantity.part.description}
                      />
                    </ListItem>
                  ))}
                  <ListItem
                    secondaryAction={
                      <Typography variant="h6" fontWeight="bold">
                        {partQuantities.reduce(
                          (acc, partQuantity) =>
                            acc +
                            partQuantity.part.cost * partQuantity.quantity,
                          0
                        )}{' '}
                        $
                      </Typography>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight="bold">
                          Total
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
                <Button
                  onClick={() => setOpenSelectParts(true)}
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Add Part
                </Button>
              </Box>
            )}
            {!!workOrder.files.length && (
              <Box>
                <Divider sx={{ mt: 2 }} />
                <Typography sx={{ mt: 2, mb: 1 }} variant="h3">
                  Files
                </Typography>
                <List>
                  {workOrder.files.map((file) => (
                    <ListItem
                      key={file.id}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                          <DoDisturbOnTwoToneIcon color="error" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Link href={file.url} variant="h6">
                            {file.name}
                          </Link>
                        }
                        secondary={file.createdAt}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
        {currentTab == 'updates' && (
          <List>
            {workOrderHistories.map((workOrderHistory) => (
              <ListItem
                key={workOrderHistory.id}
                secondaryAction={workOrderHistory.date}
              >
                <ListItemText
                  primary={`${workOrderHistory.user.firstName} ${workOrderHistory.user.lastName}`}
                  secondary={workOrderHistory.description}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Grid>
      <AddTimeModal
        open={openAddTimeModal}
        onClose={() => setOpenAddTimeModal(false)}
      />
      <AddCostModal
        open={openAddCostModal}
        onClose={() => setOpenAddCostModal(false)}
      />
    </Grid>
  );
}
