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
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import {enumService, jobService} from "../../services/apiServices";
import {MenuItem} from "react-contextmenu";

const Example = () => {
    const [data, setData] = useState([]);
    const [idCompany] = useState(1);
    const [page] = useState(0);
    const [pageSize] = useState(20);
    const [languages, setLanguages] = useState([]);
    const [salary, minWage, maxWage] = useState(0);
    const [tableData, setTableData] = useState(() => data);
    const [validationErrors, setValidationErrors] = useState({});
    const [createModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchLanguagesData = async () => {
            try {
                const response = await enumService.getProgrammingLanguages();
                setLanguages(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLanguagesData();
    }, [])

    useEffect(() => {
        const fetchCompanyData = async () => {
            // if (token) {
            try {
                const request = {
                    page: {
                        size: pageSize,
                        number: page
                    }
                };
                const response = await jobService.findAll(request);
                setTableData(response.data.content);
            } catch (error) {
                console.error(error);
            }
            // }
        };
        fetchCompanyData();
    }, [page, pageSize]);

    const handleCreateNewRow = (values) => {
        tableData.push(values);
        setTableData([...tableData]);
    };

    const handleSaveRowEdits = async ({exitEditingMode, row, values}) => {
        if (!Object.keys(validationErrors).length) {
            tableData[row.index] = values;
            //send/receive api updates here, then refetch or update local table data for re-render
            const editJob = async () => {
                try {
                    const request = {
                        id: row.original.id,
                        name: values.name,
                        description: values.description,
                        salary: {
                            minWage: values.minWage,
                            maxWage: values.maxWage,
                            salary: values.salary,
                        },
                        role: values.role,
                        type: values.type,
                        languages: [values.languages],
                        status: values.status,
                        idCompany: idCompany,
                    }
                    await jobService.edit(values);
                    tableData.splice(row.index, 1);
                    setTableData([...tableData]);
                } catch (error) {
                    console.error(error);
                }
            }
            editJob();
            setTableData([...tableData]);
            exitEditingMode(); //required to exit editing mode and close modal
        }
    };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
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

    // const getCommonEditTextFieldProps = useCallback(
    //     (cell) => {
    //         return {
    //             error: !!validationErrors[cell.id],
    //             helperText: validationErrors[cell.id],
    //             onBlur: (event) => {
    //                 const isValid =
    //                     cell.column.id === 'email'
    //                         ? validateEmail(event.target.value)
    //                         : cell.column.id === 'age'
    //                             ? validateAge(+event.target.value)
    //                             : validateRequired(event.target.value);
    //                 if (!isValid) {
    //                     //set validation error for cell if invalid
    //                     setValidationErrors({
    //                         ...validationErrors,
    //                         [cell.id]: `${cell.column.columnDef.header} is required`,
    //                     });
    //                 } else {
    //                     //remove validation error for cell if valid
    //                     delete validationErrors[cell.id];
    //                     setValidationErrors({
    //                         ...validationErrors,
    //                     });
    //                 }
    //             },
    //         };
    //     },
    //     [validationErrors],
    // );

    const notVisibleColumns = useMemo(() => ['salary.salary', 'salary.minWage', 'salary.maxWage'], []);

    const columns = useMemo(
        () => {
            return [
                {
                    accessorKey: 'id',
                    header: 'ID',
                    enableColumnOrdering: false,
                    enableCreating: false,
                    enableEditing: false, //disable editing on this column
                    size: 80,
                },
                {
                    accessorKey: 'name',
                    header: 'Name',
                    size: 140,
                    // muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                    //     ...getCommonEditTextFieldProps(cell),
                    // }),
                },
                {
                    accessorKey: 'description',
                    header: 'Description',
                    size: 140,
                    // muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                    //     ...getCommonEditTextFieldProps(cell),
                    // }),
                },
                {
                    accessorKey: 'status',
                    header: 'Status',
                    size: 10,
                    // muiTableBodyCellEditTextFieldProps: ({cell}) => ({
                    //     ...getCommonEditTextFieldProps(cell),
                    // }),
                },
                {
                    accessorKey: 'languages',
                    header: 'Languages',
                    Cell: ({row}) => row.original.languages.join(', '),
                    muiTableBodyCellEditTextFieldProps: {
                        Select: true, // change to Select for a dropdown
                        multiple: true, // enable multiple selection
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
        [languages],
    );

    return (
        <>
            <MaterialReactTable
                // displayColumnDefOptions={{
                //     'mrt-row-actions': {
                //         muiTableHeadCellProps: {
                //             align: 'center',
                //         },
                //         size: 120,
                //     },
                // }}
                initialState={{columnVisibility: {...Object.fromEntries(notVisibleColumns.map(column => [column, false]))}}}
                columns={columns}
                data={tableData}
                editingMode="modal" //default
                enableColumnOrdering
                enableEditing
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
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
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Button
                        color="secondary"
                        onClick={() => setCreateModalOpen(true)}
                        variant="contained">
                        Create New Job
                    </Button>
                )}
            />
            <CreateNewAccountModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
                idCompany={idCompany}
            />
        </>
    );
};

//example of creating a mui dialog modal for creating new rows
const CreateNewAccountModal = ({open, columns, onClose, onSubmit, idCompany}) => {
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
                salary: values.salary?.salary || 0,
                minWage: values.salary?.minWage || 0,
                maxWage: values.salary?.maxWage || 0,
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
                            }
                            if (column.accessorKey === "status") {
                                return (
                                    <FormControl key={column.accessorKey} fullWidth>
                                        <InputLabel>{column.header}</InputLabel>
                                        <Select
                                            name={column.accessorKey}
                                            value={values[column.accessorKey]}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
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
                <Button
                    color="secondary"
                    onClick={handleSubmit}
                    variant="contained">
                    Create New Job
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// const validateRequired = (value) => !!value.length;
// const validateEmail = (email) => !!email.length && email.toLowerCase()
//     .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,);
// const validateAge = (age) => age >= 18 && age <= 50;

export default Example;