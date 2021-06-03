const axios = require('axios');

class ScheduleService {
    path = "https://reqres.in/api/users/2/";

    create = (data) => {
        return axios.post(this.path + "/schedules", data)
    }
    update = (data) => {
        return axios.patch(this.path + "/update", data)
    }
}

export default ScheduleService;