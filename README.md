
# To Do List (Nodejs + Prisma)

เป็น To Do List ที่ได้เตรียม Function การทำงานกับ Task ต่างๆ ที่จะทำให้จัดการตามวิธีการ CRUD (Create, Read, Update และ Delete)

และแยกประเภทของ Task ที่เสร็จและไม่เสร็จด้วยเวลาที่ใช้ในการทำ Task นั้นๆ


## Feature

- สร้าง ลบ แก้ไข Task งาน
- อัพเดตสถานะของ Task
- คัดกรองข้อมูล Task (สามารถดูการคัดกรองได้ที่ API Reference : Get tasks)

## How to install

- Clone Project นี้วางในตำแหน่งที่ต้องการภายในเครื่อง

```
  git clone https://github.com/Kanasanan24/todo-tasklist-node-prisma-sqlite.git
```

- สร้าง .env ไฟล์และโดยสร้างข้อมูลตามตัวอย่างใน .env.example

```
  PORT=your_port
  DATABASE_URL=your_database_path(default:"file:./dev.db")
```

- เปิด CLI (Command Line Interface) ในเส้นทางของ Project นี้ และทำการติดตั้ง Package

```
  npm install
```

- Setup SQLite

```
  prisma generate
```

- อัพโหลด Model เข้า SQLite

```
  npx prisma migrate dev --name initial-project-model
```

- ทำการ Compile จาก Typescript เป็น Javascript

```
  npm run build
```

- Run seed เพื่อเตรียมเก็บ Cache ของ Task

```
  npm run seed
```

- Run server

```
  npm run start หรือ npm start
```
## API Reference

#### Get tasks

```
  GET /api/task/pagination
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `search` | `string` |  **[default = ""]** ใช้ในการค้นหา Task ผ่าน (name, description) |
| `page` | `integer` | **[default = 1]** หน้าที่จะค้นหาปัจจุบัน |
| `pageSize` | `integer` | **[default = 15]** ขนาดข้อมูลที่จะค้นต่อ page |
| `sortField` | `string` | **[default = "id"]** เลือก Field ที่จะใช้ในการคัดกรอง (id, task_name, created_at) |
| `sortOrder` | `string` | **[default = "asc"]** เรียงข้อมูลแบบไหน (asc, desc) |
| `completed` | `boolean` | **[default = false]** เลือกว่าจะคัดกรอง Task ที่สำเร็จหรือไม่ |

#### Get task by id

```
  GET /api/tasks/:task_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `task_id`      | `integer` | **Required**. Id ของ Task ที่ต้องการค้น |

#### Create task

```
  POST /api/task/create
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `task_name` | `string` |  **Required**. ชื่อของ Task |
| `task_description` | `string` | **Required**. คำอธิบายของ Task |
| `due_date` | `Datetime` | **Required**. วันเวลาของวันครบกำหนด |
| `completed_at` | `Datetime`| วันเวลาที่ทำ Tasks สำเร็จ  |

#### Update task

```
  PUT /api/task/update/:task_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `task_id`      | `integer` | **Required**. Id ของ Task ที่ต้องการ Update |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `task_name` | `string` |  **Required**. ชื่อของ Task |
| `task_description` | `string` | **Required**. คำอธิบายของ Task |
| `due_date` | `Datetime` | **Required**. วันเวลาของวันครบกำหนด |
| `completed_at` | `Datetime`| วันเวลาที่ทำ Tasks สำเร็จ  |

#### Delete task

```
  DELETE /api/task/delete/:task_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `task_id`      | `integer` | **Required**. Id ของ Task ที่ต้องการ Delete |