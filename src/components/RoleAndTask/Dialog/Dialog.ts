import { defineComponent, ref, onMounted, watch } from "vue";
import EventServices from "@/Services/EventServices";
import { useLoaderStore } from "@/stores/loaderStore";
import { useSnackbarStore } from '@/stores/snackbarStore';

export default defineComponent({
    props: {
        toggleDialog: {
            type: Boolean,
            required: true
        },
        dialogTitle: {
            type: String,
            required: true
        },
        dialogPuropse: {
            type: String,
            required: true
        },
        editItem: {
            type: Object,
            required: true
        }
    },
    emits: ["closeDialog","refreshTable"],

    setup(props, { emit }) {

        type RoleAndTaskStructure = {
            role?: string;
            task?: string;
            router?: string;
            description: string;
            isActive: string;
        }



        const loader = useLoaderStore();
        const snackbar = useSnackbarStore();
        const roleArr = ref([])
        const taskArr = ref([])

        const editval = ref({})
        watch(() => props.editItem, (newVal) => {
            editval.value = { ...newVal }
        }, {
            immediate: true,
            deep: true
        })

        onMounted(() => {
            getDropdownValues();
        })

        const closeDialog = () => {
            addRoleDetails.value = { ...defaultRoleDetails }
            addTaskDetails.value = { ...defaultTaskDetails }
            addRoleTaskDetails.value = { ...defaultRoleTaskDetails }
            emit('closeDialog')
        }

        const defaultRoleDetails: RoleAndTaskStructure = {
            role: "",
            description: "",
            isActive: "Y"
        }

        const addRoleDetails = ref<RoleAndTaskStructure>({ ...defaultRoleDetails })

        const defaultTaskDetails: RoleAndTaskStructure = {
            task: "",
            router: "",
            description: "",
            isActive: "Y"
        }
        const addTaskDetails = ref<RoleAndTaskStructure>({ ...defaultTaskDetails })


        const defaultRoleTaskDetails: RoleAndTaskStructure = {
            role: "",
            task: "",
            description: "",
            isActive: "Y"
        }

        const addRoleTaskDetails = ref<RoleAndTaskStructure>({ ...defaultRoleTaskDetails })

        const inputValidation = ref();
        const requiredRule = [(v: string) => !!v || "Filed is Required !"]

        const insertDetails = async () => {
            const form = inputValidation.value;

            if (form) {
                const { valid } = await form.validate()

                if (valid) {
                    if (props.dialogPuropse =="Add") {
                        let val = {
                            title: props.dialogTitle,
                            roleDetails: addRoleDetails.value,
                            taskDetails: addTaskDetails.value,
                            roleTaskDetails: addRoleTaskDetails.value
                        }
                        loader.show();
                        EventServices.addRoleAndTaskDetails(val)
                            .then((response) => {
                                if (response.data.status == "S") {
                                    loader.hide();
                                    snackbar.show(response.data.status, response.data.description)
                                    emit('refreshTable')
                                    closeDialog();
                                }
                                else {
                                    loader.hide();
                                    snackbar.show(response.data.status, response.data.errMsg)
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                loader.hide()
                            })
                    } 
                    else if (props.dialogPuropse=="Edit") {
                        let val = {
                            title: props.dialogTitle,
                            updatedData: editval.value
                        }
                        loader.show();
                        EventServices.updateRoleAndTask(val)
                         .then((response) => {
                                if (response.data.status == "S") {
                                    loader.hide();
                                    snackbar.show(response.data.status, response.data.description)
                                    emit('refreshTable')
                                    closeDialog();
                                }
                                else {
                                    loader.hide();
                                    snackbar.show(response.data.status, response.data.errMsg)
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                loader.hide()
                            })
                    }
                }
            }
        }

        function getDropdownValues() {
            loader.show()
            EventServices.getRoleTaskDropdown()
                .then((response) => {
                    if (response.data.status == "S") {
                        roleArr.value = response.data.role
                        taskArr.value = response.data.task
                        loader.hide();
                    }
                    else {
                        snackbar.show(response.data.status, response.data.errMsg);
                        loader.hide()
                    }
                })
                .catch((error) => {
                    console.log(error);
                    loader.hide()
                })
        }
        return {
            props,
            closeDialog,
            addRoleDetails,
            addTaskDetails,
            addRoleTaskDetails,
            inputValidation,
            requiredRule,
            insertDetails,
            roleArr,
            taskArr,
            editval
        }
    }
})