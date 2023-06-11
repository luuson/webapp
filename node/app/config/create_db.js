const connection = require('./connect_db.js');

connection.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL:', error);
      return;
    }
    console.log('Connected to MySQL server');
  
    // Create the tables
    createTables();
  
    // Close the MySQL connection when finished
    connection.end();
  });


  function createTables() {
    const createVideosTableQuery = `
      CREATE TABLE IF NOT EXISTS videos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255),
        file_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  
    const createTagsTableQuery = `
      CREATE TABLE IF NOT EXISTS tags (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255)
      )
    `;
  
    const createVideoTagsTableQuery = `
      CREATE TABLE IF NOT EXISTS video_tags (
        video_id INT,
        tag_id INT,
        FOREIGN KEY (video_id) REFERENCES videos(id),
        FOREIGN KEY (tag_id) REFERENCES tags(id)
      )
    `;
  
    const createCommentsTableQuery = `
      CREATE TABLE IF NOT EXISTS comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        video_id INT,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (video_id) REFERENCES videos(id)
      )
    `;
  
    connection.query(createVideosTableQuery, (error) => {
      if (error) {
        console.error('Error creating videos table:', error);
      } else {
        console.log('Videos table created successfully');
      }
    });
  
    connection.query(createTagsTableQuery, (error) => {
      if (error) {
        console.error('Error creating tags table:', error);
      } else {
        console.log('Tags table created successfully');
      }
    });
  
    connection.query(createVideoTagsTableQuery, (error) => {
      if (error) {
        console.error('Error creating video_tags table:', error);
      } else {
        console.log('Video_Tags table created successfully');
      }
    });
  
    connection.query(createCommentsTableQuery, (error) => {
      if (error) {
        console.error('Error creating comments table:', error);
      } else {
        console.log('Comments table created successfully');
      }
    });
  }
  