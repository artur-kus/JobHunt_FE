import React, {Component} from "react";
import CRUDTable, {CreateForm, DeleteForm, Field, Fields, UpdateForm} from "react-crud-table";

// Component's Base CSS
import UserService from "./candidate.service";
import {withRouter} from "../../common/with-router";

const DescriptionRenderer = ({field}) => <textarea {...field} />;


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
        const candidates = [...this.state.candidates];
        const newCandidate = {
            ...task,
            id: this.state.count + 1 // increment the count
        };
        candidates.push(newCandidate);
        return new Promise(resolve => {
            this.setState({
                candidates,
                count: this.state.count + 1 // increment the count in state
            }, () => resolve(newCandidate));
        });
    },
    update: data => {
        const candidates = [...this.state.candidates];
        const index = candidates.findIndex(t => t.id === data.id);
        const updatedCandidate = {
            ...candidates[index],
            ...data
        };
        candidates.splice(index, 1, updatedCandidate);
        return new Promise(resolve => {
            this.setState({
                candidates
            }, () => resolve(updatedCandidate));
        });
    },
    delete: data => {
        const candidates = [...this.state.candidates];
        const index = candidates.findIndex(t => t.id === data.id);
        const deletedCandidate = candidates[index];
        candidates.splice(index, 1);
        return new Promise(resolve => {
            this.setState({
                candidates,
                count: this.state.count - 1 // decrement the count in state
            }, () => resolve(deletedCandidate));
        });
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
            count: 0
        }
    }

    render() {
        return (
            <div style={styles.container}>
                <CRUDTable
                    caption="Candidate"
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
                        title="User Creation"
                        message="Add a new user"
                        trigger="Create user"
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