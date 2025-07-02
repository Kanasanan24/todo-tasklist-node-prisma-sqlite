import Joi from "joi";
import prisma from "../data/prisma";
import { Request, Response } from "express";
import { SearchTask } from "../types/taskType";

const taskSchema = Joi.object({
  task_name: Joi.string().min(5).max(50).required(),
  task_description: Joi.string().min(5).max(150).required(),
  due_date: Joi.date(),
  completed_at: Joi.date().allow("").optional(),
});

const searchSchema = Joi.object({
  search: Joi.string().allow("").max(150).optional(),
  page: Joi.number().integer().optional(),
  pageSize: Joi.number().integer().optional(),
  sortField: Joi.string().valid("id", "task_name", "created_at").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
  completed_at: Joi.boolean().optional(),
});

const createTask = async(req:Request, res:Response) => {
  try {
    // validate
    const { error } = taskSchema.validate(req.body, { abortEarly: false });
    if (error?.details) {
      return res.status(400).json({ errors: error.details.map(
        detail => ({ path: detail.path, message: detail.message })
      )});
    }
    // create task
    const task = await prisma.tasks.create({
      data: {
        ...req.body,
        due_date: new Date(req.body.due_date),
        completed_at: req.body?.completed_at ? new Date(req.body.completed_at) : null
      }
    });
    // update cache
    await prisma.cacheStorages.update({where: { cache_name: "cache_tasks" }, data: { cache_total: { increment: 1 } }});
    // response
    return res.status(201).json({ message: "The task was created successfully.", data: task });
  } catch (error) {
    console.error({ position: "Create task", error });
    return res.status(500).json({ message: "Something went wrong." });
  }
}

const getTasks = async(req:Request<{}, {}, {}, SearchTask>, res:Response) => {
  try {
    // validate
    const { error } = searchSchema.validate(req.query, { abortEarly: false });
    if (error?.details) {
      return res.status(400).json({ errors: error.details.map(
        detail => ({ path: detail.path, message: detail.message })
      )});
    }
    // query
    const { search = "", page = 1, pageSize = 15, sortField = "id", sortOrder = "asc", completed = false } = req.query;
    const parsePage = Number(page);
    const parsePageSize = Number(pageSize);
    const tasks = await prisma.tasks.findMany({
      where: {
        AND: [
          {
            OR: [
              { task_name: { contains: search } },
              { task_description: { contains: search } }
            ]
          },
          completed ? { completed_at: { not: null } } : { completed_at: null }
        ]
      },
      skip: (parsePage - 1) * parsePageSize,
      take: parsePageSize,
      orderBy: {
        [sortField]: sortOrder
      }
    });
    // cache
    const total_tasks = await prisma.cacheStorages.findUnique({
      where: { cache_name: "cache_tasks" },
      select: { cache_total: true }
    });
    // response
    return res.status(200).json({ data: tasks, pagination: {
      page: parsePage,
      pageSize: parsePageSize,
      totalPages: Math.ceil((total_tasks?.cache_total ?? 0 ) / pageSize),
      totalSizes: total_tasks?.cache_total ?? 0
    }});
  } catch (error) {
    console.error({ position: "Get tasks", error });
    return res.status(500).json({ message: "Something went wrong." });
  }
}

const getTaskById = async(req:Request, res:Response) => {
  try {
    // check task id
    const { task_id } = req.params;
    if (!task_id) return res.status(400).json({ message: "The task was not found." });
    // query
    const task = await prisma.tasks.findUnique({
      where: { id: Number(task_id) }
    });
    // response
    return res.status(200).json({ data: task });
  } catch (error) {
    console.error({ position: "Get task by id", error });
    return res.status(500).json({ message: "Something went wrong." });
  }
}

const updateTask = async(req:Request, res:Response) => {
  try {
    // check task id
    const { task_id } = req.params;
    if (!task_id) return res.status(400).json({ message: "Something went wrong." });
    // validate
    const { error } = taskSchema.validate(req.body, { abortEarly: false });
    if (error?.details) {
      return res.status(400).json({ errors: error.details.map(
        detail => ({ path: detail.path, message: detail.message })
      )});
    }
    // update
    const task = await prisma.tasks.update({
      where: { id: Number(task_id) },
      data: {
        ...req.body,
        due_date: new Date(req.body.due_date),
        completed_at: req.body?.completed_at ? new Date(req.body.completed_at) : null
      }
    });
    // response
    return res.status(200).json({ message: "The task was updated successfully.", data: task });
  } catch (error) {
    console.error({ position: "Update task", error });
    return res.status(500).json({ message: "Something went wrong." });
  }
}

const deleteTask = async(req:Request, res:Response) => {
  try {
    // check task id
    const { task_id } = req.params;
    if (!task_id) return res.status(400).json({ message: "The task was not found." });
    // delete
    await prisma.tasks.delete({ where: { id: Number(task_id) } });
    // update cache
    await prisma.cacheStorages.update({where: { cache_name: "cache_tasks" }, data: { cache_total: { decrement: 1 } }});
    // response
    return res.status(200).json({ message: "The task was deleted successfully." });
  } catch (error) {
    console.error({ position: "Delete task", error });
    return res.status(500).json({ message: "Something went wrong." });
  }
}

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
}