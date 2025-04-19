import { useState, useEffect, useCallback } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

function useCounterOperations(packageId, counterObj, setCounterObj) {
  const account = useCurrentAccount();
  const [counterValue, setCounterValue] = useState(0);
  const [counterObjects, setCounterObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const MODULE_NAME = 'counter';
  
  // Memoized refresh function
  const refreshCounterData = useCallback(async () => {
    if (!account) return;
    
    console.log('Refreshing counter data...');
    
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
      
      if (objects?.data) {
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
        
        if (updatedObject?.data?.content) {
          setCounterObj(updatedObject);
          const newValue = parseInt(updatedObject.data.content.fields.value) || 0;
          setCounterValue(newValue);
          console.log('Updated counter value to:', newValue);
        }
      }
    } catch (error) {
      console.error('Error refreshing counter data:', error);
    }
  }, [account, suiClient, packageId, counterObj, setCounterObj]);

  // Start/stop polling when counterObj changes
  useEffect(() => {
    if (counterObj) {
      // Start polling every 2 seconds
      const interval = setInterval(refreshCounterData, 2000);
      setPollingInterval(interval);
      
      // Initial refresh
      refreshCounterData();
      
      return () => {
        clearInterval(interval);
        setPollingInterval(null);
      };
    } else {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  }, [counterObj, refreshCounterData]);

  // Initial data load
  useEffect(() => {
    if (account) {
      refreshCounterData();
    }
  }, [account, refreshCounterData]);

  const selectCounter = async (object) => {
    console.log('Selected counter object:', object);
    setCounterObj(object);
    setLoading(true);
    
    try {
      const freshObject = await suiClient.getObject({
        id: object.data.objectId,
        options: {
          showContent: true
        }
      });
      
      if (freshObject?.data?.content?.fields) {
        const value = parseInt(freshObject.data.content.fields.value) || 0;
        setCounterValue(value);
        setCounterObj(freshObject);
      }
    } catch (error) {
      console.error('Error fetching fresh counter data:', error);
      if (object.data?.content?.fields) {
        setCounterValue(parseInt(object.data.content.fields.value) || 0);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const createCounter = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::${MODULE_NAME}::create`,
        arguments: [],
      });
      
      await signAndExecute({
        transaction: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });
      
      // Optimistically refresh data after 1 second
      setTimeout(refreshCounterData, 1000);
    } catch (error) {
      console.error('Error creating counter:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const incrementCounter = async () => {
    if (!account || !counterObj) return;
    
    setLoading(true);
    try {
      // Optimistic update - increment locally immediately
      const optimisticValue = counterValue + 1;
      setCounterValue(optimisticValue);
      
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::${MODULE_NAME}::increment`,
        arguments: [tx.object(counterObj.data.objectId)],
      });
      
      await signAndExecute({
        transaction: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });
      
      // The polling will automatically pick up the new value
    } catch (error) {
      console.error('Error incrementing counter:', error);
      // Revert optimistic update if failed
      setCounterValue(counterValue);
    } finally {
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