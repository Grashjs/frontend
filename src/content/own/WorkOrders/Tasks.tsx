import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import TaskAltTwoToneIcon from '@mui/icons-material/TaskAltTwoTone';
import { useState } from 'react';
import { tasks as defaultTasks } from '../../../models/owns/tasks';
import SingleTask from '../components/form/SelectTasks/SingleTask';

interface TasksProps {}

export default function Tasks({}: TasksProps) {
  const { t }: { t: any } = useTranslation();
  const [notes, setNotes] = useState<Map<number, boolean>>(new Map());
  const [tasks, setTasks] = useState(defaultTasks);

  function handleChange(value: string | number, id: number) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, value };
      }
      return task;
    });
    setTasks(newTasks);
  }

  function handleNoteChange(value: string, id: number) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, notes: value };
      }
      return task;
    });
    setTasks(newTasks);
  }

  function toggleNotes(id: number) {
    const newNotes = new Map(notes);
    newNotes.set(id, !newNotes.get(id));
    setNotes(newNotes);
  }

  return (
    <Card>
      <CardHeader title={t('Tasks')} avatar={<TaskAltTwoToneIcon />} />
      <Divider />
      <CardContent>
        <FormControl fullWidth>
          {tasks.map((task) => (
            <SingleTask
              key={task.id}
              task={task}
              handleChange={handleChange}
              handleNoteChange={handleNoteChange}
              toggleNotes={toggleNotes}
              notes={notes}
            />
          ))}
        </FormControl>
      </CardContent>
    </Card>
  );
}