import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MultipleTabsLayout from '../../components/MultipleTabsLayout';
import { TitleContext } from '../../../../contexts/TitleContext';
import { useLocation, useParams } from 'react-router-dom';
import Asset, { AssetDTO } from '../../../../models/owns/asset';
import AssetWorkOrders from './AssetWorkOrders';
import AssetDetails from './AssetDetails';
import AssetParts from './AssetParts';
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
import { editAsset, getAssetDetails } from '../../../../slices/asset';
import { useDispatch, useSelector } from '../../../../store';
import { CustomSnackBarContext } from '../../../../contexts/CustomSnackBarContext';
import { formatAssetValues } from '../../../../utils/formatters';
import { CompanySettingsContext } from '../../../../contexts/CompanySettingsContext';
import { PermissionEntity } from '../../../../models/owns/role';
import PermissionErrorMessage from '../../components/PermissionErrorMessage';
import useAuth from '../../../../hooks/useAuth';

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
  const { hasViewPermission, hasEditPermission, hasDeletePermission } =
    useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isNumeric(assetId)) dispatch(getAssetDetails(Number(assetId)));
  }, [assetId]);

  const handleOpenUpdateModal = () => setOpenUpdateModal(true);
  const handleCloseUpdateModal = () => setOpenUpdateModal(false);

  useEffect(() => {
    setTitle(asset?.name);
  }, [asset]);

  const arr = location.pathname.split('/');

  const tabs = [
    { value: 'work-orders', label: t('Work Orders') },
    { value: 'details', label: t('Details') },
    { value: 'parts', label: t('Parts') }
  ];
  const tabIndex = tabs.findIndex((tab) => tab.value === arr[arr.length - 1]);

  const fields: Array<IField> = [
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
      placeholder: t('Model')
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
            fields={fields}
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

              return new Promise<void>((resolve, rej) => {
                uploadFiles([], formattedValues.image)
                  .then((files) => {
                    formattedValues = {
                      ...formattedValues,
                      image: files.length ? { id: files[0].id } : asset.image
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
        withoutCard
        editAction
      >
        {isNumeric(assetId) ? (
          tabIndex === 0 ? (
            <AssetWorkOrders asset={asset} />
          ) : tabIndex === 1 ? (
            <AssetDetails asset={asset} />
          ) : (
            tabIndex === 2 && <AssetParts asset={asset} />
          )
        ) : null}
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
