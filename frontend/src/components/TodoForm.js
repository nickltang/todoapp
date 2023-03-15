import {useState} from 'react'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import axios from 'axios'

const TodoForm = ({todos, setTodos}) => {
    const [name, setName] = useState('')

    const handleChange = e => {
        setName(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (!name) {
            alert("Please provide a valid value for todo");
            return;
        }

        axios.post("/api/todo/", {
            name: name
        }).then((res) => {
            setName("");
            const { data } = res;
            setTodos([
                ...todos,
                data
            ])
        }).catch(e => console.log(e))
    }

    return (
        <Form onSubmit={handleSubmit}>
            <InputGroup className='mb-4'>
                <FormControl 
                    placeholder='To Do' 
                    onChange={handleChange}
                    value={name}
                />
                <Button type='submit'>
                    Add
                </Button>
            </InputGroup>
        </Form>
    )
}

export default TodoForm