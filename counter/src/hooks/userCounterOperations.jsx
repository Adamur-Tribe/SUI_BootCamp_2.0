import { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

function useCounterOperations(packageId, counterObj, setCounterObj) {
  const account = useCurrentAccount();
  const [counterValue, setCounterValue] = useState(0);
  const [counterObjects, setCounterObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const MODULE_NAME = 'counter';
  
  const refreshCounterData = async () => {
    if (!account) return;
    
    console.log('Refreshing counter data...');
    setLoading(true);
    
    try {
      // Refresh the list of counter objects
      const objectType = `${packageId}::${MODULE_NAME}::Counter`;
      const objects = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: objectType
        },
        options: {
          showContent: true
        }
      });
      
      console.log('Refreshed counter objects:', objects);
      
      if (objects && objects.data) {
        setCounterObjects(objects.data);
      }
      
      if (counterObj) {
        const updatedObject = await suiClient.getObject({
          id: counterObj.data.objectId,
          options: {
            showContent: true
          }
        });
        
        console.log('Refreshed selected counter:', updatedObject);
        
        if (updatedObject && updatedObject.data && updatedObject.data.content) {
          setCounterObj(updatedObject);
          const newValue = parseInt(updatedObject.data.content.fields.value) || 0;
          setCounterValue(newValue);
          console.log('Updated counter value to:', newValue);
        }
      }
    } catch (error) {
      console.error('Error refreshing counter data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (account) {
      refreshCounterData();
    }
  }, [account, suiClient, packageId, refreshTrigger]);
  
  const selectCounter = async (object) => {
    console.log('Selected counter object:', object);
    setCounterObj(object);
    
    try {
      // Fetch the latest data for this object to ensure we have the current value
      const freshObject = await suiClient.getObject({
        id: object.data.objectId,
        options: {
          showContent: true
        }
      });
      
      console.log('Fresh counter data:', freshObject);
      
      if (freshObject && freshObject.data && freshObject.data.content && freshObject.data.content.fields) {
        const value = parseInt(freshObject.data.content.fields.value) || 0;
        console.log('Setting counter value to:', value);
        setCounterValue(value);
        
        setCounterObj(freshObject);
      } else if (object.data && object.data.content && object.data.content.fields) {
        const value = parseInt(object.data.content.fields.value) || 0;
        console.log('Setting counter value to (from original object):', value);
        setCounterValue(value);
      }
    } catch (error) {
      console.error('Error fetching fresh counter data:', error);
      
      if (object.data && object.data.content && object.data.content.fields) {
        setCounterValue(parseInt(object.data.content.fields.value) || 0);
      }
    }
  };
  
  const createCounter = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      console.log('Creating counter with package ID:', packageId);
      
      // Create a transaction block
      const tx = new Transaction();
      
      // Add the move call to create a counter
      tx.moveCall({
        target: `${packageId}::${MODULE_NAME}::create`,
        arguments: [],
      });
      
      console.log('Transaction prepared:', tx);
      
      // Execute the transaction
      const result = await signAndExecute({
        transaction: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });
      
      console.log('Transaction result:', result);
      
      // Wait a moment for blockchain state to update
      setTimeout(() => {
        // Trigger a refresh of all counter data
        setRefreshTrigger(prev => prev + 1);
        
        // Show success message
        alert('Counter created successfully! Check your wallet for the new object.');
      }, 1000); // Wait 1 second before refreshing
      
    } catch (error) {
      console.error('Error creating counter:', error);
      alert(`Failed to create counter: ${error.message}`);
      setLoading(false);
    }
  };
  
  const incrementCounter = async () => {
    if (!account || !counterObj) return;
    
    setLoading(true);
    try {
      console.log('Incrementing counter with ID:', counterObj.data.objectId);
      
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::${MODULE_NAME}::increment`,
        arguments: [tx.object(counterObj.data.objectId)],
      });
      
      console.log('Transaction prepared:', tx);
      
      const result = await signAndExecute({
        transaction: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });
      
      console.log('Transaction result:', result);
      
      // Wait a moment for blockchain state to update
      setTimeout(() => {
        // Trigger a refresh of all counter data
        setRefreshTrigger(prev => prev + 1);
        
        // Show success message
        alert('Counter incremented successfully!');
      }, 1000); 
      
    } catch (error) {
      console.error('Error incrementing counter:', error);
      alert(`Failed to increment counter: ${error.message}`);
      setLoading(false);
    }
  };

  return {
    counterObjects,
    counterValue,
    loading,
    createCounter,
    incrementCounter,
    selectCounter
  };
}

export default useCounterOperations;