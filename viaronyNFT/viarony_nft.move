module viarony_nft::viaronyNFT {
    use sui::object::{Self, UID};
    use std::string::String;
    use std::signer; 
    use std::vector;

    // Defining the struct for the NFT
    public struct NFT has store {
        id: u64,       // Unique identifier for the NFT
        name: String,  // Name of the NFT
        // image url of the NFT here
    }

    // Define a struct collection to store the NFTs that will be minted
    public struct Collection has key {
        id: UID,     // unique id for the collection
        nfts: vector<NFT>,// array to store multiple NFTs(dynamically)
        next_id: u64, // counter to generate the next ID for new NFTs
    }

    // Initialize the module by creating a new Collection for the signer
    public fun init(account: &signer) {
        let collection = Collection {
            id: object::new(account),  // a new UID for the collection
            nfts: vector::empty(),// initialize the vector for NFTs (empty at this point)
            next_id: 0,// Start at 0
        };
        move_to(account, collection); // Move the collection to the signer's account
    }

    // function Mint to create a new NFT and add it to the signer's collection
    public fun mint(account: &signer, name: String) acquires Collection {
        let addr = signer::address_of(account);   // Get the signer's address

        // Ensure the Collection exists at the signer's address
        assert!(exists<Collection>(addr), 0);     // Error code 0: "Collection does not exist"

        // Borrow the Collection mutably to modify it
        let collection = borrow_global_mut<Collection>(addr);

        // Create a new NFT based on the above NFT struct(populating)
        let nft = NFT {
            id: collection.next_id, // Assign the current ID to the NFT
            name: name,  // Set the NFT's name
        };

        // Add the NFT to the collection's vector
        vector::push_back(&mut collection.nfts, nft);

        // Increment the next_id counter (for uniform indexing)
        collection.next_id = collection.next_id + 1;
    }

    // Count the number of NFTs in the collection at the given address
    public fun count(addr: address): u64 acquires Collection {
        // Ensure the Collection exists at the given address
        assert!(exists<Collection>(addr), 1);// Error code 1: "Collection does not exist"

        // Borrow the Collection immutably to read it
        let collection = borrow_global<Collection>(addr);

        // Return the length of the NFT vector (the total NFTS in the vector(arrary))
        vector::length(&collection.nfts)
    }
}