const express = require("express");
const cors = require("cors");
const {uuid} = require("uuidv4");

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const respository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(respository);
  return response.json(respository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(rep => rep.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'not found'});
  }

  const updatedRepository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;  

  const repositoryIndex = repositories.findIndex(rep => rep.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'not found'});
  }

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(rep => rep.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'not found'});
  }  

  repositories[repositoryIndex].likes++;  

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
