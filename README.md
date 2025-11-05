# SlotSwapper

SlotSwapper is a peer-to-peer time-slot swapping application that allows users to create events and swap time slots with other users. Built with the **MERN stack** (MongoDB, Express.js, React, Node.js), it provides a smooth interface for managing personal schedules and exchanging slots with others efficiently.

---

Project Overview

Design Choices:

- **Backend (Node.js + Express):** RESTful API design for modularity and scalability. Authentication is handled via JWT.  
- **Database (MongoDB):** Flexible schema design for Users, Events, and Swap Requests. Used Mongoose for schema modeling and population.  
- **Frontend (React + Bootstrap):** Fast, responsive UI using Bootstrap components. State management via React Context API for user authentication.  
- **Swap Logic:** Two main models – `Swap` for tracking swap requests and `SwapRequest` for simplified slot-based swapping. Status management ensures slots are updated automatically (`SWAPPABLE`, `SWAP_PENDING`, `BUSY`).  

Key Features:

- User signup/login with JWT authentication  
- CRUD operations for events  
- Mark events as swappable  
- View swappable slots from other users  
- Send and respond to swap requests  
- Automatic update of event status after swap  

---

## Local Setup Instructions

1. Clone the repository:

gitbash
git clone https://github.com/VaradAndhare/SlotSwapper.git
cd SlotSwapper/backend

2.Install dependencies:
npm install

3.Create .env:
MONGO_URL=mongodb+srv://andharevarad03_db_user:PQZkLzlxNB4Fslgf@cluster0.fg89o5a.mongodb.net/?appName=Cluster0
JWT_SECRET=secretkey

3.Run backend:
node index.js

4.Frontend:
cd ../frontend
npm install
npm run dev

API Endpoints
Auth (/api/auth)

| Method | Endpoint  | Description |
| ------ | --------- | ----------- |
| POST   | `/signup` | Register    |
| POST   | `/login`  | Login       |


Events (/api/events)

| Method | Endpoint | Description      |
| ------ | -------- | ---------------- |
| GET    | `/`      | List user events |
| POST   | `/`      | Create event     |
| PUT    | `/:id`   | Update event     |
| DELETE | `/:id`   | Delete event     |

Swappable Slots (/api/swaproute)

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/swappable`    | List swappable slots |
| POST   | `/request`      | Send swap request    |
| POST   | `/response/:id` | Accept/Reject swap   |

Assumptions & Challenges

1.Users cannot swap their own events.
2.Only SWAPPABLE events can be requested.
3.Swap requests update status to SWAP_PENDING.
4.Only receivers can respond to requests.
5.Challenges: Route conflicts, Mongoose population, frontend request handling.

Future Enhancements

Real-time notifications (Socket.IO)
Email notifications
Analytics dashboard
Improved UI responsiveness
