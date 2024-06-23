"use client";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  incrementByAmount,
  decrementByAmount,
  resetCounter,
} from "../../redux/features/counter/counterSlicer";
import { useState } from "react";

function CounterRedux() {
  //useSelector gets the state from store
  const count = useSelector((state) => state.counter.value); // Access the counter state

  //useDispatch updates the store with the state from a component, as defined by your logic inside the counterslice.js
  const dispatch = useDispatch();

  const [inc, setInc] = useState(0);
  const [dec, setDec] = useState(0);

  return (
    <>
      <div className="redux-counter-container">
        <div className="main-top-container">
          <h1>Counter</h1>
        </div>

        <div className="counter-container">
          <span>
            <strong>Counter: {count}</strong>
          </span>
          <div className="counter-wrapper">
            <div className="input-counter-wrapper">
              <input
                type="number"
                placeholder="Increment"
                value={inc}
                onChange={(e) => setInc(e.target.value)}
              />
              <button
                className="btn-blue"
                onClick={() => {
                  dispatch(incrementByAmount(Number(inc)));
                }}
              >
                Increment By Value
              </button>
            </div>
            <div className="input-counter-wrapper">
              <input
                type="number"
                placeholder="Decrement"
                value={dec}
                onChange={(e) => setDec(e.target.value)}
              />
              <button
                className="btn-blue"
                onClick={() => {
                  dispatch(decrementByAmount(Number(dec)));
                }}
              >
                Decrement By Value
              </button>
            </div>
          </div>
          <div className="counter-wrapper">
            <button
              className="btn-blue"
              onClick={() => {
                dispatch(increment());
              }}
            >
              Increment
            </button>

            <button
              className="btn-blue"
              onClick={() => {
                dispatch(decrement());
              }}
            >
              Decrement
            </button>
          </div>

          <button
            className="btn-red"
            onClick={() => {
              dispatch(resetCounter());
              setInc(0);
              setDec(0);
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

export default CounterRedux;
