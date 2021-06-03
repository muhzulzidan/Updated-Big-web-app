import { axiosTypes } from "../Constants";
import { baseUrls, postfixUrls } from "../Urls";
import { useApi } from "../Utils";

export function useGetSettings(ownerID) {
  const api = useApi({
    baseUrl: baseUrls.settings.fetch,
    type: axiosTypes.get,
    key: ownerID,
  });

  return api;
}

export function useCreateSettings(settings) {
  const api = useApi({
    baseUrl: baseUrls.settings.fetch,
    type: axiosTypes.post,
    body: settings,
  });

  return api;
}

export function useUpdateSettings({ ownerID, settings }) {
  const api = useApi({
    baseUrl: baseUrls.settings.fetch,
    type: axiosTypes.put,
    key: ownerID,
    body: settings,
  });

  return api;
}

export function useEditSettingsTimeInterval({ ownerID, settings }) {
  const api = useApi({
    baseUrl: baseUrls.settings.fetch,
    postFixUrl: postfixUrls.edit.timeInterval,
    type: axiosTypes.patch,
    key: ownerID,
    body: settings,
  });

  return api;
}

export function useEditSettingsClockFormat({ ownerID, settings }) {
  const api = useApi({
    baseUrl: baseUrls.settings.fetch,
    postFixUrl: postfixUrls.edit.clockFormat,
    type: axiosTypes.patch,
    key: ownerID,
    body: settings,
  });

  return api;
}

export function useEditSettingsStartOfWeek({ ownerID, settings }) {
  const api = useApi({
    baseUrl: baseUrls.settings.fetch,
    postFixUrl: postfixUrls.edit.startOfWeek,
    type: axiosTypes.patch,
    key: ownerID,
    body: settings,
  });

  return api;
}

export function useEditSettingsTimezone({ ownerID, settings }) {
  const api = useApi({
    baseUrl: baseUrls.settings.fetch,
    postFixUrl: postfixUrls.edit.timezone,
    type: axiosTypes.patch,
    key: ownerID,
    body: settings,
  });

  return api;
}

export function useEditSettingsAutoSave({ ownerID, settings }) {
  const api = useApi({
    baseUrl: baseUrls.settings.fetch,
    postFixUrl: postfixUrls.edit.autoSave,
    type: axiosTypes.patch,
    key: ownerID,
    body: settings,
  });

  return api;
}
