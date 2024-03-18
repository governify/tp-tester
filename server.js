const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const git = simpleGit();
const app = express();
const rimraf = require('rimraf'); // Add this at the top of your file

app.use(cors());
app.use(bodyParser.json());

app.post('/tpa/save', (req, res) => {
  const data = req.body;
  const filePath = path.join(__dirname, '/src/assets/savedMetrics', `${data.fileName}.json`);
  fs.writeFile(filePath, JSON.stringify(data.content, null, 2), (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while saving the file.' });
    } else {
      res.json({ message: 'File saved successfully.' });
    }
  });
});
app.post('/tpa/update', (req, res) => {
  const data = req.body;
  const filePath = path.join(__dirname, '/src/assets/savedMetrics', `${data.fileName}`);

  // Verifica si el archivo ya existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      // Si el archivo existe, lo borra
      fs.unlinkSync(filePath);
    }

    // Crea el nuevo archivo
    fs.writeFile(filePath, JSON.stringify(data.content, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while saving the file.' });
      } else {
        res.json({ message: 'File updated successfully.' });
      }
    });
  });
});

// Método GET para obtener todos los archivos .json en la carpeta de assets
app.get('/tpa/files', (req, res) => {
  const dirPath = path.join(__dirname, '/src/assets/savedMetrics');
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while reading the directory.' });
    } else {
      const jsonFiles = files.filter(file => path.extname(file) === '.json');
      res.json(jsonFiles);
    }
  });
});

// Método GET para obtener el contenido de un archivo .json específico
app.get('/tpa/files/:fileName', (req, res) => {
  const filePath = path.join(__dirname, '/src/assets/savedMetrics', `${req.params.fileName}.json`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while reading the file.' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.delete('/tpa/files/:fileName', (req, res) => {
  const filePath = path.join(__dirname, '/src/assets/savedMetrics', `${req.params.fileName}`);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', err);
      res.status(404).json({ message: 'File does not exist.' });
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('An error occurred while deleting the file:', err);
          res.status(500).json({ message: 'An error occurred while deleting the file.' });
        } else {
          res.json({ message: 'File deleted successfully.' });
        }
      });
    }
  });
});

app.post('/token/save', (req, res) => {
  const token = req.body.token;
  const filePath = path.join(__dirname, '/src/assets/token', 'code.json');

  // Verifica si el archivo ya existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      // Si el archivo existe, lo borra
      fs.unlinkSync(filePath);
    }

    // Crea el nuevo archivo con el token
    fs.writeFile(filePath, JSON.stringify({ token }, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while saving the token.' });
      } else {
        res.json({ message: 'Token saved successfully.' });
      }
    });
  });
});

app.get('/token/get', (req, res) => {
  const filePath = path.join(__dirname, '/src/assets/token', 'code.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while reading the token.' });
    } else {
      const { token } = JSON.parse(data);
      res.json({ token });
    }
  });
});

app.delete('/token/delete', (req, res) => {
  const filePath = path.join(__dirname, '/src/assets/token', 'code.json');

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', err);
      res.status(404).json({ message: 'File does not exist.' });
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('An error occurred while deleting the file:', err);
          res.status(500).json({ message: 'An error occurred while deleting the file.' });
        } else {
          res.json({ message: 'File deleted successfully.' });
        }
      });
    }
  });
});

//GITHUB
app.post('/cloneRepo', (req, res) => {
  const { repoName } = req.body;
  const repoPath = path.join(__dirname, 'assets', 'repositories', repoName);

  // Delete the directory before cloning
  rimraf(repoPath, (err) => {
    if (err) {
      res.status(500).send('Error deleting directory: ' + err.message);
    } else {
      console.log(`Cloning repository ${repoName} into ${repoPath}`);
      git.clone(`https://github.com/${repoName}.git`, repoPath)
        .then(() => {
          console.log('Repository cloned successfully');
          res.json({ message: 'Repository cloned successfully' });
        })
        .catch((error) => {
          console.error('Error cloning repository:', error);
          res.status(500).send('Error cloning repository: ' + error.message);
        });
    }
  });
});
app.listen(4202, () => console.log('Server is running on port 4202'));
