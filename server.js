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
  const { owner, repoName } = req.body;
  const repoUrl = `https://github.com/${owner}/${repoName}.git`;
  const repoPath = path.join(__dirname, 'assets', 'repositories', repoName);

  // Delete the directory before cloning
  rimraf(repoPath, (err) => {
    if (err) {
      res.status(500).send('Error deleting directory: ' + err.message);
    } else {
      console.log(`Cloning repository ${repoName} into ${repoPath}`);
      git.clone(repoUrl, repoPath)
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
app.get('/listRepos', (req, res) => {
  const repoPath = path.join(__dirname, 'assets', 'repositories');

  try {
    const files = fs.readdirSync(repoPath, { withFileTypes: true });
    const directories = files
      .filter(file => file.isDirectory() && !file.name.startsWith('.'))
      .map(file => file.name);
    res.json({ repositories: directories });
  } catch (err) {
    res.status(500).send('Error reading directory: ' + err.message);
  }
});
const util = require('util');
const exec = util.promisify(require('child_process').exec);

app.get('/branches/:repoName', async (req, res) => {
  const { repoName } = req.params;
  const repoPath = path.join(__dirname, 'assets', 'repositories', repoName);

  try {
    const { stdout, stderr } = await exec('git branch', { cwd: repoPath });
    if (stderr) {
      console.error('Error listing branches:', stderr);
      res.status(500).send('Error listing branches: ' + stderr);
    } else {
      const branches = stdout.split('\n').map(branch => branch.trim()).filter(Boolean);
      res.json({ branches });
    }
  } catch (err) {
    console.error('Error executing git command:', err);
    res.status(500).send('Error executing git command: ' + err.message);
  }
});

app.delete('/deleteRepo/:repoName', (req, res) => {
  const { repoName } = req.params;
  const repoPath = path.join(__dirname, 'assets', 'repositories', repoName);

  rimraf(repoPath, (err) => {
    if (err) {
      console.error('Error deleting repository:', err);
      res.status(500).send('Error deleting repository: ' + err.message);
    } else {
      console.log(`Repository ${repoName} deleted successfully`);
      res.json({ message: 'Repository deleted successfully' });
    }
  });
});

app.post('/createBranch/:repoName', async (req, res) => {
  const { repoName } = req.params;
  const { branchName } = req.body;
  const repoPath = path.join(__dirname, 'assets', 'repositories', repoName);

  try {
    const { stdout, stderr } = await exec(`git checkout -b ${branchName}`, { cwd: repoPath });
    if (stderr && !stderr.includes('Switched to a new branch')) {
      console.error('Error creating branch:', stderr);
      res.status(500).send('Error creating branch: ' + stderr);
    } else {
      res.json({ message: `Branch ${branchName} created successfully` });
    }
  } catch (err) {
    console.error('Error executing git command:', err);
    res.status(500).send('Error executing git command: ' + err.message);
  }
});

app.get('/pullCurrentBranch/:repoName', async (req, res) => {
  const { repoName } = req.params;
  const repoPath = path.join(__dirname, 'assets', 'repositories', repoName);

  try {
    const { stdout, stderr } = await exec('git pull', { cwd: repoPath });
    if (stderr) {
      console.error('Error pulling current branch:', stderr);
      res.status(500).send('Error pulling current branch: ' + stderr);
    } else {
      res.json({ message: `Pulled current branch successfully` });
    }
  } catch (err) {
    console.error('Error executing git command:', err);
    res.status(500).send('Error executing git command: ' + err.message);
  }
});

app.delete('/deleteBranch/:repoName/:branchName', async (req, res) => {
  const { repoName, branchName } = req.params;
  const repoPath = path.join(__dirname, 'assets', 'repositories', repoName);

  try {
    const { stdout, stderr } = await exec(`git branch -d ${branchName}`, { cwd: repoPath });
    if (stderr) {
      console.error('Error deleting branch:', stderr);
      res.status(500).send('Error deleting branch: ' + stderr);
    } else {
      res.json({ message: `Branch ${branchName} deleted successfully` });
    }
  } catch (err) {
    console.error('Error executing git command:', err);
    res.status(500).send('Error executing git command: ' + err.message);
  }
});

app.post('/changeBranch/:repoName/:branchName', async (req, res) => {
  const { repoName, branchName } = req.params;
  const repoPath = path.join(__dirname, 'assets', 'repositories', repoName);

  try {
    const { stdout, stderr } = await exec(`git checkout ${branchName}`, { cwd: repoPath });
    if (stderr && !stderr.includes('Switched to branch')) {
      console.error('Error changing branch:', stderr);
      res.status(500).send('Error changing branch: ' + stderr);
    } else {
      res.json({ message: `Switched to branch ${branchName} successfully` });
    }
  } catch (err) {
    console.error('Error executing git command:', err);
    res.status(500).send('Error executing git command: ' + err.message);
  }
});
app.listen(4202, () => console.log('Server is running on port 4202'));
