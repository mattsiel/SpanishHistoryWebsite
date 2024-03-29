/* eslint-disable import/extensions */
import { Router } from 'express';
import Sequelize from 'sequelize';
import ParentModel from '../models/parent.model.js';
import sequelize from '../middleware/sequelize.js';

const Parent = ParentModel(sequelize, Sequelize);

const router = Router();

router.get('/', (req, res) => {
  Parent.findAll().then((parent) => res.json(parent));
  return res.status(200);
});

router.get('/:id', (req, res) => {
  Parent.findAll({ where: { id: req.params.id } }).then((parents) => res.json(parents));
  return res.status(200);
});

const { Op } = Sequelize;


router.get('/searchPerson', (req, res) => {
  Parent.findAll({
    where: {
      person_id : req.query.person_id,
    },
  }).then((parent) => res.send(parent));
});

router.get('/searchParent', (req, res) => {
  Parent.findAll({
    where: {
      parent_person_id : req.query.parent_person_id,
    },
  }).then((parent) => res.send(parent));
});

router.get('/findChildren', (req, res) => {
  const children = [];
  Parent.findAll({
    where: {
      parent_person_id : req.query.parent_person_id,
    },
  }).then((parent) => children.push(parent.person_id));

  return children;
});

router.post('/', async (req, res) => {
  Parent.create(
    {
      person_id : req.body.person_id,
      parent_person_id : req.body.parent_person_id,
      parent_type : req.body.parent_type,
    },
    { validate: true },
  ).then((parent) => {
    res.json(parent);
  }).catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      res.status(401).send('The Data Types of the Data did not match the database');
    }
  });
});

router.patch('/:id', (req, res) => {
  Parent.findByPk(req.params.id).then((parent) => {
    parent.update({
      person_id : req.body.person_id,
      parent_person_id : req.body.parent_person_id,
      parent_type : req.body.parent_type,
    }).then((upParent) => {
      res.json(upParent);
    });
  });
});

router.delete('/:id', (req, res) => {
  Parent.findByPk(req.params.id).then((parent) => {
    parent.destroy();
  }).then(() => {
    res.sendStatus(200);
  });
});

export default router;