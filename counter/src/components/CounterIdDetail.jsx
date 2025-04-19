function CounterDetail({ counterObj, counterValue, incrementCounter, goBackToList }) {
  return (
    <div className="counter-detail">
      <div className="counter-header">
        <h3>Counter Details</h3>
        <button 
          onClick={goBackToList} 
          className="action-button secondary"
        >
          ← Back to List
        </button>
      </div>
      
      <div className="counter-info">
        <div className="info-row">
          <span className="info-label">Counter ID:</span>
          <span className="info-value">{counterObj.data.objectId.substring(0, 8)}...</span>
        </div>
        <div className="info-row">
          <span className="info-label">Current Value:</span>
          <span className="info-value counter-value">{counterValue}</span>
        </div>
      </div>
      
      <button 
        onClick={incrementCounter} 
        className="action-button primary increment-button"
      >
        Increment Counter
      </button>
    </div>
  );
}

export default CounterDetail;