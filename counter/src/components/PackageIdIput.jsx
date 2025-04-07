function PackageIdInput({ packageId, setPackageId }) {
    return (
      <div className="package-id-section">
        <label htmlFor="package-id">Package ID:</label>
        <input
          id="package-id"
          type="text"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          placeholder="Enter your deployed package ID"
          className="package-id-input"
        />
      </div>
    );
  }
  
  export default PackageIdInput;

  
 