import React, {Component} from "react";
import CRUDTable, {CreateForm, DeleteForm, Field, Fields, UpdateForm} from "react-crud-table";

// Component's Base CSS
import UserService from "./candidate.service";
import {withRouter} from "../../common/with-router";

const DescriptionRenderer = ({field}) => <textarea {...field} />;

let candidates = [
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
    let sorter = SORTERS.STRING_ASCENDING(mapper);

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

let count = candidates.length;

// let count = items => {
//     items.length
// }

const service = {
    fetchItems: (payload, items) => {
        console.log("test service");
        console.log(items);
        items = items.sort(getSorter(payload.sort));
        return Promise.resolve(items);
    },
    create: task => {
        count += 1;
        candidates.push({
            ...task,
            id: count
        });
        return Promise.resolve(task);
    },
    update: data => {
        const task = candidates.find(t => t.id === data.id);
        task.title = data.title;
        task.description = data.description;
        return Promise.resolve(task);
    },
    delete: data => {
        const task = candidates.find(t => t.id === data.id);
        candidates = candidates.filter(t => t.id !== task.id);
        return Promise.resolve(task);
    }
};

const styles = {
    container: {margin: "auto", width: "fit-content"}
};

class Candidate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            candidates: [],
            // pageSize: 20
            // isLoadingRacers: true,
            // isLoadingPagination: false,
        }
    }

    componentDidMount() {
        UserService.findAll().then(response => {
            this.setState({
                candidates: response.data.content
            })
        })
            .catch(ex => {
                this.setState({})
            })
    }

    render() {
        console.log('Render: ');
        console.log(this.state.candidates);
        return (
            <div style={styles.container}>
                <CRUDTable
                    caption="Candidate"
                    fetchItems={payload => service.fetchItems(payload, this.state.candidates)}
                >
                    <Fields>
                        <Field name="id" label="Id" hideInCreateForm/>
                        <Field name="email" label="Email" placeholder="Email"/>
                        <Field name="firstName" label="First Name" placeholder="First Name"/>
                        <Field name="lastName" label="Last Name" placeholder="Last Name"/>
                        <Field name="title" label="Title" placeholder="Title"/>
                        <Field
                            name="description"
                            label="Description"
                            render={DescriptionRenderer}
                        />
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
        );
    }
}

export default withRouter(Candidate)