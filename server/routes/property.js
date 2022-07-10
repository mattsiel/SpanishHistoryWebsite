/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable linebreak-style */
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

class personFunctions {
  getPropertys(request, response) {
    pool.query('SELECT * FROM dynasty', (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  }

  getPropertyById(request, response) {
    const id = parseInt(request.params.id, 10);

    pool.query('SELECT * FROM dynasty WHERE dynasty_id = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  }

  createProperty(request, response) {
    const {
      dynasty_name,
      dynasty_head,
      dynasty_creator_id,
      dynasty_start
    } = request.body;

    pool.query(
      'INSERT INTO dynasty VALUES ($1, $2, $3, $4)',
      [ dynasty_name,
        dynasty_head,
        dynasty_creator_id,
        dynasty_start],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`Dynasty added with ID: ${results.insertId}`);
      },
    );
  }

  updateProperty(request, response) {
    const id = parseInt(request.params.id, 10);
    const {
      dynasty_name,
      dynasty_head,
      dynasty_creator_id,
      dynasty_start
    } = request.body;

    pool.query(
      'UPDATE users SET dynasty_name = $2, dynasty_head = $3, dynasty_creator_id = $4, dynasty_start = $5 WHERE dynasty_id = $1',
      [ dynasty_name,
        dynasty_head,
        dynasty_creator_id,
        dynasty_start],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).send(`Dynasty modified with ID: ${id}`);
      },
    );
  }

  deleteProperty(request, response) {
    const id = parseInt(request.params.id, 10);

    pool.query('DELETE FROM dynasty WHERE dynasty_id = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Dynasty deleted with ID: ${id}`);
    });
  }
}

module.exports = personFunctions;