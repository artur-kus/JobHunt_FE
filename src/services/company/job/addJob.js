import React, {useEffect, useState} from "react";
import CRUDTable, {CreateForm, DeleteForm, Field, Fields, UpdateForm} from "react-crud-table";
import CandidateService from "../../user/candidate.service";

// Component's Base CSS
import "./job.css";
import UserService from "../../user/candidate.service";

// const DescriptionRenderer = ({field}) => <textarea {...field} />;

let tasks = [
    {
        id: 1,
        title: "Create an example",
        description: "Create an example of how to use the component"
    },
    {
        id: 2,
        title: "Improve",
        description: "Improve the component!"
    }
];

const SORTERS = {
    NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
    NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
    STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
    STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a))
};

const getSorter = data => {
    const mapper = x => x[data.field];
    let sorter;

    if (data.field === "id") {
        sorter =
            data.direction === "ascending"
                ? SORTERS.NUMBER_ASCENDING(mapper)
                : SORTERS.NUMBER_DESCENDING(mapper);
    } else {
        sorter =
            data.direction === "ascending"
                ? SORTERS.STRING_ASCENDING(mapper)
                : SORTERS.STRING_DESCENDING(mapper);
    }

    return sorter;
};

let count = tasks.length;
const service = {
    fetchItems: (payload, response) => {
        let items = response.data.content.map(item => {
            return {
                ...item,
                email: item.user.email,
                street: item.address.street
            }
        });
        items = items.sort(getSorter(payload.sort));
        return Promise.resolve(items);
    },
    create: task => {
        count += 1;
        tasks.push({
            ...task,
            id: count
        });
        return Promise.resolve(task);
    },
    update: data => {
        const task = tasks.find(t => t.id === data.id);
        task.title = data.title;
        task.description = data.description;
        return Promise.resolve(task);
    },
    delete: data => {
        const task = tasks.find(t => t.id === data.id);
        tasks = tasks.filter(t => t.id !== task.id);
        return Promise.resolve(task);
    }
};

const styles = {
    container: {margin: "auto", width: "fit-content"}
};

export const TaskComponent = () => {

    return (
        <div style={styles.container}>
            <CRUDTable
                caption="Tasks"
                fetchItems={async payload => service.fetchItems(payload, await UserService.findAll())}
            >
                <Fields>
                    <Field name="id" label="Id" hideInCreateForm/>
                    <Field name="email" label="Email" placeholder="Email"/>
                    <Field name="firstName" label="First Name" placeholder="First Name"/>
                    <Field name="lastName" label="Last Name" placeholder="Last Name"/>
                    <Field name="street" label="Street" placeholder="Street"/>
                </Fields>
                <CreateForm
                    title="Task Creation"
                    message="Create a new task!"
                    trigger="Create Task"
                    onSubmit={task => service.create(task)}
                    submitText="Create"
                    validate={values => {
                        const errors = {};
                        if (!values.title) {
                            errors.title = "Please, provide task's title";
                        }

                        if (!values.description) {
                            errors.description = "Please, provide task's description";
                        }

                        return errors;
                    }}
                />

                <UpdateForm
                    title="Task Update Process"
                    message="Update task"
                    trigger="Update"
                    onSubmit={task => service.update(task)}
                    submitText="Update"
                    validate={values => {
                        const errors = {};

                        if (!values.id) {
                            errors.id = "Please, provide id";
                        }

                        if (!values.title) {
                            errors.title = "Please, provide task's title";
                        }

                        if (!values.description) {
                            errors.description = "Please, provide task's description";
                        }

                        return errors;
                    }}
                />

                <DeleteForm
                    title="Task Delete Process"
                    message="Are you sure you want to delete the task?"
                    trigger="Delete"
                    onSubmit={task => service.delete(task)}
                    submitText="Delete"
                    validate={values => {
                        const errors = {};
                        if (!values.id) {
                            errors.id = "Please, provide id";
                        }
                        return errors;
                    }}
                />
            </CRUDTable>
        </div>
    )
};