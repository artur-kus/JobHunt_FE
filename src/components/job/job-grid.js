import React, {useCallback, useEffect, useMemo, useState} from 'react';
import MaterialReactTable from 'material-react-table';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import {jobService, enumService} from "../../services/apiServices";
import {MenuItem} from "react-contextmenu";

const Example = () => {
    const [data, setData] = useState([]);
    const [idCompany] = useState(1);
    const [page] = useState(0);
    const [pageSize] = useState(20);
    const [languages, setLanguages] = useState([]);
    const [tableData, setTableData] = useState(() => data);
    const [validationErrors, setValidationErrors] = useState({});
    const [createModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchLanguagesData = async () => {
            try {
                const response = await enumService.getProgrammingLanguages();
                console.log(response.data.content)
                setLanguages(response.data.content);
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

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                enableColumnOrdering: false,
                enableCreating: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
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
                muiTableBodyCellEditTextFieldProps: {
                    select: true, //change to select for a dropdown
                    children: languages.map((language) => (
                        <MenuItem key={language} value={language}>
                            {language}
                        </MenuItem>
                    )),
                },
            },
        ],
        [],
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
            />
        </>
    );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({open, columns, onClose, onSubmit}) => {
    const [values, setValues] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );

    const handleSubmit = () => {
        //put your validation logic here
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New Account</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: {xs: '300px', sm: '360px', md: '400px'},
                            gap: '1.5rem',
                        }}
                    >
                        {columns.map((column) => (
                            <TextField
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) =>
                                    setValues({...values, [e.target.name]: e.target.value})
                                }
                            />
                        ))}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{p: '1.25rem'}}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Create New Account
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