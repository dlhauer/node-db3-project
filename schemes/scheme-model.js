const db = require('../data/db-config');

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
  update,
  remove
}

function find() {
  return db.select('*').from('schemes');
}

function findById(id) {
  return db.select('*')
          .from('schemes')
          .where({ id })
          .first();
}

function findSteps(id) {
  return db('steps as st')
          .join('schemes as sc', 'st.scheme_id', 'sc.id')
          .where({scheme_id: id})
          .select('sc.scheme_name', 'st.step_number', 'st.instructions')
          .orderBy('st.step_number');
}

function add(scheme) {
  return db('schemes')
          .insert(scheme)
          .then(([id]) => {
            return findById(id);
          });
}

function addStep(step, schemeId) {
  return db('steps')
          .where({scheme_id: schemeId})
          .insert(step)
          .then(() => {
            return step;
          })
}

function update(changes, id) {
  return db('schemes')
          .where({ id })
          .update(changes)
          .then(() => {
            return findById(id);
          });
}

function remove(id) {
  return findById(id)
          .then(scheme => {
            return db('schemes')
                    .where({ id })
                    .del()
                    .then(() => {
                      return scheme;
                    })
          })
}