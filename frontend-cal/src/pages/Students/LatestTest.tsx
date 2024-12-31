import React, { useState } from 'react';

const LatestTest = () => {
  const [answers, setAnswers] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAnswers({
      ...answers,
      [name]: value,
    });
  };

  return (
    <div>
      <h1>Latest Test</h1>
      <form>
        <div>
          <label>Question 1: What is 2 + 2?</label>
          <div>
            <input
              type="radio"
              name="question1"
              value="3"
              onChange={handleChange}
            /> 3
            <input
              type="radio"
              name="question1"
              value="4"
              onChange={handleChange}
            /> 4
            <input
              type="radio"
              name="question1"
              value="5"
              onChange={handleChange}
            /> 5
          </div>
        </div>
        <div>
          <label>Question 2: What is the capital of France?</label>
          <div>
            <input
              type="radio"
              name="question2"
              value="Berlin"
              onChange={handleChange}
            /> Berlin
            <input
              type="radio"
              name="question2"
              value="Madrid"
              onChange={handleChange}
            /> Madrid
            <input
              type="radio"
              name="question2"
              value="Paris"
              onChange={handleChange}
            /> Paris
          </div>
        </div>
        <div>
          <label>Question 3: What is the color of the sky?</label>
          <div>
            <input
              type="radio"
              name="question3"
              value="Green"
              onChange={handleChange}
            /> Green
            <input
              type="radio"
              name="question3"
              value="Blue"
              onChange={handleChange}
            /> Blue
            <input
              type="radio"
              name="question3"
              value="Red"
              onChange={handleChange}
            /> Red
          </div>
        </div>
      </form>
    </div>
  );
};

export default LatestTest;