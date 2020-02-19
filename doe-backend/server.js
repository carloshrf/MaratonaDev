const express = require('express');
const nunjucks = require('nunjucks');
const server = express(); 

// Configuring the engine template to set the path of index.html folder.
// noCache turn able updates in page refresh
nunjucks.configure('../doe-frontend/', {
  express: server,
  noCache: true,
});

// Defining a public path for static files
server.use(express.static('../doe-frontend/public'))
server.use(express.urlencoded({extended: true}));

// Database connection
const Pool = require('pg').Pool;
const db = new Pool({
  user: 'postgres',
  password: 'docker',
  host: '192.168.99.100',
  port: 5432,
  database: 'maratonadev',
});

// Routes
server.get('/', (req, res) => {

  db.query("SELECT * FROM donors", function(err, result) {
    if (err) return res.send("Erro de banco de dados.");
  
    const donors = result.rows;
    return res.render('index.html', { donors });
  });

});

server.post('/', (req, res) => {
  
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if (name == "" || email == "" || blood == "") {
    return res.send('Todos campos são obrigatórios');
  } 

  const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)
  `;
  
  const values = [name, email, blood];

  db.query(query, values, function(err) {
    if (err) return res.send("erro no banco de dados.");

    return res.redirect('/');
  });
  
});

server.listen(3000, () => {
  console.log('server started');
});

