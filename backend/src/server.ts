import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cors());

interface Employee {
  id: string;
  firstname: string;
  lastname: string;
  age: number;
  isMarried: boolean;
}

let employees: Employee[] = [];

app.get("/employees", (req: Request, res: Response) => {
  res.json(employees);
});

app.get("/employees/search", (req: Request, res: Response) => {
  const { firstname } = req.query;

  if (!firstname || typeof firstname !== "string") {
    return res
      .status(400)
      .json({ error: "Firstname query parameter is required" });
  }

  const results = employees.filter((employee) =>
    employee.firstname.toLowerCase().includes(firstname.toLowerCase())
  );

  res.json(results);
});

app.get("/employees/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return res.status(404).json({ error: "Employee not found" });
  }

  res.json(employee);
});

app.post("/employees", (req: Request, res: Response) => {
  const { firstname, lastname, age, isMarried } = req.body;

  if (!firstname || !lastname || age === undefined || isMarried === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newEmployee: Employee = {
    id: uuidv4(),
    firstname,
    lastname,
    age: Number(age),
    isMarried: Boolean(isMarried),
  };

  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

app.put("/employees/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstname, lastname, age, isMarried } = req.body;

  const employeeIndex = employees.findIndex((emp) => emp.id === id);

  if (employeeIndex === -1) {
    return res.status(404).json({ error: "Employee not found" });
  }

  if (!firstname || !lastname || age === undefined || isMarried === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  employees[employeeIndex] = {
    id,
    firstname,
    lastname,
    age: Number(age),
    isMarried: Boolean(isMarried),
  };

  res.json(employees[employeeIndex]);
});

app.delete("/employees/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const employeeIndex = employees.findIndex((emp) => emp.id === id);

  if (employeeIndex === -1) {
    return res.status(404).json({ error: "Employee not found" });
  }

  const deletedEmployee = employees.splice(employeeIndex, 1);
  res.json(deletedEmployee[0]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
