const axios = require('axios');

const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');

// Set the port to 4000
const PORT = process.env.PORT || 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

const ALL_SOLUTIONS = 'ALL_SOLUTIONS';
const NEW_SOLUTION = 'NEW_SOLUTION';
const NEW_SOLUTION_WITH_FILES = 'NEW_SOLUTION_WITH_FILES';
const EDIT_SOLUTION = 'EDIT_SOLUTION';
const EDIT_SOLUTION_WITH_FILES = 'EDIT_SOLUTION_WITH_FILES';
const DELETE_SOLUTION = 'DELETE_SOLUTION';
const ADD_SOLUTION_FLAG = 'ADD_SOLUTION_FLAG';
const REMOVE_SOLUTION_FLAG = 'REMOVE_SOLUTION_FLAG';
const ADD_CHOSEN_SOLUTION = 'ADD_CHOSEN_SOLUTION';
const REMOVE_CHOSEN_SOLUTION = 'REMOVE_CHOSEN_SOLUTION'

const NEW_SOLUTION_COMMENT = 'NEW_SOLUTION_COMMENT';
const NEW_SOLUTION_COMMENT_REPLY = 'NEW_SOLUTION_COMMENT_REPLY';
const NEW_SOLUTION_COMMENT_REPLY_WITH_FILES = 'NEW_SOLUTION_COMMENT_REPLY_WITH_FILES';
const NEW_SOLUTION_COMMENT_WITH_FILES = 'NEW_SOLUTION_COMMENT_WITH_FILES';
const EDIT_SOLUTION_COMMENT = 'EDIT_SOLUTION_COMMENT';
const EDIT_SOLUTION_COMMENT_WITH_FILES = 'EDIT_SOLUTION_COMMENT_WITH_FILES';
const EDIT_SOLUTION_COMMENT_REPLY = 'EDIT_SOLUTION_COMMENT_REPLY';
const EDIT_SOLUTION_COMMENT_REPLY_WITH_FILES = 'EDIT_SOLUTION_COMMENT_REPLY_WITH_FILES';
const DELETE_SOLUTION_COMMENT_REPLY = 'DELETE_SOLUTION_COMMENT_REPLY';
const ADD_SOLUTION_COMMENT_REPLY_FLAG = 'ADD_SOLUTION_COMMENT_REPLY_FLAG';
const REMOVE_SOLUTION_COMMENT_REPLY_FLAG = 'REMOVE_SOLUTION_COMMENT_REPLY_FLAG';
const DELETE_SOLUTION_COMMENT = 'DELETE_SOLUTION_COMMENT';
const ADD_SOLUTION_COMMENT_FLAG = 'ADD_SOLUTION_COMMENT_FLAG';
const REMOVE_SOLUTION_COMMENT_FLAG = 'REMOVE_SOLUTION_COMMENT_FLAG';


const ROOT_URL = 'http://localhost:3000';
//const ROOT_URL = 'https://warm-escarpment-13569.herokuapp.com';

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected: ', wss.clients.length);
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('message', (message) => {

    console.log(message);
    const data = JSON.parse(message);

    if(data.type === NEW_SOLUTION){
      const new_solution_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/new`, data.data);
      new_solution_request.then((res) => {
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({type: NEW_SOLUTION + '_RETURN', error: [], data: res.data}));
        })
      })    
    } else if(data.type === ALL_SOLUTIONS){
      const all_solutions_request = axios.get(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions`);
      all_solutions_request.then((res) => {
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({type: ALL_SOLUTIONS + '_RETURN', error: [], data: res.data}));
        })
      })    
    } else if(data.type === NEW_SOLUTION_WITH_FILES){
      const new_solution_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/new`, {name: data.data.name, description: data.data.description, media_url: data.media_url});
      new_solution_request.then((res) => {
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({type: NEW_SOLUTION + '_RETURN', error: [], data: res.data}));
        })
      })
    } else if(data.type === EDIT_SOLUTION){
      const edit_solution_request = axios.put(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/edit`, data.data);
      edit_solution_request.then((res) => {
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({type: EDIT_SOLUTION + '_RETURN', error: [], data: res.data}));
        })
      })
    } else if(data.type === EDIT_SOLUTION_WITH_FILES){
      const edit_solution_request = axios.put(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/edit`, {name: data.data.name, description: data.data.description, media_url: data.media_url});
      edit_solution_request.then((res) => {
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({type: EDIT_SOLUTION + '_RETURN', error: [], data: res.data}));
        })
      })
    } else if(data.type === DELETE_SOLUTION){
      const delete_request = axios.delete(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}`);
      delete_request.then((res) => {
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({type: DELETE_SOLUTION + '_RETURN', error: [], data: res.data}));
        })
      });
    } else if(data.type === ADD_SOLUTION_FLAG){
      const add_flag_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/flags`)
      add_flag_request.then((res) =>{
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({type: ADD_SOLUTION_FLAG + '_RETURN', error: [], data: res.data}));
        })
      })
    } else if(data.type === REMOVE_SOLUTION_FLAG){
      const remove_flag_request = axios.delete(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/flags/`)
      remove_flag_request.then((res) =>{
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({type: REMOVE_SOLUTION_FLAG + '_RETURN', error: [], data: res.data}));
        })
      })
    } else if(data.type === ADD_CHOSEN_SOLUTION){
      const add_chosen_request = axios.put(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/edit`, { discussion: true })
      add_chosen_request.then((res) =>{
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({type: ADD_CHOSEN_SOLUTION + '_RETURN', error: [], data: res.data}));
        })
      })
    } else if(data.type === REMOVE_CHOSEN_SOLUTION){
      const remove_chosen_request = axios.put(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/edit`, { discussion: false })
      remove_chosen_request.then((res) => {
        wss.clients.forEach((client) => {
          client.send(JSON.stringify({type: REMOVE_CHOSEN_SOLUTION + '_RETURN', error: [], data: res.data}));
        })
      })
    } else if(data.type === NEW_SOLUTION_COMMENT){
      const new_comment_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/new`,  { description: data.data.description});
      new_comment_request
        .then((res) => {
            wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: NEW_SOLUTION_COMMENT + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: NEW_SOLUTION_COMMENT + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        })
    } else if(data.type === NEW_SOLUTION_COMMENT_WITH_FILES){
      const new_comment_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/new`,  { description: data.data.description, media_url: data.media_url});
      new_comment_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: NEW_SOLUTION_COMMENT + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: NEW_SOLUTION_COMMENT + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        })
    } else if(data.type === EDIT_SOLUTION_COMMENT){
      const new_comment_request = axios.put(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.comment_id}/edit`,  { description: data.data.description});
      new_comment_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: EDIT_SOLUTION_COMMENT + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: EDIT_SOLUTION_COMMENT + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        })
    } else if(data.type === EDIT_SOLUTION_COMMENT_WITH_FILES){
      const edit_comment_request = axios.put(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.comment_id}/edit`,  { description: data.data.description, media_url: data.media_url});
      edit_comment_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: EDIT_SOLUTION_COMMENT + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: EDIT_SOLUTION_COMMENT + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        })
    } else if(data.type === DELETE_SOLUTION_COMMENT){
      const delete_comment_request = axios.delete(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.comment_id}/`);
      delete_comment_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: DELETE_SOLUTION_COMMENT + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: DELETE_SOLUTION_COMMENT + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        })
    } else if(data.type === ADD_SOLUTION_FLAG){
      const add_solution_flag_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/flags`);
      add_solution_flag_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: ADD_SOLUTION_FLAG + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: ADD_SOLUTION_FLAG + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        })
    } else if(data.type === REMOVE_SOLUTION_FLAG){
      const remove_solution_flag_request = axios.delete(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/flags`);
      remove_solution_flag_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: REMOVE_SOLUTION_FLAG + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: REMOVE_SOLUTION_FLAG + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        })
    } else if(data.type === ADD_SOLUTION_COMMENT_FLAG){
      const add_comment_flag_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.comment_id}/flags`);
      add_comment_flag_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: ADD_SOLUTION_COMMENT_FLAG + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: ADD_SOLUTION_COMMENT_FLAG + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        })
    } else if(data.type === REMOVE_SOLUTION_COMMENT_FLAG){
      const remove_comment_flag_request = axios.delete(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.comment_id}/flags`);
      remove_comment_flag_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: REMOVE_SOLUTION_COMMENT_FLAG + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: REMOVE_SOLUTION_COMMENT_FLAG + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        })
    } else if(data.type === NEW_SOLUTION_COMMENT_REPLY){
      let new_comment_request;
      data.data.true_parent_id ?
        new_comment_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.parent_comment_id}/new/reply`,  { true_parent_id: data.data.true_parent_id, description: data.data.description}):
        new_comment_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.parent_comment_id}/new/reply`,  { description: data.data.description})
      new_comment_request
        .then((res) => {
            wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: NEW_SOLUTION_COMMENT_REPLY + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: NEW_SOLUTION_COMMENT_REPLY + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        });
    } else if(data.type === NEW_SOLUTION_COMMENT_REPLY_WITH_FILES){
      let new_comment_request;
      data.data.true_parent_id ?
        new_comment_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.parent_comment_id}/new/reply`,  { true_parent_id: data.data.true_parent_id, description: data.data.description, media_url: data.media_url}):
        new_comment_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.parent_comment_id}/new/reply`,  { description: data.data.description, media_url: data.media_url});
      new_comment_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: NEW_SOLUTION_COMMENT_REPLY + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: NEW_SOLUTION_COMMENT_REPLY + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        });
    } else if(data.type === EDIT_SOLUTION_COMMENT_REPLY){
      const edit_comment_request = axios.put(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.comment_id}/edit/reply`,  { description: data.data.description, parent_id: data.parent_id});
      edit_comment_request
        .then((res) => {
            wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: EDIT_SOLUTION_COMMENT_REPLY + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: EDIT_SOLUTION_COMMENT_REPLY + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        });
    } else if(data.type === EDIT_SOLUTION_COMMENT_REPLY_WITH_FILES){
      const edit_comment_request = axios.put(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.comment_id}/edit/reply`,  { description: data.data.description, parent_id: data.parent_id, media_url: data.media_url});
      edit_comment_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: EDIT_SOLUTION_COMMENT_REPLY + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: EDIT_SOLUTION_COMMENT_REPLY + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        });
    } else if(data.type === DELETE_SOLUTION_COMMENT_REPLY){
      const delete_comment_reply_request = axios.delete(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.comment_id}/reply/${data.parent_id}`);
      delete_comment_reply_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: DELETE_SOLUTION_COMMENT_REPLY + '_RETURN', error: [], data: res.data}));
          })
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: DELETE_SOLUTION_COMMENT_REPLY + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          })
        });
    } else if(data.type === ADD_SOLUTION_COMMENT_REPLY_FLAG){
      const add_comment_flag_request = axios.post(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.comment_id}/flags/replies`, { parent_id: data.parent_id});
      add_comment_flag_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: ADD_SOLUTION_COMMENT_REPLY_FLAG + '_RETURN', error: [], data: res.data}));
          });
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: ADD_SOLUTION_COMMENT_REPLY_FLAG + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          });
        });
    } else if(data.type === REMOVE_SOLUTION_COMMENT_REPLY_FLAG){
      const remove_comment_flag_request = axios.delete(`${ROOT_URL}/api/users/${data.user_id}/projects/${data.project_id}/solutions/${data.solution_id}/comments/${data.comment_id}/flags/${data.parent_id}/replies`);
      remove_comment_flag_request
        .then((res) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: REMOVE_SOLUTION_COMMENT_REPLY_FLAG + '_RETURN', error: [], data: res.data}));
          });
        })
        .catch((error) => {
          wss.clients.forEach((client) => {
            client.send(JSON.stringify({type: REMOVE_SOLUTION_COMMENT_REPLY_FLAG + '_RETURN_ERROR', error: error.response.data, data: res.data}));
          });
        });
    }  
  });
});
