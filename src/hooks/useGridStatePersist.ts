import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import { GridColDef } from '@mui/x-data-grid';

const useGridStatePersist = (apiRef: React.MutableRefObject<GridApiPro>, columns: GridColDef[], prefix: string) => {
  const stateItem = `${prefix}DataGridState`;
  const saveSnapshot = useCallback(() => {
    if (apiRef?.current?.exportState && localStorage) {
      const currentState = apiRef.current.exportState();
      localStorage.setItem(stateItem, JSON.stringify(currentState));
    }
  }, [apiRef]);

  useLayoutEffect(() => {
    const handleBeforeUnload = () => {
      saveSnapshot();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveSnapshot();
    };
  }, [saveSnapshot]);

  useEffect(() => {
    if (columns != null && apiRef?.current?.restoreState != null && localStorage?.getItem(stateItem)) {
      apiRef?.current?.restoreState(JSON.parse(localStorage.getItem(stateItem)));
    }
  }, [apiRef, columns]);
};

export default useGridStatePersist;