import React, { useEffect, useState } from "react";

const Home = () => {
	const [tareas, setTareas] = useState([]);
	const [label, setLabel] = useState("");

	// Método GET para obtener array con todas las tareas existentes para mi usuario
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
				console.error("Error al recuperar datos:", response.statusText);
			}
		} catch (error) {
			console.error("Error al recuperar datos:", error);
		}
	};

	// Método POST para añadir nuevas tareas al array de mi usuario
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
				console.log("Tarea creada:", dataJson);
			} else {
				console.error("Error al crear tarea:", response.statusText);
			}
		} catch (error) {
			console.error("Error al crear tarea:", error);
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
				console.error("Error al eliminar tarea:", response.statusText);
			}
		} catch (error) {
			console.error("Error al eliminar tarea:", error);
		}
	};

	// Método DELETE para eliminar TODAS las tareas del array de mi usuario
	const deleteAllElements = async () => {
		try {
			// 1.-Envío DELETE para cada tarea con mapeo y el "id" dinámico
			const deletePromises = tareas.map((item) =>
				fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, { method: 'DELETE' })
			);

			// 2.- Esperar a que todas las peticiones DELETE se completen
			await Promise.all(deletePromises);

			// 3.- Actualizar el array de "tareas"
			setTareas([]);
			console.log("Todas las tareas han sido eliminadas");
		} catch (error) {
			console.error("Error al eliminar todas las tareas:", error);
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
						<label className="form-label"><strong>To do list</strong></label>
						<input
							placeholder="Type the new to do"
							value={label}
							className="form-control"
							aria-describedby="emailHelp"
							onChange={(event) => setLabel(event.target.value)}
						/>
					</div>
					<button type="submit" className="btn btn btn-primary mb-3">Enter</button>
				</form>
				<div className="w-100 m-auto">
					<ol>
						{tareas.map((item, index) => (
							<li key={index}>
								{item.label}
								<button
									className="btn btn-success btn-sm ms-2"
									onClick={() => deleteElement(item.id)}
								>
									Done
								</button>
							</li>
						))}
					</ol>
					<button
						className="btn btn-danger"
						onClick={deleteAllElements}
					><strong>complete all todos</strong>
					</button>
				</div>
			</div>
			</div>
			
		</div>

	);
};

export default Home;