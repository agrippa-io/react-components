import React from 'react'
import { IMapGoogleProps } from '../@types/interfaces/IMapGoogleProps'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { mapGoogleConfigToDataGridRows } from '../utils'

const columns = [
  { field: 'key', headerName: 'Key' },
  { field: 'value', headerName: 'Value' },
]

export function MapGoogleConfigTable({
  config,
  debug = false,
}: IMapGoogleProps) {
  if (!debug) {
    return null
  }

  const rows = mapGoogleConfigToDataGridRows(config)

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        pageSize={25}
      />
    </Box>
  )
}
