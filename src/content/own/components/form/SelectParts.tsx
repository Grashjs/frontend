import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Part from 'src/models/owns/part';
import { useDispatch, useSelector } from '../../../../store';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { getParts } from '../../../../slices/part';

interface SelectPartsProps {
  onChange: (parts: Part[]) => void;
  open: boolean;
  onClose: () => void;
  selected: number[];
}

export default function SelectParts({
  onChange,
  open,
  onClose,
  selected
}: SelectPartsProps) {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();
  const { parts } = useSelector((state) => state.parts);
  const { multiParts } = useSelector((state) => state.multiParts);
  const [currentTab, setCurrentTab] = useState<string>('parts');
  const [selectedParts, setSelectedParts] = useState<Part[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>(selected);
  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };
  const tabs = [
    { value: 'parts', label: t('Parts') },
    { value: 'sets', label: t('Sets of Parts') }
  ];

  useEffect(() => {
    setSelectedParts(
      selectedIds
        .map((id) => {
          return parts.find((part) => part.id == id);
        })
        .filter((part) => !!part)
    );
  }, [selectedIds, parts]);

  useEffect(() => {
    dispatch(getParts());
  }, []);

  useEffect(() => {
    onChange(selectedParts);
  }, [selectedParts]);

  const onSelect = (ids: number[]) => {
    setSelectedIds(Array.from(new Set([...selectedIds, ...ids])));
  };
  const onUnSelect = (ids: number[]) => {
    const newSelectedIds = selectedIds.filter((id) => !ids.includes(id));
    setSelectedIds(newSelectedIds);
  };
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          p: 3
        }}
      >
        <Typography variant="h4" gutterBottom>
          {t('Select Parts')}
        </Typography>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          p: 3
        }}
      >
        <Tabs
          sx={{ mb: 2 }}
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
        {currentTab === 'parts' && (
          <FormGroup>
            {parts.map((part) => (
              <FormControlLabel
                onChange={(event, checked) => {
                  if (checked) {
                    onSelect([part.id]);
                  } else onUnSelect([part.id]);
                }}
                key={part.id}
                control={<Checkbox checked={selectedIds.includes(part.id)} />}
                label={part.name}
              />
            ))}
          </FormGroup>
        )}
        {currentTab === 'sets' && (
          <FormGroup>
            {multiParts.map((set) => (
              <FormControlLabel
                key={set.id}
                control={
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Checkbox
                      checked={set.parts.every((part) =>
                        selectedIds.includes(part.id)
                      )}
                      onChange={(event, checked) => {
                        if (checked) {
                          onSelect(set.parts.map((part) => part.id));
                        } else onUnSelect(set.parts.map((part) => part.id));
                      }}
                    />
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreTwoToneIcon />}
                        aria-controls="panel1a-content"
                      >
                        {set.name}
                      </AccordionSummary>
                      <AccordionDetails>
                        {set.parts.map((part) => (
                          <Typography key={part.id}>{part.name}</Typography>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                }
                label=""
              />
            ))}
          </FormGroup>
        )}
      </DialogContent>
    </Dialog>
  );
}
