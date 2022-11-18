import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import useSessionStorage from "@core/hooks/useSessionStorage";
import { API_ROUTES, PAGE_ROUTES } from "@core/config/constants";
import { api } from "@core/utils/api";
import { OutputSignIn, InputSignIn } from "../models/signIn";
import { pathToApiUrl } from "@core/utils/helpers";

type UseSignInProps = {
  redirectTo: PAGE_ROUTES;
};

const defaultRedirectTo = {
  redirectTo: PAGE_ROUTES.profile,
};

export default function useSignIn({
  redirectTo,
}: UseSignInProps = defaultRedirectTo) {
  const [_, setAccessToken] = useSessionStorage<string>("accessToken", "");
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<OutputSignIn>, AxiosError, InputSignIn>(
    (credentials: InputSignIn) =>
      api.post(pathToApiUrl(API_ROUTES.login), credentials),
    {
      onSuccess({ data }) {
        setAccessToken(data.token);

        return data;
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData([API_ROUTES.login, variables], context);
        toast.error(
          (err.response?.data as string) ||
            "Something wrong happened, try again"
        );
      },
      onSettled: (_, __, variables) => {
        queryClient.invalidateQueries([API_ROUTES.login, variables]);
      },
    }
  );
}
