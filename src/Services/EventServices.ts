import axios from "axios";

const baseApiClient = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getEmpDetails() {
    return baseApiClient.get("/getDashboardDetails");
  },
  GetRoleTaskDetails(){
    return baseApiClient.get("/getRoleTaskDetails")
  },
  addRoleAndTaskDetails(data: Object){
    return baseApiClient.post("/addRoleTaskDetails",data)
  },
  getRoleTaskDropdown(){
    return baseApiClient.get("/getRoleTaskDropdown")
  },
  updateRoleAndTask(data:Object){
    return baseApiClient.post("/updtRoleAndTask",data)
  }
};
