import { axiosTypes } from "../Constants";
import { baseUrls, postfixUrls } from "../Urls";
import { useApi } from "../Utils";

export function useGetSchedulesByOwner(ownerKey) {
  const api = useApi({
    baseUrl: baseUrls.schedule.fetchByOwner,
    type: axiosTypes.get,
    key: ownerKey,
  });

  return api;
}

export function useGetSchedule(scheduleKey) {
  const api = useApi({
    baseUrl: baseUrls.schedule.fetch,
    type: axiosTypes.get,
    key: scheduleKey,
  });

  return api;
}

export function useCreateSchedule(schedule) {
  const api = useApi({
    baseUrl: baseUrls.schedule.fetch,
    type: axiosTypes.post,
    body: schedule,
  });

  return api;
}

export function useUpdateSchedule({ key, schedule }) {
  const api = useApi({
    baseUrl: baseUrls.schedule.fetch,
    type: axiosTypes.put,
    key,
    body: schedule,
  });

  return api;
}

export function useDeleteSchedule(scheduleKey) {
  const api = useApi({
    baseUrl: baseUrls.schedule.fetch,
    type: axiosTypes.delete,
    key: scheduleKey,  
    

  });

  return api;
}

export function useEditScheduleName({ key, schedule }) {
  const api = useApi({
    baseUrl: baseUrls.schedule.fetch,
    postFixUrl: postfixUrls.edit.name,
    type: axiosTypes.patch,
    key,
    body: schedule,
  });

  return api;
}

export function useEditSchedulePolicy({ key, schedule }) {
  const api = useApi({
    baseUrl: baseUrls.schedule.fetch,
    postFixUrl: postfixUrls.edit.policy,
    type: axiosTypes.patch,
    key,
    body: schedule,
  });

  return api;
}

export function useEditScheduleTimezone({ key, schedule }) {
  const api = useApi({
    baseUrl: baseUrls.schedule.fetch,
    postFixUrl: postfixUrls.edit.timezone,
    type: axiosTypes.patch,
    key,
    body: schedule,
  });

  return api;
}

export function useAddScheduleTimeSlot({ key, timeSlot }) {
  const api = useApi({
    baseUrl: baseUrls.schedule.fetch,
    postFixUrl: postfixUrls.add.timeSlot,
    type: axiosTypes.patch,
    key,
    body: timeSlot,
  });

  return api;
}

export function useDeleteScheduleTimeSlot({ key, timeSlot }) {
  const api = useApi({
    baseUrl: baseUrls.schedule.fetch,
    postFixUrl: postfixUrls.delete.timeSlot,
    type: axiosTypes.patch,
    key,
    body: timeSlot,
  });

  return api;
}
