import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControlLabel,
  Stack,
  Checkbox,
} from "@mui/material";
import React from "react";
import RHFOutlinedTextField from "../../components/inputs/RHFTextField";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ObjectSchema, boolean, number, object, string } from "yup";
import UserApi from "../../api/user";
import { Api } from "../../api";
import { ApiRoutes, NM_WARNING } from "../../constants";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import useUser from "../../hooks/useUser";
import { UserRoles } from "../../constants";
import ToggleButton from "@mui/material/ToggleButton";
import CheckIcon from "@mui/icons-material/Check";
import { WarningDialogProps } from "../../types/props";

type InputsForAdmin = UserUpdateDTO;

const schema: ObjectSchema<InputsForAdmin> = object({
  email: string().email().label("Email").required().default(""),
  fullName: string().label("Username").required().default(""),
  active: boolean().label("Active").required().default(true),
  role: string().label("Role").required().default(UserRoles.STAFF),
});

const activeValues = Object.freeze({
  Enabled: true,
  Disabled: false,
} as const);

const roleOptions = [...Object.values(UserRoles)].map((item) => (
  <MenuItem key={item} value={item}>
    {item}
  </MenuItem>
));

const _updateData = async (userVM: User, data: UserUpdateDTO) => {
  const res = await Api.update<UserUpdateDTO>(ApiRoutes.user.update, {
    id: userVM.id,
    data: data,
  }).catch((error) => error);

  if (res.statusCode === 200) {
    toast.success(res.message);
    return Promise.resolve();
  }

  toast.error(res.message);
};

const UserUpdateDialogForAdmin = NiceModal.create(({ user }: { user: User }) => {
  const modal = useModal();
  const { handleSubmit, control } = useForm<InputsForAdmin>({
    resolver: yupResolver(schema),
    defaultValues: user || schema.getDefault(),
  });

  // modal.keepMounted = true;

  const onSubmit: SubmitHandler<InputsForAdmin> = async (data) => {
    console.log(data);

    const isRoleChanged = data.role != user.role;
    const isActiveChanged = data.active != user.active;

    if (isRoleChanged || isActiveChanged) {
      const wn_cntn: WarningDialogProps = {
        title: `Confirm changes?`,
        content: (
          <>
            {isRoleChanged ? (
              <p>
                Confirm change from "{user.role}" to "{data.role}"?
              </p>
            ) : null}
            {isActiveChanged ? <p>Confirm change user state?</p> : null}
          </>
        ),
      };

      NiceModal.show(NM_WARNING, { props: wn_cntn }).then(() => {
        // _handleSubmit();
        _updateData(user, data).then(() => modal.remove());
      });
    } else _updateData(user, data).then(() => modal.remove());
  };

  return (
    <Dialog
      open={modal.visible}
      onClose={() => modal.remove}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onSubmit),
      }}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Stack>
          <RHFOutlinedTextField
            variant="outlined"
            name="fullName"
            label="Full name"
            control={control}
            margin="dense"
          />
          <RHFOutlinedTextField
            variant="outlined"
            name="email"
            label="Email"
            control={control}
            margin="dense"
          />
          <FormControlLabel
            label={"Active"}
            control={
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={!!field.value}
                    // onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
          />
          <Controller
            name="role"
            control={control}
            disabled={user.role == UserRoles.MANAGER}
            render={({ field }) => (
              <Select {...field} label="Role">
                {roleOptions}
              </Select>
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            modal.reject();
            modal.remove();
          }}>
          Cancel
        </Button>
        <Button type="submit"> Save </Button>
      </DialogActions>
    </Dialog>
  );
});

export default UserUpdateDialogForAdmin;
