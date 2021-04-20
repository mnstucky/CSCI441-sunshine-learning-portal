const { pool } = require("./db");

async function addTestUser() {
  const text =
    "INSERT INTO student_info VALUES ('999999', 'studenttestaccount@yahoo.com', '$2b$12$D2sT1ii8.rUBIsyQ6TF8RuaSQHieuzDa7e4kad3MIoSqOLu7M7ksi', 'Testy', 'Tester', 5, 'Test Teacher', 'teachertestaccount@yahoo.com', 'Test School', '123 Test Street', '999-999-9999')";
  try {
    const res = await pool.query(text);
  } catch (err) {
    console.error(err);
  }
}

async function deleteTestUser() {
  const text =
    "DELETE FROM student_info WHERE studentid = '999999'";
  try {
    const res = await pool.query(text);
  } catch (err) {
    console.error(err);
  }
}

async function deleteTestThreads() {
  const text = "DELETE FROM discussion_thread WHERE studentid = '999999'";
  try {
    const res = await pool.query(text);
  } catch (err) {
    console.error(err);
  }
}

exports.addTestUser = addTestUser;
exports.deleteTestUser = deleteTestUser;
exports.deleteTestThreads = deleteTestThreads;