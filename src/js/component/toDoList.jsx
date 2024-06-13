import React, { useEffect, useState } from "react";

const Home = () => {
	const [tareas, setTareas] = useState([]);
	const [label, setLabel] = useState("");

	
	async function createUser() {
		try {
			const response = await fetch('https://playground.4geeks.com/todo/users/woolmike', {
				method: "POST",
				body: JSON.stringify([]),
				headers: {
					"Content-Type": "application/json"
				}
			})
			console.log(response)
			console.log(response.ok); // Will be true if the response is successful
			console.log(response.status); // The status code=200 or code=400 etc.
			const data = await response.json()
			console.log(data);
			if (!response.ok) {
				throw new Error(data.msg)
			}
		}
		catch (error) {
			console.error(error)
		}
		console.log("createUser function ran")
	}

	const getAllData = async () => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/users/woolmike`);
			if (response.ok) {
				const dataJson = await response.json();
				setTareas(Array.isArray(dataJson.todos) ? dataJson.todos : []);
				console.log("Datos obtenidos:", dataJson.todos);
			} else {
				console.error("Error data", response.statusText);
			}
		} catch (error) {
			console.error("Errodata", error);
		}
	};

	
	const createNewElement = async (event) => {
		event.preventDefault();
		const newTask = { label, is_done: false };
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/woolmike`, {
				method: 'POST',
				body: JSON.stringify(newTask),
				headers: { "Content-Type": "application/json" }
			});

			if (response.ok) {
				const dataJson = await response.json();
				setTareas([...tareas, dataJson]);
				console.log("created", dataJson);
			} else {
				console.error("no created", response.statusText);
			}
		} catch (error) {
			console.error("No created", error);
		}
	};

	// Método DELETE para eliminar una tarea específica con un botón
	const deleteElement = async (todoId) => {
		try {
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				setTareas(tareas.filter((item) => item.id !== todoId));
				console.log("Tarea eliminada:", todoId);
			} else {
				console.error("No deleted", response.statusText);
			}
		} catch (error) {
			console.error("NO deleted", error);
		}
	};


	const deleteAllElements = async () => {
		try {
			const deletePromises = tareas.map((item) =>
				fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, { method: 'DELETE' })
			);
			await Promise.all(deletePromises);
			setTareas([]);
			console.log("Todo list deleted");
		} catch (error) {
			console.error("todo list no deleted", error);
		}
	};

	useEffect(() => {
		getAllData();
		createUser();
	}, []);

	useEffect(() => {
		setLabel("");
	}, [tareas]);

	return (
		<div className="container text-center">
			<div className="col-aling-self-center">
				<div>
				<form onSubmit={createNewElement}>
					<div className="mb-3">
						<label className="form-label"><h1>To do list</h1></label>
						<div>
							<input
							placeholder="Type the new to do"
							value={label}
							onChange={(event) => setLabel(event.target.value)}
						/>
						</div>
						
					</div>
					<button type="submit" className="btn btn btn-primary mb-3">Enter</button>
				</form>
				<div className="w-100 m-auto">
					<div>
						{tareas.map((item, index) => (
							<li className="mb-1">
								{item.label}
								<button
									className="btn btn-success btn-sm ms-2"
									onClick={() => deleteElement(item.id)}
								>
									Done
								</button>
							</li>
						))}
					</div>
						
				
					<button
						className="btn btn-danger mt -2 mb-2"
						onClick={deleteAllElements}
					><strong>Complete all todos</strong>
					</button>
					<h3>Todos to complete  {tareas.length}</h3>
				</div>
			</div>
			</div>
			
		</div>

	);
};

export default Home;