import { defineComponent, onMounted, ref } from "vue";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useLoaderStore } from "@/stores/loaderStore";
import EventServices from "@/Services/EventServices";
import RoleTaskDialog from "./Dialog/Dialog.vue"

export default defineComponent({
    components: {
        RoleTaskDialog
    },
    setup() {
        const snackbar = useSnackbarStore();
        const loader = useLoaderStore();

        const roleDetails = ref([])
        const taskDetails = ref([])
        const roleAndTaskDetails = ref([])
        const tabVal = ref(0)
        const search = ref('')
        const tabDetails = ref([
            {
                name: 'Role Details',
                icon: "mdi-account-circle",
                tableValue: [],
                tableHeaders: [
                    { title: "Role", key: "role" },
                    { title: "Description", key: "description" },
                    { title: "Active Status", key: "isActive" },
                    { title: "Created By", key: "createdBy" },
                    { title: "Created Date", key: "createdDate" },
                    { title: "Updated By", key: "updatedBy" },
                    { title: "Updated Date", key: "updatedDate" },
                    { title: "Action", key: "deleteItem", align: "start" },
                ],
            },
            {
                name: 'Task Details',
                icon: "mdi-calendar-check",
                tableValue: [],
                tableHeaders: [
                    { title: "Task", key: "task" },
                    { title: "Description", key: "description" },
                    { title: "Router", key: "router" },
                    { title: "Active Status", key: "isActive" },
                    { title: "Created By", key: "createdBy" },
                    { title: "Created Date", key: "createdDate" },
                    { title: "Updated By", key: "updatedBy" },
                    { title: "Updated Date", key: "updatedDate" },
                    { title: "Action", key: "deleteItem", align: "start" },
                ],
            },
            {
                name: 'Role and Task Details',
                icon: 'mdi-subdirectory-arrow-right',
                tableValue: [],
                tableHeaders: [
                    { title: "Role", key: "role" },
                    { title: "Task", key: "task" },
                    { title: "Description", key: "description" },
                    { title: "Active Status", key: "isActive" },
                    { title: "Created By", key: "createdBy" },
                    { title: "Created Date", key: "createdDate" },
                    { title: "Updated By", key: "updatedBy" },
                    { title: "Updated Date", key: "updatedDate" },
                    { title: "Action", key: "deleteItem", align: "start" },
                ],
            }
        ])
        const toggleDialog = ref(false)
        const dialogTitle = ref("")
        const dialogPuropse = ref("")
        const editItem = ref({})
        
        function actionRoleTask(title:string) {
            toggleDialog.value = true;
            dialogTitle.value = title
            dialogPuropse.value = "Add"
        }

        function edit(val: object){
            editItem.value = val
            dialogTitle.value = tabDetails.value[tabVal.value].name;
            dialogPuropse.value = "Edit"
            toggleDialog.value = true;
            
        }

        function closeDialog() {
            toggleDialog.value = false
        }

        function GetRoleTaskDetails() {
            loader.show();
            EventServices.GetRoleTaskDetails()
                .then((resp) => {

                    if (resp.data.status == "S") {
                        tabDetails.value[0].tableValue = resp.data.roleDetails
                        tabDetails.value[1].tableValue = resp.data.taskDetails
                        tabDetails.value[2].tableValue = resp.data.roletaskDetails
                        loader.hide();
                        console.log("tabDetails", tabDetails);

                    }
                    else {
                        snackbar.show(resp.data.status, resp.data.errMsg);
                        loader.hide();
                    }

                })
                .catch((error) => {
                    console.log(error);
                    loader.hide();
                })
        }
        onMounted(() => {
            GetRoleTaskDetails()
        })


        return {
            GetRoleTaskDetails,
            tabDetails,
            roleDetails,
            taskDetails,
            roleAndTaskDetails,
            tabVal,
            search,
            actionRoleTask,
            toggleDialog,
            closeDialog,
            dialogTitle,
            dialogPuropse,
            edit,
            editItem
        }
    }
})