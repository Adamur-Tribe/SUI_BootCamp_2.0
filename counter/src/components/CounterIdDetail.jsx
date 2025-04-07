 function CounterDetail({ counterObj, counterValue, incrementCounter, goBackToList }) {
    return (
      <div>
        <p>Counter ID: {counterObj.data.objectId.substring(0, 8)}...</p>
        <p>Counter Value: {counterValue}</p>
        <button onClick={incrementCounter} className="counter-button increment">
          Increment Counter
        </button>
        <button onClick={goBackToList} className="counter-button back">
          Back to List
        </button>
      </div>
    );
  }
  
  export default CounterDetail;