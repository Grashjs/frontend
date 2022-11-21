import { Box, Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SettingsLayout from '../SettingsLayout';
import CustomDataGrid from '../../components/CustomDatagrid';
import { GridEnrichedColDef } from '@mui/x-data-grid/models/colDef/gridColDef';
import {
  GridActionsCellItem,
  GridRenderCellParams,
  GridRowParams,
  GridToolbar,
  GridValueGetterParams
} from '@mui/x-data-grid';
import { Checklist, checklists } from '../../../../models/owns/checklists';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import SelectTasksModal from '../../components/form/SelectTasks';
import { useContext, useState } from 'react';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useDispatch } from '../../../../store';
import { CustomSnackBarContext } from '../../../../contexts/CustomSnackBarContext';
import { deleteChecklist } from '../../../../slices/checklist';
import ConfirmDialog from '../../components/ConfirmDialog';

function Checklists() {
  const { t }: { t: any } = useTranslation();
  const [openCreateChecklist, setOpenCreateChecklist] = useState(false);
  const [openEditChecklist, setOpenEditChecklist] = useState(false);
  const [currentChecklist, setCurrentChecklist] = useState<Checklist>();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { showSnackBar } = useContext(CustomSnackBarContext);

  const onDeleteSuccess = () => {
    showSnackBar(t('The Checklist has been deleted successfully'), 'success');
  };
  const onDeleteFailure = (err) =>
    showSnackBar(t("The Checklist couldn't be deleted"), 'error');

  const handleDelete = (id: number) => {
    dispatch(deleteChecklist(id)).then(onDeleteSuccess).catch(onDeleteFailure);
    setOpenDelete(false);
  };
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
      field: 'description',
      headerName: t('Description'),
      description: t('Description'),
      width: 150
    },
    {
      field: 'category',
      headerName: t('Category'),
      description: t('Category'),
      width: 150
    },
    {
      field: 'tasks',
      headerName: t('Tasks'),
      description: t('Tasks'),
      valueGetter: (params: GridValueGetterParams<Checklist>) =>
        params.row.tasks.length,
      width: 150
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('Actions'),
      description: t('Actions'),
      getActions: (params: GridRowParams<Checklist>) => [
        <GridActionsCellItem
          key="delete"
          icon={<DeleteTwoToneIcon fontSize="small" color="error" />}
          onClick={() => {
            setCurrentChecklist(params.row);
            setOpenDelete(true);
          }}
          label="Remove Checklist"
        />
      ]
    }
  ];
  return (
    <SettingsLayout tabIndex={4}>
      <Grid item xs={12}>
        <Box
          sx={{
            height: 600,
            width: '95%',
            p: 4
          }}
        >
          <Button
            sx={{
              mb: 2
            }}
            variant="contained"
            onClick={() => setOpenCreateChecklist(true)}
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            {t('Create Checklist')}
          </Button>
          <CustomDataGrid
            columns={columns}
            rows={checklists}
            components={{
              Toolbar: GridToolbar
            }}
            onRowClick={(params: GridRowParams<Checklist>) => {
              setCurrentChecklist(params.row);
              setOpenEditChecklist(true);
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {}
              }
            }}
          />
        </Box>
      </Grid>
      <SelectTasksModal
        open={openCreateChecklist}
        onClose={() => setOpenCreateChecklist(false)}
        selected={[]}
        onSelect={(tasks, { name, description, category }) => {}}
        action="createChecklist"
      />
      <SelectTasksModal
        open={openEditChecklist}
        onClose={() => setOpenEditChecklist(false)}
        selected={currentChecklist?.tasks ?? []}
        onSelect={(tasks, { name, description, category }) => {}}
        action="editChecklist"
        infos={{
          name: currentChecklist?.name,
          description: currentChecklist?.description,
          category: currentChecklist?.category
        }}
      />
      <ConfirmDialog
        open={openDelete}
        onCancel={() => {
          setOpenDelete(false);
        }}
        onConfirm={() => handleDelete(currentChecklist?.id)}
        confirmText={t('Delete')}
        question={t('Are you sure you want to delete this Checklist?')}
      />
    </SettingsLayout>
  );
}

export default Checklists;