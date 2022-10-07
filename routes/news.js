var express = require('express');
var router = express.Router();

const db = require('../models');
const news = db.newss;
const comments = db.comments;
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      console.log(file);
        cb(null,file.originalname)
    }
});
const upload = multer({storage:fileStorage});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('Welcome to API for news');
});
// get all news wiht delete is false
router.get('/get_news', function(req, res, next) {
	news.findAll({
    where:{
      dlt:0
    }
  })
	.then(data => {
    res.send(data);
	})
	.catch(err => {
		res.json({
			info: "Error",
			message: err.message
		});
	});
});

//add news
router.post('/add_news', upload.single('image') ,function(req, res, next) {
  if(!req.file){
    var err = new Error('Please upload a file');
    err.errorStatus=422;
    throw err;
  }else{
    img=req.file.originalname;
  }
	var news_data = {
		title: req.body.title,
        image: img,
        news_content: req.body.content,
        dlt: 0
	}
	news.create(news_data)
	.then(data => {
    res.send(data);
  })
	.catch(err => {
		res.json({
      info:"Error",
      message:err.message
    })
	});
});
//detail berita
router.get('/news_detail/:id', async function(req, res, next) {
  var id = req.params.id;
  id=parseInt(id);
  
  const commentss= await comments.findAll({
    where : {
      id_news:id
    }
    });
  await news.findByPk(id)
  .then(data_detail => {
    if(data_detail){
        res.send({
            data_detail,
            commentss
        });
    //   res.render('./content/news_detail', {
    //     title: 'News Detail',
    //     data_detail: data_detail,
    //     commentss: commentss
    //   })
    }else{
      res.status(404).send({
        message: "Tidak ada data id=" + id
      })
    }
  })
  .catch(err => {
    res.status(404).send({
      message: "Tidak ada data id=" + id
    });
  });
});

//show edit news page
router.get('/edit_news/:id', function(req, res, next) {
  var id = req.params.id;
  id=parseInt(id);
  news.findByPk(id)
  .then(data => {
    if(data){
        res.send(data);
    }else{
      res.status(404).send({
        message: "Tidak ada data id=" + id
      })
    }
  })
  .catch(err => {
    res.status(404).send({
      message: "Tidak ada data id=" + id
    });
  });
});
//edit news
router.post('/edit_news/:id', upload.single('image') ,function(req, res, next) {
  var id = req.params.id;
  id=parseInt(id);
  if(!req.file){
    var err = new Error('Please upload a file');
    err.errorStatus=422;
    throw err;
  }else{
    img=req.file.originalname;
  }
  var news_data = {
    title: req.body.title,
    image: img,
    news_content: req.body.content,
    dlt: 0
  }
  news.update(news_data, {
    where: { id_news: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Data was updated successfully."
        });
    } else {
      res.send({
        message: `Cannot update News with id=${id}. Maybe News was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating News with id=" + id
    });
  });
});

//delete news
router.get('/delete_news/:id', function(req, res, next) {
  var id = req.params.id;
  id=parseInt(id);
  let text;
  
  var news_data = {
    dlt: 1
  }
    news.update(news_data,{
      where: { id_news: id }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Data was deleted successfully."
          });
      } else {
        res.send({
          message: `Cannot delete News with id=${id}. Maybe News was not found!`
        });
      }
    })  .catch(err => {
      res.status(500).send({
        message: "Could not delete News with id=" + id
      });
    });
});

//add comment
router.post('/news_detail/addcomment',function(req, res, next) {
	var data = {
	name: req.body.name,
    comment: req.body.comment,
    id_news: req.body.id_news
	}
	comments.create(data)
	.then(data => {
    res.send(data);
  })
	.catch(err => {
		res.json({
      info:"Error",
      message:err.message
    })
	});
});
module.exports = router;
