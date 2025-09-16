const http = require('http');
const fs = require('fs');
const path = require('path');

// Create server
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Serve static files
  if (req.method === 'GET') {
    let filePath = '.' + req.url;
    
    // Default to index.html
    if (filePath === './') {
      filePath = './index.html';
    }
    
    // Determine content type
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read file
    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          // File not found
          fs.readFile('./404.html', (err, content) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
        } else {
          // Server error
          res.writeHead(500);
          res.end(`Server Error: ${error.code}`);
        }
      } else {
        // Success
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }
  
  // API endpoints for data management
  if (req.method === 'GET' && req.url.startsWith('/api/')) {
    handleApiGet(req, res);
  } else if (req.method === 'POST' && req.url.startsWith('/api/')) {
    handleApiPost(req, res);
  } else if (req.method === 'PUT' && req.url.startsWith('/api/')) {
    handleApiPut(req, res);
  } else if (req.method === 'DELETE' && req.url.startsWith('/api/')) {
    handleApiDelete(req, res);
  }
});

// Handle GET API requests
function handleApiGet(req, res) {
  const urlParts = req.url.split('/');
  const dataType = urlParts[2]; // properties, transactions, etc.
  const id = urlParts[3]; // optional ID
  
  fs.readFile(`./data.${dataType}.json`, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read data' }));
      return;
    }
    
    try {
      const jsonData = JSON.parse(data);
      
      if (id) {
        // Return specific item
        const item = jsonData.find(item => item.id == id);
        if (item) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(item));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Item not found' }));
        }
      } else {
        // Return all items
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jsonData));
      }
    } catch (parseError) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to parse data' }));
    }
  });
}

// Handle POST API requests
function handleApiPost(req, res) {
  const urlParts = req.url.split('/');
  const dataType = urlParts[2]; // properties, transactions, etc.
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    try {
      const newItem = JSON.parse(body);
      
      fs.readFile(`./data.${dataType}.json`, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to read data' }));
          return;
        }
        
        try {
          const jsonData = JSON.parse(data);
          
          // Assign new ID
          const maxId = jsonData.length > 0 ? Math.max(...jsonData.map(item => item.id)) : 0;
          newItem.id = maxId + 1;
          
          jsonData.push(newItem);
          
          fs.writeFile(`./data.${dataType}.json`, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to save data' }));
              return;
            }
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newItem));
          });
        } catch (parseError) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to parse data' }));
        }
      });
    } catch (parseError) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
}

// Handle PUT API requests
function handleApiPut(req, res) {
  const urlParts = req.url.split('/');
  const dataType = urlParts[2]; // properties, transactions, etc.
  const id = urlParts[3]; // required ID
  
  if (!id) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'ID is required' }));
    return;
  }
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    try {
      const updatedItem = JSON.parse(body);
      
      fs.readFile(`./data.${dataType}.json`, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to read data' }));
          return;
        }
        
        try {
          const jsonData = JSON.parse(data);
          
          // Find and update item
          const index = jsonData.findIndex(item => item.id == id);
          if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Item not found' }));
            return;
          }
          
          // Update item
          jsonData[index] = { ...jsonData[index], ...updatedItem };
          
          fs.writeFile(`./data.${dataType}.json`, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to save data' }));
              return;
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jsonData[index]));
          });
        } catch (parseError) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to parse data' }));
        }
      });
    } catch (parseError) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
}

// Handle DELETE API requests
function handleApiDelete(req, res) {
  const urlParts = req.url.split('/');
  const dataType = urlParts[2]; // properties, transactions, etc.
  const id = urlParts[3]; // required ID
  
  if (!id) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'ID is required' }));
    return;
  }
  
  fs.readFile(`./data.${dataType}.json`, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read data' }));
      return;
    }
    
    try {
      const jsonData = JSON.parse(data);
      
      // Find and remove item
      const index = jsonData.findIndex(item => item.id == id);
      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Item not found' }));
        return;
      }
      
      const deletedItem = jsonData.splice(index, 1)[0];
      
      fs.writeFile(`./data.${dataType}.json`, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to save data' }));
          return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Item deleted successfully', deletedItem }));
      });
    } catch (parseError) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to parse data' }));
    }
  });
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});