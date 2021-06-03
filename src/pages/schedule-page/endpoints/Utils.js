import { useEffect, useState } from "react";
import axios from "axios";
import { actionStatus, axiosTypes } from "./Constants";
import { baseUrls } from "./Urls";
import { mockData } from "../data/schedules";

export function useApi({
  baseUrl,
  postFixUrl = "",
  key = "",
  type,
  headers = {},
  body = {},
}) {
  const [apiState, setApiState] = useState();
  const [apiResponse, setApiResponse] = useState();
  const [apiCallback, setApiCallback] = useState();

  function setApi(callBack) {
    if (callBack) {
      setApiCallback(callBack);
    }
    setApiState(actionStatus.initial);
  }

  function resetApi() {
    setApiState();
  }

  useEffect(() => {
    if (apiState === actionStatus.initial) {
      async function fetch() {
        setApiState(actionStatus.fetching);

        switch (type) {
          default:
          case axiosTypes.get:
            return await axios.get(`${baseUrl}${key}`, {
              params: headers,
            });
          case axiosTypes.post:
            return await axios.post(`${baseUrl}${key}${postFixUrl}`, body);
          case axiosTypes.put:
            return await axios.put(`${baseUrl}${key}${postFixUrl}`, body);
          case axiosTypes.delete:
            return await axios.delete(`${baseUrl}${key}${postFixUrl}`, {
              headers,
              data: body,
            });
          case axiosTypes.patch:
            return await axios.patch(`${baseUrl}${key}${postFixUrl}`, body);
        }
      }

      const api = fetch();

      try {
        api
          .then((response) => {
            setApiResponse(response.data.data);
            setApiState(actionStatus.succeeded);

            if (apiCallback) {
              apiCallback();
            }
          })
          .catch((err) => {
            setApiResponse(err);
            setApiState(actionStatus.failed);

            //TODO: Remove this

            setApiResponse([]);
            if (
              baseUrl === baseUrls.schedule.fetchByOwner &&
              type === axiosTypes.get
            )
              setApiResponse(mockData);
            setApiState(actionStatus.succeeded);

            if (apiCallback) {
              apiCallback();
            }
            //TODO: Remove this
          });
      } catch (err) {
        setApiResponse(err);
        setApiState(actionStatus.failed);

        //TODO: Remove this

        setApiResponse([]);
        if (
          baseUrl === baseUrls.schedule.fetchByOwner &&
          type === axiosTypes.get
        )
          setApiResponse(mockData);
        setApiState(actionStatus.succeeded);

        if (apiCallback) {
          apiCallback();
        }
        //TODO: Remove this
      }
    }
  }, [apiCallback, apiState, baseUrl, body, headers, key, postFixUrl, type]);

  return { apiState, apiResponse, setApi, resetApi };
}
