const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) {
      return response.status(400).json( { error: 'Invalid project' } )
  }

  return next()
}


app.use('/projects/:id', validateProjectId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const project = { id: uuid(), title, url, techs , likes: 0};

  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id)
  
  if ( repositoriesIndex < 0 ){
    return response.status(400).json({ error: 'Project not found.'})
  }

  const project = {
    id,
    title, 
    url, 
    techs,
    likes: repositories[repositoriesIndex].likes,
  }

  return response.json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id)
  
  if ( repositoriesIndex < 0 ){
    return response.status(400).json({ error: 'Project not found.'})
  }

  repositories.splice(repositoriesIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id)
  
  if ( repositoriesIndex < 0 ){
    return response.status(400).json({ error: 'Project not found.'})
  }

  repositories[repositoriesIndex].likes += 1

  return response.json(repositories[repositoriesIndex])
});

module.exports = app;
