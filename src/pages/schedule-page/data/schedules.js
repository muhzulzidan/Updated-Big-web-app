import { v4 as uuidv4 } from "uuid";

export const mockData = [
  {
    schedule_id: "01F3VSX4VE50F2WVM61BMV983R",
    created: "2021-04-22T03:27:48.078Z",
    last_modified: null,
    owner_id: "owner1",
    policy_id: null,
    name: "Schedule A",
    timings: [
      {
        id: "70de7a85-fa26-4eea-906a-8084b05df9ca",
        start: 1170,
        stop: 1440,
      },
      {
        id: "74ae1a41-8f29-4abc-b45c-b1ead85748f5",
        start: 0,
        stop: 240,
      },
      {
        id: "e45e8a95-4cd5-4239-b210-46457a24a9a6",
        start: 2625,
        stop: 2790,
      },
    ],
    zone: "Asia/Riyadh",
  },
  {
    schedule_id: "01F3VSYFNXETGD2T3WC0AGVRA3",
    created: "2021-04-22T03:28:31.933Z",
    last_modified: null,
    owner_id: "owner1",
    policy_id: null,
    name: "Schedule A",
    timings: [
      {
        id: "70de7a85-fa26-4eea-906a-8084b05df9ca",
        start: 1170,
        stop: 1440,
      },
      {
        id: "74ae1a41-8f29-4abc-b45c-b1ead85748f5",
        start: 0,
        stop: 240,
      },
      {
        id: "e45e8a95-4cd5-4239-b210-46457a24a9a6",
        start: 2625,
        stop: 2790,
      },
    ],
    zone: "Asia/Riyadh",
  },
  {
    schedule_id: "01F3VSZPGTPWCAQWH8V9SAN52R",
    created: "2021-04-22T03:29:11.706Z",
    last_modified: null,
    owner_id: "owner1",
    policy_id: null,
    name: "Schedule A",
    timings: [
      {
        id: "70de7a85-fa26-4eea-906a-8084b05df9ca",
        start: 1170,
        stop: 1440,
      },
      {
        id: "74ae1a41-8f29-4abc-b45c-b1ead85748f5",
        start: 0,
        stop: 240,
      },
      {
        id: "e45e8a95-4cd5-4239-b210-46457a24a9a6",
        start: 2625,
        stop: 2790,
      },
    ],
    zone: "Asia/Riyadh",
  },
];
const scheduleData = [
  {
    name: "Schedule A",
    timezone: "Asia/Riyadh",
    schedule_id: uuidv4(),
    timings: [],
  },
  {
    name: "Schedule B",
    timezone: "Asia/Riyadh",
    schedule_id: uuidv4(),
    timings: [],
  },
  {
    name: "Schedule C",
    timezone: "Asia/Riyadh",
    schedule_id: uuidv4(),
    timings: [],
  },
  {
    name: "Schedule D",
    timezone: "Asia/Riyadh",
    schedule_id: uuidv4(),
    timings: [],
  },
  {
    name: "Schedule E",
    timezone: "Asia/Riyadh",
    schedule_id: uuidv4(),
    timings: [],
  },
  {
    name: "Schedule F",
    timezone: "Asia/Riyadh",
    schedule_id: uuidv4(),
    timings: [],
  },
  {
    name: "Schedule G",
    timezone: "Asia/Riyadh",
    schedule_id: uuidv4(),
    timings: [],
  },
  {
    name: "Schedule H",
    timezone: "Asia/Riyadh",
    schedule_id: uuidv4(),
    timings: [],
  },
  {
    name: "Schedule I",
    timezone: "Asia/Riyadh",
    schedule_id: uuidv4(),
    timings: [],
  },
  {
    name: "Schedule G",
    timezone: "Asia/Riyadh",
    schedule_id: uuidv4(),
    timings: [],
  },
  {
    name: "Schedule K",
    timezone: "Asia/Riyadh",
    schedule_id: uuidv4(),
    timings: [],
  },
];

export default scheduleData