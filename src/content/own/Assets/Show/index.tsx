import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MultipleTabsLayout from '../../components/MultipleTabsLayout';
import { TitleContext } from '../../../../contexts/TitleContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Asset, { AssetDTO } from '../../../../models/owns/asset';
import AssetWorkOrders from './AssetWorkOrders';
import AssetDetails from './AssetDetails';
import AssetParts from './AssetParts';
import AssetFiles from './AssetFiles';
import { isNumeric } from 'src/utils/validators';
import { IField } from '../../type';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import Form from '../../components/form';
import * as Yup from 'yup';
import {
  deleteAsset,
  editAsset,
  getAssetDetails
} from '../../../../slices/asset';
import { useDispatch, useSelector } from '../../../../store';
import { CustomSnackBarContext } from '../../../../contexts/CustomSnackBarContext';
import { formatAssetValues } from '../../../../utils/formatters';
import { CompanySettingsContext } from '../../../../contexts/CompanySettingsContext';
import { PermissionEntity } from '../../../../models/owns/role';
import PermissionErrorMessage from '../../components/PermissionErrorMessage';
import useAuth from '../../../../hooks/useAuth';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import ConfirmDialog from '../../components/ConfirmDialog';
import AssetMeters from './AssetMeters';

interface PropsType {}

const ShowAsset = ({}: PropsType) => {
  const { t }: { t: any } = useTranslation();
  const { assetId } = useParams();
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const { setTitle } = useContext(TitleContext);
  const { uploadFiles } = useContext(CompanySettingsContext);
  const location = useLocation();
  const { showSnackBar } = useContext(CustomSnackBarContext);
  const { assetInfos } = useSelector((state) => state.assets);
  const asset: AssetDTO = assetInfos[assetId]?.asset;
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const {
    hasViewPermission,
    hasEditPermission,
    hasDeletePermission,
    getFilteredFields
  } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isNumeric(assetId)) dispatch(getAssetDetails(Number(assetId)));
  }, [assetId]);

  const handleOpenUpdateModal = () => setOpenUpdateModal(true);
  const handleCloseUpdateModal = () => setOpenUpdateModal(false);

  const handleDelete = () => {
    dispatch(deleteAsset(asset.id))
      .then(onDeleteSuccess)
      .catch(onDeleteFailure);
  };
  useEffect(() => {
    setTitle(asset?.name);
  }, [asset]);

  const arr = location.pathname.split('/');

  const tabs = [
    { value: 'work-orders', label: t('Work Orders') },
    { value: 'details', label: t('Details') },
    { value: 'parts', label: t('Parts') },
    { value: 'files', label: t('Files') },
    { value: 'meters', label: t('Meters') }
  ];
  const tabIndex = tabs.findIndex((tab) => tab.value === arr[arr.length - 1]);
  const onDeleteSuccess = () => {
    showSnackBar(t('The Asset has been deleted successfully'), 'success');
    navigate('/app/assets');
  };
  const onDeleteFailure = (err) =>
    showSnackBar(t("The Asset couldn't be deleted"), 'error');
  const defaultFields: Array<IField> = [
    {
      name: 'assetInfo',
      type: 'titleGroupField',
      label: t('Asset Information')
    },
    {
      name: 'name',
      type: 'text',
      label: t('Name'),
      placeholder: t('Enter asset name'),
      required: true
    },
    {
      name: 'location',
      type: 'select',
      type2: 'location',
      label: t('Location'),
      placeholder: t('Select asset location'),
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
      name: 'model',
      type: 'text',
      label: t('Model'),
      placeholder: t('Model'),
      midWidth: true
    },
    {
      name: 'serialNumber',
      type: 'text',
      label: t('Serial Number'),
      placeholder: t('Serial Number'),
      midWidth: true
    },
    {
      name: 'category',
      midWidth: true,
      label: t('Category'),
      placeholder: t('Category'),
      type: 'select',
      type2: 'category',
      category: 'asset-categories'
    },
    {
      name: 'area',
      type: 'text',
      midWidth: true,
      label: t('Area'),
      placeholder: t('Area')
    },
    {
      name: 'image',
      type: 'file',
      fileType: 'image',
      label: t('Image')
    },
    {
      name: 'assignedTo',
      type: 'titleGroupField',
      label: t('Assigned To')
    },
    {
      name: 'primaryUser',
      type: 'select',
      type2: 'user',
      label: 'Worker',
      placeholder: 'Select primary user'
    },
    {
      name: 'assignedTo',
      type: 'select',
      type2: 'user',
      multiple: true,
      label: t('Additional Workers'),
      placeholder: 'Select additional workers'
    },
    {
      name: 'teams',
      type: 'select',
      type2: 'team',
      multiple: true,
      label: t('Teams'),
      placeholder: 'Select teams'
    },
    {
      name: 'moreInfos',
      type: 'titleGroupField',
      label: t('More Informations')
    },
    {
      name: 'customers',
      type: 'select',
      type2: 'customer',
      multiple: true,
      label: t('Customers'),
      placeholder: 'Select customers'
    },
    {
      name: 'vendors',
      type: 'select',
      type2: 'vendor',
      multiple: true,
      label: t('Vendors'),
      placeholder: t('Select vendors')
    },
    {
      name: 'inServiceDate',
      type: 'date',
      midWidth: true,
      label: t('Placed in Service date')
    },
    {
      name: 'warrantyExpirationDate',
      type: 'date',
      midWidth: true,
      label: t('Warranty Expiration date')
    },
    {
      name: 'additionalInfos',
      type: 'text',
      label: t('Additional Information'),
      placeholder: t('Additional Information'),
      multiple: true
    },
    {
      name: 'files',
      type: 'file',
      multiple: true,
      label: t('Files'),
      fileType: 'file'
    },
    {
      name: 'structure',
      type: 'titleGroupField',
      label: t('Structure')
    },
    { name: 'parts', type: 'select', type2: 'part', label: t('Parts') },
    {
      name: 'parentAsset',
      type: 'select',
      type2: 'asset',
      label: t('Parent Asset'),
      excluded: Number(assetId)
    }
  ];

  const shape = {
    name: Yup.string().required(t('Asset name is required'))
  };
  const onEditSuccess = () => {
    setOpenUpdateModal(false);
    showSnackBar(t('The changes have been saved'), 'success');
  };
  const onEditFailure = (err) =>
    showSnackBar(t("The Asset couldn't be edited"), 'error');

  const renderAssetUpdateModal = () => (
    <Dialog
      fullWidth
      maxWidth="md"
      open={openUpdateModal}
      onClose={handleCloseUpdateModal}
    >
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('Edit Asset')}
        </Typography>
        <Typography variant="subtitle2">
          {t('Fill in the fields below to edit this asset')}
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
            fields={getFilteredFields(defaultFields)}
            validation={Yup.object().shape(shape)}
            submitText={t('Save')}
            values={{
              ...asset,
              location: asset?.location
                ? {
                    label: asset?.location.name,
                    value: asset?.location.id
                  }
                : null,
              primaryUser: asset?.primaryUser
                ? {
                    label: `${asset?.primaryUser.firstName} ${asset?.primaryUser.lastName}`,
                    value: asset?.primaryUser.id
                  }
                : null,
              assignedTo: asset?.assignedTo?.map((user) => {
                return {
                  label: `${user.firstName} ${user.lastName}`,
                  value: user.id
                };
              }),
              customers: asset?.customers?.map((customer) => {
                return {
                  label: customer.name,
                  value: customer.id
                };
              }),
              vendors: asset?.vendors?.map((vendor) => {
                return {
                  label: vendor.companyName,
                  value: vendor.id
                };
              }),
              teams: asset?.teams?.map((team) => {
                return {
                  label: team.name,
                  value: team.id
                };
              }),
              parts:
                asset?.parts?.map((part) => {
                  return {
                    label: part.name,
                    value: part.id
                  };
                }) ?? []
            }}
            onChange={({ field, e }) => {}}
            onSubmit={async (values) => {
              let formattedValues = formatAssetValues(values);
              const files = formattedValues.files.find((file) => file.id)
                ? []
                : formattedValues.files;
              return new Promise<void>((resolve, rej) => {
                uploadFiles(files, formattedValues.image)
                  .then((files) => {
                    formattedValues = {
                      ...formattedValues,
                      image: files.find((file) => file.type === 'IMAGE')
                        ? { id: files.find((file) => file.type === 'IMAGE').id }
                        : asset.image,
                      files: [
                        ...asset.files,
                        ...files
                          .filter((file) => file.type === 'OTHER')
                          .map((file) => {
                            return { id: file.id };
                          })
                      ]
                    };
                    dispatch(editAsset(Number(assetId), formattedValues))
                      .then(onEditSuccess)
                      .catch(onEditFailure)
                      .finally(resolve);
                  })
                  .catch((err) => {
                    onEditFailure(err);
                    rej(err);
                  });
              });
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
  if (hasViewPermission(PermissionEntity.ASSETS))
    return (
      <MultipleTabsLayout
        basePath={`/app/assets/${assetId}`}
        tabs={tabs}
        tabIndex={tabIndex}
        title={`Asset`}
        action={
          hasEditPermission(PermissionEntity.ASSETS, asset)
            ? handleOpenUpdateModal
            : null
        }
        actionTitle={t('Edit')}
        secondAction={() => setOpenDelete(true)}
        secondActionTitle={t('Delete')}
        secondActionIcon={<DeleteTwoToneIcon />}
        withoutCard
        editAction
      >
        {isNumeric(assetId) ? (
          tabIndex === 0 ? (
            <AssetWorkOrders asset={asset} />
          ) : tabIndex === 1 ? (
            <AssetDetails asset={asset} />
          ) : tabIndex === 2 ? (
            <AssetParts asset={asset} />
          ) : tabIndex === 3 ? (
            <AssetFiles asset={asset} />
          ) : (
            tabIndex === 4 && <AssetMeters asset={asset} />
          )
        ) : null}
        <ConfirmDialog
          open={openDelete}
          onCancel={() => {
            setOpenDelete(false);
          }}
          onConfirm={handleDelete}
          confirmText={t('Delete')}
          question={t('Are you sure you want to delete this Asset?')}
        />
        {renderAssetUpdateModal()}
      </MultipleTabsLayout>
    );
  else
    return (
      <PermissionErrorMessage
        message={
          "You don't have access to Assets. Please contact your administrator if you should have access"
        }
      />
    );
};

export default ShowAsset;
