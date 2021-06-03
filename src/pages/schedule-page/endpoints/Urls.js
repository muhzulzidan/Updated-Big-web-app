//TODO: Change to base url
const baseUrl = "https://jsonplaceholder.typicode.com";

export const baseUrls = {
  schedule: {
    fetch: `${baseUrl}/schedules/`,
    fetchByOwner: `${baseUrl}/schedules/owner/`,
  },
  settings: {
    fetch: `${baseUrl}/settings/`,
  },
};

export const postfixUrls = {
  add: {
    timeSlot: "/add/timeSlot",
  },
  edit: {
    name: "/edit/name",
    policy: "/edit/policy",
    timezone: "/edit/timezone",
    // Settings
    timeInterval: "/edit/timeInterval",
    clockFormat: "/edit/clockFormat",
    startOfWeek: "/edit/startOfWeek",
    autoSave: "/edit/autoSave",
  },
  delete: {
    timeSlot: "/delete/timeSlot",
  },
};
