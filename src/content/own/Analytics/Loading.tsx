import { CircularProgress, Stack } from '@mui/material';

export default function Loading() {
  return (
    <Stack
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
    </Stack>
  );
}
