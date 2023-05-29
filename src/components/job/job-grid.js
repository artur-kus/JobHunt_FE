import React, {useCallback, useEffect, useMemo, useState} from 'react';
import MaterialReactTable from 'material-react-table';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    Select,
    Stack, TableCell,
    TextField,
    Tooltip,
} from '@mui/material';
import {Delete, DownloadSharp, Edit} from '@mui/icons-material';
import {enumService, jobService} from "../../services/apiServices";
import MenuItem from '@mui/material/MenuItem'

const Jobs = () => {
    const [idCompany] = useState(1);
    const [page] = useState(0);
    const [pageSize] = useState(20);
    const [languages, setLanguages] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [tableData, setTableData] = useState(() => []);
    const [validationErrors, setValidationErrors] = useState({});
    const [createModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [languagesResponse, jobRolesResponse, jobTypesResponse, jobDataResponse] = await Promise.all([
                enumService.getProgrammingLanguages(),
                enumService.getJobRoles(),
                enumService.getJobType(),
                jobService.findAll({
                    page: {
                        size: pageSize,
                        number: page,
                    },
                }),
            ]);
            setLanguages(languagesResponse.data);
            setJobRoles(jobRolesResponse.data);
            setJobTypes(jobTypesResponse.data);
            setTableData(jobDataResponse.data.content);
        };
        fetchData();
    }, [page, pageSize]);

    const handleCreateNewRow = (values) => {
        tableData.push(values);
        setTableData([...tableData]);
    };

    const handleDeleteRow = useCallback(
        (row) => {
            if (!window.confirm(`Are you sure you want to delete ${row.getValue('name')}`)) {
                return;
            }
            const deleteJob = async () => {
                try {
                    await jobService.delete(row.original.id);
                    tableData.splice(row.index, 1);
                    setTableData([...tableData]);
                } catch (error) {
                    console.error(error);
                }
            }
            deleteJob();
        },
        [tableData],
    );

    const downloadResponses = async (idJob) => {
        const date = new Date();
        const currentDate = ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            "_" +
            ("0" + date.getDate()).slice(-2) +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            date.getFullYear().toString().substr(-2);
        const filename = `responses_${idJob}_${currentDate}.zip`;
        const response = await jobService.downloadResponses(idJob);
        const url = window.URL.createObjectURL(new Blob([response.data]), { type: 'application/zip' });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
    };

    const notVisibleColumns = useMemo(() => ['salary.salary', 'salary.minWage', 'salary.maxWage'], []);

    const columns = useMemo(() => {
            console.log(jobRoles)
            return [
                {
                    accessorKey: 'id',
                    header: 'ID',
                    enableColumnOrdering: false,
                    enableCreating: false,
                    enableEditing: false,
                    size: 80,
                    rowStyle: {height: 10},
                },
                {
                    accessorKey: 'name',
                    header: 'Name',
                    size: 140,
                },
                {
                    accessorKey: 'description',
                    header: 'Description',
                    size: 140
                },
                {
                    accessorKey: 'role',
                    header: 'Role',
                    muiTableBodyCellEditTextFieldProps: {
                        Select: true,
                        children: [
                            <MenuItem key="DEVELOPER" value="Developer">Male</MenuItem>,
                            <MenuItem key="OTHER" value="Other">Male</MenuItem>
                        ],
                    }
                },
                {
                    accessorKey: 'type',
                    header: 'Type',
                    muiTableBodyCellEditTextFieldProps: {
                        Select: true,
                        children: jobTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        )),
                    },
                },
                {
                    accessorKey: 'languages',
                    header: 'Languages',
                    Cell: ({row}) => row.original.languages.join(', '),
                    muiTableBodyCellEditTextFieldProps: {
                        Select: true,
                        multiple: true,
                        children: languages.map((language) => (
                            <MenuItem key={language} value={language}>
                                {language}
                            </MenuItem>
                        )),
                    },
                },
                {
                    accessor: "",
                    header: 'Salary',
                    enableEditing: false,
                    enableCreating: false,
                    size: 30,
                    Cell: ({row}) => (
                        `$${(row.original.salary != null && row.original.salary.salary != null) ? row.original.salary.salary : row.original.salary.minWage + ' - ' + row.original.salary.maxWage}`
                    )
                },
                {
                    accessorKey: 'status',
                    header: 'Status',
                    size: 10,
                },
                {
                    accessorKey: 'salary.salary',
                    accessor: "",
                    header: 'Full salary',
                    enableEditing: true,
                    size: 15,
                },
                {
                    accessorKey: 'salary.minWage',
                    accessor: "",
                    header: 'Minimal wage salary',
                    enableEditing: true,
                    size: 15,
                },
                {
                    accessorKey: 'salary.maxWage',
                    accessor: "",
                    header: 'Maximal wage salary',
                    enableEditing: true,
                    size: 50,
                },
            ]
        },
        [languages, jobRoles],
    );

    return (
        <>
            <MaterialReactTable
                initialState={{columnVisibility: {...Object.fromEntries(notVisibleColumns.map(column => [column, false]))}}}
                columns={columns}
                data={tableData}
                editingMode="modal"
                enableColumnOrdering
                enableEditing
                muiTableBodyProps={{
                    sx: {
                        '& tr:nth-of-type(odd)': {
                            backgroundColor: '#f5f5f5',
                        },
                    },
                }}
                // muiTableBodyCellEditTextFieldProps={{
                //     Select: true,
                //     TextField: true,
                //     children: {
                //         role: jobRoles.map((role) => (
                //             <MenuItem key={role} value={role}>
                //                 {role}
                //             </MenuItem>
                //         )),
                //         type: jobTypes.map((type) => (
                //             <MenuItem key={type} value={type}>
                //                 {type}
                //             </MenuItem>
                //         )),
                //         languages: languages.map((language) => (
                //             <MenuItem key={language} value={language}>
                //                 {language}
                //             </MenuItem>
                //         )),
                //     },
                renderRowActions={({row, table}) => (
                    <Box sx={{display: 'flex', gap: '1rem'}}>
                        <Tooltip arrow placement="left" title="Edit">
                            <IconButton onClick={() => table.setEditingRow(row)}>
                                <Edit/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Delete">
                            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                <Delete/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Download job responses">
                            <IconButton color="primary" onClick={() => downloadResponses(row.original.id)}>
                                <DownloadSharp/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Button
                        color="primary"
                        onClick={() => setCreateModalOpen(true)}
                        variant="contained">
                        Create New Job
                    </Button>
                )}
            />
            <CreateNewJobModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
                idCompany={idCompany}
                jobTypes={jobTypes}
                jobRoles={jobRoles}
            />
        </>
    );
};

//example of creating a mui dialog modal for creating new rows
const CreateNewJobModal = ({open, columns, onClose, onSubmit, idCompany, jobTypes, jobRoles}) => {
    const [values, setValues] = useState(() => {
        const initial = {};
        columns.forEach((column) => {
            initial[column.accessorKey ?? ""] = "";
        });
        initial.languages = [];
        return initial;
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setValues({
            ...values,
            [name]: event.target.value,
        });
    };

    const handleSubmit = () => {
        const completeObject = {
            ...values,
            salary: {
                salary: values["salary.salary"] || 0,
                minWage: values["salary.minWage"] || 0,
                maxWage: values["salary.maxWage"] || 0,
            },
            idCompany: idCompany,
        };
        const createJob = async () => {
            try {
                console.log(completeObject)
                jobService.create(completeObject);
            } catch (error) {
                console.error(error);
            }
        }
        // put your validation logic here
        onSubmit(completeObject);
        onClose();
        createJob();
    };

    // filter out the 'id' column
    const filteredColumns = columns.filter((column) => column.accessorKey !== "id");

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New Job</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: "100%",
                            minWidth: {xs: "300px", sm: "360px", md: "400px"},
                            gap: "1.5rem",
                        }}>
                        {filteredColumns.map((column) => {
                            if (column.accessorKey === "languages") {
                                return (
                                    <FormControl key={column.accessorKey} fullWidth>
                                        <InputLabel>{column.header}</InputLabel>
                                        <Select
                                            multiple
                                            name={column.accessorKey}
                                            key={column.accessorKey}
                                            value={values[column.accessorKey]}
                                            onChange={handleChange}
                                            renderValue={(selected) => selected.join(", ")}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 224,
                                                        width: 250,
                                                    },
                                                },
                                            }}
                                        >
                                            {column.muiTableBodyCellEditTextFieldProps.children}
                                        </Select>
                                    </FormControl>
                                );
                            } else if (column.accessorKey === "status") {
                                return (
                                    <FormControl key={column.accessorKey} fullWidth>
                                        <InputLabel>{column.header}</InputLabel>
                                        <Select
                                            name={column.accessorKey}
                                            value={values[column.accessorKey]}
                                            onChange={handleChange}>
                                            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                                        </Select>
                                    </FormControl>
                                );
                            } else if (column.accessorKey === "type") {
                                return (
                                    <FormControl key={column.accessorKey} fullWidth>
                                        <InputLabel>{column.header}</InputLabel>
                                        <Select
                                            name={column.accessorKey}
                                            value={values[column.accessorKey]}
                                            onChange={handleChange}>
                                            {jobTypes.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                );
                            } else if (column.accessorKey === "role") {
                                return (
                                    <FormControl key={column.accessorKey} fullWidth>
                                        <InputLabel>{column.header}</InputLabel>
                                        <Select
                                            name={column.accessorKey}
                                            value={values[column.accessorKey]}
                                            onChange={handleChange}>
                                            {jobRoles.map((role) => (
                                                <MenuItem key={role} value={role}>
                                                    {role}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                );
                            } else if (column.header === "Salary") {
                            } else return (
                                <TextField
                                    key={column.accessorKey}
                                    label={column.header}
                                    name={column.accessorKey}
                                    onChange={handleChange}
                                    value={values[column.accessorKey]}
                                />
                            );
                        })}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{p: "1.25rem"}}>
                <Button onClick={onClose}>Cancel</Button>
                <Button style={{backgroundColor: '#262a2d', color: '#fff'}}
                        onClick={handleSubmit}
                        variant="contained">
                    Create New Job
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// const EditJobModal = ({open, columns, job, onClose, onSubmit, jobTypes, jobRoles}) => {
//     const [values, setValues] = useState(job);
//
//     const handleChange = (event) => {
//         const name = event.target.name;
//         setValues({
//             ...values,
//             [name]: event.target.value,
//         });
//     };
//
//     const handleSubmit = () => {
//         const updatedJob = {
//             ...values,
//             salary: {
//                 salary: values["salary.salary"] || 0,
//                 minWage: values["salary.minWage"] || 0,
//                 maxWage: values["salary.maxWage"] || 0,
//             },
//         };
//         // put your validation logic here
//         onSubmit(updatedJob);
//         onClose();
//     };
//
//     const filteredColumns = columns.filter((column) => column.accessorKey !== "id");
//
//     return (
//         <Dialog open={open}>
//             <DialogTitle textAlign="center">Edit Job</DialogTitle>
//             <DialogContent>
//                 <form onSubmit={(e) => e.preventDefault()}>
//                     <Stack
//                         sx={{
//                             width: "100%",
//                             minWidth: {xs: "300px", sm: "360px", md: "400px"},
//                             gap: "1.5rem",
//                         }}
//                     >
//                         {filteredColumns.map((column) => {
//                             if (column.accessorKey === "languages") {
//                                 return (
//                                     <FormControl key={column.accessorKey} fullWidth>
//                                         <InputLabel>{column.header}</InputLabel>
//                                         <Select
//                                             multiple
//                                             name={column.accessorKey}
//                                             key={column.accessorKey}
//                                             value={values[column.accessorKey]}
//                                             onChange={handleChange}
//                                             renderValue={(selected) => selected.join(", ")}
//                                             MenuProps={{
//                                                 PaperProps: {
//                                                     style: {
//                                                         maxHeight: 224,
//                                                         width: 250,
//                                                     },
//                                                 },
//                                             }}
//                                         >
//                                             {column.muiTableBodyCellEditTextFieldProps.children}
//                                         </Select>
//                                     </FormControl>
//                                 );
//                             } else if (column.accessorKey === "status") {
//                                 return (
//                                     <FormControl key={column.accessorKey} fullWidth>
//                                         <InputLabel>{column.header}</InputLabel>
//                                         <Select
//                                             name={column.accessorKey}
//                                             value={values[column.accessorKey]}
//                                             onChange={handleChange}
//                                         >
//                                             <MenuItem value="ACTIVE">ACTIVE</MenuItem>
//                                             <MenuItem value="INACTIVE">INACTIVE</MenuItem>
//                                         </Select>
//                                     </FormControl>
//                                 );
//                             } else if (column.accessorKey === "type") {
//                                 return (
//                                     <FormControl key={column.accessorKey} fullWidth>
//                                         <InputLabel>{column.header}</InputLabel>
//                                         <Select
//                                             name={column.accessorKey}
//                                             value={values[column.accessorKey]}
//                                             onChange={handleChange}
//                                         >
//                                             {jobTypes.map((type) => (
//                                                 <MenuItem key={type} value={type}>
//                                                     {type}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                 );
//                             } else if (column.accessorKey === "role") {
//                                 return (
//                                     <FormControl key={column.accessorKey} fullWidth>
//                                         <InputLabel>{column.header}</InputLabel>
//                                         <Select
//                                             name={column.accessorKey}
//                                             value={values[column.accessorKey]}
//                                             onChange={handleChange}>
//                                             {jobRoles.map((role) => (
//                                                 <MenuItem key={role} value={role}>
//                                                     {role}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                 );
//                             } else {
//                                 return (
//                                     <TextField
//                                         key={column.accessorKey}
//                                         label={column.header}
//                                         name={column.accessorKey}
//                                         value={values[column.accessorKey]}
//                                         onChange={handleChange}
//                                         fullWidth
//                                     />
//                                 );
//                             }
//                         })}
//                     </Stack>
//                 </form>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose}>Cancel</Button>
//                 <Button onClick={handleSubmit} variant="contained" sx={{ml: 1}}>
//                     Save
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// const validateRequired = (value) => !!value.length;
// const validateEmail = (email) => !!email.length && email.toLowerCase()
//     .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,);
// const validateAge = (age) => age >= 18 && age <= 50;

export default Jobs;