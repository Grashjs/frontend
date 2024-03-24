import {
  Box,
  Button,
  Chip,
  CircularProgress,
  debounce,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomDataGrid from '../components/CustomDatagrid';
import {
  GridActionsCellItem,
  GridEnrichedColDef,
  GridRenderCellParams,
  GridRowParams,
  GridToolbar,
  GridValueGetterParams
} from '@mui/x-data-grid';
import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import UserDetailsDrawer from './UserDetailsDrawer';
import User from '../../../models/owns/user';
import UserRoleCardList from './UserRoleCardList';
import { EmailOutlined } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useParams } from 'react-router-dom';
import { emailRegExp, isNumeric } from 'src/utils/validators';
import { useDispatch, useSelector } from '../../../store';
import { CustomSnackBarContext } from '../../../contexts/CustomSnackBarContext';
import {
  clearSingleUser,
  disableUser,
  editUser,
  editUserRole,
  getSingleUser,
  getUsers,
  inviteUsers
} from '../../../slices/user';
import { OwnUser } from '../../../models/user';
import { PermissionEntity, Role } from '../../../models/owns/role';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import useAuth from '../../../hooks/useAuth';
import Form from '../components/form';
import * as Yup from 'yup';
import { IField } from '../type';
import { formatSelect } from '../../../utils/formatters';
import { CompanySettingsContext } from '../../../contexts/CompanySettingsContext';
import { SearchCriteria } from '../../../models/owns/page';
import { onSearchQueryChange } from '../../../utils/overall';
import SearchInput from '../components/SearchInput';
import CancelIcon from '@mui/icons-material/Cancel';
import ConfirmDialog from '../components/ConfirmDialog';
import { useGridApiRef } from '@mui/x-data-grid-pro';
import useGridStatePersist from '../../../hooks/useGridStatePersist';

interface PropsType {
  values?: any;
  openModal: boolean;
  handleCloseModal: () => void;
}

const People = ({ openModal, handleCloseModal }: PropsType) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const [currentUser, setCurrentUser] = useState<OwnUser>();
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const { peopleId } = useParams();
  const { hasEditPermission, user } = useAuth();
  const { users, loadingGet, singleUser } = useSelector((state) => state.users);
  const [openDrawerFromUrl, setOpenDrawerFromUrl] = useState<boolean>(false);
  const [criteria, setCriteria] = useState<SearchCriteria>({
    filterFields: [],
    pageSize: 10,
    pageNum: 0,
    direction: 'DESC'
  });
  const dispatch = useDispatch();
  const { showSnackBar } = useContext(CustomSnackBarContext);
  const { getFormattedCurrency, getFormattedDate } = useContext(
    CompanySettingsContext
  );
  const [emails, setEmails] = useState<string[]>([]);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [openDisableModal, setOpenDisableModal] = useState<boolean>(false);
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [isInviteSubmitting, setIsInviteSubmitting] = useState(false);
  const [roleId, setRoleId] = useState<number>();

  const onQueryChange = (event) => {
    onSearchQueryChange<User>(event, criteria, setCriteria, [
      'firstName',
      'lastName',
      'email',
      'phone',
      'jobTitle'
    ]);
  };
  const debouncedQueryChange = useMemo(() => debounce(onQueryChange, 1300), []);

  const onEditSuccess = () => {
    setOpenUpdateModal(false);
    showSnackBar(t('changes_saved_success'), 'success');
  };
  const onEditFailure = (err) =>
    showSnackBar(t('The User couldn\'t be edited'), 'error');

  const handleOpenDrawer = (user: OwnUser) => {
    setCurrentUser(user);
    window.history.replaceState(
      null,
      'User details',
      `/app/people-teams/people/${user.id}`
    );
    setDetailDrawerOpen(true);
  };
  const handleOpenDetails = (id: number) => {
    const foundUser = users.content.find((user) => user.id === id);
    if (foundUser) {
      handleOpenDrawer(foundUser);
    }
  };
  const handleOpenUpdate = (id: number) => {
    const foundUser = users.content.find((user) => user.id === id);
    if (foundUser) {
      setCurrentUser(foundUser);
      setOpenUpdateModal(true);
    }
  };
  const handleOpenDisable = (id: number) => {
    const foundUser = users.content.find((user) => user.id === id);
    if (foundUser) {
      setCurrentUser(foundUser);
      setOpenDisableModal(true);
    }
  };
  const handleCloseDetails = () => {
    window.history.replaceState(null, 'User', `/app/people-teams/people`);
    setDetailDrawerOpen(false);
  };
  const defautfields: Array<IField> = [
    {
      name: 'rate',
      type: 'number',
      label: t('hourly_rate')
    },
    {
      name: 'role',
      type: 'select',
      type2: 'role',
      label: t('role')
    }
  ];
  const getFields = () => {
    let fields = [...defautfields];
    if (currentUser?.ownsCompany || currentUser?.id === user?.id) {
      const roleIndex = fields.findIndex((field) => field.name === 'role');
      fields.splice(roleIndex, 1);
    }
    return fields;
  };
  const renderEditUserModal = () => (
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
          {t('edit_user')}
        </Typography>
        <Typography variant="subtitle2">
          {t('edit_user_description')}
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
            fields={getFields()}
            validation={Yup.object().shape({})}
            submitText={t('save')}
            values={{
              rate: currentUser?.rate,
              role: currentUser
                ? {
                  label:
                    currentUser.role.code === 'USER_CREATED'
                      ? currentUser.role.name
                      : t(`${currentUser.role.code}_name`),
                  value: currentUser.role.id
                }
                : null
            }}
            onChange={({ field, e }) => {
            }}
            onSubmit={async (values) => {
              return dispatch(
                editUser(currentUser.id, {
                  ...currentUser,
                  rate: values.rate ?? currentUser.rate
                })
              )
                .then(
                  () =>
                    formatSelect(values.role).id !== currentUser.role.id &&
                    dispatch(
                      editUserRole(currentUser.id, formatSelect(values.role).id)
                    )
                )
                .then(onEditSuccess)
                .catch(onEditFailure);
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
  const onRoleChange = (id: number) => setRoleId(id);
  // if reload with peopleId
  useEffect(() => {
    if (peopleId && isNumeric(peopleId)) {
      dispatch(getSingleUser(Number(peopleId)));
    }
  }, [peopleId]);

  useEffect(() => {
    dispatch(getUsers(criteria));
  }, [criteria]);

  //see changes in ui on edit
  useEffect(() => {
    if (singleUser || users.content.length) {
      const currentInContent = users.content.find(
        (user) => user.id === currentUser?.id
      );
      const updatedUser = currentInContent ?? singleUser;
      if (updatedUser) {
        if (openDrawerFromUrl) {
          setCurrentUser(updatedUser);
        } else {
          handleOpenDrawer(updatedUser);
          setOpenDrawerFromUrl(true);
        }
      }
    }
    return () => {
      dispatch(clearSingleUser());
    };
  }, [singleUser, users]);

  const onPageSizeChange = (size: number) => {
    setCriteria({ ...criteria, pageSize: size });
  };
  const onPageChange = (number: number) => {
    setCriteria({ ...criteria, pageNum: number });
  };

  const verifyCurrentEmail = (): boolean => {
    if (currentEmail) {
      let error;
      if (emails.length < 20) {
        const emailsClone = [...emails];
        if (emailsClone.includes(currentEmail)) {
          error = 'This email is already selected';
        } else {
          if (users.content.map((user) => user.email).includes(currentEmail)) {
            error = 'A user with this email is already in this company';
          } else {
            if (!currentEmail.match(emailRegExp)) {
              error = 'This email is invalid';
            }
          }
        }
      } else error = 'You can invite a maximum of 20 users at once';
      if (error) {
        showSnackBar(t(error), 'error');
        setIsInviteSubmitting(false);
        return false;
      }
    }
    return true;
  };
  // let fields: Array<IField> = [];

  // const shape = {};

  const columns: GridEnrichedColDef[] = [
    {
      field: 'name',
      headerName: t('name'),
      width: 150,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
      renderCell: (params: GridRenderCellParams<string>) => (
        <Box sx={{ fontWeight: 'bold' }}>{params.value}</Box>
      )
    },
    {
      field: 'email',
      headerName: t('email'),
      width: 150
    },
    {
      field: 'phone',
      headerName: t('phone'),
      width: 150
    },
    {
      field: 'jobTitle',
      headerName: t('job_title'),
      width: 150
    },
    {
      field: 'role',
      headerName: t('role'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<Role>) =>
        params.value.code === 'USER_CREATED'
          ? params.value.name
          : t(`${params.value.code}_name`)
    },
    {
      field: 'rate',
      headerName: t('hourly_rate'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<number>) =>
        getFormattedCurrency(params.value)
    },
    {
      field: 'lastLogin',
      headerName: t('last_login'),
      width: 150,
      valueGetter: (params: GridValueGetterParams<string>) =>
        getFormattedDate(params.value)
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('actions'),
      description: t('actions'),
      getActions: (params: GridRowParams<OwnUser>) => {
        let actions = [
          <GridActionsCellItem
            key="edit"
            icon={<EditTwoToneIcon fontSize="small" color={'primary'} />}
            onClick={() => handleOpenUpdate(Number(params.id))}
            label={t('edit')}
          />,
          ...(params.row.enabled && !params.row.ownsCompany ?
            [<GridActionsCellItem
              key="disable"
              icon={<CancelIcon fontSize="small" color={'error'} />}
              onClick={() => handleOpenDisable(Number(params.id))}
              label={t('disable')}
            />] : [])
        ];
        if (!hasEditPermission(PermissionEntity.PEOPLE_AND_TEAMS, params.row))
          actions = [];
        return actions;
      }
    }
  ];
  const apiRef = useGridApiRef();
  useGridStatePersist(apiRef, columns, 'users');
  const RenderPeopleList = () => (
    <CustomDataGrid
      apiRef={apiRef}
      pageSize={criteria.pageSize}
      page={criteria.pageNum}
      rows={users.content}
      rowCount={users.totalElements}
      pagination
      paginationMode="server"
      onPageSizeChange={onPageSizeChange}
      onPageChange={onPageChange}
      rowsPerPageOptions={[10, 20, 50]}
      loading={loadingGet}
      columns={columns}
      components={{
        Toolbar: GridToolbar
      }}
      initialState={{
        columns: {
          columnVisibilityModel: {}
        }
      }}
      onRowClick={(params) => {
        // setCurrentUser(users.find((user) => user.id === params.id));
        handleOpenDetails(Number(params.id));
      }}
    />
  );

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Stack direction="row" width="95%">
        <Box sx={{ my: 0.5 }}>
          <SearchInput onChange={debouncedQueryChange} />
        </Box>
      </Stack>
      {RenderPeopleList()}

      <Drawer
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'left' : 'right'}
        open={detailDrawerOpen}
        onClose={handleCloseDetails}
        elevation={9}
      >
        <UserDetailsDrawer user={currentUser} />
      </Drawer>

      {/* Render People Add Modal */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openModal}
        onClose={handleCloseModal}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('invite_users')}
          </Typography>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '95%' }}>
            <Paper
              elevation={0}
              sx={{
                mb: 2,
                p: 2,
                textAlign: 'center',
                background: grey[100]
              }}
            >
              <Box
                component="img"
                sx={{
                  height: 50,
                  width: 50
                }}
                alt={
                  '<a href=\'https://www.flaticon.com/free-icons/team\' title=\'team icons\'>Team icons created by Freepik - Flaticon</a>'
                }
                src="/static/images/team.png"
              />
              <Typography variant="h5">{t('bring_people_team')}</Typography>
            </Paper>

            <UserRoleCardList onChange={onRoleChange} />
            <Grid container sx={{ mt: 2 }} spacing={1}>
              {emails.map((email, index) => (
                <Grid item key={index}>
                  <Chip
                    label={email}
                    onDelete={() => {
                      const emailsClone = [...emails];
                      emailsClone.splice(index, 1);
                      setEmails(emailsClone);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            <TextField
              sx={{ my: 2 }}
              fullWidth
              helperText={t('add_20_users')}
              label={t('enter_email')}
              placeholder={t('example@email.com')}
              name="email"
              value={currentEmail}
              onChange={(event) => {
                setCurrentEmail(event.target.value);
              }}
              onKeyDown={(event) => {
                if (['Enter', 'Tab'].includes(event.key)) {
                  if (verifyCurrentEmail()) {
                    const emailsClone = [...emails];
                    emailsClone.push(currentEmail);
                    setEmails(emailsClone);
                    setCurrentEmail('');
                  }
                }
              }}
              variant={'outlined'}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                )
              }}
            />
            <Button
              fullWidth
              sx={{ mb: 3 }}
              onClick={async () => {
                setIsInviteSubmitting(true);
                const invite = (emails: string[]) =>
                  dispatch(inviteUsers(roleId, emails))
                    .then(() => {
                      handleCloseModal();
                      setEmails([]);
                      setCurrentEmail('');
                      showSnackBar(t('users_invite_success'), 'success');
                    })
                    .catch((err) =>
                      showSnackBar(t('users_invite_failure'), 'error')
                    )
                    .finally(() => setIsInviteSubmitting(false));
                if (roleId) {
                  if (emails.length || currentEmail) {
                    if (currentEmail) {
                      if (verifyCurrentEmail())
                        invite([...emails, currentEmail]);
                    } else {
                      invite(emails);
                    }
                  } else {
                    showSnackBar(t('please_type_emails'), 'error');
                    setIsInviteSubmitting(false);
                  }
                } else {
                  showSnackBar(t('please_select_role'), 'error');
                  setIsInviteSubmitting(false);
                }
              }}
              variant="contained"
              startIcon={
                isInviteSubmitting ? <CircularProgress size="1rem" /> : null
              }
              disabled={isInviteSubmitting}
            >
              {t('invite')}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={openDisableModal}
        onCancel={() => {
          setOpenDisableModal(false);
        }}
        onConfirm={() => {
          dispatch(disableUser(currentUser.id)).then(() => {
            setOpenDisableModal(false);
            showSnackBar(t('user_disabled_success'), 'success');
          });
        }}
        confirmText={t('disable')}
        question={t('confirm_disable_user', { user: `${currentUser?.firstName} ${currentUser?.lastName}` })}
      />
      {renderEditUserModal()}
    </Box>
  );
};

export default People;
