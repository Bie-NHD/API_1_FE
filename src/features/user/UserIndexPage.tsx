import React from "react";
import UserList from "./UserList";
import IndexToolBar from "../../components/IndexToolBar";
import PageHeader from "../../components/PageHeader";
import NiceModal from "@ebay/nice-modal-react";
import { NM_CONTRACT, NM_USER_CREATE } from "../../constants";
import { useCreateUser } from "../../hooks/user";
import toast from "react-hot-toast";
import { MutateDialogProps } from "../../types/props";
import { Container, Button } from "@mui/material";
import ExportButton from "../../components/buttons/ExportButton";
import ImportButton from "../../components/buttons/ImportButton";
import AddCircle from "@mui/icons-material/AddCircle";

const styles = {
  display: "flex",
  justifyContent: "end",
  justifyItems: "start",
  marginRight: 0,
};

const location = window.location.pathname;

const UserIndexPage = () => {
  const { mutateAsync } = useCreateUser({
    onSuccess(data, variables, context) {
      toast.success(data.message);
    },
  });

  const createDialogProps: MutateDialogProps = {
    onCreate: mutateAsync,
  };

  const handleNewItem = () => NiceModal.show(NM_USER_CREATE, createDialogProps);

  return (
    <>
      <PageHeader />
      <Container sx={styles}>
        <Button variant="contained" startIcon={<AddCircle />} onClick={handleNewItem}>
          New
        </Button>
        {/* <ImportButton /> */}
        <ExportButton exportType={location} />
      </Container>
      <UserList />
    </>
  );
};

export default UserIndexPage;
