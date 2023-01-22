import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Form from '../components/form';
import * as Yup from 'yup';
import { IField } from '../type';
import CustomDataGrid from '../components/CustomDatagrid';
import Team from '../../../models/owns/team';
import {
  GridEnrichedColDef,
  GridRenderCellParams,
  GridToolbar
} from '@mui/x-data-grid';
import { Close } from '@mui/icons-material';
import { isNumeric } from 'src/utils/validators';
import { useParams } from 'react-router-dom';
import { addTeam, deleteTeam, editTeam, getTeams } from '../../../slices/team';
import { useDispatch, useSelector } from '../../../store';
import ConfirmDialog from '../components/ConfirmDialog';
import { useContext, useEffect, useState } from 'react';
import { formatSelectMultiple } from '../../../utils/formatters';
import { UserMiniDTO } from '../../../models/user';
import UserAvatars from '../components/UserAvatars';
import { CustomSnackBarContext } from '../../../contexts/CustomSnackBarContext';
import useAuth from '../../../hooks/useAuth';
import { PermissionEntity } from '../../../models/owns/role';
import NoRowsMessage from '../components/NoRowsMessage';

interface PropsType {
  values?: any;
  openModal: boolean;
  handleCloseModal: () => void;
}

const Teams = ({ openModal, handleCloseModal }: PropsType) => {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [currentTeam, setCurrentTeam] = useState<Team>();
  const { teams } = useSelector((state) => state.teams);
  const { showSnackBar } = useContext(CustomSnackBarContext);
  const { hasEditPermission, hasDeletePermission } = useAuth();
  const [isTeamDetailsOpen, setIsTeamDetailsOpen] = useState(false);
  const [viewOrUpdate, setViewOrUpdate] = useState<'view' | 'update'>('view');
  const { teamId } = useParams();

  useEffect(() => {
    dispatch(getTeams());
  }, []);

  const handleDelete = (id: number) => {
    dispatch(deleteTeam(id)).then(onDeleteSuccess).catch(onDeleteFailure);
    setOpenDelete(false);
  };
  const onCreationSuccess = () => {
    handleCloseModal();
    showSnackBar(t('team_create_success'), 'success');
  };
  const onCreationFailure = (err) =>
    showSnackBar(t('team_create_failure'), 'error');
  const onEditSuccess = () => {
    setOpenUpdateModal(false);
    showSnackBar(t('changes_saved_success'), 'success');
  };
  const onEditFailure = (err) => showSnackBar(t('team_edit_failure'), 'error');
  const onDeleteSuccess = () => {
    showSnackBar(t('team_delete_success'), 'success');
  };
  const onDeleteFailure = (err) =>
    showSnackBar(t('team_delete_failure'), 'error');
  let fields: Array<IField> = [
    {
      name: 'name',
      type: 'text',
      label: t('name'),
      placeholder: t('team_name'),
      required: true
    },
    {
      name: 'description',
      type: 'text',
      multiple: true,
      label: t('description'),
      placeholder: t('description')
    },
    {
      name: 'users',
      type: 'select',
      type2: 'user',
      multiple: true,
      label: t('people_in_team'),
      placeholder: t('people_in_team')
    }
  ];

  const shape = {
    name: Yup.string().required('required_team_name')
  };

  const columns: GridEnrichedColDef[] = [
    {
      field: 'name',
      headerName: t('team_name'),
      width: 150,
      renderCell: (params: GridRenderCellParams<string>) => (
        <Box sx={{ fontWeight: 'bold' }}>{params.value}</Box>
      )
    },
    {
      field: 'description',
      headerName: t('description'),
      width: 150
    },
    {
      field: 'users',
      headerName: t('people_in_team'),
      width: 200,
      renderCell: (params: GridRenderCellParams<UserMiniDTO[]>) => (
        <UserAvatars users={params.value} />
      )
    }
  ];
  const handleOpenDetails = (id: number) => {
    const foundTeam = teams.find((team) => team.id === id);
    if (foundTeam) {
      setCurrentTeam(foundTeam);
      window.history.replaceState(
        null,
        'Team details',
        `/app/people-teams/teams/${id}`
      );
      setIsTeamDetailsOpen(true);
    }
  };
  const handleCloseDetails = () => {
    window.history.replaceState(null, 'Team', `/app/people-teams/teams`);
    setIsTeamDetailsOpen(false);
  };

  // if reload with teamId
  useEffect(() => {
    if (teamId && isNumeric(teamId)) {
      handleOpenDetails(Number(teamId));
    }
  }, [teams]);

  const RenderTeamsAddModal = () => (
    <Dialog fullWidth maxWidth="md" open={openModal} onClose={handleCloseModal}>
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('create_team')}
        </Typography>
        <Typography variant="subtitle2">
          {t('create_team_description')}
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
            submitText={t('submit')}
            onChange={({ field, e }) => {}}
            onSubmit={async (values) => {
              values.users = formatSelectMultiple(values.users);
              return dispatch(addTeam(values))
                .then(onCreationSuccess)
                .catch(onCreationFailure);
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );

  const Renderteams = () => (
    <Box
      sx={{
        height: 400,
        width: '95%'
      }}
    >
      {teams.length !== 0 ? (
        <CustomDataGrid
          rows={teams}
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
            handleOpenDetails(Number(params.id));
          }}
        />
      ) : (
        <NoRowsMessage
          message={t('noRows.team.message')}
          action={t('noRows.team.action')}
        />
      )}
    </Box>
  );

  const ModalTeamDetails = () => (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isTeamDetailsOpen}
      onClose={handleCloseDetails}
    >
      <DialogTitle
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          {viewOrUpdate === 'view' ? (
            hasEditPermission(
              PermissionEntity.PEOPLE_AND_TEAMS,
              currentTeam
            ) && (
              <Typography
                onClick={() => setViewOrUpdate('update')}
                style={{ cursor: 'pointer' }}
                variant="subtitle1"
                mr={2}
              >
                {t('edit')}
              </Typography>
            )
          ) : (
            <Typography
              onClick={() => setViewOrUpdate('view')}
              style={{ cursor: 'pointer' }}
              variant="subtitle1"
              mr={2}
            >
              {t('go_back')}
            </Typography>
          )}
          {hasDeletePermission(
            PermissionEntity.PEOPLE_AND_TEAMS,
            currentTeam
          ) && (
            <Typography
              variant="subtitle1"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setIsTeamDetailsOpen(false);
                setOpenDelete(true);
              }}
            >
              {t('to_delete')}
            </Typography>
          )}
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleCloseDetails}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 3
        }}
      >
        {viewOrUpdate === 'view' ? (
          <Box>
            <Typography variant="subtitle1">{t('name')}</Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {currentTeam?.name}
            </Typography>
            <Typography variant="subtitle1">{t('description')}</Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {currentTeam?.description}
            </Typography>

            {/* people in the team */}
          </Box>
        ) : (
          <Box>
            <Form
              fields={fields}
              validation={Yup.object().shape(shape)}
              submitText={t('save')}
              values={
                {
                  ...currentTeam,
                  users: currentTeam.users.map((user) => {
                    return {
                      label: `${user.firstName} ${user.lastName}`,
                      value: user.id
                    };
                  })
                } || {}
              }
              onChange={({ field, e }) => {}}
              onSubmit={async (values) => {
                values.users = formatSelectMultiple(values.users);
                return dispatch(editTeam(currentTeam.id, values))
                  .then(() => {
                    onEditSuccess();
                    setViewOrUpdate('view');
                  })
                  .catch(onEditFailure);
              }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <RenderTeamsAddModal />
      <ModalTeamDetails />
      <Renderteams />
      <ConfirmDialog
        open={openDelete}
        onCancel={() => {
          setOpenDelete(false);
          setIsTeamDetailsOpen(true);
        }}
        onConfirm={() => handleDelete(currentTeam?.id)}
        confirmText={t('to_delete')}
        question={t('confirm_delete_team')}
      />
    </Box>
  );
};

export default Teams;
