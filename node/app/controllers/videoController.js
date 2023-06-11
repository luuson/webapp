// controllers/videoController.js

const Video = require('../models/video');
const fs = require('fs');




exports.index = (req, res) => {
  Video.getAll((err, videos) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('../views/videos/index', { videos });
    }
  });
};
// Render the form to create a new video
exports.renderCreateForm = (req, res) => {
  res.render('../views/videos/create.ejs');
};



// Create a new video
exports.createVideo = (req, res) => {
  const { title, tags, comment } = req.body;
  const videoFile = req.files ? req.files.video : null;

  Video.create({ title, tags, comment })
    .then((video) => {
      if (videoFile) {
        const videoPath = `uploads/${videoFile.name}`;

        videoFile.mv(videoPath, (error) => {
          if (error) {
            console.error('Error saving video file:', error);
            return res.status(500).send('Internal Server Error');
          }

          video.videoPath = videoPath;
          video.save()
            .then(() => res.redirect('/videos'))
            .catch((error) => {
              console.error('Error updating video with video file path:', error);
              res.status(500).send('Internal Server Error');
            });
        });
      } else {
        res.redirect('/videos');
      }
    })
    .catch((error) => {
      console.error('Error creating video:', error);
      res.status(500).send('Internal Server Error');
    });
};

// Get video details
exports.getVideo = (req, res) => {
  const { id } = req.params;

  Video.findByPk(id)
    .then((video) => {
      if (!video) {
        return res.status(404).send('Video not found');
      }

      res.render('videos/details', { video });
    })
    .catch((error) => {
      console.error('Error fetching video:', error);
      res.status(500).send('Internal Server Error');
    });
};

// Render the form to update a video
exports.renderUpdateForm = (req, res) => {
  const { id } = req.params;

  Video.findByPk(id)
    .then((video) => {
      if (!video) {
        return res.status(404).send('Video not found');
      }

      res.render('video/update', { video });
    })
    .catch((error) => {
      console.error('Error fetching video for update:', error);
      res.status(500).send('Internal Server Error');
    });
};

// Update video details
exports.updateVideo = (req, res) => {
  const { id } = req.params;
  const { title, tags, comment } = req.body;
  const videoFile = req.files ? req.files.video : null;

  Video.findByPk(id)
    .then((video) => {
      if (!video) {
        return res.status(404).send('Video not found');
      }

      video.title = title;
      video.tags = tags;
      video.comment = comment;

      if (videoFile) {
        const videoPath = `uploads/${videoFile.name}`;

        // Delete the existing video file if it exists
        if (video.videoPath) {
          fs.unlink(video.videoPath, (error) => {
            if (error) {
              console.error('Error deleting existing video file:', error);
            }
          });
        }

        videoFile.mv(videoPath, (error) => {
          if (error) {
            console.error('Error saving video file:', error);
            return res.status(500).send('Internal Server Error');
          }

          video.videoPath = videoPath;
          video.save()
            .then(() => res.redirect(`/videos/${id}`))
            .catch((error) => {
              console.error('Error updating video with video file path:', error);
              res.status(500).send('Internal Server Error');
            });
        });
      } else {
        video.save()
          .then(() => res.redirect(`/videos/${id}`))
          .catch((error) => {
            console.error('Error updating video:', error);
            res.status(500).send('Internal Server Error');
          });
      }
    })
    .catch((error) => {
      console.error('Error fetching video for update:', error);
      res.status(500).send('Internal Server Error');
    });
};

// Delete a video
exports.deleteVideo = (req, res) => {
  const { id } = req.params;

  Video.findByPk(id)
    .then((video) => {
      if (!video) {
        return res.status(404).send('Video not found');
      }

      // Delete the video file if it exists
      if (video.videoPath) {
        fs.unlink(video.videoPath, (error) => {
          if (error) {
            console.error('Error deleting video file:', error);
          }
        });
      }

      video.destroy()
        .then(() => res.redirect('/videos'))
        .catch((error) => {
          console.error('Error deleting video:', error);
          res.status(500).send('Internal Server Error');
        });
    })
    .catch((error) => {
      console.error('Error fetching video for delete:', error);
      res.status(500).send('Internal Server Error');
    });
};
