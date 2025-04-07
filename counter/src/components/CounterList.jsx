function CounterList({ counterObjects, selectCounter, createCounter }) {
  return (
    <div className="counter-list">
      <h3 className="counter-list-title">Your Counters</h3>
      <div className="counter-items">
        {counterObjects.map((obj) => (
          <div 
            key={obj.data.objectId} 
            className="counter-item"
            onClick={() => selectCounter(obj)}
          >
            <span className="counter-id">Counter ID: {obj.data.objectId.substring(0, 8)}...</span>
            <span className="counter-arrow">→</span>
          </div>
        ))}
      </div>
      <div className="counter-actions">
        <button 
          onClick={createCounter} 
          className="action-button primary"
        >
          Create New Counter
        </button>
      </div>
    </div>
  );
}

export default CounterList;