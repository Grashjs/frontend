import SettingsLayout from '../SettingsLayout';

import {
  Avatar,
  Box,
  Button,
  Dialog,
  Drawer,
  Grid,
  Slide,
  styled,
  Typography,
  useTheme
} from '@mui/material';
import { deleteRole, getRoles } from '../../../../slices/role';
import { useDispatch, useSelector } from '../../../../store';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import PageHeader from './PageHeader';
import { useTranslation } from 'react-i18next';
import {
  PermissionEntity,
  PermissionRoot,
  Role
} from '../../../../models/owns/role';
import CloseIcon from '@mui/icons-material/Close';
import {
  forwardRef,
  ReactElement,
  Ref,
  useContext,
  useEffect,
  useState
} from 'react';
import { TransitionProps } from '@mui/material/transitions';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  GridActionsCellItem,
  GridRenderCellParams,
  GridRowParams,
  GridToolbar
} from '@mui/x-data-grid';
import CustomDatagrid from '../../components/CustomDatagrid';
import { GridEnrichedColDef } from '@mui/x-data-grid/models/colDef/gridColDef';
import RoleDetails from './RoleDetails';
import EditRole from './EditRole';
import useAuth from '../../../../hooks/useAuth';
import { CustomSnackBarContext } from '../../../../contexts/CustomSnackBarContext';
import { defaultPermissions } from '../../../../utils/roles';

const DialogWrapper = styled(Dialog)(
  () => `
        .MuiDialog-paper {
          overflow: visible;
        }
  `
);
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const AvatarError = styled(Avatar)(
  ({ theme }) => `
        background-color: ${theme.colors.error.lighter};
        color: ${theme.colors.error.main};
        width: ${theme.spacing(12)};
        height: ${theme.spacing(12)};
  
        .MuiSvgIcon-root {
          font-size: ${theme.typography.pxToRem(45)};
        }
  `
);

const ButtonError = styled(Button)(
  ({ theme }) => `
       background: ${theme.colors.error.main};
       color: ${theme.palette.error.contrastText};
  
       &:hover {
          background: ${theme.colors.error.dark};
       }
      `
);
const LabelWrapper = styled(Box)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(10)};
    font-weight: bold;
    text-transform: uppercase;
    border-radius: ${theme.general.borderRadiusSm};
    padding: ${theme.spacing(0.9, 1.5, 0.7)};
    line-height: 1;
  `
);
function Roles() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const { companySettings } = useAuth();
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<Role>();
  const { showSnackBar } = useContext(CustomSnackBarContext);
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.roles);
  const permissionsMapping = new Map<
    string,
    {
      permissionsRoot: PermissionRoot;
      permissions: PermissionEntity[];
    }[]
  >([
    [
      'createPeopleTeams',
      [
        {
          permissionsRoot: 'createPermissions',
          permissions: [PermissionEntity.PEOPLE_AND_TEAMS]
        },
        {
          permissionsRoot: 'editOtherPermissions',
          permissions: [PermissionEntity.PEOPLE_AND_TEAMS]
        }
      ]
    ],
    [
      'createCategories',
      [
        {
          permissionsRoot: 'createPermissions',
          permissions: [PermissionEntity.CATEGORIES]
        },
        {
          permissionsRoot: 'editOtherPermissions',
          permissions: [PermissionEntity.CATEGORIES]
        }
      ]
    ],
    [
      'deleteWorkOrders',
      [
        {
          permissionsRoot: 'deleteOtherPermissions',
          permissions: [PermissionEntity.WORK_ORDERS]
        }
      ]
    ],
    [
      'deletePreventiveMaintenanceTrigger',
      [
        {
          permissionsRoot: 'deleteOtherPermissions',
          permissions: [PermissionEntity.PREVENTIVE_MAINTENANCES]
        }
      ]
    ],
    [
      'deleteLocations',
      [
        {
          permissionsRoot: 'deleteOtherPermissions',
          permissions: [PermissionEntity.LOCATIONS]
        }
      ]
    ],
    [
      'deleteAssets',
      [
        {
          permissionsRoot: 'deleteOtherPermissions',
          permissions: [PermissionEntity.ASSETS]
        }
      ]
    ],
    [
      'deletePartsAndSets',
      [
        {
          permissionsRoot: 'deleteOtherPermissions',
          permissions: [PermissionEntity.PARTS_AND_MULTIPARTS]
        }
      ]
    ],
    [
      'deletePurchaseOrders',
      [
        {
          permissionsRoot: 'deleteOtherPermissions',
          permissions: [PermissionEntity.PURCHASE_ORDERS]
        }
      ]
    ],
    [
      'deleteMeters',
      [
        {
          permissionsRoot: 'deleteOtherPermissions',
          permissions: [PermissionEntity.METERS]
        }
      ]
    ],
    [
      'deleteVendorsCustomers',
      [
        {
          permissionsRoot: 'deleteOtherPermissions',
          permissions: [PermissionEntity.VENDORS_AND_CUSTOMERS]
        }
      ]
    ],
    [
      'deleteCategories',
      [
        {
          permissionsRoot: 'deleteOtherPermissions',
          permissions: [PermissionEntity.CATEGORIES]
        }
      ]
    ],
    [
      'deleteFiles',
      [
        {
          permissionsRoot: 'deleteOtherPermissions',
          permissions: [PermissionEntity.FILES]
        }
      ]
    ],
    [
      'deletePeopleTeams',
      [
        {
          permissionsRoot: 'deleteOtherPermissions',
          permissions: [PermissionEntity.PEOPLE_AND_TEAMS]
        }
      ]
    ],
    [
      'accessSettings',
      [
        {
          permissionsRoot: 'viewPermissions',
          permissions: [PermissionEntity.SETTINGS]
        }
      ]
    ]
  ]);

  const formatValues = (values, useDefaultPermissions: boolean) => {
    values.companySettings = { id: companySettings.id };
    values.roleType = 'ROLE_CLIENT';
    values = useDefaultPermissions
      ? { ...values, ...defaultPermissions }
      : values;
    permissionsMapping.forEach((configs, name) => {
      configs.forEach((config) => {
        if ((values[name] && values[name][0] === 'on') || values[name]) {
          console.log(name, config);
          values[config.permissionsRoot] = values[
            config.permissionsRoot
          ].concat(config.permissions);
        } else if (!values[name] || values[name][0] === 'off') {
          values[config.permissionsRoot] = values[
            config.permissionsRoot
          ].filter((permission) => !config.permissions.includes(permission));
        }
      });
    });
    return values;
  };
  const onDeleteSuccess = () => {
    showSnackBar(t('The Role has been deleted successfully'), 'success');
  };
  const onDeleteFailure = (err) =>
    showSnackBar(t("The Role couldn't be deleted"), 'error');

  const handleOpenDetails = (id: number) => {
    const foundRole = roles.find((role) => role.id === id);
    if (foundRole) {
      setCurrentRole(foundRole);
      setOpenDrawer(true);
    }
  };
  const handleOpenDelete = (id: number) => {
    changeCurrentRole(id);
    setOpenDelete(true);
  };
  const changeCurrentRole = (id: number) => {
    const foundRole = roles.find((role) => role.id === id);
    setCurrentRole(foundRole);
  };
  const handleOpenUpdate = (id: number) => {
    changeCurrentRole(id);
    setOpenUpdateModal(true);
  };
  const closeConfirmDelete = () => setOpenDelete(false);

  const handleDelete = (id: number) => {
    setOpenDrawer(false);
    dispatch(deleteRole(id)).then(onDeleteSuccess).catch(onDeleteFailure);
    setOpenDelete(false);
  };
  useEffect(() => {
    dispatch(getRoles());
  }, []);

  const renderDeleteModal = () => (
    <DialogWrapper
      open={openDelete}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      keepMounted
      onClose={closeConfirmDelete}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        p={5}
      >
        <AvatarError>
          <CloseIcon />
        </AvatarError>

        <Typography
          align="center"
          sx={{
            py: 4,
            px: 6
          }}
          variant="h3"
        >
          {t('Are you sure you want to permanently delete this role')}?
        </Typography>

        <Box>
          <Button
            variant="text"
            size="large"
            sx={{
              mx: 1
            }}
            onClick={closeConfirmDelete}
          >
            {t('Cancel')}
          </Button>
          <ButtonError
            onClick={() => handleDelete(currentRole.id)}
            size="large"
            sx={{
              mx: 1,
              px: 3
            }}
            variant="contained"
          >
            {t('Delete')}
          </ButtonError>
        </Box>
      </Box>
    </DialogWrapper>
  );

  const columns: GridEnrichedColDef[] = [
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
      field: 'users',
      headerName: t('Users'),
      description: t('Users'),
      width: 150
    },
    {
      field: 'externalId',
      headerName: t('External ID'),
      description: t('External Id'),
      width: 150
    },
    {
      field: 'paid',
      headerName: t('Type'),
      description: t('Type'),
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => (
        <LabelWrapper
          sx={{
            background: params.value
              ? `${theme.colors.info.main}`
              : `${theme.colors.success.main}`,
            color: `${theme.palette.getContrastText(
              params.value ? theme.colors.info.dark : theme.colors.success.dark
            )}`
          }}
        >
          {params.value ? t('Paid') : t('Free')}
        </LabelWrapper>
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('Actions'),
      description: t('Actions'),
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditTwoToneIcon fontSize="small" color="primary" />}
          onClick={() => handleOpenUpdate(Number(params.id))}
          label="Edit"
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteTwoToneIcon fontSize="small" color="error" />}
          onClick={() => handleOpenDelete(Number(params.id))}
          label="Delete"
        />
      ]
    }
  ];

  return (
    <SettingsLayout tabIndex={3}>
      <Grid item xs={12}>
        <Box p={4}>
          <PageHeader rolesNumber={roles.length} formatValues={formatValues} />
          <EditRole
            open={openUpdateModal}
            role={currentRole}
            onClose={() => setOpenUpdateModal(false)}
            formatValues={formatValues}
          />
          {renderDeleteModal()}
          <Box sx={{ mt: 4, height: 500, width: '95%' }}>
            <CustomDatagrid
              rows={roles}
              columns={columns}
              components={{
                Toolbar: GridToolbar
                // Toolbar: GridToolbarColumnsButton,
                // Toolbar: GridToolbarDensitySelector
              }}
              onRowClick={(params) => handleOpenDetails(Number(params.id))}
              initialState={{
                columns: {
                  columnVisibilityModel: {}
                }
              }}
            />
          </Box>
        </Box>
      </Grid>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: { width: '50%' }
        }}
      >
        <RoleDetails
          role={currentRole}
          handleOpenUpdate={() => setOpenUpdateModal(true)}
          handleOpenDelete={() => setOpenDelete(true)}
        />
      </Drawer>
    </SettingsLayout>
  );
}

export default Roles;
