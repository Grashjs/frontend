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
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { TitleContext } from '../../../contexts/TitleContext';
import { GridEnrichedColDef } from '@mui/x-data-grid/models/colDef/gridColDef';
import CustomDataGrid from '../components/CustomDatagrid';
import { GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import PurchaseOrder, {
  approvalStatusTranslations
} from '../../../models/owns/purchaseOrder';
import { useDispatch, useSelector } from '../../../store';
import {
  deletePurchaseOrder,
  editPurchaseOrder,
  getPurchaseOrders
} from '../../../slices/purchaseOrder';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNavigate, useParams } from 'react-router-dom';
import PurchaseOrderDetails from './PurchaseOrderDetails';
import { IField } from '../type';
import Form from '../components/form';
import * as Yup from 'yup';
import { isNumeric } from '../../../utils/validators';
import { formatSelect } from '../../../utils/formatters';
import { CustomSnackBarContext } from '../../../contexts/CustomSnackBarContext';
import { CompanySettingsContext } from '../../../contexts/CompanySettingsContext';
import useAuth from '../../../hooks/useAuth';
import { PermissionEntity } from '../../../models/owns/role';
import PermissionErrorMessage from '../components/PermissionErrorMessage';
import { PlanFeature } from '../../../models/owns/subscriptionPlan';
import FeatureErrorMessage from '../components/FeatureErrorMessage';
import NoRowsMessageWrapper from '../components/NoRowsMessageWrapper';
import {
  editPOPartQuantities,
  getPartQuantitiesByPurchaseOrder
} from '../../../slices/partQuantity';
import Category from '../../../models/owns/category';

function PurchaseOrders() {
  const { t }: { t: any } = useTranslation();
  const { setTitle } = useContext(TitleContext);
  const { getFormattedDate, getUserNameById, getFormattedCurrency } =
    useContext(CompanySettingsContext);
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const { partQuantitiesByPurchaseOrder } = useSelector(
    (state) => state.partQuantities
  );
  const { purchaseOrderId } = useParams();
  const { hasViewPermission, hasCreatePermission, hasFeature } = useAuth();
  const dispatch = useDispatch();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const { purchaseOrders, loadingGet } = useSelector(
    (state) => state.purchaseOrders
  );
  const [currentPurchaseOrder, setCurrentPurchaseOrder] =
    useState<PurchaseOrder>();
  const partQuantities =
    partQuantitiesByPurchaseOrder[currentPurchaseOrder?.id] ?? [];
  const { showSnackBar } = useContext(CustomSnackBarContext);

  const handleOpenUpdate = () => {
    setOpenUpdateModal(true);
  };
  const handleOpenDetails = (id: number) => {
    const foundPurchaseOrder = purchaseOrders.find(
      (purchaseOrder) => purchaseOrder.id === id
    );
    if (foundPurchaseOrder) {
      setCurrentPurchaseOrder(foundPurchaseOrder);
      window.history.replaceState(
        null,
        'PurchaseOrder details',
        `/app/purchase-orders/${id}`
      );
      setOpenDrawer(true);
    }
  };
  useEffect(() => {
    setTitle(t('Purchase Orders'));
    if (hasViewPermission(PermissionEntity.PURCHASE_ORDERS))
      dispatch(getPurchaseOrders());
  }, []);

  useEffect(() => {
    if (
      purchaseOrders?.length &&
      purchaseOrderId &&
      isNumeric(purchaseOrderId)
    ) {
      handleOpenDetails(Number(purchaseOrderId));
    }
  }, [purchaseOrders]);

  useEffect(() => {
    if (currentPurchaseOrder)
      dispatch(getPartQuantitiesByPurchaseOrder(currentPurchaseOrder.id));
  }, [currentPurchaseOrder?.id]);

  const handleDelete = (id: number) => {
    handleCloseDetails();
    dispatch(deletePurchaseOrder(id))
      .then(onDeleteSuccess)
      .catch(onDeleteFailure);
    setOpenDelete(false);
  };
  const handleCloseDetails = () => {
    window.history.replaceState(null, 'PurchaseOrder', `/app/purchase-orders`);
    setOpenDrawer(false);
  };
  const onEditSuccess = () => {
    setOpenUpdateModal(false);
    showSnackBar(t('The changes have been saved'), 'success');
  };
  const onEditFailure = (err) =>
    showSnackBar(t("The Purchase Order couldn't be edited"), 'error');
  const onDeleteSuccess = () => {
    showSnackBar(
      t('The Purchase Order has been deleted successfully'),
      'success'
    );
  };
  const onDeleteFailure = (err) =>
    showSnackBar(t("The Purchase Order couldn't be deleted"), 'error');
  const columns: GridEnrichedColDef[] = [
    {
      field: 'id',
      headerName: t('ID'),
      description: t('ID'),
      width: 150
    },
    {
      field: 'name',
      headerName: t('Name'),
      description: t('Name'),
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => (
        <Box sx={{ fontWeight: 'bold' }}>{params.value}</Box>
      )
    },
    {
      field: 'itemsNumber',
      headerName: t('Number of items'),
      description: t('Number of items'),
      width: 150,
      valueGetter: (params: GridRenderCellParams<null, PurchaseOrder>) =>
        params.row.partQuantities.length
    },
    {
      field: 'totalCost',
      headerName: t('Total Cost'),
      description: t('Total Cost'),
      width: 150,
      valueGetter: (params: GridRenderCellParams<null, PurchaseOrder>) =>
        getFormattedCurrency(
          params.row.partQuantities.reduce((acc, partQuantity) => {
            return acc + partQuantity.part.cost * partQuantity.quantity;
          }, 0)
        )
    },
    {
      field: 'totalQuantity',
      headerName: t('Total Quantity'),
      description: t('Total Quantity'),
      width: 150,
      valueGetter: (params: GridRenderCellParams<null, PurchaseOrder>) =>
        params.row.partQuantities.reduce((acc, partQuantity) => {
          return acc + partQuantity.quantity;
        }, 0)
    },
    {
      field: 'category',
      headerName: t('Category'),
      description: t('Category'),
      width: 150,
      valueGetter: (params: GridRenderCellParams<Category>) =>
        params.value?.name
    },
    {
      field: 'status',
      headerName: t('Status'),
      description: t('Status'),
      width: 150,
      valueGetter: (params: GridRenderCellParams<string>) =>
        t(approvalStatusTranslations[params.value])
    },
    {
      field: 'shippingShipToName',
      headerName: t('Shipping to'),
      description: t('Shipping to'),
      width: 150
    },
    {
      field: 'shippingAddress',
      headerName: t('Shipping Address'),
      description: t('Shipping Address'),
      width: 150
    },
    {
      field: 'shippingPhone',
      headerName: t('Phone'),
      description: t('Phone'),
      width: 150
    },
    {
      field: 'createdBy',
      headerName: t('Created By'),
      description: t('Created By'),
      width: 150,
      valueGetter: (params) => getUserNameById(params.value)
    },
    {
      field: 'createdAt',
      headerName: t('Created On'),
      description: t('Created On'),
      width: 150,
      valueGetter: (params) => getFormattedDate(params.row.createdAt)
    }
  ];
  const fields: Array<IField> = [
    {
      name: 'purchaseOrderDetails',
      type: 'titleGroupField',
      label: t('Purchase Order Details')
    },
    {
      name: 'name',
      type: 'text',
      label: t('Name'),
      placeholder: t('Enter Purchase Order name'),
      required: true,
      midWidth: true
    },
    {
      name: 'category',
      type: 'select',
      label: t('Category'),
      type2: 'category',
      category: 'purchase-order-categories',
      placeholder: t('Category'),
      midWidth: true
    },
    {
      name: 'shippingDueDate',
      type: 'date',
      label: t('Due Date'),
      midWidth: true
    },
    {
      name: 'shippingAdditionalDetail',
      type: 'text',
      label: t('Additional Details'),
      midWidth: true,
      multiple: true
    },
    {
      name: 'vendor',
      type: 'select',
      type2: 'vendor',
      label: t('Vendor'),
      midWidth: true
    },
    {
      name: 'partQuantities',
      type: 'partQuantity',
      label: t('Parts'),
      midWidth: true
    },
    {
      name: 'shippingInformation',
      type: 'titleGroupField',
      label: t('Shipping Information')
    },
    {
      name: 'shippingCompanyName',
      type: 'text',
      label: t('Company name'),
      placeholder: t('Company name'),
      midWidth: true
    },
    {
      name: 'shippingShipToName',
      type: 'text',
      label: t('Ship To'),
      placeholder: t('Ship To'),
      midWidth: true
    },
    {
      name: 'shippingAddress',
      type: 'text',
      label: t('Address'),
      placeholder: t('Address'),
      midWidth: true
    },
    {
      name: 'shippingCity',
      type: 'text',
      label: t('City'),
      placeholder: t('City'),
      midWidth: true
    },
    {
      name: 'shippingState',
      type: 'text',
      label: t('State'),
      placeholder: t('State'),
      midWidth: true
    },
    {
      name: 'shippingZipCode',
      type: 'number',
      label: t('Zip Code'),
      placeholder: t('Zip Code'),
      midWidth: true
    },
    {
      name: 'shippingPhone',
      type: 'text',
      label: t('Phone number'),
      placeholder: t('Phone number'),
      midWidth: true
    },
    {
      name: 'shippingFax',
      type: 'text',
      label: t('Fax Number'),
      placeholder: t('Fax Number'),
      midWidth: true
    },
    {
      name: 'additionalInformation',
      type: 'titleGroupField',
      label: t('Additional Information')
    },
    {
      name: 'additionalInfoDate',
      type: 'date',
      label: t('Purchase Order Date'),
      placeholder: t('Purchase Order Date'),
      midWidth: true
    },
    {
      name: 'additionalInfoNotes',
      type: 'text',
      label: t('Notes'),
      placeholder: t('Add Notes'),
      midWidth: true,
      multiple: true
    },
    {
      name: 'additionalInfoRequisitionedName',
      type: 'text',
      label: t('Requisitioner'),
      placeholder: t('Requisitioner'),
      midWidth: true
    },
    {
      name: 'additionalInfoTerm',
      type: 'text',
      label: t('Terms'),
      placeholder: t('Terms'),
      midWidth: true
    },
    {
      name: 'additionalInfoShippingOrderCategory',
      type: 'text',
      label: t('Shipping Method'),
      placeholder: t('Shipping Method'),
      midWidth: true
    }
  ];
  const shape = {
    name: Yup.string().required(t('The name is required'))
  };
  const renderUpdateModal = () => (
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
          {t('Edit Purchase Order')}
        </Typography>
        <Typography variant="subtitle2">
          {t('Fill in the fields below to update the Purchase Order')}
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
              ...currentPurchaseOrder,
              vendor: currentPurchaseOrder?.vendor
                ? {
                    label: currentPurchaseOrder.vendor.name,
                    value: currentPurchaseOrder.vendor.id.toString()
                  }
                : null,
              category: currentPurchaseOrder?.category
                ? {
                    label: currentPurchaseOrder.category.name,
                    values: currentPurchaseOrder?.category.id
                  }
                : null,
              partQuantities
            }}
            onChange={({ field, e }) => {}}
            onSubmit={async (values) => {
              values.vendor = formatSelect(values.vendor);
              values.category = formatSelect(values.category);
              return new Promise<void>((resolve, rej) => {
                dispatch(editPurchaseOrder(currentPurchaseOrder.id, values))
                  .then(() => {
                    dispatch(
                      editPOPartQuantities(
                        currentPurchaseOrder.id,
                        values.partQuantities
                      )
                    ).then(() =>
                      setTimeout(
                        () =>
                          dispatch(
                            getPartQuantitiesByPurchaseOrder(
                              currentPurchaseOrder.id
                            )
                          ),
                        //I don't know why direct call to API doesn't have updated values
                        1000
                      )
                    );
                  })
                  .then(onEditSuccess)
                  .catch(onEditFailure)
                  .finally(resolve);
              });
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
  if (hasFeature(PlanFeature.PURCHASE_ORDER)) {
    if (hasViewPermission(PermissionEntity.PURCHASE_ORDERS))
      return (
        <>
          <Helmet>
            <title>{t('Purchase Orders')}</title>
          </Helmet>
          <Grid
            container
            justifyContent="center"
            alignItems="stretch"
            spacing={1}
            paddingX={4}
          >
            {hasCreatePermission(PermissionEntity.PURCHASE_ORDERS) && (
              <Grid
                item
                xs={12}
                display="flex"
                flexDirection="row"
                justifyContent="right"
                alignItems="center"
              >
                <Button
                  onClick={() => navigate('/app/purchase-orders/create')}
                  startIcon={<AddTwoToneIcon />}
                  sx={{ mx: 6, my: 1 }}
                  variant="contained"
                >
                  Purchase Order
                </Button>
              </Grid>
            )}
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
                    rows={purchaseOrders}
                    loading={loadingGet}
                    components={{
                      Toolbar: GridToolbar,
                      NoRowsOverlay: () => (
                        <NoRowsMessageWrapper
                          message={t(
                            'Manage your Purchase Orders in a single place'
                          )}
                          action={t(
                            "Press the '+' button to create a Purchase Order."
                          )}
                        />
                      )
                    }}
                    onRowClick={(params) =>
                      handleOpenDetails(Number(params.id))
                    }
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
          <Drawer
            anchor="right"
            open={openDrawer}
            onClose={handleCloseDetails}
            PaperProps={{
              sx: { width: '50%' }
            }}
          >
            <PurchaseOrderDetails
              purchaseOrder={currentPurchaseOrder}
              handleOpenUpdate={handleOpenUpdate}
              handleDelete={() => setOpenDelete(true)}
              partQuantities={partQuantities}
            />
          </Drawer>
          {renderUpdateModal()}
          <ConfirmDialog
            open={openDelete}
            onCancel={() => {
              setOpenDelete(false);
              setOpenDrawer(true);
            }}
            onConfirm={() => handleDelete(currentPurchaseOrder?.id)}
            confirmText={t('Delete')}
            question={t('Are you sure you want to delete this Purchase Order?')}
          />
        </>
      );
    else
      return (
        <PermissionErrorMessage
          message={
            "You don't have access to Purchase Orders. Please contact your administrator if you should have access"
          }
        />
      );
  } else
    return (
      <FeatureErrorMessage message={'Upgrade to create Purchase Orders'} />
    );
}

export default PurchaseOrders;
