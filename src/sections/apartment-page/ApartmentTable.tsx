import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_ShowHideColumnsButton,
  MRT_SortingState,
  MRT_ToggleGlobalFilterButton,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useState } from "react";
import { Stack, Skeleton, MenuItem } from "@mui/material";
import { useApartments, useCreateApartment } from "../../hooks";
import Apartment from "../../models/Apartment";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorPlaceHolder from "../../components/placeholder/ErrorPlaceHolder";
import NiceModal from "@ebay/nice-modal-react";
import { NM_APARTMENT } from "../../constants/niceModalId";
import { useUpdateApartment } from "../../hooks/useEditApartment";
import toast from "react-hot-toast";
import { ApiRoutes, QK_APARTMENTS } from "../../constants";
import { useQueryClient } from "@tanstack/react-query";
import { Edit } from "@mui/icons-material";
import { ApiUpdateParams } from "../../models";

// ------------------------------------

const Loading = () => (
  <Stack spacing={2} sx={{ minHeight: "100", height: "40%", marginY: "2rem" }}>
    <Skeleton
      variant="rectangular"
      animation="wave"
      height={"20%"}
      sx={{ minHeight: 30 }}
    />
    <Skeleton
      variant="rectangular"
      animation="wave"
      height={"70%"}
      sx={{ minHeight: 150 }}
    />
    <Skeleton
      variant="rectangular"
      animation="wave"
      height={"70%"}
      sx={{ minHeight: 150 }}
    />
    <Skeleton
      variant="rectangular"
      animation="wave"
      height={"70%"}
      sx={{ minHeight: 150 }}
    />
  </Stack>
);

// ------------------------------------

const columnDefs: MRT_ColumnDef<Apartment>[] = [
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "numberOfRoom",
    header: "Number Of Room",
  },
  {
    accessorKey: "retailPrice",
    header: "Retail Price",
  },
];

// ------------------------------------

const ApartmentTable = () => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState(""); // search filter
  const client = useQueryClient();

  const mutationUpdate = useUpdateApartment({
    onSuccess(data, variables, context) {
      toast.success(data.message);
      client.invalidateQueries({ queryKey: [QK_APARTMENTS] });
    },
  });

  /**
   *  Data fetching
   */
  const {
    isLoading,
    isError,
    isRefetching,
    data: { data = [], meta } = {},
    error,
    refetch,
  } = useApartments({
    variables: {
      page: pagination.pageIndex, //refetch when pagination.pageIndex changes
      pageSize: pagination.pageSize, //refetch when pagination.pageSize changes
      sortBy: sorting?.map((value) => value.id).toString(), //refetch when sorting changes
    },
  });

  // Define columns ---------------------------------------
  // const columns = useMemo<MRT_ColumnDef<Apartment>[]>(() => columnDefs, []);

  // Define table -----------------------------------------

  const table = useMaterialReactTable({
    columns: columnDefs,
    data: data,
    rowCount: meta?.totalRowCount ?? 0,
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isLoading || isRefetching,
      sorting,
    },
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    renderToolbarInternalActions: ({ table }) => (
      <>
        {/* built-in buttons (must pass in table prop for them to work!) */}
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        {/* <MRT_ToggleDensePaddingButton table={table} /> */}
      </>
    ),
    enableRowActions: true,
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem
        key="edit"
        onClick={() =>
          NiceModal.show(NM_APARTMENT, { apartment: data[row.index] }).then(
            (data) => {
              mutationUpdate.mutate(
                // TODO: This is not type-safe
                {
                  data: data as ApiUpdateParams<Omit<Apartment, "id">>,
                  action: ApiRoutes.Update,
                }
              );
            }
          )
        }
      >
        Edit
      </MenuItem>,
      <MenuItem key="delete" onClick={() => console.info("Delete")}>
        Delete
      </MenuItem>,
    ],
  });

  // -------------------------------------------------------

  // Show loading
  if (isLoading) return <Loading />;
  // Show, throw Error
  if (isError) {
    console.log(error || new Error("Error with ApartmentTable"));
    return <ErrorPlaceHolder onClick={() => refetch()} />;
  }

  // -------------------------------------------------------

  return <MaterialReactTable table={table} />;
};

export default ApartmentTable;
