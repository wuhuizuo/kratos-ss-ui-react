import {
  Configuration,
  PublicApi,
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  VerificationFlow,
} from "@oryd/kratos-client";
import config from "config/kratos";

const kratos = new PublicApi(
  new Configuration({ basePath: config.kratos.public })
);

export const initialiseRequest = ({
  type,
}: {
  type: "login" | "register" | "settings" | "verify" | "recover";
}): Promise<
  LoginFlow | RegistrationFlow | SettingsFlow | VerificationFlow | RecoveryFlow
> => {
  const endpoints = {
    login: `${config.kratos.browser}/self-service/login/browser?return_to=${config.baseUrl}/callback`,
    register: `${config.kratos.browser}/self-service/registration/browser?return_to=${config.baseUrl}/callback`,
    settings: `${config.kratos.browser}/self-service/settings/browser`,
    verify: `${config.kratos.public}/self-service/verification/browser`,
    recover: `${config.kratos.public}/self-service/recovery/browser`,
  };

  return new Promise((resolve, reject) => {
    const params = new URLSearchParams(window.location.search);
    const request = params.get("flow") || "";
    const endpoint = endpoints[type];

    // Ensure request exists in params.
    if (!request) return (window.location.href = endpoint);

    let authRequest: Promise<any> | undefined;
    if (type === "login") authRequest = kratos.getSelfServiceLoginFlow(request);
    else if (type === "register")
      authRequest = kratos.getSelfServiceRegistrationFlow(request);
    else if (type === "settings")
      authRequest = kratos.getSelfServiceSettingsFlow(request);
    else if (type === "verify")
      authRequest = kratos.getSelfServiceVerificationFlow(request);
    else if (type === "recover")
      authRequest = kratos.getSelfServiceRecoveryFlow(request);

    if (!authRequest) return reject();

    authRequest
      .then(({ data }) => {
        resolve(data);
    })
      .catch((error) => {
        console.debug(error)
        return (window.location.href = endpoint);
      });
  });
}
