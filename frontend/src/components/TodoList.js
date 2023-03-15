import {useState} from 'react'
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem'
import ListGroup from 'react-bootstrap/ListGroup'
import {MdCheckBox, MdCheckBoxOutlineBlank, MdEdit, MdDelete} from 'react-icons/md'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import FormControl from 'react-bootstrap/FormControl'

const Todolist = ({todos, setTodos}) => {
    const [show, setShow] = useState(false)
    const [record, setRecord] = useState(null)

    const handleClose = () => {
        setShow(false)
    }

    const handleDelete = (id) => {
        axios.delete(`/api/todo/${id}/`)
            .then(() => {
                const newTodos = todos.filter(t => {
                    return t.id !== id
                })
                setTodos(newTodos)
            }).catch(e => console.log(e))
    }

    const handleUpdate = async (id, value) => {
        axios.patch(`api/todo/${id}/`, value)
            .then(res => {
                const {data} = res
                const newToDos = todos.map(t => {
                    if(t.id === id) {
                        return data
                    }
                    return t
                }) 
                setTodos(newToDos)
            }).catch(e => {
                console.log(e)
            })
    }

    const renderListGroupItem = (t) => {
        return <ListGroupItem 
                    key={t.id} 
                    className='d-flex justify-content-between align-items-center'
                >
                    <div className='d-flex justify-content-between align-items-center'>
                        <span 
                            style={{marginRight: "12px", cursor: "pointer"}} 
                            onClick={() => handleUpdate(t.id, {completed: !t.completed})}>
                            { t.completed === true
                                ? <MdCheckBox />
                                : <MdCheckBoxOutlineBlank />
                            }
                        </span>
                        <span>
                            {t.name}
                        </span>
                    </div>
                    <div>
                        <MdEdit 
                            style={{cursor: "pointer", marginRight: "12px"}}
                            onClick={() => {
                                setRecord(t)
                                setShow(true)
                            }}
                        />
                        <MdDelete 
                            style={{cursor: "pointer"}} 
                            onClick={() => handleDelete(t.id)}
                        />
                    </div>
                </ListGroupItem>
    }

    const handleChange = (e) => {
        setRecord({
            ...record,
            name: e.target.value
        })
    }

    const handleSaveChanges = async () => {
        await handleUpdate(record.id, {name: record.name})
        handleClose()
    }

    const completedTodos = todos.filter(t => t.completed === true)
    const incompleteTodos = todos.filter(t => t.completed === false)

    return (
        <div>
            <div className='mb-2 mt-4'>
                Incomplete: ({incompleteTodos.length})
            </div>
            <ListGroup>
                { incompleteTodos.map(renderListGroupItem)}
            </ListGroup>    
            <div className='mb-2 mt-4'>
                Completed: ({completedTodos.length})
            </div>
            <ListGroup>
                { completedTodos.map(renderListGroupItem)}
            </ListGroup>    
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Todo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl 
                        value={record ? record.name : ""}
                        onChange={handleChange}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        
    )
}

export default Todolist