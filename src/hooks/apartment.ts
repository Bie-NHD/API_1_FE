import { createMutation, createQuery } from "react-query-kit";
import { Api } from "../api";
import { ApartmentRoutes, AppRoutes, QK_APARTMENTS } from "../constants";
import toast from "react-hot-toast";
import { QueryClient, keepPreviousData } from "@tanstack/react-query";

export const useCreateApartment = (client: QueryClient) =>
  createMutation({
    mutationFn: async (variables: ApartmentUpdateDTO) => Api.create(ApartmentRoutes.Add, variables),
    onSuccess(data, variables, context) {
      toast.success(data.message);
      client.invalidateQueries({ queryKey: [QK_APARTMENTS] });
    },
    onError(error, variables, context) {
      console.log(error);
      toast.error(error.message || "Trouble creating new apartment");
    },
  });
/**
 * To ```edit``` & ```delete``` Apartments
 @param data data
 @param action from ```ApiActions```
 */
export const useUpdateApartment = createMutation({
  mutationFn: async (variables: { data: ApiUpdateParams<ApartmentUpdateDTO>; action: string }) =>
    variables.action === AppRoutes.Update
      ? Api.update(ApartmentRoutes.Update, variables.data)
      : Api.delete(ApartmentRoutes.Delete, { id: variables.data.id }),
  onError(error, variables, context) {
    console.log(error || "Trouble updating apartment");
    toast.error(error.message || "Trouble updating apartment");
  },
});

export const useGetApartments = createQuery<UseGetApartmentsHookReturns, ApiSearchParams>({
  queryKey: [QK_APARTMENTS],
  fetcher: (variables: ApiSearchParams) => {
    const { q, ...others } = variables;

    return !!q
      ? Api.search<ApartmentApiResponse>(ApartmentRoutes.Search, variables).then((value) => ({
          data: value.apartments,
          meta: {
            totalRowCount: value.page.totalElements,
          },
        }))
      : Api.fetch<ApartmentApiResponse>(ApartmentRoutes.GetAll, { ...others }).then((value) => ({
          data: value.apartments,
          meta: {
            totalRowCount: value.page.totalElements,
          },
        }));
  },
  placeholderData: keepPreviousData,
});
