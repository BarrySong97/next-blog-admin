"use client";

import { Table } from "@tanstack/react-table";


// import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  visibleRows?: boolean;
  search?: boolean;
  toolActions?: React.ReactNode;
  extraActions?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  visibleRows = false,
  toolActions,
  extraActions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between w-full">
      {visibleRows ? (
        <div className="flex gap-4">
          {toolActions}
          {/* <DataTableViewOptions table={table} /> */}
        </div>
      ) : null}
      <div className="flex   space-x-2 mr-1">{extraActions}</div>
    </div>
  );
}
