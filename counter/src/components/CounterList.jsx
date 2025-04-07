  function CounterList({ counterObjects, selectCounter, createCounter }) {
    return (
      <div className="counter-list">
        <h3>Select a Counter:</h3>
        {counterObjects.map((obj) => (
          <div 
            key={obj.data.objectId} 
            className="counter-item"
            onClick={() => selectCounter(obj)}
          >
            Counter ID: {obj.data.objectId.substring(0, 8)}...
          </div>
        ))}
        <div className="counter-actions">
          <button onClick={createCounter} className="counter-button create">
            Create Another Counter
          </button>
        </div>
      </div>
    );
  }
  
  export default CounterList;