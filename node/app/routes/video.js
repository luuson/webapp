const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Define the GET route for video index
router.get('/', videoController.index);

// Define the GET route for creating a new video
router.get('/create', videoController.renderCreateForm);

// Define the POST route for creating a new video
router.post('/create', videoController.createVideo);

// Define the GET route for retrieving video details
router.get('/:id', videoController.getVideo);

// Define the GET route for rendering the update form
router.get('/:id/update', videoController.renderUpdateForm);

// Define the POST route for updating a video
router.post('/:id/update', videoController.updateVideo);

// Define the POST route for deleting a video
router.post('/:id/delete', videoController.deleteVideo);

module.exports = router;
