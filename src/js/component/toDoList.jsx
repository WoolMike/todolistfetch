import React, { useState,useEffect} from "react";



//include images into your bundle

//create your first component
const ToDoList = () => {

	const [task, setTask] = useState('');
	const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        fetch('https://playground.4geeks.com/apis/fake/todos/user/miguel')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                const todosData = data.map(taskList => ({ ...taskList, label: taskList.label }));
                setTaskList(todosData);
            })
            .catch(error => console.error('Error fetching todos:', error));
    };

    const addTodo = () => {
        const newTodo = { label: task, done: false };
        const updatedTodos = [...taskList, newTodo];
        setTaskList(updatedTodos); // Update todos in the local state
        updateTodoList(updatedTodos); // Update todos in the backen
    };

    const deleteAll=()=>{
        setTaskList([]);
        updateTodoList([]);

    }

    const deleteTodo = (index) => {
        const updatedTodos = taskList.filter((_, i) => i !== index);
        setTaskList(updatedTodos); // Update todos in the local state
        updateTodoList(updatedTodos); // Update todos in the backend
    };

    const updateTodoList = (updatedTodos) => {
        fetch('https://playground.4geeks.com/apis/fake/todos/user/miguel', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodos)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('List updated:', data);
        })
        .catch(error => console.error('Error updating todo list:', error));
    };

	return (<>
		<div className="text-center">
            <div className="container">
                <div className="d-flex">
                    <div className="col-7 text-end">
                <h1>To do list</h1>
                </div>
                <div className="col">
                    <div className="mt-2">
                        <button type="button" class="btn btn-danger" onClick={()=>deleteAll()}>Delete all</button>
                    </div>
                    
                </div>
                </div>
                
                
            </div>
			
			<input type="text" placeholder="Task" onChange={(evento) => setTask(evento.target.value)} 
            Value={task}
            onKeyDown={(evento)=>{
                if(evento.target.value!=false){
                   if(evento.key==="Enter")
                {
                    addTodo();
                    evento.target.value=""
                } 
                }
            }}
             />
			{
				taskList.map((toDo, index) => {
					return <div className="container" key={index}>
						<div className="col-align-self-center">
							<div className="card mt-3">
								<div className="card-body">
									<div className="d-flex">
										<div>
											<div className="col text-start fs-1">
												{toDo.label}
											</div>
										</div>
										<div className="col align-self-end text-end">
											<div className="col align-self-end text-end">
												<div className="hidden">
													<i className="fa-solid fa-xmark fs-1 " onClick={()=>deleteTodo(index)}></i>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div>
						</div>
						<p></p>
					</div>

				})}

			<div className="container">
				<p className="text-start ml-4">{taskList.length} items left</p>
			</div>

		</div>

	</>
	);
};

export default ToDoList;