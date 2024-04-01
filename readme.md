# EcoSync DNCC

EcoSync DNCC is a web application developed to address the challenges of solid waste management within the jurisdiction of the Dhaka North City Corporation (DNCC). This application serves as a centralized platform for managing waste collection, transportation, and disposal activities efficiently.

## Table of Contents

- [Team Info](#team-info)
- [Technology Stack](#technology-stack)
- [Administration Info](#administration-info)
- [Installation Guidelines](#installation-guidelines)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Team Info

- **Team Name:** JUST_NINJAS
- **Institution:** Jashore University of Science and Technology

### Team Members

- Mirza Mohibul Hasan(Team Leader)
  - Email: mirzamohibul618@gmail.com
- Masum Billa
  - Email: masumbilla190101@gmail.com
- Niloy Das
  - Email: niloydas5215@gmail.com

## Technology Stack

EcoSync DNCC is built using the MERN stack:

- **Frontend:**
  - React.js
- **Backend:**
  - Node.js with Express.js
  - MongoDB for database

## Administration Info

### Admin Credentials:

- **Email:** mirzamohibul618@gmail.com
  - **Password:** Asdfg
- **Email:** ecosyncninjas@gmail.com
  - **Password:** 1234

### STS Manager Info

- **Email:** niloydas5215@gmail.com
  - **Password:** Asdfg

### Landfill Manager Info

- **Email:** masumbilla190101@gmail.com
  - **Password:** Asdfg

## Installation Guidelines

To install and run the frontend, follow these steps:

1. Clone the repository:

```
$ git clone https://github.com/mirza-mohibul-hasan/cs24-p2-JUST_NINJAS
$ cd cs24-p2-JUST_NINJAS
```

2. Build and run using Docker:

```
$ docker-compose up --build OR docker compose up --build
```

**Special Instructions:**

- Some rare times node modules can be a little problematic (device-wise or version-wise). If you face any issue regarding that, just delete the node_modules folder and run "npm install".
- The docker-compose part ran in my device successfully. If you face any issue, check Docker and docker-compose version, Dockerfile, and docker-compose file.
- The docker-compose.yml file will create two containers, one for the frontend and another for the backend.
- In the package.json file in the client folder, "dev": "vite --host 0.0.0.0", was changed. If you face any issue, then make sure to put the "--host" before running.
- Keep the dockerignore file as it is; otherwise, there will be dependency or version problems.

### Port Details

- **Frontend:** 5173
- **Backend:** 3000
- **Frontend:** [http://localhost:5173/](http://localhost:5173/)
- **Backend:** [http://localhost:3000/](http://localhost:3000/)

## Usage

Once the application is up and running, users can log in using their respective credentials based on their roles. Admins, STS managers, and landfill managers each have their specific functionalities and permissions within the application.

## License

This project is licensed under the [MIT License](LICENSE).
